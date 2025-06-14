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

        <div className="space-y-2">
          <TodoList todosDto={todosDto} />
        </div>
      </>
    </TabsComponent>
  )
}
