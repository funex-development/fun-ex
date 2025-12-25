# セキュリティ設計書

## 目的
このドキュメントは、FunExウェブサイトおよび関連システムの開発において遵守すべきセキュリティ要件とガイドラインを定義します。

---

## 1. 個人情報保護

### 1.1 個人情報の取り扱い原則
- **最小権限の原則**: 個人情報へのアクセスは、業務上必要な最小限のユーザー・システムに限定する
- **暗号化の徹底**: 保存時（at rest）および転送時（in transit）の両方で個人情報を暗号化する
- **アクセス制御**: ログイン情報（メールアドレス、氏名、電話番号など）は認証・認可されたユーザーのみがアクセス可能とする

### 1.2 個人情報の表示制限
- ログイン情報やメールアドレスなどの個人情報は、**誰でも見れる状態にしない**
- 管理画面でも、必要に応じてマスキング処理を実施する（例: `user@example.com` → `u***@example.com`）
- URLパラメータやクエリ文字列に個人情報を含めない

### 1.3 データ処理の場所
- **サーバーサイド処理の原則**: 個人情報や機密情報は必ずサーバーサイドで処理・検証する
- **クライアントサイドの禁止事項**:
  - クライアントサイドで個人情報を保存しない（LocalStorage、SessionStorage、Cookieに機密情報を保存しない）
  - JavaScriptで個人情報を直接操作・表示しない
  - ブラウザのDevToolsで機密情報が見えないようにする

### 1.4 サーバーレスポンスのセキュリティ
- APIレスポンスに不要な個人情報を含めない
- エラーメッセージに個人情報やシステム内部情報を含めない
- レスポンスヘッダーで適切なセキュリティヘッダーを設定する:
  ```
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Content-Security-Policy: default-src 'self'
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  ```

---

## 2. 認証・認可

### 2.1 認証の要件
- **強固なパスワードポリシー**:
  - 最低8文字以上
  - 英大文字、英小文字、数字、記号を組み合わせる
  - 一般的な辞書単語やパターン（123456、passwordなど）を禁止する

- **セッション管理**:
  - セッションIDは暗号学的に安全な乱数生成器で生成する
  - セッションタイムアウトを適切に設定する（例: 30分の非アクティブでタイムアウト）
  - ログアウト時は必ずサーバーサイドでセッションを破棄する

- **多要素認証（MFA）の検討**:
  - 管理者アカウントには必須
  - 一般ユーザーにも推奨として提供

### 2.2 認可の要件
- **役割ベースのアクセス制御（RBAC）**:
  - ユーザー、管理者、スーパー管理者などの役割を定義
  - 各役割に必要最小限の権限のみを付与

- **APIエンドポイントの保護**:
  - すべてのAPIエンドポイントで認証・認可チェックを実施
  - クライアントサイドだけでなく、サーバーサイドで必ず権限チェックを行う

---

## 3. 脆弱性対策

### 3.1 XSS（クロスサイトスクリプティング）対策

#### 必須対策
1. **入力値のサニタイゼーション**:
   - ユーザー入力は必ずエスケープ処理を行う
   - HTMLエンティティへの変換（`<` → `&lt;`、`>` → `&gt;` など）

2. **出力のエスケープ**:
   - HTMLコンテキスト: `textContent`を使用、`innerHTML`は避ける
   - JavaScriptコンテキスト: JSON.stringifyを使用
   - URLコンテキスト: encodeURIComponentを使用

3. **Content Security Policy（CSP）の設定**:
   ```html
   <meta http-equiv="Content-Security-Policy"
         content="default-src 'self'; script-src 'self' 'nonce-{random}'; style-src 'self' 'unsafe-inline';">
   ```

4. **信頼できないデータの禁止**:
   - `eval()`、`Function()`の使用禁止
   - `document.write()`の使用禁止
   - インラインイベントハンドラ（`onclick`など）の使用を最小限に

#### コード例
```javascript
// ❌ 危険な例
element.innerHTML = userInput;

// ✅ 安全な例
element.textContent = userInput;

// ❌ 危険な例
const script = document.createElement('script');
script.text = userInput;

// ✅ 安全な例（入力値の検証とサニタイゼーション後）
const sanitizedInput = DOMPurify.sanitize(userInput);
element.innerHTML = sanitizedInput;
```

### 3.2 CSRF（クロスサイトリクエストフォージェリ）対策

#### 必須対策
1. **CSRFトークンの実装**:
   - すべてのフォーム送信にCSRFトークンを含める
   - トークンはセッションごとに生成し、サーバーサイドで検証

2. **SameSite Cookie属性の設定**:
   ```
   Set-Cookie: sessionid=xxxxx; SameSite=Strict; Secure; HttpOnly
   ```

3. **カスタムヘッダーの使用**:
   - AJAXリクエストにカスタムヘッダー（例: `X-CSRF-Token`）を追加

4. **重要な操作の再認証**:
   - パスワード変更、メールアドレス変更などの重要な操作では再認証を要求

#### コード例
```html
<!-- フォームにCSRFトークンを含める -->
<form method="POST" action="/api/update">
  <input type="hidden" name="csrf_token" value="{{ csrf_token }}">
  <!-- その他のフィールド -->
</form>
```

```javascript
// AJAXリクエストにCSRFトークンを含める
fetch('/api/update', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
  },
  body: JSON.stringify(data)
});
```

### 3.3 SQLインジェクション対策

#### 必須対策
1. **プリペアドステートメントの使用**:
   - すべてのデータベースクエリでプリペアドステートメント（パラメータ化クエリ）を使用
   - 文字列連結によるクエリ生成を禁止

