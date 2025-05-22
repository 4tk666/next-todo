'use server'

import { signIn } from '@/auth'
import { hashPassword } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

type ActionState = {
  error?: string
}

export async function signUpAction(
  state: ActionState | undefined,
  formData: FormData,
) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // パスワードの一致確認
  if (password !== confirmPassword) {
    return { error: 'パスワードと確認用パスワードが一致しません' }
  }

  try {
    // ユーザーが既に存在するか確認
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: 'このメールアドレスは既に登録されています' }
    }

    // パスワードをハッシュ化
    const hashedPassword = await hashPassword(password)

    // 新規ユーザーの作成
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // 元のパスワード（平文）を使用してサインイン
    const result = await signIn('credentials', {
      username: user.email,
      password: password, // ハッシュ化前のパスワードを使用
      redirect: false,
    })

    // サインインの結果を確認
    if (result?.error) {
      return { error: 'サインインに失敗しました' }
    }

    return { success: true }
  } catch (error) {
    return { error: '登録中にエラーが発生しました' }
  }
}
