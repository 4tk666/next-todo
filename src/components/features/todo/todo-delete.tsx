'use client'

import { ConfirmationDialog } from '@/components/elements/confirmation-dialog'
import type { TodoDTO } from '@/lib/dto/todoDto'
import { deleteTodoAction } from '@/lib/server-actions/todos/todo-delete-actions'
import { clsx } from 'clsx'
import { useState, useTransition } from 'react'
import { IoTrash } from 'react-icons/io5'

type TodoDeleteProps = {
  /** 削除対象のTodoデータ */
  todo: TodoDTO
}

/**
 * Todo削除機能を提供するコンポーネント
 *
 * 削除前に確認ダイアログを表示し、ユーザーの意図を確認してから
 * サーバーアクションを実行してTodoを安全に削除します。
 * useTransitionを使用してReactの並行機能を活用し、UIの応答性を保ちます。
 */
export function TodoDelete({ todo }: TodoDeleteProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPendingTransition, startTransition] = useTransition()

  return (
    <>
      {/* 削除ボタン */}
      <button
        type="button"
        className={clsx(
          'p-1.5',
          'text-red-600 hover:text-red-800 hover:bg-red-50',
          'rounded',
          'transition-colors opacity-0 group-hover:opacity-100',
          'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        )}
        aria-label={`タスク「${todo.title}」を削除`}
        onClick={() => setIsDialogOpen(true)}
        disabled={isPendingTransition}
      >
        <IoTrash size={14} />
      </button>

      {/* 削除確認ダイアログ */}
      {isDialogOpen && (
        <ConfirmationDialog
          title="タスクを削除"
          message={`「${todo.title}」を削除しますか？\nこの操作は取り消すことができません。`}
          confirmText="削除"
          cancelText="キャンセル"
          onConfirm={() => {
            startTransition(async () => {
              try {
                // サーバーアクションを実行してTodoを削除
                const result = await deleteTodoAction(todo.id)

                if (result.success) {
                  setIsDialogOpen(false)
                }
              } catch (error) {
                // 予期しないエラーが発生した場合の処理
                console.error('Todo削除中にエラーが発生しました:', error)
              }
            })
          }}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          isLoading={isPendingTransition}
        />
      )}
    </>
  )
}
