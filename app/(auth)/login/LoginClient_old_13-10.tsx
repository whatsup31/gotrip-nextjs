// app/(auth)/login/LoginClient.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDashboardPath } from '@/utils/role-routing';

export default function LoginClient() {
  const router = useRouter();
  const qs = useSearchParams();
  const redirectTo = qs.get('redirect');

  // Conserve la valeur par défaut utilisée dans l’implémentation actuelle
  const [email, setEmail] = useState('hote@omi.com');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const { supabaseBrowser } = await import('@/utils/supabase-browser');
      const supabase = supabaseBrowser();

      // 1) Auth
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signErr) throw signErr;

      // 2) User
      const { data: ures, error: uerr } = await supabase.auth.getUser();
      if (uerr || !ures?.user) throw uerr || new Error('No user');

      // 3) Rôle
      const { data: profile, error: profErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', ures.user.id)
        .single();
      if (profErr) throw profErr;

      // 4) Redirection
      const role = profile?.role ?? null;
      const target = redirectTo || getDashboardPath(role);
      router.replace(target);
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
          <Link href="/signup" className="text-blue-1">
            Sign up for free
          </Link>
        </p>
      </div>

      <div className="col-12">
        <div className="form-input">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder=" " /* nécessaire pour certains styles de label flottant */
          />
          <label className="lh-1 text-14 text-light-1">Email</label>
        </div>
      </div>

      <div className="col-12">
        <div className="form-input">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder=" "
          />
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
        <button
          type="submit"
          className="button py-20 -dark-1 bg-blue-1 text-white w-100"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign In'} <div className="icon-arrow-top-right ml-15" />
        </button>
      </div>
    </form>
  );
}
