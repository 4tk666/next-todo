import { z } from 'zod'

/**
 * タスク作成フォームのバリデーションスキーマ
 */
export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'タイトルを入力してください' })
    .max(100, { message: 'タイトルは100文字以下で入力してください' }),
  description: z
    .string()
    .max(500, { message: '説明は500文字以下で入力してください' })
    .optional()
    .nullable(),
})

export type CreateTodoFormValues = z.infer<typeof createTodoSchema>
