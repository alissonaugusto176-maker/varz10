'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../lib/supabase';

type Team = {
  id: string;
  name: string;
  login: string;
  responsible_name: string;
  responsible_phone: string | null;
  status: 'active' | 'blocked';
  team_modalities?: { modality: 'campo' | 'futsal'; enabled: boolean }[];
};

export default function Times() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    async function loadTeams() {
      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('id,name,login,responsible_name,responsible_phone,status,team_modalities(modality,enabled)')
        .order('created_at', { ascending: false });

      if (error) setError(error.message);
      else setTeams((data ?? []) as Team[]);
      setLoading(false);
    }
    loadTeams();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teams.filter(team => {
      const matchesStatus = status === 'all' || team.status === status;
      const haystack = `${team.name} ${team.login} ${team.responsible_name} ${team.responsible_phone ?? ''}`.toLowerCase();
      return matchesStatus && (!q || haystack.includes(q));
    });
  }, [teams, search, status]);

  return <main className="formPage">
    <div className="formTop"><Link href="/admin">← Painel ADM</Link><div className="brand"><span className="shield">V10</span><strong>VARZ10</strong></div></div>
    <section className="teamForm wide">
      <div className="listHead"><div><p className="eyebrow">SUPER ADM</p><h1>Times e acessos</h1><p className="muted">Cadastre, edite, bloqueie e gerencie os acessos.</p></div><Link className="primary" href="/admin/times/novo">+ Cadastrar time</Link></div>
      <div className="toolbar"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar time, responsável, celular ou login"/><select value={status} onChange={e=>setStatus(e.target.value)}><option value="all">Todos</option><option value="active">Ativos</option><option value="blocked">Bloqueados</option></select></div>

      {loading && <div className="emptyState"><h3>Carregando times...</h3></div>}
      {!loading && error && <div className="firstAccess"><p>{error}</p></div>}
      {!loading && !error && filtered.length === 0 && <div className="emptyState"><h3>{teams.length ? 'Nenhum time encontrado' : 'Nenhum time cadastrado ainda'}</h3><p>{teams.length ? 'Tente outro termo ou filtro.' : 'Seu primeiro time aparecerá aqui depois do cadastro.'}</p></div>}
      {!loading && !error && filtered.length > 0 && <div className="teamList">{filtered.map(team => {
        const mods = (team.team_modalities ?? []).filter(m=>m.enabled).map(m=>m.modality === 'futsal' ? 'Futsal / Quadra' : 'Futebol de Campo');
        return <article className="teamRow" key={team.id}>
          <div className="teamRowTop"><div><h3>{team.name}</h3><span className={`statusPill ${team.status}`}>{team.status === 'active' ? 'Ativo' : 'Bloqueado'}</span></div><strong className="teamLogin">@{team.login}</strong></div>
          <div className="teamMeta"><div><small>Responsável</small><b>{team.responsible_name}</b></div><div><small>Celular / WhatsApp</small><b>{team.responsible_phone || 'Não informado'}</b></div><div><small>Modalidade</small><b>{mods.join(' • ') || 'Nenhuma liberada'}</b></div></div>
          <div className="teamActions"><button disabled>Editar</button><button disabled>Redefinir senha</button><button disabled>{team.status === 'active' ? 'Bloquear' : 'Reativar'}</button></div>
        </article>;
      })}</div>}
    </section>
  </main>;
}
