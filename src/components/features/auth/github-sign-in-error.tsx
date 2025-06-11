'use client'

import { useSearchParams } from 'next/navigation'
import { FormError } from '@/components/elements/form-error'
import { OAUTH_ERRORS } from '@/constants/oauth-errors'

/**
 * GitHub認証エラー表示コンポーネント
 * useSearchParamsを使用するため、Suspenseで囲む必要があります
 */
export function GitHubSignInError() {
  const searchParams = useSearchParams()
  const authError = searchParams.get('error')

  if (!authError) return null

  return (
    <FormError
      errors={[
        OAUTH_ERRORS[authError] ||
          'GitHub認証中に予期しないエラーが発生しました。しばらく時間をおいて再度お試しください。',
      ]}
    />
  )
}
