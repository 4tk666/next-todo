import { cn } from '@/lib/utils/class-utils'

type ErrorBannerProps = {
  /** エラーメッセージ */
  message: string
  /** カスタムクラス名 */
  className?: string
}

/**
 * エラーメッセージを表示するバナーコンポーネント
 * フォーム全体に対するエラーメッセージの表示に使用します
 */
export function ErrorBanner({ message, className }: ErrorBannerProps) {
  return (
    <div
      className={cn(
        'mt-4 p-3',
        'text-sm',
        'bg-red-100 border border-red-400',
        'text-red-700 rounded',
        className,
      )}
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  )
}
