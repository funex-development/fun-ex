import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// ビルド時（環境変数未設定）のエラーを避けるため遅延初期化
let resendInstance: Resend | null = null;
function getResend(): Resend {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

// HTMLエスケープ（メール本文のXSS対策）
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// インメモリ・レート制限（IP単位の固定ウィンドウ方式）
// 注意: サーバーレス環境ではインスタンス単位の制限になるため簡易的な保護
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1分
const RATE_LIMIT_MAX_REQUESTS = 5; // 1分あたり最大5回
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  // Vercel等のプロキシ越しのIPを取得
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // 古いエントリの掃除（メモリリーク防止のため、呼び出しごとに期限切れエントリを削除）
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetAt < now) rateLimitMap.delete(key);
    }
  }

  if (!record || record.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((record.resetAt - now) / 1000) };
  }

  record.count += 1;
  return { allowed: true };
}

interface ContactFormData {
  company: string;
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
  privacyPolicy: boolean;
  turnstileToken: string;
}

// お問い合わせ種別の許可値（クライアント側 INQUIRY_TYPES と一致させること）
const ALLOWED_INQUIRY_TYPES = new Set([
  "consultation",
  "estimate",
  "request",
  "hearing",
  "other",
]);

const INQUIRY_TYPE_LABELS: Record<string, string> = {
  consultation: "相談したい（壁打ち）",
  estimate: "見積りが欲しい",
  request: "制作を依頼したい",
  hearing: "まず話を聞きたい",
  other: "その他",
};

interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function POST(request: NextRequest) {
  try {
    // レート制限チェック
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: "リクエストが多すぎます。しばらく待ってから再度お試しください。" },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter ?? 60),
          },
        }
      );
    }

    const body: ContactFormData = await request.json();
    const { company, name, email, phone, inquiryType, message, privacyPolicy, turnstileToken } = body;

    // バリデーション
    if (!name || !email || !inquiryType || !message || !privacyPolicy || !turnstileToken) {
      return NextResponse.json(
        { message: "必須項目をすべて入力してください" },
        { status: 400 }
      );
    }

    // お問い合わせ種別の許可値チェック
    if (!ALLOWED_INQUIRY_TYPES.has(inquiryType)) {
      return NextResponse.json(
        { message: "お問い合わせ種別が不正です" },
        { status: 400 }
      );
    }

    // Cloudflare Turnstile検証
    const turnstileVerifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const turnstileResponse = await fetch(turnstileVerifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: process.env.CF_SECRET_KEY,
        response: turnstileToken,
      }),
    });

    const turnstileData: TurnstileResponse = await turnstileResponse.json();

    if (!turnstileData.success) {
      console.error("Turnstile verification failed:", turnstileData["error-codes"]);
      return NextResponse.json(
        { message: "ボット検証に失敗しました。もう一度お試しください。" },
        { status: 400 }
      );
    }

    // Discord Webhook送信
    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("WEBHOOK_URL is not configured");
      return NextResponse.json(
        { message: "サーバーエラーが発生しました" },
        { status: 500 }
      );
    }

    // Discord Embed形式でペイロードを作成
    const discordPayload = {
      embeds: [
        {
          title: "📧 新しいお問い合わせ",
          color: 0x0066cc, // 青色
          fields: [
            {
              name: "会社名",
              value: company,
              inline: true,
            },
            {
              name: "氏名",
              value: name,
              inline: true,
            },
            {
              name: "メールアドレス",
              value: email,
              inline: false,
            },
            ...(phone ? [{
              name: "電話番号",
              value: phone,
              inline: false,
            }] : []),
            {
              name: "お問い合わせ種別",
              value: INQUIRY_TYPE_LABELS[inquiryType] ?? inquiryType,
              inline: false,
            },
            {
              name: "お問い合わせ内容",
              value: message,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "株式会社ファンエクス",
          },
        },
      ],
    };

    // Discord Webhook と 確認メール送信を並列実行
    const [webhookResult, emailResult] = await Promise.allSettled([
      fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discordPayload),
      }),
      getResend().emails.send({
        from: "株式会社ファンエクス <noreply@funex.co.jp>",
        to: email,
        subject: "お問い合わせを受け付けました - 株式会社ファンエクス",
        html: `
          <div style="font-family: 'Hiragino Sans', 'Yu Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
              お問い合わせありがとうございます
            </h2>

            <p>${escapeHtml(name)} 様</p>

            <p>この度は株式会社ファンエクスにお問い合わせいただき、誠にありがとうございます。<br>
            以下の内容でお問い合わせを受け付けました。</p>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              ${company ? `<p style="margin: 10px 0;"><strong>会社名:</strong> ${escapeHtml(company)}</p>` : ''}
              <p style="margin: 10px 0;"><strong>お名前:</strong> ${escapeHtml(name)}</p>
              <p style="margin: 10px 0;"><strong>メールアドレス:</strong> ${escapeHtml(email)}</p>
              ${phone ? `<p style="margin: 10px 0;"><strong>電話番号:</strong> ${escapeHtml(phone)}</p>` : ''}
              <p style="margin: 10px 0;"><strong>お問い合わせ種別:</strong> ${escapeHtml(INQUIRY_TYPE_LABELS[inquiryType] ?? inquiryType)}</p>
              <p style="margin: 10px 0;"><strong>お問い合わせ内容:</strong></p>
              <p style="margin: 10px 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
            </div>

            <p>担当者より2営業日以内にご連絡させていただきます。<br>
            今しばらくお待ちくださいますようお願い申し上げます。</p>

            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

            <p style="font-size: 0.9em; color: #666;">
              株式会社ファンエクス<br>
              〒101-0024<br>
              東京都千代田区神田和泉町1番地6-16ヤマトビル405<br>
              メールアドレス: info@funex.co.jp<br>
              <a href="https://funex.co.jp" style="color: #0066cc;">https://funex.co.jp</a>
            </p>
          </div>
        `,
      }),
    ]);

    // Discord Webhookの結果チェック（失敗時はエラー返却）
    if (webhookResult.status === "rejected") {
      console.error("Discord webhook error:", webhookResult.reason);
      return NextResponse.json(
        { message: "送信に失敗しました。もう一度お試しください。" },
        { status: 500 }
      );
    }
    if (!webhookResult.value.ok) {
      console.error("Discord webhook failed:", await webhookResult.value.text());
      return NextResponse.json(
        { message: "送信に失敗しました。もう一度お試しください。" },
        { status: 500 }
      );
    }

    // メール送信失敗はログのみ（フォーム送信自体は成功として扱う）
    if (emailResult.status === "rejected") {
      console.error("Email sending failed:", emailResult.reason);
    }

    return NextResponse.json(
      { message: "送信が完了しました" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
