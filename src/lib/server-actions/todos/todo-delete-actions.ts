'use server'

import type { ActionState } from '@/types/form'
import { revalidatePath } from 'next/cache'
import { deleteTodoWithValidation } from '../shared/todo-helpers'

/**
 * Todoを削除するサーバーアクション
 * @param todoId - 削除するTodoのID
 * @returns 削除結果
 */
export async function deleteTodoAction(todoId: string): Promise<ActionState> {
  try {
    // セッション確認と削除処理をヘルパー関数で実行
    const deleteResult = await deleteTodoWithValidation(todoId)

    if (!deleteResult.success) {
      return {
        success: false,
        error: {
          message: deleteResult.errorMessage,
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
