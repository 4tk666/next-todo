'use client'

import { Button } from '@/components/elements/button'
import { Checkbox } from '@/components/elements/checkbox'
import { Textarea } from '@/components/elements/textarea'
import type { TodoDTO } from '@/lib/dto/todoDto'
import { updateTodoAction } from '@/lib/server-actions/todos/todo-update-actions'
import type { ActionState } from '@/types/form'
import { useActionState } from 'react'
import { useState } from 'react'
import { FormError } from '../../elements/form-error'
import { Input } from '../../elements/input'

type TodoUpdateFormProps = {
  /** 編集対象のTodo */
  todo: TodoDTO
  /** 成功時のコールバック */
  onSuccess: () => void
  /** キャンセル時のコールバック */
  onCancel: () => void
  setIsChecked: (isChecked: boolean) => void
}

/**
 * タスク更新フォームコンポーネント（サーバーアクション対応版）
 */
export function TodoUpdateForm({
  todo,
  onSuccess,
  onCancel,
  setIsChecked,
}: TodoUpdateFormProps) {
  // フォーム上での完了状態をローカルで管理
  const [isLocalChecked, setIsLocalChecked] = useState(todo.isComplete)

  // タスクの完了状態を管理する状態
  const [state, action, isPending] = useActionState(
    async (prevState: ActionState | undefined, formData: FormData) => {
      const result = await updateTodoAction({ formData, todo })
      if (result.success) {
        // 成功時のコールバック
        onSuccess()
        setIsChecked(isLocalChecked)
      }

      return result
    },
    undefined,
  )

  return (
    <form action={action} className="space-y-6">
      {/* 全体エラーメッセージ */}
      {state?.error && <FormError errors={[state.error.message]} />}
      {/* 完了状態チェックボックス */}
      <div className="flex items-center">
        <Checkbox
          id="isComplete"
          name="isComplete"
          label="完了にする"
          checked={isLocalChecked}
          disabled={isPending}
          onChange={(checked) => setIsLocalChecked(checked)}
        />
      </div>

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
        <Button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          variant="outline"
        >
          キャンセル
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? '更新中...' : 'タスクを更新'}
        </Button>
      </div>
    </form>
  )
}
