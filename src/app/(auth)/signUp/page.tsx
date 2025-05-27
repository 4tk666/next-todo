'use client'

import { Button } from '@/components/button'
import { FormField } from '@/components/form-field'
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

        <form className="mt-6 space-y-6" action={action}>
          <div className="space-y-4">
            <FormField
              id="name"
              label="お名前"
              placeholder="お名前を入力"
              defaultValue={state?.values?.name}
              errors={state?.formError?.name}
            />
            <FormField
              id="email"
              label="メールアドレス"
              type="email"
              placeholder="メールアドレスを入力"
              defaultValue={state?.values?.email}
              errors={state?.formError?.email}
            />
            <FormField
              id="password"
              label="パスワード"
              type="password"
              placeholder="パスワードを入力"
              defaultValue={state?.values?.password}
              errors={state?.formError?.password}
            />
            <FormField
              id="confirmPassword"
              label="パスワード（確認用）"
              type="password"
              placeholder="パスワードを再入力"
              defaultValue={state?.values?.confirmPassword}
              errors={state?.formError?.confirmPassword}
            />
          </div>

          <div>
            <Button type="submit" disabled={isPending}>
              {isPending ? '処理中...' : 'アカウント作成'}
            </Button>
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
