// app/(auth)/login/LoginClient.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '@/utils/supabase-browser';

export default function LoginClient() {
  const router = useRouter();
  const qs = useSearchParams();
  const redirectTo = qs.get('redirect') || '/host/listings';

  const [email, setEmail] = useState('hote@omi.com');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.replace(redirectTo);
  }

  return (
    <form onSubmit={onSubmit}>
      <h1 className="text-22 fw-600 mb-30">Welcome back</h1>

      <div className="mb-20">
        <label className="text-14 lh-14 text-dark-1 mb-10">Email</label>
        <input
          className="form-input"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-20">
        <label className="text-14 lh-14 text-dark-1 mb-10">Password</label>
        <input
          className="form-input"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {err && <div className="text-red-500 text-14 mb-20">{err}</div>}

      <button className="button -md -blue-1-05 w-1/1" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}
