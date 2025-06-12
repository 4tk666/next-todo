'use client'

import { Checkbox } from '@/components/elements/checkbox'
import type { TodoDTO } from '@/lib/dto/todoDto'
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

            if (!result.success) {
              toast.error(
                result.error?.message || 'タスクの完了状態の更新に失敗しました',
              )
              return
            }
          } catch (error) {
            console.error(error)
            toast.error('タスクの完了状態の更新中にエラーが発生しました')
          }
        })
      }}
    />
  )
}
