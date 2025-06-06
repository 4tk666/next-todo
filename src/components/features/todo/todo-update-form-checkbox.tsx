'use client'

import { Checkbox } from '@/components/elements/checkbox'
import type { TodoDTO } from '@/lib/dto/todoDto'
import { toggleTodoCompleteAction } from '@/lib/server-actions/todos/todo-update-actions'
import { useTransition } from 'react'

type TodoCheckboxProps = {
  /** Todo項目 */
  todo: TodoDTO
  isChecked: boolean
  setIsChecked: (isChecked: boolean) => void
}

/**
 * Todo完了状態を切り替えるチェックボックスコンポーネント
 * よりシンプルなサーバーアクション統合版
 */
export function TodoUpdateFormCheckbox({
  todo,
  isChecked,
  setIsChecked,
}: TodoCheckboxProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <Checkbox
      id="isCompleteTableRow"
      checked={isChecked}
      disabled={isPending}
      onChange={(isNewChecked) => {
        setIsChecked(isNewChecked)
        startTransition(async () => {
          try {
            const result = await toggleTodoCompleteAction(todo.id, isNewChecked)

            if (!result.success) {
              console.error('Todo完了状態の更新に失敗しました:')
              setIsChecked(todo.isComplete) // 元の状態に戻す
              return
            }
          } catch (error) {
            console.error(error)
            setIsChecked(todo.isComplete) // 元の状態に戻す
          }
        })
      }}
    />
  )
}
