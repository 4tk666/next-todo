'use server'

import { signIn } from '@/auth'
import { redirect } from 'next/navigation'

export async function signInAction(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  try {
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    })

    if (result?.error) {
      return { error: 'ユーザー名またはパスワードが正しくありません' }
    }

    redirect('/')
  } catch (error) {
    console.log(error)
    return { error: 'エラーが発生しました' }
  }
}
