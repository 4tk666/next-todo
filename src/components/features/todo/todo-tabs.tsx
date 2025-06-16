'use client'

import { TabsComponent } from '@/components/elements/tabs'
import { TodoCreate } from '@/components/features/todo/todo-create'
import TodoList from '@/components/features/todo/todo-list'
import type { TodoDTO } from '@/lib/dto/todo-dto'
import { TODO_TABS } from '@/constants/todo-tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

type TodoTabsProps = {
  todosDto: TodoDTO[]
  activeTab: string
}

/**
 * TodoTabsコンポーネント
 * タブ切り替え時にURLパラメータを更新してサーバーサイドで絞り込み
 */
export default function TodoTabs({ todosDto, activeTab }: TodoTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  /**
   * タブ変更時にURLパラメータを更新
   */
  const handleTabChange = useCallback(
    (newTab: string) => {
      const params = new URLSearchParams(searchParams)
      params.set('tab', newTab)
      router.push(`/todos?${params.toString()}`)
    },
    [router, searchParams],
  )

  return (
    <TabsComponent
      items={TODO_TABS}
      value={activeTab}
      onValueChange={handleTabChange}
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
