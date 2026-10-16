import { useState } from 'react'
import { KeyRound, Plus, ShieldCheck, UserRoundPlus, UsersRound } from 'lucide-react'
import { api } from '../../services/api'
import { useAsyncData } from '../../hooks/useAsyncData'
import LoadingState from '../../components/feedback/LoadingState'
import EmptyState from '../../components/feedback/EmptyState'
import PageHeader from '../../components/admin/PageHeader'
import MetricCard from '../../components/admin/MetricCard'
import styles from './AdminPages.module.css'

const initialForm = {
  nombres: '',
  apellidos: '',
  telefono: '',
  tipo_contrato: '',
  username: '',
  password: '',
  id_rol: ''
}

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const { data, loading, error, reload } = useAsyncData(() => api('/api/admin/users'), [])

  const activeUsers = data?.items?.filter(item => item.activo).length ?? 0
  const admins = data?.items?.filter(item => item.rol === 'Administrador').length ?? 0

  const handleChange = event => {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await api('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(form)
      })
      setForm(initialForm)
      setShowForm(false)
      await reload()
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Administración"
        title="Usuarios del sistema"
        description="Crea y administra las cuentas de acceso del personal y asigna el rol correspondiente."
        actions={
          <button className={styles.primary} onClick={() => setShowForm(value => !value)}>
            {showForm ? 'Cerrar formulario' : <><Plus size={18}/> Crear usuario</>}
          </button>
        }
      />

      {error && <div className={styles.noticeError}>{error}</div>}

      <div className={styles.metricsThree}>
        <MetricCard icon={UsersRound} label="Usuarios registrados" value={data?.items?.length ?? 0} helper="Tabla usuario" tone="blue" />
        <MetricCard icon={ShieldCheck} label="Administradores" value={admins} helper="Rol Administrador" tone="violet" />
        <MetricCard icon={KeyRound} label="Cuentas activas" value={activeUsers} helper="Acceso habilitado" tone="green" />
      </div>

      {showForm && (
        <form className={`${styles.panel} ${styles.formSection}`} onSubmit={handleSubmit}>
          <div className={styles.formSectionHead}>
            <span className={styles.formIcon}><UserRoundPlus size={22}/></span>
            <div><h3>Nuevo usuario</h3><p>Se creará primero el empleado y luego su cuenta de acceso dentro de una sola transacción.</p></div>
          </div>

          <div className={styles.formGrid}>
            <label>Nombres<input name="nombres" value={form.nombres} onChange={handleChange} required /></label>
            <label>Apellidos<input name="apellidos" value={form.apellidos} onChange={handleChange} required /></label>
            <label>Teléfono<input name="telefono" value={form.telefono} onChange={handleChange} maxLength="15" placeholder="Opcional" /></label>
            <label>Tipo de contrato<input name="tipo_contrato" value={form.tipo_contrato} onChange={handleChange} maxLength="50" placeholder="Opcional" /></label>
            <label>Nombre de usuario<input name="username" value={form.username} onChange={handleChange} autoComplete="off" required /></label>
            <label>Contraseña<input name="password" type="password" value={form.password} onChange={handleChange} minLength="4" autoComplete="new-password" required /></label>
            <label>Rol
              <select name="id_rol" value={form.id_rol} onChange={handleChange} required>
                <option value="">Seleccionar rol</option>
                {data?.roles?.map(role => <option key={role.id_rol} value={role.id_rol}>{role.nombre}</option>)}
              </select>
            </label>
          </div>

          {message && <div className={styles.noticeError}>{message}</div>}
          <div className={styles.formActions}>
            <button type="button" className={styles.secondaryButton} onClick={() => setShowForm(false)}>Cancelar</button>
            <button className={styles.primary} disabled={saving}>{saving ? 'Creando...' : 'Crear cuenta'}</button>
          </div>
        </form>
      )}

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <div><span className={styles.panelEyebrow}>Seguridad</span><h3>Cuentas registradas</h3></div>
          <span className={styles.countPill}>{data?.items?.length ?? 0} usuarios</span>
        </div>
        {loading ? <LoadingState /> : !data?.items?.length ? (
          <EmptyState title="No hay usuarios" description="Crea la primera cuenta adicional desde el botón “Crear usuario”." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Colaborador</th><th>Usuario</th><th>Rol</th><th>Contrato</th><th>Último acceso</th><th>Estado</th></tr></thead>
              <tbody>
                {data.items.map(user => (
                  <tr key={user.id_usuario}>
                    <td><b>{user.nombres} {user.apellidos}</b><small className={styles.cellSub}>{user.telefono || 'Sin teléfono'}</small></td>
                    <td>{user.username}</td>
                    <td><span className={styles.badge}>{user.rol}</span></td>
                    <td>{user.tipo_contrato || '—'}</td>
                    <td>{user.ultimo_acceso ? new Date(user.ultimo_acceso).toLocaleString() : 'Nunca'}</td>
                    <td><span className={user.activo ? styles.statusOk : styles.statusMuted}>{user.activo ? 'Activo' : 'Inactivo'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
