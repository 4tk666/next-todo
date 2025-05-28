'use client'

import { Button } from '@/components/elements/button'
import { FormField } from '@/components/elements/form-field'
import type { ActionState } from '@/types/form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { signInAction } from '../../../lib/server-actions/auth/sign-in-actions'

export default function SignInPage() {
  const router = useRouter()

  const [state, action, isPending] = useActionState(
    async (state: ActionState | undefined, formData: FormData) => {
      const result = await signInAction(state, formData)
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
            アカウントにサインイン
          </h2>
        </div>

        {state?.error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {state.error}
          </div>
        )}

        <form className="mt-6 space-y-6" action={action}>
          <div className="space-y-4">
            <FormField
              id="username"
              label="メールアドレス"
              type="email"
              placeholder="メールアドレスを入力"
              defaultValue={state?.values?.username}
              errors={state?.formError?.username}
              required
            />
            <FormField
              id="password"
              label="パスワード"
              type="password"
              placeholder="パスワードを入力"
              defaultValue={state?.values?.password}
              errors={state?.formError?.password}
              required
            />
          </div>

          <div>
            <Button type="submit" disabled={isPending}>
              サインイン
            </Button>
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
