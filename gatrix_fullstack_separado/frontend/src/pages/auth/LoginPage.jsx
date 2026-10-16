import { useState } from 'react'
import { Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './LoginPage.module.css'

export default function LoginPage(){
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [show,setShow]=useState(false)
  const [error,setError]=useState('')
  const [saving,setSaving]=useState(false)
  const {login}=useAuth()
  const navigate=useNavigate()
  const submit=async e=>{e.preventDefault();setError('');setSaving(true);try{await login(username,password);navigate('/admin')}catch(err){setError(err.message)}finally{setSaving(false)}}

  return <div className={styles.page}>
    <section className={styles.brandPanel}>
      <Link to="/" className={styles.brand}><img src="/gatrix-logo.png" alt="Gatrix Car Wash"/><span>GATRIX CARWASH</span></Link>
      <div><span><ShieldCheck size={16}/> Gestión inteligente</span><h1>Control total para un lavado impecable.</h1><p>Atenciones, caja, inventario y equipo organizados en un solo lugar. Ingresa con tu cuenta para acceder al panel de gestión.</p></div>
      <small>Operación organizada • Stock al día • Acceso controlado</small>
    </section>
    <section className={styles.formPanel}>
      <div className={styles.formBox}>
        <Link to="/">← Volver al sitio</Link>
        <h2>Bienvenido de nuevo</h2><p>Ingresa tus credenciales para continuar.</p>
        <form onSubmit={submit}>
          <label>Usuario<input value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" required placeholder="Ingresa tu usuario"/></label>
          <label>Contraseña<div className={styles.password}><input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required placeholder="••••••••"/><button type="button" onClick={()=>setShow(v=>!v)} aria-label="Mostrar contraseña">{show?<EyeOff/>:<Eye/>}</button></div></label>
          {error&&<div className={styles.error}>{error}</div>}
          <button className={styles.submit} disabled={saving}><LogIn size={18}/>{saving?'Ingresando...':'Ingresar al sistema'}</button>
        </form>
        <p className={styles.help}>¿Necesitas ayuda? <a href="mailto:soporte@gatrix.com">soporte@gatrix.com</a></p>
      </div>
    </section>
  </div>
}
