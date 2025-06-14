import { z } from 'zod'
import { TODO_PRIORITIES, type TodoPriority } from '@/constants/todo-priority'

/**
 * 汎用的なバリデーションスキーマの集約ファイル
 * 再利用可能なスキーマコンポーネントを提供します
 */

// 汎用的な文字列のスキーマ
export const requiredStringSchema = z
  .string()
  .trim()
  .min(1, { message: 'この項目は必須です' })

// メールアドレス関連のスキーマ
export const emailSchema = requiredStringSchema
  .max(100, { message: 'メールアドレスは100文字以下で入力してください' })
  .email({ message: '有効なメールアドレスを入力してください' })

// パスワード関連のスキーマ
export const passwordSchema = requiredStringSchema
  .min(8, { message: 'パスワードは8文字以上で入力してください' })
  .max(100, { message: 'パスワードは100文字以下で入力してください' })

// 名前関連のスキーマ
export const nameSchema = requiredStringSchema.max(50, {
  message: '名前は50文字以下で入力してください',
})

// タイトル関連のスキーマ
export const titleSchema = requiredStringSchema.max(100, {
  message: 'タイトルは100文字以下で入力してください',
})

// 説明文関連のスキーマ
export const descriptionSchema = z
  .string()
  .max(500, { message: '説明は500文字以下で入力してください' })
  .nullable()

// ブール値のスキーマ
export const booleanSchema = z.boolean()

// 期日のスキーマ（ISO文字列形式での入力を受け取り、日付に変換してバリデーション）
export const dueDateSchema = z.date().nullable()

export const parentIdSchema = z
  .string()
  .nullable()

// パスワード確認用のrefineヘルパー関数
export function createPasswordConfirmationRefine<
  T extends { password: string; confirmPassword: string },
>(schema: z.ZodType<T>) {
  return schema.refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードと確認用パスワードが一致しません',
    path: ['confirmPassword'],
  })
}

// 優先度のスキーマ
export const prioritySchema = z
  .number()
  .refine(
    (value) => {
      return Object.values(TODO_PRIORITIES).includes(value as TodoPriority)
    },
    { message: '有効な優先度を選択してください' },
  )
  .transform((value) => {
    return value === TODO_PRIORITIES.UN_SELECTED ? null : value
  })
