'use client'

import { Button } from '@/components/elements/button'
import { InputField } from '@/components/elements/fields/input-field'
import type { ActionState } from '@/types/form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { signUpAction } from '../../../lib/server-actions/auth/sign-up-actions'
import { ErrorBanner } from '@/components/elements/error-banner'
import type { SignUpFormValues } from '@/lib/schemas/auth/sign-up-schema'
import { toast } from 'sonner'

export default function SignUpPage() {
  const router = useRouter()

  const [state, action, isPending] = useActionState(
    async (
      state: ActionState<void, SignUpFormValues> | undefined,
      formData: FormData,
    ) => {
      try {
        const result = await signUpAction(formData)
        if (result.success) {
          router.push('/')
          toast.success('アカウントを作成しました。')
        } else {
          // エラーがある場合はそのまま表示
          toast.error(
            result.error?.message || 'アカウントの作成に失敗しました。',
          )
        }

        return result
      } catch (error) {
        console.error('Sign up error:', error)
        toast.error(
          'アカウントの作成中にエラーが発生しました。もう一度お試しください。',
        )
      }
    },
    undefined,
  )

  return (
    <div className="flex justify-center items-center h-full">
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
              href="/sign-in"
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
