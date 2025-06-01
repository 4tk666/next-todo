'use client'

import { cn } from '@/lib/utils/class-utils'

type TextareaProps = {
  id: string
  name?: string
  className?: string
  placeholder?: string
  rows?: number
  defaultValue?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  errors?: string[]
  disabled?: boolean
}

export function Textarea({
  id,
  name = id,
  className = '',
  placeholder,
  rows = 3,
  defaultValue,
  value,
  onChange,
  errors,
  disabled = false,
}: TextareaProps) {
  const hasErrors = errors && errors.length > 0

  return (
    <textarea
      id={id}
      name={name}
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
      rows={rows}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-invalid={!!errors}
      aria-describedby={errors ? `${id}-error` : undefined}
    />
  )
}
