'use client'

import { FormError } from '../form-error'
import { FormLabel } from '../form-label'
import { Textarea } from '../textarea'

// TextareaコンポーネントのProps型をインポート
type TextareaProps = React.ComponentProps<typeof Textarea>

type TextareaFieldProps = TextareaProps & {
  /** フィールドのラベルテキスト */
  label: React.ReactNode
  /** 必須項目かどうか */
  required?: boolean
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
  required = false,
  ...textareaProps
}: TextareaFieldProps) {
  return (
    <div>
      <FormLabel id={id} required={required}>
        {label}
      </FormLabel>
      <Textarea id={id} {...textareaProps} />
      <FormError errors={textareaProps.errors} id={id} />
    </div>
  )
}
