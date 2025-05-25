'use client'

import type { ActionState } from '@/types/form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { signUpAction } from './actions'

export default function SignUpPage() {
  const router = useRouter()

  const [state, action, isPending] = useActionState(
    async (state: ActionState | undefined, formData: FormData) => {
      const result = await signUpAction(state, formData)
      if (result.success) router.push('/')

      return result
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1.5 text-gray-800 border"
                placeholder="お名前を入力"
                defaultValue={state?.values?.name}
              />
              {state?.formError?.name && (
                <div className="mt-1 text-sm text-red-600">
                  {state.formError.name.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              )}
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1.5 text-gray-800 border"
                placeholder="メールアドレスを入力"
                defaultValue={state?.values?.email}
              />
              {state?.formError?.email && (
                <div className="mt-1 text-sm text-red-600">
                  {state.formError.email.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              )}
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1.5 text-gray-800 border"
                placeholder="パスワードを入力"
                defaultValue={state?.values?.password}
              />
              {state?.formError?.password && (
                <div className="mt-1 text-sm text-red-600">
                  {state.formError.password.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              )}
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1.5 text-gray-800 border"
                placeholder="パスワードを再入力"
                defaultValue={state?.values?.confirmPassword}
              />
              {state?.formError?.confirmPassword && (
                <div className="mt-1 text-sm text-red-600">
                  {state.formError.confirmPassword.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              )}
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