2. **ORMの活用**:
   - 可能な限りORM（Object-Relational Mapping）を使用
   - 生SQLの使用を最小限に抑える

3. **入力値の検証**:
   - データ型の検証（数値は数値型として扱う）
   - ホワイトリスト方式での入力値検証

4. **最小権限の原則**:
   - データベースユーザーに必要最小限の権限のみを付与
   - アプリケーションからDROP、ALTER文を実行できないようにする

#### コード例
```javascript
// ❌ 危険な例（SQLインジェクションの脆弱性あり）
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
db.query(query);

// ✅ 安全な例（プリペアドステートメント使用）
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [userEmail]);

// ✅ 安全な例（ORMを使用 - 例: Sequelize）
const user = await User.findOne({
  where: { email: userEmail }
});
```

---

## 4. 機密情報管理

### 4.1 APIキー・環境変数の管理

#### 絶対禁止事項
- **ハードコーディングの禁止**: APIキー、パスワード、秘密鍵などをソースコードに直接記述しない
- **バージョン管理への登録禁止**: `.env`ファイルや機密情報を含むファイルをGitにコミットしない

#### 必須対策
1. **環境変数の使用**:
   - すべての機密情報は環境変数として管理
   - `.env`ファイルは`.gitignore`に必ず追加
   - `.env.example`テンプレートを提供（実際の値は含めない）

2. **シークレット管理ツールの活用**:
   - 本番環境: AWS Secrets Manager、Google Secret Manager、Azure Key Vaultなど
   - 開発環境: dotenv、direnv などのツールを使用

3. **アクセス権限の制限**:
   - 機密情報へのアクセスは必要最小限の人員に限定
   - アクセスログを記録し、定期的に監査

#### コード例
```javascript
// ❌ 危険な例（ハードコーディング）
const apiKey = 'your_actual_api_key_here_is_dangerous';
const dbPassword = 'MySecretPassword123';

// ✅ 安全な例（環境変数を使用）
const apiKey = process.env.STRIPE_API_KEY;
const dbPassword = process.env.DB_PASSWORD;

// ✅ .envファイルの例
/*
STRIPE_API_KEY=your_actual_key_here
DB_PASSWORD=xxxxxxxxxxxxx
DB_HOST=localhost
DB_PORT=5432
*/

// ✅ .gitignoreに追加
/*
.env
.env.local
.env.production
*.key
*.pem
config/secrets.yml
*/
```

### 4.2 クライアントサイドでの機密情報の扱い

#### 禁止事項
- フロントエンドのJavaScriptにAPIキーを埋め込まない
- LocalStorageやSessionStorageに機密情報を保存しない
- console.logで機密情報を出力しない（本番環境では特に注意）

#### 推奨事項
- APIキーが必要な場合は、サーバーサイドプロキシを経由させる
- 公開可能なAPIキー（例: Google Maps API）でも、ドメイン制限やリファラー制限を設定する

---

## 5. セキュアコーディングガイドライン

### 5.1 開発時の基本原則
1. **入力は全て信頼しない**: すべてのユーザー入力を検証・サニタイゼーションする
2. **多層防御**: 複数のセキュリティレイヤーで保護する（クライアント + サーバー + データベースなど）
3. **最小権限の原則**: 必要最小限の権限のみを付与する
4. **セキュアデフォルト**: デフォルトで安全な設定にする
5. **失敗時の安全性**: エラーが発生しても安全な状態を保つ

### 5.2 コードレビューのチェックリスト
- [ ] 個人情報はサーバーサイドのみで処理されているか
- [ ] クライアントサイドに機密情報が露出していないか
- [ ] APIキーや環境変数がハードコードされていないか
- [ ] XSS対策（入力のエスケープ、CSP設定）が実装されているか
- [ ] CSRF対策（トークン、SameSite Cookie）が実装されているか
- [ ] SQLインジェクション対策（プリペアドステートメント）が実装されているか
- [ ] 認証・認可が適切に実装されているか
- [ ] エラーメッセージに機密情報が含まれていないか
- [ ] セキュリティヘッダーが適切に設定されているか
- [ ] HTTPSが強制されているか

### 5.3 セキュリティテスト
1. **静的解析**: コードの脆弱性を自動検出（ESLint、SonarQube など）
2. **動的解析**: 実行時の脆弱性をテスト（OWASP ZAP、Burp Suite など）
3. **依存関係の監査**: `npm audit`、`yarn audit`などで定期的にチェック
4. **ペネトレーションテスト**: 本番リリース前に実施

---

## 6. インシデント対応

### 6.1 セキュリティインシデント発生時の手順
1. **検知と報告**: 速やかにセキュリティチームに報告
2. **初期対応**: 被害の拡大を防ぐ（アカウント停止、サービス一時停止など）
3. **調査**: 原因と影響範囲を特定
4. **復旧**: 脆弱性を修正し、サービスを復旧
5. **事後対応**: 影響を受けたユーザーへの通知、再発防止策の実施

### 6.2 連絡先
- セキュリティ担当: [担当者名・連絡先を記載]
- インシデント報告: [報告先を記載]

---

## 7. 定期的な見直し

このセキュリティ設計書は、以下のタイミングで定期的に見直し・更新を行います:
- 四半期ごとの定期レビュー
- 新機能追加時
- セキュリティインシデント発生時
- 法規制の変更時

---

## 8. 参考資料

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [CWE/SANS Top 25](https://www.sans.org/top25-software-errors/)
- [個人情報保護委員会ガイドライン](https://www.ppc.go.jp/)

---

**最終更新日**: 2025-12-25
**バージョン**: 1.0
**承認者**: [承認者名]
