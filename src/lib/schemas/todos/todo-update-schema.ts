import { z } from 'zod'

/**
 * タスク更新フォームのバリデーションスキーマ
 */
export const updateTodoSchema = z.object({
  id: z.string().min(1, { message: 'IDが必要です' }),
  title: z
    .string()
    .min(1, { message: 'タイトルを入力してください' })
    .max(100, { message: 'タイトルは100文字以下で入力してください' }),
  description: z
    .string()
    .max(500, { message: '説明は500文字以下で入力してください' })
    .optional()
    .nullable(),
  isComplete: z.boolean(),
})

export type UpdateTodoFormValues = z.infer<typeof updateTodoSchema>
