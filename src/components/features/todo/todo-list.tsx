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
    <tr>
      <td colSpan={4} className="text-gray-500 text-center py-8">
        まだTodoがありません。新しいTodoを作成してください。
      </td>
    </tr>
  ) : (
    todosDto.map((todo) => {
      const isExpanded = expandedTodoIds.includes(todo.id)
      const hasChildren = todo.children.length > 0

      return (
        <Fragment key={todo.id}>
          <tr className="group border-b border-gray-200">
            <TodoItem
              todo={todo}
              hasChildren={hasChildren}
              handleToggleExpansion={(todoId) =>
                setExpandedTodoIds((previousIds) =>
                  createExpandedTodoIds({ previousIds, todoId }),
                )
              }
              isExpanded={isExpanded}
            />
          </tr>
          {hasChildren &&
            isExpanded &&
            todo.children.map((child) => (
              <tr key={child.id} className="group border-b border-gray-200">
                <TodoItem todo={child} isChildrenTodo />
              </tr>
            ))}
        </Fragment>
      )
    })
  )
}
