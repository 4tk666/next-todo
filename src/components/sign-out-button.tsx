import { signOut } from '@/auth'
import { Button } from './button'

async function handleSignOut() {
  'use server'
  await signOut({
    redirect: true,
    redirectTo: '/',
  })
}

export async function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <Button type="submit">ログアウト</Button>
    </form>
  )
}
