'use client'

import { Button } from '@/components/elements/button'
import { Checkbox } from '@/components/elements/checkbox'
import { DateInput } from '@/components/elements/date-input'
import { TextareaField } from '@/components/elements/fields/textarea-field'
import { Select } from '@/components/elements/select'
import type { TodoDTO } from '@/lib/dto/todoDto'
import { updateTodoAction } from '@/lib/server-actions/todos/todo-update-actions'
import type { ActionState, UpdateActionState } from '@/types/form'
import { useActionState } from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import {
  TODO_PRIORITIES,
  TODO_PRIORITY_LABELS,
} from '@/constants/todo-priority'
import { DEFAULT_VALUES } from '@/constants/default-values'
import { FormError } from '../../elements/form-error'
import { Input } from '../../elements/input'
import type { UpdateTodoFormValues } from '@/lib/schemas/todos/todo-update-schema'
import { formatDateToString } from '@/lib/utils/date-utils'

type TodoUpdateFormProps = {
  /** 編集対象のTodo */
  todo: TodoDTO
  /** 他のTodoのリスト（親タスク選択用） */
  todosDto: TodoDTO[]
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
  todosDto,
  onSuccess,
  onCancel,
  setIsChecked,
}: TodoUpdateFormProps) {
  // フォーム上での完了状態をローカルで管理
  const [isLocalChecked, setIsLocalChecked] = useState(todo.isComplete)

  // タスクの完了状態を管理する状態
  const [state, action, isPending] = useActionState(
    async (
      prevState: UpdateActionState<void, UpdateTodoFormValues> | undefined,
      formData: FormData,
    ) => {
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
    <form action={action} className="space-y-6 text-left">
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
          defaultValue={state?.values?.title ?? todo.title}
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
          defaultValue={state?.values?.description ?? todo.description ?? ''}
          errors={state?.error?.fields?.description}
        />
      </div>

      <div>
        <DateInput
          id="dueDate"
          name="dueDate"
          label="期日"
          disabled={isPending}
          defaultValue={
            state?.values?.dueDate
              ? formatDateToString({
                  date: state.values.dueDate,
                })
              : todo.dueDate
          }
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
              : String(todo.priority)
          }
          disabled={isPending}
        />
        <input
          type="hidden"
          name="priority"
          value={state?.values?.priority ?? todo.priority ?? ''}
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
            ...todosDto
              .filter((option) => option.id !== todo.id && !option.parentId)
              .map((option) => ({
                value: option.id,
                label: option.title,
              })),
          ]}
          defaultValue={
            state?.values?.parentId ??
            todo.parentId ??
            DEFAULT_VALUES.UNSELECTED_STRING
          }
          disabled={
            isPending || todosDto.length === 0 || todo.children.length > 0
          }
        />
        <input
          type="hidden"
          name="parentId"
          value={
            state?.values?.parentId ??
            todo.parentId ??
            DEFAULT_VALUES.UNSELECTED_STRING
          }
        />
        <FormError id="parentId" errors={state?.error?.fields?.parentId} />
      </div>

      <div className="flex justify-end space-x-4">
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
