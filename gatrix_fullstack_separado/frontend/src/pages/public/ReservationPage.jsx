import { useEffect, useState } from 'react'
import { CalendarCheck, Clock3, Phone } from 'lucide-react'
import { api } from '../../services/api'
import PageBanner from '../../components/public/PageBanner'
import styles from './PublicPages.module.css'

const empty={nombres:'',apellidos:'',dni:'',telefono:'',email:'',placa:'',marca:'',color:'',id_servicio:'',fecha:'',hora:''}

export default function ReservationPage(){
  const [services,setServices]=useState([])
  const [form,setForm]=useState(empty)
  const [message,setMessage]=useState('')
  const [saving,setSaving]=useState(false)

  useEffect(()=>{api('/api/public/services').then(r=>setServices(r.items)).catch(()=>{})},[])
  const onChange=e=>setForm({...form,[e.target.name]:e.target.value})
  const submit=async e=>{e.preventDefault();setSaving(true);setMessage('');try{const r=await api('/api/public/reservations',{method:'POST',body:JSON.stringify(form)});setMessage(`Reserva registrada con código #${r.id_atencion}.`);setForm(empty)}catch(err){setMessage(err.message)}finally{setSaving(false)}}

  return <>
    <PageBanner icon={CalendarCheck} title="Reserva tu atención" description="Elige tu servicio, fecha y hora en pocos pasos." />
    <section className={styles.page}>
      <div className={styles.reservationLayout}>
        <aside className={styles.reservationSide}>
          <article className={styles.sideInfoCard}><Clock3/><div><h3>Horario de atención</h3><p>Lunes a sábado</p><strong>8:00 a. m. – 7:00 p. m.</strong></div></article>
          <article className={styles.sideInfoCard}><Phone/><div><h3>¿Necesitas ayuda?</h3><p>También puedes comunicarte con nosotros.</p><strong>987 654 321</strong></div></article>
        </aside>
        <form className={styles.formCard} onSubmit={submit}>
          <h2 className={styles.formTitle}><CalendarCheck/> Nueva reserva</h2>
          <p className={styles.formIntro}>Completa tus datos y la información básica de tu vehículo. Correo y color son opcionales.</p>
          <div className={styles.formGrid}>
            <label><span>Nombres</span><input name="nombres" value={form.nombres} onChange={onChange} required/></label>
            <label><span>Apellidos</span><input name="apellidos" value={form.apellidos} onChange={onChange} required/></label>
            <label><span>DNI</span><input name="dni" value={form.dni} onChange={onChange} required/></label>
            <label><span>Teléfono</span><input name="telefono" value={form.telefono} onChange={onChange} required/></label>
            <label><span>Correo electrónico</span><input type="email" name="email" value={form.email} onChange={onChange}/></label>
            <label><span>Placa</span><input name="placa" value={form.placa} onChange={onChange} required/></label>
            <label><span>Marca</span><input name="marca" value={form.marca} onChange={onChange} required/></label>
            <label><span>Color</span><input name="color" value={form.color} onChange={onChange}/></label>
            <label><span>Servicio</span><select name="id_servicio" value={form.id_servicio} onChange={onChange} required><option value="">Seleccionar servicio...</option>{services.map(s=><option value={s.id_servicio} key={s.id_servicio}>{s.nombre} — S/ {Number(s.precio).toFixed(2)}</option>)}</select></label>
            <label><span>Fecha</span><input type="date" name="fecha" value={form.fecha} onChange={onChange} required/></label>
            <label><span>Hora</span><input type="time" name="hora" value={form.hora} onChange={onChange} required/></label>
          </div>
          {message&&<p className={styles.formMessage}>{message}</p>}
          <div className={styles.formActions}><button className={styles.primary} disabled={saving||services.length===0}>{saving?'Registrando...':'Confirmar reserva'}</button>{services.length===0&&<small>En este momento no hay servicios disponibles para reservar.</small>}</div>
        </form>
      </div>
    </section>
  </>
}
