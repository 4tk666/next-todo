import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils/class-utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export function Button({
  children,
  disabled,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'group cursor-pointer relative',
        'flex w-full justify-center',
        'px-4 py-2',
        'rounded-md',
        'text-sm font-semibold text-white',
        'bg-indigo-600 hover:bg-indigo-500',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
        'disabled:bg-gray-300',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
