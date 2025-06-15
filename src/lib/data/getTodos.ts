'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getTodoDTO } from '../dto/todoDto'
import { TODO_TABS_VALUES } from '@/constants/todo-tabs'

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
  const createFilterCondition = (filterType?: string) => {
    if (filterType === TODO_TABS_VALUES.COMPLETED) {
      return { isComplete: true }
    }
    if (filterType === TODO_TABS_VALUES.UPCOMING) {
      const now = new Date()
      return {
        isComplete: false,
        dueDate: {
          gte: now, // 期限日が現在時刻より後（greater than）
        },
      }
    }
    if (filterType === TODO_TABS_VALUES.OVERDUE) {
      const now = new Date()
      return {
        isComplete: false,
        dueDate: {
          lt: now,
        },
      }
    }
    // TODO_TABS_VALUES.ALLの場合やfilterがundefinedの場合は空のオブジェクトを返す（すべて表示）
    return {}
  }

  // where条件を組み立て
  const whereClause = {
    ...baseWhereClause,
    ...createFilterCondition(filter),
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
