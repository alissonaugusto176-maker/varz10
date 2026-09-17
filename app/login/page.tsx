'use client';
import {FormEvent,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {supabase} from '../../lib/supabase';

export default function Login(){
 const [show,setShow]=useState(false),[login,setLogin]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[loading,setLoading]=useState(false); const router=useRouter();
 async function submit(e:FormEvent){e.preventDefault();setError('');setLoading(true);try{
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL; const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const res=await fetch(`${url}/functions/v1/varz10-auth`,{method:'POST',headers:{'Content-Type':'application/json','apikey':key!},body:JSON.stringify({login,password})}); const data=await res.json();
  if(!res.ok) throw new Error(data.error||'Não foi possível entrar.');
  const {error:sessionError}=await supabase.auth.setSession({access_token:data.access_token,refresh_token:data.refresh_token}); if(sessionError) throw sessionError;
  router.replace(data.user?.role==='super_admin'?'/admin':'/'); router.refresh();
 }catch(err){setError(err instanceof Error?err.message:'Não foi possível entrar.');}finally{setLoading(false)}}
 return <main className="loginPage"><section className="loginCard"><Link href="/" className="brand center"><span className="shield">V10</span><strong>VARZ10</strong></Link><div className="loginHead"><p className="eyebrow">BEM-VINDO</p><h1>Entre na sua conta</h1><p>Acesse a gestão do seu time.</p></div><form onSubmit={submit}><label>Login<input required value={login} onChange={e=>setLogin(e.target.value)} placeholder="Ex: Admalisson" autoComplete="username"/></label><label>Senha<div className="password"><input required value={password} onChange={e=>setPassword(e.target.value)} type={show?'text':'password'} placeholder="Sua senha" autoComplete="current-password"/><button type="button" onClick={()=>setShow(!show)}>{show?'Ocultar':'Mostrar'}</button></div></label>{error&&<div className="firstAccess"><p>{error}</p></div>}<button className="primary full" disabled={loading} type="submit">{loading?'Entrando...':'Entrar'}</button></form><div className="loginHelp"><span>Primeiro acesso?</span><p>Digite o login fornecido pelo administrador. O sistema vai orientar a criação da sua senha.</p></div><small>Problemas com o acesso? Fale com o administrador VARZ10.</small></section></main>}
