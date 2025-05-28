'use client'

import { FormError } from './form-error'
import { Input } from './input'

type FormFieldProps = {
  id: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  defaultValue?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors?: string[]
  required?: boolean
  disabled?: boolean
  autoComplete?: string
}

export function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  defaultValue,
  value,
  onChange,
  errors,
  required = false,
  disabled = false,
  autoComplete,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && (
          <span className="text-red-500 ml-1 text-lg" aria-label="必須項目">
            *
          </span>
        )}
      </label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        errors={errors}
        disabled={disabled}
        autoComplete={autoComplete}
      />
      <FormError errors={errors} id={id} />
    </div>
  )
}
