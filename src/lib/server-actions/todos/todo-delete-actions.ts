'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import type { ActionState } from '@/types/form'
import { revalidatePath } from 'next/cache'

/**
 * Todoを削除するサーバーアクション
 */
export async function deleteTodoAction(todoId: string): Promise<ActionState> {
  try {
    // 認証チェック
    const session = await auth()
    if (!session?.user?.id) {
      return {
        success: false,
        error: {
          message: 'ユーザーが認証されていません',
        },
      }
    }

    // 存在確認と所有者チェックを同時に行い、該当するTodoを削除
    // deleteMany を使用することで、条件に一致するレコードがない場合も安全に処理できます
    const deletedTodo = await prisma.todo.deleteMany({
      where: {
        id: todoId,
        userId: session.user.id, // 所有者チェックも同時に実行
      },
    })

    // 削除されたレコード数をチェック
    if (deletedTodo.count === 0) {
      return {
        success: false,
        error: {
          message: '指定されたTodoが存在しないか、削除する権限がありません',
        },
      }
    }

    // キャッシュを再検証してUIを更新
    revalidatePath('/todos')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Todo削除エラー:', error)
    return {
      success: false,
      error: {
        message: 'Todoの削除中にエラーが発生しました',
      },
    }
  }
}
