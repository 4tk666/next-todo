'use client'

import { TodoItem } from '@/components/features/todo/todo-item'
import type { TodoDTO } from '@/lib/dto/todoDto'
import { createExpandedTodoIds } from '@/lib/features/todos/todo-list-functions'
import { Fragment, useState } from 'react'

type TodoListProps = {
  todosDto: TodoDTO[]
}

export default function TodoList({ todosDto }: TodoListProps) {
  // 展開されているTODO IDを管理
  const [expandedTodoIds, setExpandedTodoIds] = useState<string[]>([])

  return todosDto.length === 0 ? (
    <div className="text-gray-500 text-center py-8">
      まだTodoがありません。新しいTodoを作成してください。
    </div>
  ) : (
    <ul className="border-t border-gray-200" aria-label="タスクリスト">
      {todosDto.map((todo) => {
        const isExpanded = expandedTodoIds.includes(todo.id)
        const hasChildren = todo.children.length > 0

        return (
          <Fragment key={todo.id}>
            <li className="bg-white">
              <TodoItem
                todo={todo}
                todosDto={todosDto}
                hasChildren={hasChildren}
                handleToggleExpansion={(todoId) =>
                  setExpandedTodoIds((previousIds) =>
                    createExpandedTodoIds({ previousIds, todoId }),
                  )
                }
                isExpanded={isExpanded}
              />
            </li>
            {hasChildren && isExpanded && (
              <li className="bg-white ml-6">
                <ul aria-label="サブタスクリスト">
                  {todo.children.map((child) => (
                    <li key={child.id} className="bg-white">
                      <TodoItem
                        todo={child}
                        todosDto={todosDto}
                        isChildrenTodo
                      />
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </Fragment>
        )
      })}
    </ul>
  )
}
