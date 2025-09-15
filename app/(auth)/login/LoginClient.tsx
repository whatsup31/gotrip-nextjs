// app/(auth)/login/LoginClient.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDashboardPath } from '@/utils/role-routing';

export default function LoginClient() {
  const router = useRouter();
  const qs = useSearchParams();
  const redirectTo = qs.get('redirect');

  const [email, setEmail] = useState('hote@omi.com');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      // Import dynamique pour éviter qu’un import top-level casse le rendu
      const { supabaseBrowser } = await import('@/utils/supabase-browser');
	  //const { supabaseBrowser } = await import('../../../utils/supabase-browser');
      const supabase = supabaseBrowser();

      // 1) Authentification
      const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signErr) throw signErr;

      // 2) Lecture user
      const { data: ures, error: uerr } = await supabase.auth.getUser();
      if (uerr || !ures?.user) throw uerr || new Error('No user');

      // 3) Lecture rôle dans profiles (clé: user_id)
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
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-22 fw-600 mb-30">Se connecter</h1>

      <div className="mb-20">
        <label className="text-14 lh-14 text-dark-1 mb-10">Email</label>
        <input
          className="form-input"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          required
        />
      </div>

      <div className="mb-20">
        <label className="text-14 lh-14 text-dark-1 mb-10">Mot de passe</label>
        <input
          className="form-input"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          required
        />
      </div>

      {err && <div className="text-red-500 text-14 mb-20">{String(err)}</div>}

      <button className="button -md -blue-1-05 w-full" disabled={loading}>
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}
