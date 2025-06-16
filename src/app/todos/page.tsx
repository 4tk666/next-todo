import { auth } from '@/auth'
import TodoTabs from '@/components/features/todo/todo-tabs'
import { getTodos } from '@/lib/data/get-todos'
import { redirect } from 'next/navigation'
import { TODO_TABS_VALUES } from '@/constants/todo-tabs'
import { Suspense } from 'react'

type TodosPageProps = {
  searchParams: Promise<{ tab?: string }>
}

export default async function TodosPage({ searchParams }: TodosPageProps) {
  const session = await auth()

  // 認証されていない場合はサインインページへリダイレクト
  if (!session?.user?.id) {
    redirect('/')
  }

  // URLパラメータからタブを取得、デフォルトはALL
  const resolvedSearchParams = await searchParams
  const activeTab = resolvedSearchParams.tab || TODO_TABS_VALUES.ALL

  // タブに応じてTodo一覧を取得
  const todosDto = await getTodos({ filter: activeTab })

  return (
    <div className="container mx-auto max-w-[100%]">
      <div className="bg-white shadow rounded-md overflow-hidden px-[20px] py-[25px]">
        {/* ヘッダー部分 */}
        <div className="flex flex-col mb-[20px]">
          <div className="flex items-center">
            <h2 className="text-lg font-bold text-gray-800 mb-[15px]">
              マイタスク
            </h2>
          </div>
        </div>

        {/* タブコンテンツ */}
        <Suspense fallback={<div>読み込み中...</div>}>
          <TodoTabs todosDto={todosDto} activeTab={activeTab} />
        </Suspense>
      </div>
    </div>
  )
}
