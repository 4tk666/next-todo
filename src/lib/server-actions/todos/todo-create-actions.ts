'use server'

import { auth } from '@/auth'
import { DEFAULT_VALUES } from '@/constants/default-values'
import { prisma } from '@/lib/prisma'
import {
  type CreateTodoFormValues,
  createTodoSchema,
} from '@/lib/schemas/todos/todo-create-schema'
import type { ActionState } from '@/types/form'
import { revalidatePath } from 'next/cache'
import { getSessionUserIdOrError } from '../shared/auth-helpers'
import { validateParentId } from '../shared/todo-helpers'
/**
 * タスクを新規作成するサーバーアクション（useActionState対応版）
 * @param prevState - 前の状態
 * @param formData - フォームデータ
 * @returns 作成結果
 */
export async function createTodoAction(
  formData: FormData,
): Promise<ActionState<void, CreateTodoFormValues>> {
  try {
    // セッション認証チェック
    const sessionResult = await getSessionUserIdOrError()

    if (!sessionResult.success) return sessionResult
    const userId = sessionResult.userId

    // 入力値を保持（エラー時の再表示用）
    const values = {
      title: String(formData.get('title') ?? ''),
      description: formData.get('description')
        ? String(formData.get('description'))
        : null,
      dueDate: formData.get('dueDate')
        ? new Date(formData.get('dueDate')?.toString() ?? '')
        : null,
      priority: formData.get('priority')
        ? Number(String(formData.get('priority')))
        : null,
      parentId: formData.get('parentId')
        ? String(formData.get('parentId'))
        : null,
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

    const { title, description, dueDate, priority, parentId } =
      validationResult.data

    // 親TodoのIDが指定されている場合、存在確認
    const parentIdErrorResult = await validateParentId(parentId)
    if (!parentIdErrorResult.success) return parentIdErrorResult

    // データベースに保存（バリデーション済みデータを使用）
    await prisma.todo.create({
      data: {
        title,
        description,
        dueDate,
        priority,
        parentId:
          parentId === DEFAULT_VALUES.UNSELECTED_STRING ? null : parentId,
        userId,
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
      }
    }
  }
}
