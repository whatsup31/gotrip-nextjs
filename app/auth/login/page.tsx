'use client'
import { useState } from 'react'
import { supabaseBrowser } from '@/utils/supabase-browser'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setErr(null)
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setErr(error.message)
    router.push('/host/new-listing')
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          placeholder="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded p-2"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <button className="w-full border rounded p-2" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        {err && <p className="text-red-600 text-sm">{err}</p>}
      </form>
    </div>
  )
}
