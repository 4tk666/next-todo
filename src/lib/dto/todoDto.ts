import type { Todo } from '@prisma/client'

export type TodoDTO = {
  /** Todoの一意識別子 */
  id: string
  /** Todoのタイトル */
  title: string
  /** Todoの詳細説明（省略可能） */
  description: string | null
  /** Todoが完了しているかどうか */
  isComplete: boolean
  /** Todoの作成日時（ISO文字列形式） */
  createdAt: string
  /** Todoの更新日時（ISO文字列形式） */
  updatedAt: string
}

/**
 * TodoエンティティをDTOに変換する関数
 * @param todo - PrismaのTodoエンティティ
 * @returns TodoDTOオブジェクト
 */
export  function getTodoDTO(todo: Todo): TodoDTO {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    isComplete: todo.isComplete,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  }
}
