'use client'

import { FormError } from '../form-error'
import { FormLabel } from '../form-label'
import { Input } from '../input'

// InputコンポーネントのProps型をインポート
type InputProps = React.ComponentProps<typeof Input>

type InputFieldProps = InputProps & {
  /** フィールドのラベルテキスト */
  label: React.ReactNode
  /** 必須項目かどうか */
  required?: boolean
}

/**
 * フォーム用Input Field
 * 
 * ラベル、エラー表示、バリデーション機能を含む統合型のInputコンポーネントです。
 * フォーム内での使用を想定し、アクセシビリティとユーザビリティを考慮した設計となっています。
 * 基底のInputコンポーネントのすべてのPropsを継承し、追加でlabelとrequiredプロパティを提供します。
 * 
 * @example
 * ```tsx
 * // 基本的な使用方法（非制御コンポーネント）
 * <InputField
 *   id="title"
 *   label="タスクのタイトル"
 *   placeholder="タイトルを入力してください"
 *   errors={state?.error?.fields?.title}
 * />
 * 
 * // 必須項目として使用
 * <InputField
 *   id="email"
 *   label="メールアドレス"
 *   type="email"
 *   required
 *   autoComplete="email"
 *   errors={formErrors?.email}
 * />
 * 
 * // 制御コンポーネントとして使用
 * <InputField
 *   id="search"
 *   label="検索"
 *   type="search"
 *   value={searchTerm}
 *   onChange={(e) => setSearchTerm(e.target.value)}
 * />
 * ```
 */
export function InputField({
  id,
  label,
  required = false,
  ...inputProps
}: InputFieldProps) {
  return (
    <div>
      <FormLabel id={id} required={required}>
        {label}
      </FormLabel>
      <Input id={id} {...inputProps} />
      <FormError errors={inputProps.errors} id={id} />
    </div>
  )
}
