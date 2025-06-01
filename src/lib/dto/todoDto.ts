import type { TodoPriority } from '@/constants/todo-priority'
import type { Todo } from '@prisma/client'

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
    dueDate: todo.dueDate?.toISOString(),
    parentId: todo.parentId ?? undefined,
    // priorityの型修正 #57
    priority: typeof todo.priority === 'number' ? todo.priority as TodoPriority : undefined,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
    children: todo.children?.map(getTodoDTO) ?? [],
  }
}
