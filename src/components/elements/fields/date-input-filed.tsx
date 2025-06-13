'use client'

import { clsx } from 'clsx'
import { DateInput, type DateInputProps } from '../date-input'
import { FormError } from '../form-error'

type DateInputFiledProps = Pick<
  DateInputProps,
  | 'format'
  | 'className'
  | 'disabled'
  | 'id'
  | 'name'
  | 'defaultValue'
> & {
  label?: string
  errors?: string[]
}

/**
 * 日付入力フィールドコンポーネント
 *
 * 日付選択のための入力フィールドを提供します。
 * ラベル、エラーメッセージ、デフォルト値の設定が可能です。
 *
 * @param props - DateInputFiledProps
 * @returns 日付入力フィールドコンポーネント
 */
export function DateInputFiled({
  format = 'yyyy/MM/dd',
  className,
  disabled = false,
  errors,
  label,
  id,
  name,
  defaultValue,
}: DateInputFiledProps) {
  return (
    <div className="w-full">
      {/* ラベル部分 */}
      {label && (
        <div className="mb-2">
          <label
            htmlFor={id}
            className={clsx(
              // レイアウト・配置
              'block',
              // 色・テキスト
              'text-sm font-medium text-gray-700',
            )}
          >
            {label}
          </label>
        </div>
      )}

      {/* 日付選択部分 */}
      <DateInput
        id={id}
        name={name}
        disabled={disabled}
        hasError={errors && errors.length > 0}
        defaultValue={defaultValue}
        format={format}
        className={className}
      />

      {/* エラーメッセージ */}
      <FormError errors={errors} id={id} />
    </div>
  )
}
