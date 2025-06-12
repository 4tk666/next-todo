import { z } from 'zod'
import {
  requiredStringSchema,
  titleSchema,
  descriptionSchema,
  booleanSchema,
} from '../common-schemas'
import { TODO_PRIORITIES, type TodoPriority } from '@/constants/todo-priority'

/**
 * タスク更新フォームのバリデーションスキーマ
 */
export const updateTodoSchema = z.object({
  id: requiredStringSchema,
  title: titleSchema,
  description: descriptionSchema,
  isComplete: booleanSchema,
  dueDate: z.date().nullable(),
  priority: z
    .number()
    .refine(
      (value) => {
        return Object.values(TODO_PRIORITIES).includes(value as TodoPriority)
      },
      { message: '有効な優先度を選択してください' },
    )
    .transform((value) => {
      return value === TODO_PRIORITIES.UN_SELECTED ? null : value
    }),
  parentId: z.string().nullable(),
})

export type UpdateTodoFormValues = z.infer<typeof updateTodoSchema>
