'use server'

import { signIn } from '@/auth'
import type { ActionState } from '@/types/form'
import { signInSchema } from '../../schemas/auth/sign-in-schema'

export async function signInAction(formData: FormData): Promise<ActionState> {
  // 入力値を保持
  const values = {
    username: formData.get('username') as string,
    password: formData.get('password') as string,
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
      // values, // 入力値を返す
    }
  }

  try {
    const result = await signIn('credentials', {
      username: values.username,
      password: values.password,
      redirect: false,
    })

    if (result?.error) {
      return {
        success: false,
        error: {
          message: 'ユーザー名またはパスワードが正しくありません',
        },
        // values, // 入力値を返す（パスワードは消さない）
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: {
        message: 'サインイン中にエラーが発生しました',
      },
      // values, // 入力値を返す
    }
  }
}

export async function signInGithubAction() {
  await signIn('github')
}
