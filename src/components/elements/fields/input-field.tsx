'use client'

import { FormError } from '../form-error'
import { FormLabel } from '../form-label'
import { Input } from '../input'

type InputFieldProps = {
  id: string
  label: React.ReactNode
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

export function InputField({
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
}: InputFieldProps) {
  return (
    <div>
      <FormLabel id={id}  required={required} >
        {label}
      </FormLabel>
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
