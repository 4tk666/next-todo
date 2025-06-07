'use server'

/**
 * Todo関連のサーバーアクション用ヘルパー関数
 */
import { prisma } from '@/lib/prisma'
import { getSessionUserIdOrError } from './auth-helpers'

/**
 * Todoの存在確認と所有者チェックを行う
 * @param todoId - TodoのID
 * @param userId - ユーザーのID
 * @returns Todoが存在し、所有者が一致する場合はtrue、そうでなければエラーメッセージ
 */
export async function validateTodoOwnership(
  todoId: string,
): Promise<{ success: false; errorMessage: string } | { success: true }> {
  const sessionResult = await getSessionUserIdOrError()

  if (!sessionResult.success) return sessionResult
  const userId = sessionResult.userId

  const existingTodo = await prisma.todo.findFirst({
    where: {
      id: todoId,
      userId,
    },
  })

  if (!existingTodo) {
    return {
      success: false,
      errorMessage: 'タスクが見つかりません',
    }
  }

  return { success: true }
}
