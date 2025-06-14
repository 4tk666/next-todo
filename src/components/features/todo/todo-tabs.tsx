'use client'

import { TabsComponent } from '@/components/elements/tabs'
import { TodoCreate } from '@/components/features/todo/todo-create'
import TodoList from '@/components/features/todo/todo-list'
import type { TodoDTO } from '@/lib/dto/todoDto'
import { TODO_TABS, TODO_TABS_VALUES } from '@/constants/todo-tabs'
import { useState } from 'react'

type TodoTabsProps = {
  todosDto: TodoDTO[]
}

/**
 * TodoTabsコンポーネント
 * 現在は全てのTodoを各タブで表示（検索ロジックは後で実装予定）
 */
export default function TodoTabs({ todosDto }: TodoTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(TODO_TABS_VALUES.UPCOMING)

  return (
    <TabsComponent
      items={TODO_TABS}
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <>
        <div className="flex flex-col mb-6">
          <TodoCreate todosDto={todosDto} />
        </div>

        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-xs font-medium text-gray-500 border-y border-gray-200">
              <th className="w-13 p-3 text-center border-r border-gray-200">
                状態
              </th>
              <th className="p-3 text-left border-r border-gray-200">
                タスク名
              </th>
              <th className="p-3 text-left border-r border-gray-200">期日</th>
              <th className="p-3 text-left border-r border-gray-200">優先度</th>
              <th className="w-14 p-3 border-r border-gray-200" />
              <th className="w-14 p-3" />
            </tr>
          </thead>
          <tbody>
            <TodoList todosDto={todosDto} />
          </tbody>
        </table>
      </>
    </TabsComponent>
  )
}
