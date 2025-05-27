'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getTodoDTO } from '../dto/todoDto'

/**
 * ユーザーのToDoリストを取得
 * @returns ToDoリストの配列
 */
export async function getTodos() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const todos = await prisma.todo.findMany({
    where: {
      userId: session.user.id,
    },
  })
  return todos.map(getTodoDTO)
}
