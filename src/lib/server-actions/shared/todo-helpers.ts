'use server'

/**
 * Todo関連のサーバーアクション用ヘルパー関数
 */
import { prisma } from '@/lib/prisma'
import { getSessionUserIdOrError } from './auth-helpers'
import { DEFAULT_VALUES } from '@/constants/default-values'

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

/**
 * 指定されたparentIdが有効かどうかを確認する
 * @param parentId 親TodoのID
 * @returns 有効な場合はtrue、無効な場合はfalse
 */
export async function validateParentId(
  parentId: string | null,
): Promise<{ success: false; errorMessage: string } | { success: true }> {
  if (!parentId || parentId === DEFAULT_VALUES.UNSELECTED_STRING) {
    return {
      success: true,
    }
  }

  const sessionResult = await getSessionUserIdOrError()
  if (!sessionResult.success) return sessionResult
  const userId = sessionResult.userId

  const parentTodo = await prisma.todo.findFirst({
    where: {
      id: parentId,
      userId: userId,
    },
    // パフォーマンス最適化のため、必要最小限のフィールド（IDのみ）を取得
    select: {
      id: true,
    },
  })

  if (!parentTodo) {
    return {
      success: false,
      errorMessage:
        '選択された親タスクは存在しないか、アクセス権限がありません。',
    }
  }

  return { success: true }
}

/**
 * Todoを削除し、セッション確認と所有者チェックを内部で実行する
 * @param todoId - 削除するTodoのID
 * @returns 削除結果
 */
export async function deleteTodoWithValidation(
  todoId: string,
): Promise<{ success: false; errorMessage: string } | { success: true }> {
  // セッション認証チェック
  const sessionResult = await getSessionUserIdOrError()
  if (!sessionResult.success) return sessionResult

  const userId = sessionResult.userId

  // 存在確認と所有者チェックを同時に行い、該当するTodoを削除
  // deleteMany を使用することで、条件に一致するレコードがない場合も安全に処理できます
  const deletedTodo = await prisma.todo.deleteMany({
    where: {
      id: todoId,
      userId, // 所有者チェックも同時に実行
    },
  })

  // 削除されたレコード数をチェック
  if (deletedTodo.count === 0) {
    return {
      success: false,
      errorMessage: '指定されたTodoが存在しないか、削除する権限がありません',
    }
  }

  return { success: true }
}
