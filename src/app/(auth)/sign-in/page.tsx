import { Suspense } from 'react'
import { GitHubSignInButton } from '@/components/features/auth/github-sign-in-button'
import { signInGithubAction } from '../../../lib/server-actions/auth/sign-in-actions'
import { GitHubSignInError } from '@/components/features/auth/github-sign-in-error'
import { SignInForm } from '@/components/features/auth/sign-in-form'

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 border">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            アカウントにサインイン
          </h2>
        </div>

        {/* GitHub認証セクション */}
        <div className="mt-6 space-y-3">
          <form action={signInGithubAction}>
            <GitHubSignInButton />
          </form>

          {/* エラー表示（Suspenseで囲む） */}
          <Suspense fallback={null}>
            <GitHubSignInError />
          </Suspense>
        </div>

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

        {/* 通常のサインインフォーム */}
        <SignInForm />
      </div>
    </div>
  )
}
