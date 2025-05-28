import { z } from 'zod'
import { requiredStringSchema, titleSchema, descriptionSchema, booleanSchema } from '../common-schemas'

/**
 * タスク更新フォームのバリデーションスキーマ
 */
export const updateTodoSchema = z.object({
  id: requiredStringSchema,
  title: titleSchema,
  description: descriptionSchema,
  isComplete: booleanSchema,
})

export type UpdateTodoFormValues = z.infer<typeof updateTodoSchema>
