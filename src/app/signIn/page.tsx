'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { signInAction } from './actions'
import Link from 'next/link'

export default function SignInPage() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    try {
      await signInAction(formData)
      router.push('/')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 border">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            アカウントにサインイン
          </h2>
        </div>

        <form className="mt-8 space-y-6" action={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                メールアドレス
              </label>
              <input
                id="username"
                name="username"
                type="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1.5 text-gray-800 border"
                placeholder="メールアドレスを入力"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1.5 text-gray-800 border"
                placeholder="パスワードを入力"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300"
            >
              サインイン
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            アカウントをお持ちでないですか？{' '}
            <Link
              href="/signUp"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              新規登録
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
