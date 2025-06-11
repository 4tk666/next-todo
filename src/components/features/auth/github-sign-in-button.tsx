'use client'

import { useFormStatus } from 'react-dom'
import { FaGithub } from 'react-icons/fa'
import clsx from 'clsx'
import { Button } from '@/components/elements/button'
import { useSearchParams } from 'next/navigation'
import { FormError } from '@/components/elements/form-error'
import { OAUTH_ERRORS } from '@/constants/oauth-errors'

/**
 * GitHub認証ボタンコンポーネント
 * useFormStatusでローディング状態を自動管理
 */
export function GitHubSignInButton() {
  const { pending } = useFormStatus()

  const searchParams = useSearchParams()

  // NextAuthのOAuthエラーをURLパラメータから取得
  const authError = searchParams.get('error')


  return (
    <>
      <Button
        type="submit"
        disabled={pending}
        className={clsx(
          // レイアウト・配置
          'w-full flex items-center justify-center gap-2',
          // 色・テキスト
          'bg-gray-900 text-white',
          // 状態・インタラクション
          'hover:bg-gray-800',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        <FaGithub size={20} />
        {pending ? 'GitHubでサインイン中...' : 'GitHubでサインイン'}
      </Button>
      {authError && (
        <FormError
          errors={[
            OAUTH_ERRORS[authError] ||
              'GitHub認証中に予期しないエラーが発生しました。しばらく時間をおいて再度お試しください。',
          ]}
        />
      )}
    </>
  )
}
