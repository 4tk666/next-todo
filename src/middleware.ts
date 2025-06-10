import { auth } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/constants/routes'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 認証なしでもアクセス可能なパス
const publicPaths = ['/', '/sign-in', '/sign-up']

const isPublicPath = (path: string) => publicPaths.includes(path)

// 認証不要のパスを判定する関数
// '/auth'はNextAuthのAPIエンドポイン
// '/api'はAPIエンドポイント、'.'は静的ファイルを示す
const isExcludedPath = (path: string) =>
  path.startsWith('/api') || path.startsWith('/auth') || path.includes('.')

// ミドルウェア関数
export async function middleware(request: NextRequest) {
  const session = await auth()
  const path = request.nextUrl.pathname

  // 認証済みでログインページにアクセスした場合はリダイレクト
  if (!!session && (path === '/sign-in' || path === '/sign-up')) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url))
  }
  // 認証不要パスの場合はそのまま続行
  if (isExcludedPath(path) || isPublicPath(path)) {
    return NextResponse.next()
  }

  // 認証されていない場合はトップページにリダイレクト
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // それ以外の場合は続行
  return NextResponse.next()
}

// マッチャー設定 - 適用対象のルートを指定
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
