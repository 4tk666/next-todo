import { auth } from '@/auth'
import TodoTabs from '@/components/features/todo/todo-tabs'
import { getTodos } from '@/lib/data/getTodos'
import { redirect } from 'next/navigation'

export default async function TodosPage() {
  const session = await auth()

  // 認証されていない場合はサインインページへリダイレクト
  if (!session?.user?.id) {
    redirect('/')
  }

  // ログインユーザーのTodo一覧を取得
  const todosDto = await getTodos()

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
        <TodoTabs todosDto={todosDto} />
      </div>
    </div>
  )
}
