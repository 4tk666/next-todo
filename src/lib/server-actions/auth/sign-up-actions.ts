'use server'

import { signIn } from '@/auth'
import { prisma } from '@/lib/prisma'
import { signUpSchema } from '@/lib/schemas/auth/sign-up-schema'
import { hashPassword } from '@/lib/utils/auth-utils'
import type { ActionState } from '@/types/form'

export async function signUpAction(formData: FormData): Promise<ActionState> {
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
      success: false,
      error: {
        message: 'バリデーションエラーが発生しました',
        fields: errors,
      },
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
        success: false,
        error: {
          message: 'このメールアドレスは既に登録されています',
        },
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
        success: false,
        error: {
          message: 'サインインに失敗しました',
        },
        values, // 入力値を返す
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: {
        message: '登録中にエラーが発生しました',
      },
      values, // 入力値を返す
    }
  }
}
