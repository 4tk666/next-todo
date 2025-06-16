import { auth } from '@/auth'
import { LinkButton } from '@/components/elements/link-button'

export default async function Home() {
  const session = await auth()

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl text-gray-800">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">NextTodo アプリへようこそ！</h1>

        {session?.user ? (
          <div>
            <div className="mt-6">
              <LinkButton href="/todos" variant="primary" className="ml-4">
                Todoリストを管理する
              </LinkButton>
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-4">ログインしてTodoリストを管理しましょう。</p>
            <div className="flex space-x-4">
              <LinkButton href="/sign-in" variant="outline">
                ログイン
              </LinkButton>
              <LinkButton href="/sign-up" variant="primary">
                新規登録
              </LinkButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
