import type { TodoPriority } from '@/constants/todo-priority'
import type { Todo } from '@prisma/client'
import { formatDateToString } from '../utils/date-utils'

/**
 * 階層構造を持つTodoの型定義
 * 子TODOを含む場合の型を明示的に定義
 */
type TodoWithChildren = Todo & {
  children?: TodoWithChildren[]
}

export type TodoDTO = {
  id: string
  title: string
  description?: string
  isComplete: boolean
  dueDate?: string
  parentId?: string
  priority?: TodoPriority
  createdAt: string
  updatedAt: string
  children: TodoDTO[]
}
/**
 * TodoエンティティをDTOに変換する関数
 * @param todo - PrismaのTodoエンティティ
 * @returns TodoDTOオブジェクト
 */
export function getTodoDTO(todo: TodoWithChildren): TodoDTO {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description ?? undefined,
    isComplete: todo.isComplete,
    dueDate: todo.dueDate
      ? formatDateToString({
          date: todo.dueDate,
          formatType: 'yyyy/MM/dd',
        })
      : undefined,
    parentId: todo.parentId ?? undefined,
    // priorityの型修正 #57
    priority:
      typeof todo.priority === 'number'
        ? (todo.priority as TodoPriority)
        : undefined,
    createdAt: formatDateToString({
      date: todo.createdAt,
      formatType: 'yyyy/MM/dd HH:mm:ss',
    }),
    updatedAt: formatDateToString({
      date: todo.updatedAt,
      formatType: 'yyyy/MM/dd HH:mm:ss',
    }),
    children: todo.children?.map(getTodoDTO) ?? [],
  }
}
