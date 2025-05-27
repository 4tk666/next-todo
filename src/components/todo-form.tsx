'use client'

import { createTodoAction } from '@/app/todos/actions'
import { Button } from '@/components/button'
import { FormError } from '@/components/form-error'
import { Input } from '@/components/input'
import { Textarea } from '@/components/textarea'
import type { ActionState } from '@/types/form'
import { useActionState } from 'react'

type TodoFormProps = {
  onSuccess: () => void
  onCancel: () => void
}

/**
 * タスク作成フォームコンポーネント（サーバーアクション対応版）
 */
export function TodoForm({ onSuccess, onCancel }: TodoFormProps) {
  const [state, action, isPending] = useActionState(
    async (prevState: ActionState | undefined, formData: FormData) => {
      const result = await createTodoAction(prevState, formData)
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
      {state?.error && <FormError errors={[state.error]} />}

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
          defaultValue={state?.values?.title}
          errors={state?.formError?.title}
        />
        <FormError errors={state?.formError?.title} id="title-error" />
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
          defaultValue={state?.values?.description}
        />
        <FormError
          errors={state?.formError?.description}
          id="description-error"
        />
      </div>

      <div className="flex space-x-4">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? '作成中...' : 'タスクを作成'}
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
