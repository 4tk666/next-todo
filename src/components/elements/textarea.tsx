'use client'

import { clsx } from 'clsx'

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
      className={clsx(
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
