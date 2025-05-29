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
        hasErrors
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
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
