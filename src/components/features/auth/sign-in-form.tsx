'use client'

import { Button } from '@/components/elements/button'
import { ErrorBanner } from '@/components/elements/error-banner'
import { InputField } from '@/components/elements/fields/input-field'
import type { ActionState } from '@/types/form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { signInAction } from '@/lib/server-actions/auth/sign-in-actions'
import { toast } from 'sonner'

/**
 * 通常のサインインフォームコンポーネント
 * クライアントサイドでのみ動作し、フォーム状態を管理
 */
export function SignInForm() {
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
    <>
      {state?.error && <ErrorBanner message={state.error.message} />}

      <form className="space-y-6" action={action}>
        <div className="space-y-4">
          <InputField
            id="username"
            label="メールアドレス"
            type="email"
            placeholder="メールアドレスを入力"
            // defaultValue={state?.values?.username}
            errors={state?.error?.fields?.username}
          />
          <InputField
            id="password"
            label="パスワード"
            type="password"
            placeholder="パスワードを入力"
            // defaultValue={state?.values?.password}
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
