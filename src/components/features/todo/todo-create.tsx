'use client'

import { Button } from '@/components/elements/button'
import { SideOverlay } from '@/components/elements/side-overlay'
import { TodoForm } from '@/components/features/todo/todo-post-form'
import type { TodoDTO } from '@/lib/dto/todo-dto'
import { clsx } from 'clsx'
import { useState } from 'react'

type TodoCreateProps = {
  todosDto: TodoDTO[]
}

/**
 * Todoページのクライアント側コンポーネント
 * タスク追加モーダルの状態管理を担当
 */
export function TodoCreate({ todosDto }: TodoCreateProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const openForm = () => setIsFormOpen(true)
  const closeForm = () => setIsFormOpen(false)

  return (
    <>
      <Button className={clsx('max-w-[120px]')} onClick={openForm}>
        タスクを作成
      </Button>

      {isFormOpen && (
        <SideOverlay
          title="新しいタスクを作成"
          isOpen={isFormOpen}
          onClose={closeForm}
        >
          <TodoForm
            todosDto={todosDto}
            onSuccess={closeForm}
            onCancel={closeForm}
          />
        </SideOverlay>
      )}
    </>
  )
}
