import { z } from 'zod'
import { descriptionSchema, titleSchema } from '../common-schemas'

/**
 * タスク作成フォームのバリデーションスキーマ
 */
export const createTodoSchema = z.object({
  title: titleSchema,
  description: descriptionSchema
})

export type CreateTodoFormValues = z.infer<typeof createTodoSchema>
