import { auth } from '@/auth'
import Link from 'next/link'

export default async function Home() {
  const session = await auth()

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl text-gray-800">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">NextTodo アプリへようこそ！</h1>

        {session?.user ? (
          <div>
            <div className="mt-6">
              <Link
                href="/todos"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Todoリストを管理する
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-4">ログインしてTodoリストを管理しましょう。</p>
            <div className="mt-6 space-x-4">
              <Link
                href="/signIn"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ログイン
              </Link>
              <Link
                href="/signUp"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                新規登録
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
