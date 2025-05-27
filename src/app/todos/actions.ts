'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import type { ActionState } from '@/types/form'
import { revalidatePath } from 'next/cache'
import { createTodoSchema } from './schema'

/**
 * タスクを新規作成するサーバーアクション（useActionState対応版）
 * @param prevState - 前の状態
 * @param formData - フォームデータ
 * @returns 作成結果
 */
export async function createTodoAction(
  prevState: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  // セッションチェック
  const session = await auth()
  if (!session?.user?.id) {
    return {
      error: '認証されていません。再度ログインしてください。',
      success: false,
    }
  }

  // 入力値を保持（エラー時の再表示用）
  const values = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
  }

  // バリデーション（safeParse使用）
  const validationResult = createTodoSchema.safeParse(values)

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors
    return {
      success: false,
      formError: errors,
      values,
    }
  }

  try {
    // データベースに保存（バリデーション済みデータを使用）
    await prisma.todo.create({
      data: {
        title: validationResult.data.title,
        description: validationResult.data.description,
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
      error: 'タスクの作成に失敗しました。もう一度お試しください。',
      values,
    }
  }
}
