'use client';
import {FormEvent,useMemo,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {supabase} from '../../../../lib/supabase';

const slug=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');

export default function NovoTime(){
  const router=useRouter();
  const[name,setName]=useState('');
  const[responsible,setResponsible]=useState('');
  const[phone,setPhone]=useState('');
  const[campo,setCampo]=useState(false);
  const[futsal,setFutsal]=useState(false);
  const[msg,setMsg]=useState('');
  const[saving,setSaving]=useState(false);
  const login=useMemo(()=>slug(name),[name]);

  async function submit(e:FormEvent){
    e.preventDefault();
    setMsg('');
    if(!campo&&!futsal){setMsg('Selecione pelo menos uma modalidade.');return;}
    if(login.length<3){setMsg('O login precisa ter pelo menos 3 caracteres.');return;}
    setSaving(true);
    const {error}=await supabase.rpc('admin_create_team',{
      p_name:name,
      p_login:login,
      p_responsible_name:responsible,
      p_responsible_phone:phone,
      p_campo:campo,
      p_futsal:futsal
    });
    setSaving(false);
    if(error){
      if(error.code==='23505') setMsg('Este login já está sendo usado por outro time.');
      else setMsg(error.message||'Não foi possível cadastrar o time.');
      return;
    }
    router.push('/admin/times?created=1');
  }

  return <main className="formPage"><div className="formTop"><Link href="/admin">← Voltar</Link><div className="brand"><span className="shield">V10</span><strong>VARZ10</strong></div></div><section className="teamForm"><p className="eyebrow">SUPER ADM</p><h1>Cadastrar time</h1><p className="muted">Cadastre o time e escolha quais modalidades serão liberadas.</p><form onSubmit={submit}><label>Nome do time<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Ex: Aliados da Parma"/></label><label>Login do time<input value={login} readOnly placeholder="gerado automaticamente"/><small>Somente o Super ADM poderá alterar este login.</small></label><div className="twoCols"><label>Nome do responsável<input required value={responsible} onChange={e=>setResponsible(e.target.value)} placeholder="Nome completo"/></label><label>Celular / WhatsApp<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="(11) 99999-9999"/></label></div><fieldset><legend>Modalidades liberadas</legend><label className="check"><input type="checkbox" checked={campo} onChange={e=>setCampo(e.target.checked)}/> Futebol de Campo</label><label className="check"><input type="checkbox" checked={futsal} onChange={e=>setFutsal(e.target.checked)}/> Futsal / Quadra</label></fieldset><div className="firstAccess"><b>Acesso do responsável</b><p>Nesta etapa salvaremos o time. A criação segura da senha de primeiro acesso será conectada em seguida.</p></div>{msg&&<div className="firstAccess"><p>{msg}</p></div>}<button className="primary full" type="submit" disabled={saving}>{saving?'Cadastrando...':'Cadastrar time'}</button></form></section></main>}
