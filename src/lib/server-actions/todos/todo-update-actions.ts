'use server'

import { auth } from '@/auth'
import { DEFAULT_VALUES } from '@/constants/default-values'
import type { TodoDTO } from '@/lib/dto/todoDto'
import { prisma } from '@/lib/prisma'
import {
  type UpdateTodoFormValues,
  updateTodoSchema,
} from '@/lib/schemas/todos/todo-update-schema'
import type { ActionState, UpdateActionState } from '@/types/form'
import { revalidatePath } from 'next/cache'
import { getSessionUserIdOrError } from '../shared/auth-helpers'
import { validateTodoOwnership } from '../shared/todo-helpers'

/**
 * Todoを更新するサーバーアクション
 * @param values - 更新するTodoの値
 * @returns 更新結果
 */
export async function updateTodoAction({
  formData,
  todo,
}: { formData: FormData; todo: TodoDTO }): Promise<
  UpdateActionState<void, UpdateTodoFormValues>
> {
  try {
    // セッション認証チェック
    const sessionResult = await getSessionUserIdOrError()

    if (!sessionResult.success) return sessionResult

    const values = {
      id: todo.id,
      isComplete: formData.get('isComplete') === 'on',
      title: formData.get('title'),
      description: formData.get('description'),
      dueDate: formData.get('dueDate'),
      priority: formData.get('priority'),
      parentId: formData.get('parentId'),
    }

    // バリデーション
    const validatedFields = updateTodoSchema.safeParse(values)

    if (!validatedFields.success) {
      return {
        success: false,
        error: {
          message: '入力内容に誤りがあります',
          fields: validatedFields.error.flatten().fieldErrors,
        },
        values: validatedFields.data,
      }
    }

    // Todoの存在確認と所有者チェック
    const ownershipErrorResult = await validateTodoOwnership(todo.id)
    if (!ownershipErrorResult.success) return ownershipErrorResult

    const { id, title, description, isComplete, dueDate, priority, parentId } =
      validatedFields.data

    // Todoを更新
    await prisma.todo.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        isComplete,
        dueDate,
        priority,
        parentId:
          parentId === DEFAULT_VALUES.UNSELECTED_STRING ? null : parentId,
        updatedAt: new Date(),
      },
    })

    // ページを再検証
    revalidatePath('/todos')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Todo更新エラー:', error)
    return {
      success: false,
      error: {
        message: 'タスクの更新に失敗しました',
      },
    }
  }
}

/**
 * Todoの完了状態を切り替えるサーバーアクション
 * @param todoId - TodoのID
 * @param isComplete - 新しい完了状態
 * @returns 更新結果
 */
export async function toggleTodoCompleteAction(
  todoId: string,
  isComplete: boolean,
): Promise<ActionState> {
  const session = await auth()
  if (!session?.user?.id) {
    return {
      success: false,
      error: {
        message: 'ログインが必要です',
      },
    }
  }

  try {
    // Todoの存在確認と所有者チェック
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: session.user.id,
      },
    })

    if (!existingTodo) {
      return {
        success: false,
        error: {
          message: 'タスクが見つかりません',
        },
      }
    }

    // Todoの完了状態を更新
    await prisma.todo.update({
      where: {
        id: todoId,
      },
      data: {
        isComplete,
        updatedAt: new Date(),
      },
    })

    // ページを再検証
    revalidatePath('/todos')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Todo完了状態更新エラー:', error)
    return {
      success: false,
      error: {
        message: 'タスクの状態更新に失敗しました',
      },
    }
  }
}
