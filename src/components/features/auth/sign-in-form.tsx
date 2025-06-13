'use client'

import { Button } from '@/components/elements/button'
import { ErrorBanner } from '@/components/elements/error-banner'
import { InputField } from '@/components/elements/fields/input-field'
import type { ActionState } from '@/types/form'
import Link from 'next/link'
import { useActionState } from 'react'
import { signInAction } from '@/lib/server-actions/auth/sign-in-actions'
import type { SignInFormValues } from '@/lib/schemas/auth/sign-in-schema'

/**
 * 通常のサインインフォームコンポーネント
 * サーバーアクションでエラーハンドリングとリダイレクトを処理
 */
export function SignInForm() {
  // サーバーアクションの状態管理（エラー時のみ状態が返される）
  const [state, action, isPending] = useActionState(
    async (
      _prevState: ActionState<void, SignInFormValues> | undefined,
      formData: FormData,
    ) => {
      return await signInAction(formData)
    },
    undefined,
  )

  return (
    <>
      {state?.error && <ErrorBanner message={state.error.message} />}

      <form className="mt-6 space-y-6" action={action}>
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
    </>
  )
}
