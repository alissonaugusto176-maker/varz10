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
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
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
