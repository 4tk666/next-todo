'use client'

import { useFormStatus } from 'react-dom'
import { FaGithub } from 'react-icons/fa'
import clsx from 'clsx'
import { Button } from '@/components/elements/button'

/**
 * GitHub認証ボタンコンポーネント
 * useFormStatusでローディング状態を自動管理
 * エラー表示は別コンポーネント（GitHubSignInError）で処理
 */
export function GitHubSignInButton() {
  const { pending } = useFormStatus()

  return (
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
  )
}
