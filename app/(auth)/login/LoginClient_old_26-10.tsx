// app/(auth)/login/LoginClient.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getDashboardPath } from '@/utils/role-routing';

type Profile = { role: string | null };

export default function LoginClient() {
  const router = useRouter();
  const qs = useSearchParams();
  const redirectTo = qs.get('redirect') || '';

  const [email, setEmail] = useState('hote@omi.com');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Si déjà connecté -> refresh cookies + redir. éventuelle
  useEffect(() => {
    const supabase = createClientComponentClient();
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        router.refresh();
        if (redirectTo) window.location.assign(redirectTo);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const supabase = createClientComponentClient();

      // 1) Auth
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signErr) throw signErr;

      // 2) Rôle
      const [{ data: ures }, { data: prof }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('profiles').select('role').limit(1).single<Profile>(),
      ]);
      const role = prof?.role ?? null;

      // 3) Propager cookies côté serveur
      router.refresh();

      // 4) Redirection (hard navigation = rechargement)
      const target = redirectTo || getDashboardPath(role);
      window.location.assign(target);
    } catch (e: any) {
      console.error(e);
      setErr(e?.message || 'Erreur inattendue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="row y-gap-20">
      <div className="col-12">
        <h1 className="text-22 fw-500">Welcome back</h1>
        <p className="mt-10">
          Don&apos;t have an account yet?{' '}
          <Link href="/signup" className="text-blue-1">Sign up for free</Link>
        </p>
      </div>

      <div className="col-12">
        <div className="form-input">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} name="email" placeholder=" " />
          <label className="lh-1 text-14 text-light-1">Email</label>
        </div>
      </div>

      <div className="col-12">
        <div className="form-input">
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} name="password" placeholder=" " />
          <label className="lh-1 text-14 text-light-1">Password</label>
        </div>
      </div>

      {err && (
        <div className="col-12">
          <div className="text-red-500 text-14">{String(err)}</div>
        </div>
      )}

      <div className="col-12">
        <Link href="/forgot-password" className="text-14 fw-500 text-blue-1 underline">
          Forgot your password?
        </Link>
      </div>

      <div className="col-12">
        <button type="submit" className="button py-20 -dark-1 bg-blue-1 text-white w-100" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'} <div className="icon-arrow-top-right ml-15" />
        </button>
      </div>
    </form>
  );
}