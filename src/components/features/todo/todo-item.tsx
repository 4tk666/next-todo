'use client'

import type { TodoDTO } from '@/lib/dto/todoDto'
import { clsx } from 'clsx'
import { FiEdit2 } from 'react-icons/fi'
import { TodoDelete } from './todo-delete'
import { TodoUpdate } from './todo-update'
import { TodoUpdateFormCheckbox} from './todo-update-form-checkbox'

type TodoItemProps = {
  todo: TodoDTO
}

export function TodoItem({ todo }: TodoItemProps) {
  return (
    <>
      <td
        className={clsx('w-12 p-3', 'text-center', 'border-r border-gray-200')}
      >
        <TodoUpdateFormCheckbox todo={todo} />
      </td>
      <td className={clsx('p-3', 'border-r border-gray-200')}>
        <div
          className={clsx(
            'text-sm font-medium',
            todo.isComplete ? 'line-through text-gray-400' : 'text-gray-800',
          )}
        >
          {todo.title}
        </div>
        {todo.description && (
          <div
            className={clsx(
              'text-xs text-gray-500 mt-1',
              todo.isComplete && 'line-through',
            )}
          >
            {todo.description}
          </div>
        )}
      </td>
      <td
        className={clsx(
          'p-3',
          'text-xs text-gray-400 whitespace-nowrap',
          'border-r border-gray-200',
        )}
      >
        {new Date(todo.createdAt).toLocaleDateString('ja-JP')}
      </td>
      <td
        className={clsx('p-3 w-12', 'text-right', 'border-r border-gray-200')}
      >
        <TodoUpdate todo={todo}>
          <div
            className={clsx(
              'p-1',
              'text-gray-400 hover:text-gray-600',
              'transition-colors',
              'opacity-0 group-hover:opacity-100',
            )}
          >
            <FiEdit2 size={14} />
          </div>
        </TodoUpdate>
      </td>
      <td className={clsx('p-3 w-12', 'text-right')}>
        <div
          className={clsx(
            'p-1',
            'text-gray-400 hover:text-gray-600',
            'transition-colors',
            'opacity-0 group-hover:opacity-100',
          )}
        >
          <TodoDelete todo={todo} />
        </div>
      </td>
    </>
  )
}
