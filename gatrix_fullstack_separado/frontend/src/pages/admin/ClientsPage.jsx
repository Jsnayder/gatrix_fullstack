import { useState } from 'react'
import { Plus, UserRoundPlus, UsersRound } from 'lucide-react'
import { api } from '../../services/api'
import { useAsyncData } from '../../hooks/useAsyncData'
import EmptyState from '../../components/feedback/EmptyState'
import LoadingState from '../../components/feedback/LoadingState'
import PageHeader from '../../components/admin/PageHeader'
import styles from './AdminPages.module.css'

const initialForm = { nombres: '', apellidos: '', dni: '', telefono: '', email: '' }

export default function ClientsPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const { data, loading, error, reload } = useAsyncData(() => api('/api/admin/clients'), [])

  const handleChange = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }))

  const handleSubmit = async event => {
    event.preventDefault()
    setMessage('')
    try {
      await api('/api/admin/clients', { method: 'POST', body: JSON.stringify(form) })
      setForm(initialForm)
      setShowForm(false)
      await reload()
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <section className={styles.page}>
      <PageHeader eyebrow="Clientes" title="Gestión de clientes" description="Registra clientes y consulta su información de contacto desde un solo lugar." actions={<button className={styles.primary} onClick={() => setShowForm(value => !value)}><Plus size={18}/>{showForm ? 'Cerrar' : 'Nuevo cliente'}</button>} />
      {error && <div className={styles.noticeError}>{error}</div>}

      {showForm && (
        <form className={`${styles.panel} ${styles.formSection}`} onSubmit={handleSubmit}>
          <div className={styles.formSectionHead}><span className={styles.formIcon}><UserRoundPlus size={22}/></span><div><h3>Nuevo cliente</h3><p>Completa los datos principales del cliente.</p></div></div>
          <div className={styles.formGrid}>
            <label>Nombres<input name="nombres" value={form.nombres} onChange={handleChange} required /></label>
            <label>Apellidos<input name="apellidos" value={form.apellidos} onChange={handleChange} required /></label>
            <label>DNI<input name="dni" value={form.dni} onChange={handleChange} required /></label>
            <label>Teléfono<input name="telefono" value={form.telefono} onChange={handleChange} required /></label>
            <label className={styles.span2}>Correo electrónico<input name="email" type="email" value={form.email} onChange={handleChange} /></label>
          </div>
          {message && <div className={styles.noticeError}>{message}</div>}
          <div className={styles.formActions}><button className={styles.primary}>Guardar cliente</button></div>
        </form>
      )}

      <div className={styles.panel}>
        <div className={styles.panelHead}><div><span className={styles.panelEyebrow}>Directorio</span><h3>Clientes registrados</h3></div><span className={styles.countPill}><UsersRound size={14}/>{data?.items?.length ?? 0}</span></div>
        {loading ? <LoadingState /> : !data?.items?.length ? <EmptyState title="No hay clientes registrados" description="El módulo comienza vacío y se alimenta con información real." /> : (
          <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>DNI</th><th>Cliente</th><th>Teléfono</th><th>Email</th><th>Registro</th></tr></thead><tbody>{data.items.map(client => <tr key={client.id_cliente}><td><span className={styles.code}>{client.dni}</span></td><td><b>{client.nombres} {client.apellidos}</b></td><td>{client.telefono}</td><td>{client.email || '—'}</td><td>{new Date(client.fecha_registro).toLocaleDateString()}</td></tr>)}</tbody></table></div>
        )}
      </div>
    </section>
  )
}
