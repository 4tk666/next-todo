'use client'

import { Button } from '@/components/elements/button'
import { InputField } from '@/components/elements/fields/input-field'
import type { ActionState } from '@/types/form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { signUpAction } from '../../../lib/server-actions/auth/sign-up-actions'
import { ErrorBanner } from '@/components/elements/error-banner'

export default function SignUpPage() {
  const router = useRouter()

  const [state, action, isPending] = useActionState(
    async (state: ActionState | undefined, formData: FormData) => {
      const result = await signUpAction(formData)
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

        {state?.error && <ErrorBanner message={state.error.message} />}

        <form className="mt-6 space-y-6" action={action}>
          <div className="space-y-4">
            <InputField
              id="name"
              label="お名前"
              placeholder="お名前を入力"
              defaultValue={state?.values?.name}
              errors={state?.error?.fields?.name}
              required
            />
            <InputField
              id="email"
              label="メールアドレス"
              type="email"
              placeholder="メールアドレスを入力"
              defaultValue={state?.values?.email}
              errors={state?.error?.fields?.email}
              required
            />
            <InputField
              id="password"
              label="パスワード"
              type="password"
              placeholder="パスワードを入力"
              defaultValue={state?.values?.password}
              errors={state?.error?.fields?.password}
              required
            />
            <InputField
              id="confirmPassword"
              label="パスワード（確認用）"
              type="password"
              placeholder="パスワードを再入力"
              defaultValue={state?.values?.confirmPassword}
              errors={state?.error?.fields?.confirmPassword}
              required
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
