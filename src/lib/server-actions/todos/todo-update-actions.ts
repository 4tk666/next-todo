'use server'

import { auth } from '@/auth'
import type { TodoDTO } from '@/lib/dto/todoDto'
import { prisma } from '@/lib/prisma'
import {
  updateTodoSchema,
} from '@/lib/schemas/todos/todo-update-schema'
import type { ActionState } from '@/types/form'
import { revalidatePath } from 'next/cache'

/**
 * Todoを更新するサーバーアクション
 * @param values - 更新するTodoの値
 * @returns 更新結果
 */
export async function updateTodoAction({
  formData,
  todo,
}: { formData: FormData; todo: TodoDTO }): Promise<ActionState> {
  const session = await auth()
  if (!session?.user?.id) {
    return {
      success: false,
      error: {
        message: 'ログインが必要です',
      },
    }
  }

  const values = {
    id: todo.id,
    title: formData.get('title'),
    description: formData.get('description'),
    isComplete: todo.isComplete,
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
    }
  }

  try {
    const { id, title, description, isComplete } = validatedFields.data

    // Todoの存在確認と所有者チェック
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id,
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

    // Todoを更新
    await prisma.todo.update({
      where: {
        id,
      },
      data: {
        title,
        description: description || null,
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
    console.error('Todo更新エラー:', error)
    return {
      success: false,
      error: {
        message: 'タスクの更新に失敗しました',
      },
    }
  }
}
