import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/class-utils'

type LinkButtonVariant = 'primary' | 'outline'

type LinkButtonProps = {
  href: string
  children: ReactNode
  variant?: LinkButtonVariant
  className?: string
}

/**
 * ボタンのようなスタイルを持つLinkコンポーネント
 * aタグの中にbuttonを入れ子にしない、適切なHTML構造を提供します
 */
export function LinkButton({
  href,
  children,
  variant = 'primary',
  className = '',
}: LinkButtonProps) {
  const getVariantStyles = (variant: LinkButtonVariant): string => {
    switch (variant) {
      case 'primary':
        return cn(
          'text-white',
          'bg-indigo-600 hover:bg-indigo-500',
          'focus-visible:outline-indigo-600',
        )
      case 'outline':
        return cn(
          'text-indigo-600 border border-indigo-600',
          'bg-transparent hover:bg-indigo-50',
          'focus-visible:outline-indigo-600',
        )
      default:
        return ''
    }
  }

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center',
        'px-4 py-2',
        'rounded-md',
        'text-sm font-semibold',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'transition-colors duration-200',
        getVariantStyles(variant),
        className,
      )}
    >
      {children}
    </Link>
  )
}
