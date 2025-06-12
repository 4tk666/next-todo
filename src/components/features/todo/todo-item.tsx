'use client'

import type { TodoDTO } from '@/lib/dto/todoDto'
import { clsx } from 'clsx'
import { FiEdit2, FiChevronRight, FiChevronDown } from 'react-icons/fi'
import { TodoDelete } from './todo-delete'
import { TodoUpdate } from './todo-update'
import { TodoUpdateFormCheckbox } from './todo-update-form-checkbox'
import { TODO_PRIORITY_LABELS } from '@/constants/todo-priority'

type TodoItemProps = {
  todo: TodoDTO
  todosDto: TodoDTO[]
  isExpanded?: boolean
  hasChildren?: boolean
  isChildrenTodo?: boolean
  handleToggleExpansion?: (todoId: string) => void
}

export function TodoItem({
  todo,
  todosDto,
  isExpanded = false,
  hasChildren = false,
  isChildrenTodo = false,
  handleToggleExpansion,
}: TodoItemProps) {
  return (
    <>
      <td
        className={clsx('w-12 p-3', 'text-center', 'border-r border-gray-200')}
      >
        <TodoUpdateFormCheckbox
          todo={todo}
        />
      </td>
      <td className={clsx('p-3', 'border-r border-gray-200')}>
        <div className="flex items-center">
          {/* 展開/折りたたみボタン */}
          {/* 子TODOが存在する親TODOのみ開閉ボタンを表示 */}
          {hasChildren && !!handleToggleExpansion ? (
            <button
              onClick={() => handleToggleExpansion(todo.id)}
              className={clsx(
                'mr-2 p-1 rounded',
                'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
                'transition-colors flex-shrink-0',
              )}
              type="button"
            >
              {isExpanded ? (
                <FiChevronDown size={16} />
              ) : (
                <FiChevronRight size={16} />
              )}
            </button>
          ) : (
            <div className="w-6 mr-2 flex-shrink-0" /> // 子TODOがない場合はスペースを確保して縦のラインを揃える
          )}

          {/* 階層インジケーター */}
          {isChildrenTodo && (
            <div className="flex items-center mr-2 text-gray-300">{'└─ '}</div>
          )}

          {/* TODOコンテンツ */}
          <div className="flex-1 min-w-0">
            <div
              className={clsx(
                'text-sm font-medium',
                todo.isComplete
                  ? 'line-through text-gray-400'
                  : 'text-gray-800',
                isChildrenTodo && 'text-gray-600', // 子TODOは少し薄めの色
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

            {/* 子TODOの数を表示 */}
            {hasChildren && (
              <div className="text-xs text-blue-500 mt-1">
                {todo.children.length}個のサブタスク
              </div>
            )}
          </div>
        </div>
      </td>
      <td
        className={clsx(
          'p-3',
          'text-xs text-gray-500 whitespace-nowrap',
          'border-r border-gray-200',
        )}
      >
        {todo.dueDate ?? '-'}
      </td>
      <td
        className={clsx(
          'p-3',
          'text-xs text-gray-500 whitespace-nowrap',
          'border-r border-gray-200',
        )}
      >
        {typeof todo.priority === 'number' &&
        todo.priority in TODO_PRIORITY_LABELS
          ? TODO_PRIORITY_LABELS[todo.priority]
          : '-'}
      </td>
      <td
        className={clsx('p-3 w-12', 'text-right', 'border-r border-gray-200')}
      >
        <TodoUpdate todo={todo} todosDto={todosDto}>
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
