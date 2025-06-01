import { z } from 'zod'
import {
  descriptionSchema,
  dueDateSchema,
  titleSchema,
} from '../common-schemas'

/**
 * タスク作成フォームのバリデーションスキーマ
 */
export const createTodoSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  dueDate: dueDateSchema,
})

export type CreateTodoFormValues = z.infer<typeof createTodoSchema>
