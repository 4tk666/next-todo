import { auth } from '@/auth'
import { TodoCreate } from '@/components/features/todo/todo-create'
import TodoList from '@/components/features/todo/todo-list'
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
          <TodoCreate todosDto={todosDto} />
        </div>

        {/* タスクリスト表 */}
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
              <th className="p-3 text-left  border-r border-gray-200">
                作成日
              </th>
              <th className="w-14 p-3 border-r border-gray-200" />
              <th className="w-14 p-3" />
            </tr>
          </thead>
          <tbody>
            <TodoList todosDto={todosDto} />
          </tbody>
        </table>
      </div>
    </div>
  )
}
