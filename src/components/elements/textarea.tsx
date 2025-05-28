'use client'

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
    <textarea
      id={id}
      name={name}
      className={finalClassNames}
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
