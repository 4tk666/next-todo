'use client'

import { Button } from '@/components/button'
import { SideOverlay } from '@/components/side-overlay'
import { TodoForm } from '@/components/todo-form'
import { useState } from 'react'

/**
 * Todoページのクライアント側コンポーネント
 * タスク追加モーダルの状態管理を担当
 */
export function TodoPageClient() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const openForm = () => setIsFormOpen(true)
  const closeForm = () => setIsFormOpen(false)

  return (
    <>
      <Button className="max-w-[120px]" onClick={openForm}>
        タスクを作成
      </Button>

      {isFormOpen && (
        <SideOverlay
          title="新しいタスクを作成"
          isOpen={isFormOpen}
          onClose={closeForm}
        >
          <TodoForm onSuccess={closeForm} onCancel={closeForm} />
        </SideOverlay>
      )}
    </>
  )
}
