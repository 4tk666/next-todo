'use client'

import { cn } from '@/lib/utils/class-utils'

type InputProps = {
  id: string
  name?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  className?: string
  placeholder?: string
  defaultValue?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors?: string[]
  disabled?: boolean
  autoComplete?: string
}

export function Input({
  id,
  name = id,
  type = 'text',
  className = '',
  placeholder,
  defaultValue,
  value,
  onChange,
  errors,
  disabled = false,
  autoComplete,
}: InputProps) {
  const hasErrors = errors && errors.length > 0

  return (
    <input
      id={id}
      name={name}
      type={type}
      className={cn(
        'mt-1 block w-full',
        'p-1.5',
        'rounded-md border shadow-sm',
        'text-gray-800 sm:text-sm',
        // フォーカス状態・アウトライン
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        hasErrors
          ? 'border-red-500 focus-visible:outline-red-600'
          : 'border-gray-300 focus-visible:outline-indigo-600',
        className,
      )}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-invalid={!!errors}
      aria-describedby={errors ? `${id}-error` : undefined}
      autoComplete={autoComplete}
    />
  )
}
