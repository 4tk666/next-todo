'use client'

import { Button } from '@/components/elements/button'
import { ErrorBanner } from '@/components/elements/error-banner'
import { InputField } from '@/components/elements/fields/input-field'
import { GitHubSignInButton } from '@/components/features/auth/github-sign-in-button'
import type { ActionState } from '@/types/form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import {
  signInAction,
  signInGithubAction,
} from '../../../lib/server-actions/auth/sign-in-actions'
import { toast } from 'sonner'

export default function SignInPage() {
  const router = useRouter()

  // 通常認証の状態管理（バリデーションエラー表示のため）
  const [state, action, isPending] = useActionState(
    async (state: ActionState | undefined, formData: FormData) => {
      const result = await signInAction(formData)
      if (result.success) {
        toast.success('サインインしました')
        router.push('/')
      }
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

        {state?.error && <ErrorBanner message={state.error.message} />}
        

        {/* GitHub認証ボタン */}
        <form action={signInGithubAction} className="mt-6">
          <GitHubSignInButton />
        </form>

        {/* 区切り線 */}
        <div className="mt-6 mb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>
        </div>

        <form className="space-y-6" action={action}>
          <div className="space-y-4">
            <InputField
              id="username"
              label="メールアドレス"
              type="email"
              placeholder="メールアドレスを入力"
              defaultValue={state?.values?.username}
              errors={state?.error?.fields?.username}
            />
            <InputField
              id="password"
              label="パスワード"
              type="password"
              placeholder="パスワードを入力"
              defaultValue={state?.values?.password}
              errors={state?.error?.fields?.password}
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
              href="/sign-up"
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
