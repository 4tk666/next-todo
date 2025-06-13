import { auth } from '@/auth'
import { clsx } from 'clsx'
import Link from 'next/link'
import { LinkButton } from '../elements/link-button'
import { SignOutButton } from '../features/auth/sign-out-button'

export async function Header() {
  const session = await auth()

  return (
    <header className="bg-white shadow fixed top-0 left-0 w-full z-50">
      <div className={clsx('max-w-7xl mx-auto', 'px-4 sm:px-6 lg:px-8')}>
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                NextTodo
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <LinkButton href="/todos" variant="primary">
                  Todoリスト
                </LinkButton>
                <SignOutButton />
              </div>
            ) : (
              <div className="flex space-x-4">
                <LinkButton href="/sign-in" variant="outline">
                  ログイン
                </LinkButton>
                <LinkButton href="/sign-up" variant="primary">
                  新規登録
                </LinkButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
