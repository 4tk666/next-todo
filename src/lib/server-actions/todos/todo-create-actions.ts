'use server'

import { auth } from '@/auth'
import { DEFAULT_VALUES } from '@/constants/default-values'
import { prisma } from '@/lib/prisma'
import { createTodoSchema } from '@/lib/schemas/todos/todo-create-schema'
import type { ActionState } from '@/types/form'
import { revalidatePath } from 'next/cache'

/**
 * 指定されたparentIdが有効かどうかを確認する
 * @param parentId 親TodoのID
 * @returns 有効な場合はtrue、無効な場合はfalse
 */
async function validateParentId(parentId: string): Promise<boolean> {
  const session = await auth()
  if (!session?.user?.id) return false

  const parentTodo = await prisma.todo.findFirst({
    where: {
      id: parentId,
      userId: session.user.id,
    },
    // パフォーマンス最適化のため、必要最小限のフィールド（IDのみ）を取得
    select: {
      id: true,
    },
  })

  return !!parentTodo
}

/**
 * タスクを新規作成するサーバーアクション（useActionState対応版）
 * @param prevState - 前の状態
 * @param formData - フォームデータ
 * @returns 作成結果
 */
export async function createTodoAction(
  formData: FormData,
): Promise<ActionState> {
  // セッションチェック
  const session = await auth()
  if (!session?.user?.id) {
    return {
      success: false,
      error: {
        message: '認証されていません。再度ログインしてください。',
      },
    }
  }

  // 入力値を保持（エラー時の再表示用）
  const values = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    dueDate: formData.get('dueDate') as string,
    priority: formData.get('priority') as string,
    parentId: formData.get('parentId') as string,
  }

  // バリデーション（safeParse使用）
  const validationResult = createTodoSchema.safeParse(values)

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors
    return {
      success: false,
      error: {
        message: 'バリデーションエラーが発生しました',
        fields: errors,
      },
      values,
    }
  }

  if (
    validationResult.data.parentId &&
    validationResult.data.parentId !== DEFAULT_VALUES.UNSELECTED_STRING
  ) {
    const isValidParentId = await validateParentId(
      validationResult.data.parentId,
    )

    if (!isValidParentId) {
      return {
        success: false,
        error: {
          message: '指定された親タスクが見つかりません。',
          fields: {
            parentId: [
              '選択された親タスクは存在しないか、アクセス権限がありません。',
            ],
          },
        },
        values,
      }
    }
  }

  try {
    // データベースに保存（バリデーション済みデータを使用）
    await prisma.todo.create({
      data: {
        title: validationResult.data.title,
        description: validationResult.data.description,
        dueDate: validationResult.data.dueDate,
        priority: validationResult.data.priority,
        parentId:
          validationResult.data.parentId === DEFAULT_VALUES.UNSELECTED_STRING
            ? null
            : validationResult.data.parentId,
        userId: session.user.id,
      },
    })

    // ページのキャッシュを再検証
    revalidatePath('/todos')

    return {
      success: true,
    }
  } catch (error) {
    console.error('タスク作成エラー:', error)
    return {
      success: false,
      error: {
        message: 'タスクの作成に失敗しました。もう一度お試しください。',
      },
      values,
    }
  }
}
