'use server'

import { auth } from '@/auth'
import { TODO_PRIORITIES } from '@/constants/todo-priority'
import { prisma } from '@/lib/prisma'
import { createTodoSchema } from '@/lib/schemas/todos/todo-create-schema'
import type { ActionState } from '@/types/form'
import { revalidatePath } from 'next/cache'

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

  try {
    // データベースに保存（バリデーション済みデータを使用）
    await prisma.todo.create({
      data: {
        title: validationResult.data.title,
        description: validationResult.data.description,
        dueDate: validationResult.data.dueDate,
        priority: validationResult.data.priority,
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
