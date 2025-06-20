'use client'

import { Checkbox } from '@/components/elements/checkbox'
import type { TodoDTO } from '@/lib/dto/todo-dto'
import { toggleTodoCompleteAction } from '@/lib/server-actions/todos/todo-update-actions'
import { useTransition } from 'react'
import { toast } from 'sonner'

type TodoCheckboxProps = {
  /** Todo項目 */
  todo: TodoDTO
}

/**
 * Todo完了状態を切り替えるチェックボックスコンポーネント
 * よりシンプルなサーバーアクション統合版
 */
export function TodoUpdateFormCheckbox({ todo }: TodoCheckboxProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <Checkbox
      id="isCompleteTableRow"
      checked={todo.isComplete}
      disabled={isPending}
      onChange={(isNewChecked) => {
        startTransition(async () => {
          try {
            const result = await toggleTodoCompleteAction(todo.id, isNewChecked)

            if (result.success) {
              toast.success('タスクの完了状態を更新しました')
            } else {
              toast.error(
                result.error?.message || 'タスクの完了状態の更新に失敗しました',
              )
            }
          } catch (error) {
            console.error(error)
            toast.error(
              '例外が発生しました。タスクの完了状態を更新できませんでした。',
            )
          }
        })
      }}
    />
  )
}
