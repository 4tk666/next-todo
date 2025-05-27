'use client'

import type { TodoDTO } from '@/lib/dto/todoDto'

type TodoItemProps = {
  todo: TodoDTO
}

export function TodoItem({ todo }: TodoItemProps) {
  return (
    <>
      <td className="w-12 p-3 text-center border-r border-gray-200">
        <input
          type="checkbox"
          checked={todo.isComplete}
          onChange={() => undefined}
          className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          aria-label={`${todo.title}を${todo.isComplete ? '未完了' : '完了'}としてマーク`}
        />
      </td>
      <td className="p-3 border-r border-gray-200">
        <div
          className={`text-sm font-medium ${todo.isComplete ? 'line-through text-gray-400' : 'text-gray-800'}`}
        >
          {todo.title}
        </div>
        {todo.description && (
          <div
            className={`text-xs text-gray-500 mt-1 ${todo.isComplete ? 'line-through' : ''}`}
          >
            {todo.description}
          </div>
        )}
      </td>
      <td className="p-3 text-xs text-gray-400 whitespace-nowrap border-r border-gray-200">
        {new Date(todo.createdAt).toLocaleDateString('ja-JP')}
      </td>
      <td className="p-3 w-12 text-right">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 opacity-0 group-hover:opacity-100 text-[10px]"
          aria-label="タスクを編集"
          title="タスクを編集"
        >
          編集
        </button>
      </td>
    </>
  )
}
