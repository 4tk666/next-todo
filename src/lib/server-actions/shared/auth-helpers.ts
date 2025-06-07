'use server'

/**
 * サーバーアクション用の認証関連ヘルパー関数
 */
import { auth } from '@/auth'

/**
 * セッションの認証状態を確認し、ユーザーIDを取得する
 * @returns ユーザーIDまたはエラーレスポンス
 */
export async function getSessionUserIdOrError(): Promise<
  { success: false; errorMessage: string } | { success: true; userId: string }
> {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      success: false,
      errorMessage: 'ログインが必要です',
    }
  }

  return {
    success: true,
    userId: session.user.id,
  }
}
