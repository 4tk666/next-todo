'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getTodoDTO } from '../dto/todo-dto'
import { createTodoFilterCondition } from '../helpers/todo-filter-helpers'

type GetTodosOptions = {
  filter?: string
}

/**
 * ユーザーのToDoリストを取得
 * @param options フィルタリングオプション
 * @returns ToDoリストの配列
 */
export async function getTodos(options: GetTodosOptions = {}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const userId = session.user.id
  const { filter } = options

  // 基本的なwhere条件を定義する関数
  const baseWhereClause = {
    userId,
    parentId: null,
  }

  // フィルタに応じた条件を生成する関数
  const filterCondition = createTodoFilterCondition(filter)

  // where条件を組み立て
  const whereClause = {
    ...baseWhereClause,
    ...filterCondition,
  }

  const todos = await prisma.todo.findMany({
    where: whereClause,
    include: {
      children: {
        include: {
          children: true, // 孫TODOまで取得
        },
      },
    },
    orderBy: [{ isComplete: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
  })

  return todos.map(getTodoDTO)
}
