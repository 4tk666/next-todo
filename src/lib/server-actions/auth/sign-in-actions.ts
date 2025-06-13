'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import type { ActionState } from '@/types/form'
import {
  type SignInFormValues,
  signInSchema,
} from '../../schemas/auth/sign-in-schema'

export async function signInAction(
  formData: FormData,
): Promise<ActionState<void, SignInFormValues> | never> {
  // 入力値を保持
  const values = {
    username: formData.get('username')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
  }

  // zodでバリデーション
  const validationResult = signInSchema.safeParse(values)

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors
    return {
      success: false,
      error: {
        message: 'バリデーションエラーが発生しました',

        fields: errors,
      },
      values,
    }
  }

  try {
    await signIn('credentials', {
      username: values.username,
      password: values.password,
      redirect: false,
    })
  } catch (error) {
    // AuthErrorの場合（NextAuth.jsの認証エラー）
    if (error instanceof AuthError) {
      console.error('AuthError type:', error.type)

      // CredentialsSigninエラーの場合（存在しないユーザーや認証失敗）
      if (error.type === 'CredentialsSignin') {
        return {
          success: false,
          error: {
            message: 'ユーザー名またはパスワードが正しくありません',
          },
          values,
        }
      }
    }

    // その他の予期しないエラー
    return {
      success: false,
      error: {
        message: 'サインイン中にエラーが発生しました',
      },
      values,
    }
  }

  // 成功時はサーバーサイドでリダイレクト
  redirect('/')
}

export async function signInGithubAction() {
  await signIn('github')
}
