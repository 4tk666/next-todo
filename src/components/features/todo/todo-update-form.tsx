'use client'

import { Button } from '@/components/elements/button'
import { Textarea } from '@/components/elements/textarea'
import type { TodoDTO } from '@/lib/dto/todoDto'
import { updateTodoAction } from '@/lib/server-actions/todos/todo-update-actions'
import type { ActionState } from '@/types/form'
import { useActionState } from 'react'
import { FormError } from '../../elements/form-error'
import { Input } from '../../elements/input'

type TodoUpdateFormProps = {
  /** 編集対象のTodo */
  todo: TodoDTO
  /** 成功時のコールバック */
  onSuccess: () => void
  /** キャンセル時のコールバック */
  onCancel: () => void
}

/**
 * タスク更新フォームコンポーネント（サーバーアクション対応版）
 */
export function TodoUpdateForm({
  todo,
  onSuccess,
  onCancel,
}: TodoUpdateFormProps) {
  const [state, action, isPending] = useActionState(
    async (prevState: ActionState | undefined, formData: FormData) => {
      const result = await updateTodoAction({ formData, todo })
      if (result.success) {
        // 成功時のコールバック
        onSuccess()
      }

      return result
    },
    undefined,
  )

  return (
    <form action={action} className="space-y-6">
      {/* 全体エラーメッセージ */}
      {state?.error && <FormError errors={[state.error.message]} />}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <Input
          id="title"
          name="title"
          placeholder="タスクのタイトルを入力"
          disabled={isPending}
          defaultValue={state?.values?.title || todo.title}
          errors={state?.error?.fields?.title}
        />
        <FormError errors={state?.error?.fields?.title} id="title" />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          説明（任意）
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="タスクの詳細を入力（任意）"
          rows={5}
          disabled={isPending}
          defaultValue={state?.values?.description ?? todo.description ?? ''}
        />
        <FormError
          errors={state?.error?.fields?.description}
          id="description"
        />
      </div>

      <div className="flex space-x-4">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? '更新中...' : 'タスクを更新'}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 flex-1"
        >
          キャンセル
        </Button>
      </div>
    </form>
  )
}
