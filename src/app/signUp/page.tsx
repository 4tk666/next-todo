'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { signUpAction } from './actions'

export default function SignUpPage() {
  const router = useRouter()

  const [state, action, isPending] = useActionState(
    async (
      state: {
        error?: string
      } | undefined,
      formData: FormData,
    ) => {
      try {
        await signUpAction(state, formData)
        router.push('/')
      } catch (error) {
        console.error(error)
        return { error: '登録中にエラーが発生しました' }
      }
    },
    undefined,
  )

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 border">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            新規アカウント登録
          </h2>
        </div>

        {state?.error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {state.error}
          </div>
        )}

        <form className="mt-8 space-y-6" action={action}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                お名前
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1.5 text-gray-800 border"
                placeholder="お名前を入力"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
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
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                パスワード（確認用）
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1.5 text-gray-800 border"
                placeholder="パスワードを再入力"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300"
            >
              {isPending ? '処理中...' : 'アカウント作成'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            既にアカウントをお持ちですか？{' '}
            <Link
              href="/signIn"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              サインイン
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
