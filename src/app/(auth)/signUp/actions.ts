'use server'

import { signIn } from '@/auth'
import { hashPassword } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import type { ActionState } from '@/types/form'
import { signUpSchema } from './schema'

export async function signUpAction(
  state: ActionState | undefined,
  formData: FormData,
) {
  // 入力値を保持
  const values = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  // zodでバリデーション
  const validationResult = signUpSchema.safeParse(values)

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors
    return {
      error: 'バリデーションエラーが発生しました',
      formError: errors,
      values, // 入力値を返す
    }
  }

  try {
    // ユーザーが既に存在するか確認
    const existingUser = await prisma.user.findUnique({
      where: { email: values.email },
    })

    if (existingUser) {
      return {
        error: 'このメールアドレスは既に登録されています',
        values, // 入力値を返す
      }
    }

    // パスワードをハッシュ化
    const hashedPassword = await hashPassword(values.password)

    // 新規ユーザーの作成
    const user = await prisma.user.create({
      data: {
        name: values.name,
        email: values.email,
        password: hashedPassword,
      },
    })

    // 元のパスワード（平文）を使用してサインイン
    const result = await signIn('credentials', {
      username: user.email,
      password: values.password, // ハッシュ化前のパスワードを使用
      redirect: false,
    })

    // サインインの結果を確認
    if (result?.error) {
      return {
        error: 'サインインに失敗しました',
        values, // 入力値を返す
      }
    }

    return { success: true }
  } catch (error) {
    return {
      error: '登録中にエラーが発生しました',
      values, // 入力値を返す
    }
  }
}
