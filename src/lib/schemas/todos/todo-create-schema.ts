import { z } from 'zod'
import {
  descriptionSchema,
  dueDateSchema,
  titleSchema,
  prioritySchema,
} from '../common-schemas'

/**
 * タスク作成フォームのバリデーションスキーマ
 */
export const createTodoSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  dueDate: dueDateSchema,
  priority: prioritySchema,
  parentId: z.string().optional().nullable(),
})

export type CreateTodoFormValues = z.infer<typeof createTodoSchema>
