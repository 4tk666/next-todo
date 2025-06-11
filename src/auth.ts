import { prisma } from '@/lib/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth, { type User, type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { comparePassword } from './lib/utils/auth-utils'
import Github from 'next-auth/providers/github'

// 認証APIのベースパス
export const BASE_PATH = '/api/auth'

const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
pages: {
  // NextAuth.jsのデフォルトサインインページ（/api/auth/signin）を
  // カスタムサインインページ（/sign-in）にリダイレクトする設定
  // これにより、アプリケーションの統一されたデザインでサインイン画面を提供
  signIn: '/sign-in',
  
  // 認証エラー発生時のリダイレクト先を指定
  // GitHub OAuth認証失敗やその他の認証エラーが発生した場合、
  // デフォルトのエラーページではなく、サインインページにリダイレクトして
  // エラーメッセージを表示する（URLパラメータ経由でエラー情報を受け取る）
  error: '/sign-in',
},
  callbacks: {
    async jwt({ token, user }) {
      // ログイン成功
      // ↓
      // jwt() コールバック発火
      // - token に必要な情報を追加
      // - JWTが生成されCookieに保存
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      // セッションの更新
      // セッションにはuser.idが含まれてないので、tokenから取得したidをセッションに追加
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    Credentials({
      name: 'Credentials',
      // 認証処理
      async authorize(credentials): Promise<User | null> {
        try {
          // emailが存在しない場合
          if (!credentials?.username) {
            return null
          }

          // ユーザー情報をDBから検索
          const email = credentials.username as string
          const user = await prisma.user.findUnique({
            where: { email },
          })

          // ユーザーが存在しない場合
          if (!user || !user.password) {
            return null
          }

          // パスワードの検証
          const isValid = await comparePassword(
            credentials.password as string,
            user.password,
          )

          if (!isValid) {
            return null
          }

          // ユーザー情報の返却
          return { id: user.id, name: user.name, email: user.email }
        } catch (error) {
          console.error('認証エラー:', error)
          return null
        }
      },
    }),
  ],
  // 認証APIのベースパス
  basePath: BASE_PATH,
  // シークレットキーの設定
  // セッションの暗号化やJWT署名など、セキュリティ関連の処理に使うシークレットキー
  // NextAuth.js は JWTトークンやセッションデータを暗号化して保管します。
  // そのときにこの secret が使われ、これがないと NextAuthがランダムに生成したキーを毎回使ってしまうため、ログインが持続しない
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
