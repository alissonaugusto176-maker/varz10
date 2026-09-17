'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role,active')
        .eq('user_id', session.user.id)
        .single();

      if (error || !profile?.active || profile.role !== 'super_admin') {
        await supabase.auth.signOut();
        router.replace('/login');
        return;
      }

      if (active) setAllowed(true);
    }

    checkAccess();
    return () => { active = false; };
  }, [pathname, router]);

  if (!allowed) {
    return <main className="formPage"><section className="teamForm"><p className="eyebrow">VARZ10</p><h1>Verificando acesso...</h1><p className="muted">Aguarde um instante.</p></section></main>;
  }

  return <>{children}</>;
}
