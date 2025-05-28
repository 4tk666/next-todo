'use client'

import { SideOverlay } from '@/components/elements/side-overlay'
import type { TodoDTO } from '@/lib/dto/todoDto'
import { useState } from 'react'
import { TodoUpdateForm } from './todo-update-form'

type TodoUpdateProps = {
  /** 編集対象のTodo */
  todo: TodoDTO
  /** 編集ボタンとして表示する子要素 */
  children: React.ReactNode
}

/**
 * Todo編集機能を提供するコンポーネント
 * 編集ボタンクリック時にサイドオーバーレイでフォームを表示
 */
export function TodoUpdate({ todo, children }: TodoUpdateProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const openForm = () => setIsFormOpen(true)
  const closeForm = () => setIsFormOpen(false)

  return (
    <>
      <button
        type="button"
        onClick={openForm}
        className="cursor-pointer bg-transparent border-0 p-0 m-0"
        aria-label="編集フォームを開く"
      >
        {children}
      </button>

      {isFormOpen && (
        <SideOverlay
          title="タスクを編集"
          isOpen={isFormOpen}
          onClose={closeForm}
        >
          <TodoUpdateForm
            todo={todo}
            onSuccess={closeForm}
            onCancel={closeForm}
          />
        </SideOverlay>
      )}
    </>
  )
}
