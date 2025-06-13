import { z } from 'zod'
import {
  descriptionSchema,
  dueDateSchema,
  titleSchema,
  prioritySchema,
  parentIdSchema,
} from '../common-schemas'

/**
 * タスク作成フォームのバリデーションスキーマ
 */
export const createTodoSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  dueDate: dueDateSchema,
  priority: prioritySchema,
  parentId: parentIdSchema
})

export type CreateTodoFormValues = z.infer<typeof createTodoSchema>
