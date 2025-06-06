'use client'

import { Button } from '@/components/elements/button'
import { DateInput } from '@/components/elements/date-input'
import { TextareaField } from '@/components/elements/fields/textarea-field'
import { createTodoAction } from '@/lib/server-actions/todos/todo-create-actions'
import type { ActionState } from '@/types/form'
import { useActionState } from 'react'
import { FormError } from '../../elements/form-error'
import { Input } from '../../elements/input'
import { Select } from '@/components/elements/select'
import clsx from 'clsx'
import {
  TODO_PRIORITIES,
  TODO_PRIORITY_LABELS,
} from '@/constants/todo-priority'
import type { TodoDTO } from '@/lib/dto/todoDto'
import { DEFAULT_VALUES } from '@/constants/default-values'

type TodoFormProps = {
  todosDto: TodoDTO[]
  onSuccess: () => void
  onCancel: () => void
}

/**
 * タスク作成フォームコンポーネント（サーバーアクション対応版）
 */
export function TodoForm({ todosDto, onSuccess, onCancel }: TodoFormProps) {
  const [state, action, isPending] = useActionState(
    async (prevState: ActionState | undefined, formData: FormData) => {
      const result = await createTodoAction(formData)
      if (result.success) {
        // 成功時のコールバック
        onSuccess()
      }
      return result
    },
    undefined,
  )

  return (
    <form action={action} className="space-y-6 text-left">
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
          defaultValue={state?.values?.title}
          errors={state?.error?.fields?.title}
        />
        <FormError errors={state?.error?.fields?.title} id="title" />
      </div>

      <div>
        <TextareaField
          id="description"
          label="説明"
          name="description"
          placeholder="タスクの詳細を入力"
          rows={5}
          disabled={isPending}
          defaultValue={state?.values?.description}
          errors={state?.error?.fields?.description}
        />
      </div>

      <div>
        <DateInput
          id="dueDate"
          name="dueDate"
          label="期日"
          disabled={isPending}
          defaultValue={state?.values?.dueDate}
          errors={state?.error?.fields?.dueDate}
        />
      </div>

      <div>
        <div className="mb-2">
          <label
            htmlFor="priority"
            className={clsx(
              // レイアウト・配置
              'block',
              // 色・テキスト
              'text-sm font-medium text-gray-700',
            )}
          >
            優先度
          </label>
        </div>
        <Select
          id="priority"
          name="priority"
          options={Object.values(TODO_PRIORITIES).map((priority) => ({
            value: String(priority),
            label: TODO_PRIORITY_LABELS[priority] ?? 'エラー',
          }))}
          defaultValue={
            typeof state?.values?.priority === 'number'
              ? String(state.values.priority)
              : `${TODO_PRIORITIES.UN_SELECTED}`
          }
          disabled={isPending}
        />
        <input
          type="hidden"
          name="priority"
          value={state?.values?.priority ?? ''}
        />
      </div>

      <div>
        <div className="mb-2">
          <label
            htmlFor="parentId"
            className={clsx(
              // レイアウト・配置
              'block',
              // 色・テキスト
              'text-sm font-medium text-gray-700',
            )}
          >
            親タスク
          </label>
        </div>
        <Select
          id="parentId"
          name="parentId"
          options={[
            { value: DEFAULT_VALUES.UNSELECTED_STRING, label: '未設定' },
            ...todosDto.map((option) => ({
              value: option.id,
              label: option.title,
            })),
          ]}
          defaultValue={
            state?.values?.parentId ?? DEFAULT_VALUES.UNSELECTED_STRING
          }
          disabled={isPending}
        />
        <input
          type="hidden"
          name="parentId"
          value={state?.values?.parentId ?? DEFAULT_VALUES.UNSELECTED_STRING}
        />
        <FormError id="parentId" errors={state?.error?.fields?.parentId} />
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
          {isPending ? '作成中...' : 'タスクを作成'}
        </Button>
      </div>
    </form>
  )
}
