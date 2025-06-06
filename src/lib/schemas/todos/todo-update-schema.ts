import { z } from 'zod'
import {
  requiredStringSchema,
  titleSchema,
  descriptionSchema,
  booleanSchema,
  dueDateSchema,
  prioritySchema,
} from '../common-schemas'

/**
 * タスク更新フォームのバリデーションスキーマ
 */
export const updateTodoSchema = z.object({
  id: requiredStringSchema,
  title: titleSchema,
  description: descriptionSchema,
  isComplete: booleanSchema,
  dueDate: dueDateSchema,
  priority: prioritySchema,
  parentId: z.string().nullable(),
})

export type UpdateTodoFormValues = z.infer<typeof updateTodoSchema>
