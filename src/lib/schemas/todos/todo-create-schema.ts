import { z } from 'zod'
import {
  descriptionSchema,
  dueDateSchema,
  titleSchema,
  prioritySchema,
} from '../common-schemas'
import { TODO_PRIORITIES, type TodoPriority } from '@/constants/todo-priority'

/**
 * タスク作成フォームのバリデーションスキーマ
 */
export const createTodoSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
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

export type CreateTodoFormValues = z.infer<typeof createTodoSchema>
