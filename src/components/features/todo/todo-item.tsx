'use client'

import type { TodoDTO } from '@/lib/dto/todoDto'
import { clsx } from 'clsx'
import { FiEdit2, FiChevronRight, FiChevronDown } from 'react-icons/fi'
import { TodoDelete } from './todo-delete'
import { TodoUpdate } from './todo-update'
import { TodoUpdateFormCheckbox } from './todo-update-form-checkbox'
import {
  TODO_PRIORITIES,
  TODO_PRIORITY_LABELS,
} from '@/constants/todo-priority'

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
    <div className="flex items-center p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors group">
      {/* チェックボックス */}
      <div className="flex-shrink-0 mr-3">
        <TodoUpdateFormCheckbox todo={todo} />
      </div>

      {/* タスク内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          {/* 展開/折りたたみボタン */}
          {hasChildren && !!handleToggleExpansion && (
            <button
              onClick={() => handleToggleExpansion(todo.id)}
              className={clsx(
                'mr-2 p-1 rounded',
                'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
                'transition-colors flex-shrink-0',
                'cursor-pointer',
              )}
              type="button"
            >
              {isExpanded ? (
                <FiChevronDown size={16} />
              ) : (
                <FiChevronRight size={16} />
              )}
            </button>
          )}

          {/* 階層インジケーター */}
          {isChildrenTodo && (
            <div className="flex items-center mr-2 text-gray-300">{'└─ '}</div>
          )}

          {/* タスクタイトル */}
          <div
            className={clsx(
              'text-sm',
              todo.isComplete ? 'line-through text-gray-400' : 'text-gray-800',
              isChildrenTodo && 'text-gray-600',
            )}
          >
            {todo.title}
          </div>

          {/* 子TODOの数を表示 */}
          {hasChildren && (
            <div className="text-xs text-blue-500 ml-2">
              {todo.children.length}個のサブタスク
            </div>
          )}
        </div>

        {/* 説明 */}
        {todo.description && (
          <div
            className={clsx(
              'text-xs text-gray-500 mt-1',
              todo.isComplete && 'line-through',
              isChildrenTodo && 'ml-6',
            )}
          >
            {todo.description}
          </div>
        )}
      </div>

      {/* 優先度 */}
      <div className="flex-shrink-0 w-12 mr-4 flex justify-center">
        {typeof todo.priority === 'number' &&
        todo.priority in TODO_PRIORITY_LABELS &&
        todo.priority !== TODO_PRIORITIES.UN_SELECTED ? (
          <div
            className={clsx(
              'text-xs px-2 py-1 rounded-full',
              todo.priority === TODO_PRIORITIES.LOW &&
                'bg-green-100 text-green-700', // 低
              todo.priority === TODO_PRIORITIES.MEDIUM &&
                'bg-yellow-100 text-yellow-700', // 中
              todo.priority === TODO_PRIORITIES.HIGH &&
                'bg-red-100 text-red-700', // 高
            )}
          >
            {TODO_PRIORITY_LABELS[todo.priority]}
          </div>
        ) : (
          ''
        )}
      </div>

      {/* 期日 */}
      <div className="flex-shrink-0 w-20 text-xs text-gray-500 mr-4">
        {todo.dueDate || ''}
      </div>

      {/* アクションボタン */}
      <div className="flex-shrink-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <TodoUpdate todo={todo} todosDto={todosDto}>
          <div
            className={clsx(
              'p-1 rounded',
              'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
              'transition-colors',
            )}
          >
            <FiEdit2 size={14} />
          </div>
        </TodoUpdate>
        <div
          className={clsx(
            'p-1 rounded',
            'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
            'transition-colors',
          )}
        >
          <TodoDelete todo={todo} />
        </div>
      </div>
    </div>
  )
}
