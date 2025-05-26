'use client'

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
  // 基本のスタイルクラス
  const baseClassNames =
    'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1.5 text-gray-800 border'

  // エラー時のクラス
  const errorClassNames =
    errors && errors.length > 0
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : ''

  // 最終的なクラス名
  const finalClassNames =
    `${baseClassNames} ${errorClassNames} ${className}`.trim()

  return (
    <input
      id={id}
      name={name}
      type={type}
      className={finalClassNames}
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
