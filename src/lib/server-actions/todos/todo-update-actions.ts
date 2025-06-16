'use server'

import { DEFAULT_VALUES } from '@/constants/default-values'
import type { TodoDTO } from '@/lib/dto/todo-dto'
import { prisma } from '@/lib/prisma'
import {
  type UpdateTodoFormValues,
  updateTodoSchema,
} from '@/lib/schemas/todos/todo-update-schema'
import type { ActionState } from '@/types/form'
import { revalidatePath } from 'next/cache'
import { getSessionUserIdOrError } from '../shared/auth-helpers'
import { validateParentId, validateTodoOwnership } from '../shared/todo-helpers'

/**
 * Todoを更新するサーバーアクション
 * @param values - 更新するTodoの値
 * @returns 更新結果
 */
export async function updateTodoAction({
  formData,
  todo,
}: { formData: FormData; todo: TodoDTO }): Promise<
  ActionState<void, UpdateTodoFormValues>
> {
  try {
    // セッション認証チェック
    const sessionResult = await getSessionUserIdOrError()

    if (!sessionResult.success) return sessionResult

    const values: UpdateTodoFormValues = {
      id: todo.id,
      isComplete: formData.get('isComplete') === 'on',
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

    // バリデーション
    const validatedFields = updateTodoSchema.safeParse(values)

    if (!validatedFields.success) {
      return {
        success: false,
        error: {
          message: '入力内容に誤りがあります',
          fields: validatedFields.error.flatten().fieldErrors,
        },
        values,
      }
    }

    const { id, title, description, isComplete, dueDate, priority, parentId } =
      validatedFields.data

    // Todoの存在確認と所有者チェック
    const ownershipErrorResult = await validateTodoOwnership(id)
    if (!ownershipErrorResult.success) return ownershipErrorResult

    // 親TodoのIDが指定されている場合、存在確認
    const parentIdErrorResult = await validateParentId(parentId)
    if (!parentIdErrorResult.success) return parentIdErrorResult

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
  try {
    // セッション認証チェック
    const sessionResult = await getSessionUserIdOrError()

    if (!sessionResult.success) return sessionResult

    // Todoの存在確認と所有者チェック
    const ownershipErrorResult = await validateTodoOwnership(todoId)
    if (!ownershipErrorResult.success) return ownershipErrorResult

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
