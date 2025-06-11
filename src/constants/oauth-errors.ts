
//  OAuthに関するエラーメッセージを定義
// https://next-auth.js.org/configuration/pages?utm_source=chatgpt.com#sign-in-page
export const OAUTH_ERRORS: Record<string, string> = {
  OAuthAccountNotLinked: 'このアカウントは既に別の認証方法でリンクされています。既存のアカウントでサインインしてください。',
  OAuthCallback: 'GitHub認証の処理中にエラーが発生しました。もう一度お試しください。',
  OAuthCreateAccount: 'GitHubアカウントでの新規登録に失敗しました。時間をおいて再度お試しください。',
  OAuthSignin: 'GitHub認証の開始に失敗しました。ネットワーク接続を確認してください。',
  AccessDenied: 'GitHub認証へのアクセスが拒否されました。必要な権限を確認してください。',
  Configuration: 'GitHub認証の設定に問題があります。管理者にお問い合わせください。',
} as const