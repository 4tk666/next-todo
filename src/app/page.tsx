import { auth } from '@/auth'

export default async function Home() {
  const session = await auth()
  return (
    <div>
      <div className="text-lg font-bold">Home</div>
      <pre className="bg-slate-100 p-2 text-sm text-slate-700">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  )
}
