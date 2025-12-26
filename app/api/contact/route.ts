import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  company: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  privacyPolicy: boolean;
  turnstileToken: string;
}

interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { company, name, email, phone, message, privacyPolicy, turnstileToken } = body;

    // バリデーション
    if (!company || !name || !email || !message || !privacyPolicy || !turnstileToken) {
      return NextResponse.json(
        { message: "必須項目をすべて入力してください" },
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

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordPayload),
    });

    if (!webhookResponse.ok) {
      console.error("Discord webhook failed:", await webhookResponse.text());
      return NextResponse.json(
        { message: "送信に失敗しました。もう一度お試しください。" },
        { status: 500 }
      );
    }

    // 確認メールを送信
    try {
      await resend.emails.send({
        from: "株式会社ファンエクス <noreply@funex.co.jp>",
        to: email,
        subject: "お問い合わせを受け付けました - 株式会社ファンエクス",
        html: `
          <div style="font-family: 'Hiragino Sans', 'Yu Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
              お問い合わせありがとうございます
            </h2>

            <p>${name} 様</p>

            <p>この度は株式会社ファンエクスにお問い合わせいただき、誠にありがとうございます。<br>
            以下の内容でお問い合わせを受け付けました。</p>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>会社名:</strong> ${company}</p>
              <p style="margin: 10px 0;"><strong>お名前:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>メールアドレス:</strong> ${email}</p>
              ${phone ? `<p style="margin: 10px 0;"><strong>電話番号:</strong> ${phone}</p>` : ''}
              <p style="margin: 10px 0;"><strong>お問い合わせ内容:</strong></p>
              <p style="margin: 10px 0; white-space: pre-wrap;">${message}</p>
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
      });
    } catch (emailError) {
      // メール送信失敗してもフォーム送信自体は成功として扱う
      console.error("Email sending failed:", emailError);
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
