'use server'

import { signIn } from '@/auth'
import type { ActionState } from '@/types/form'
import { signInSchema } from './schema'

export async function signInAction(
  state: ActionState | undefined,
  formData: FormData,
) {
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
      error: 'バリデーションエラーが発生しました',
      formError: errors,
      values, // 入力値を返す
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
        error: 'ユーザー名またはパスワードが正しくありません',
        values, // 入力値を返す（パスワードは消さない）
      }
    }

    return {
      success: true,
    }

  } catch (error) {
    console.error(error)
    return {
      error: 'エラーが発生しました',
      values, // 入力値を返す
    }
  }
}
