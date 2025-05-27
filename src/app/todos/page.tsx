import { auth } from '@/auth'
import { TodoItem } from '@/components/todo-item'
import { getTodos } from '@/lib/data/getTodos'
import { redirect } from 'next/navigation'
import { TodoPageClient } from './client'

export default async function TodosPage() {
  const session = await auth()

  // 認証されていない場合はサインインページへリダイレクト
  if (!session?.user?.id) {
    redirect('/')
  }

  // ログインユーザーのTodo一覧を取得
  const todos = await getTodos()

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
          <TodoPageClient />
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
              <th className="p-3 text-left  border-r border-gray-200">
                作成日
              </th>
              <th className="w-14 p-3" />
            </tr>
          </thead>
          <tbody>
            {todos.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-gray-500 text-center py-8">
                  まだTodoがありません。新しいTodoを作成してください。
                </td>
              </tr>
            ) : (
              todos.map((todo) => (
                <tr key={todo.id} className="group border-b border-gray-200">
                  <TodoItem todo={todo} />
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
