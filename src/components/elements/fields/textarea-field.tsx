'use client'

import { FormError } from '../form-error'
import { FormLabel } from '../form-label'
import { Textarea } from '../textarea'

type TextareaFieldProps = {
  /** 入力フィールドの一意識別子 */
  id: string
  /** フィールドのラベルテキスト */
  label: React.ReactNode
  /** フォーム送信時のフィールド名 */
  name?: string
  /** プレースホルダーテキスト */
  placeholder?: string
  /** テキストエリアの行数 */
  rows?: number
  /** デフォルト値（非制御コンポーネント用） */
  defaultValue?: string
  /** 現在の値（制御コンポーネント用） */
  value?: string
  /** 値変更時のコールバック（制御コンポーネント用） */
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  /** エラーメッセージの配列 */
  errors?: string[]
  /** 必須項目かどうか */
  required?: boolean
  /** 無効状態かどうか */
  disabled?: boolean
  /** 追加のCSSクラス名 */
  className?: string
}

/**
 * フォーム用Textarea Field
 * 
 * ラベル、エラー表示、バリデーション機能を含む統合型のTextareaコンポーネントです。
 * フォーム内での使用を想定し、アクセシビリティとユーザビリティを考慮した設計となっています。
 * 
 * @example
 * ```tsx
 * // 非制御コンポーネントとして使用
 * <TextareaField
 *   id="description"
 *   label="タスクの説明"
 *   placeholder="詳細を入力してください"
 *   rows={5}
 *   errors={state?.error?.fields?.description}
 * />
 * 
 * // 制御コンポーネントとして使用
 * <TextareaField
 *   id="notes"
 *   label="メモ"
 *   value={notesValue}
 *   onChange={(e) => setNotesValue(e.target.value)}
 * />
 * ```
 */
export function TextareaField({
  id,
  label,
  name = id,
  placeholder,
  rows = 3,
  defaultValue,
  value,
  onChange,
  errors,
  required = false,
  disabled = false,
  className,
}: TextareaFieldProps) {
  return (
    <div>
      <FormLabel id={id} required={required}>
        {label}
      </FormLabel>
      <Textarea
        id={id}
        name={name}
        placeholder={placeholder}
        rows={rows}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        errors={errors}
        disabled={disabled}
        className={className}
      />
      <FormError errors={errors} id={id} />
    </div>
  )
}
