import { useState } from 'react'
import { ClipboardCheck, Plus, Tags } from 'lucide-react'
import { api } from '../../services/api'
import { useAsyncData } from '../../hooks/useAsyncData'
import LoadingState from '../../components/feedback/LoadingState'
import EmptyState from '../../components/feedback/EmptyState'
import PageHeader from '../../components/admin/PageHeader'
import MetricCard from '../../components/admin/MetricCard'
import styles from './AdminPages.module.css'

const initialForm = { nombre: '', precio: '', duracion_min: '', descripcion: '', id_categoria: '' }

export default function AttentionPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const orders = useAsyncData(() => api('/api/admin/attention'), [])
  const services = useAsyncData(() => api('/api/admin/services'), [])

  const handleChange = event => {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setMessage('')
    try {
      await api('/api/admin/services', { method: 'POST', body: JSON.stringify(form) })
      setForm(initialForm)
      setShowForm(false)
      await services.reload()
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Operación"
        title="Módulo de Atención"
        description="Administra servicios y consulta las órdenes asociadas a clientes y vehículos."
        actions={<button className={styles.primary} onClick={() => setShowForm(value => !value)}><Plus size={18}/>{showForm ? 'Cerrar' : 'Nuevo servicio'}</button>}
      />

      <div className={styles.metricsThree}>
        <MetricCard icon={ClipboardCheck} label="Atenciones" value={orders.data?.items?.length ?? 0} helper="Órdenes activas" tone="blue" />
        <MetricCard icon={Tags} label="Servicios" value={services.data?.items?.length ?? 0} helper="Servicios registrados" tone="green" />
        <MetricCard icon={Tags} label="Categorías" value={services.data?.categories?.length ?? 0} helper="Servicios disponibles" tone="violet" />
      </div>

      {showForm && (
        <form className={`${styles.panel} ${styles.formSection}`} onSubmit={handleSubmit}>
          <div className={styles.formSectionHead}><span className={styles.formIcon}><Plus size={22}/></span><div><h3>Nuevo servicio</h3><p>Selecciona una categoría creada en categoria_servicio.</p></div></div>
          <div className={styles.formGrid}>
            <label>Nombre<input name="nombre" value={form.nombre} onChange={handleChange} required /></label>
            <label>Precio<input name="precio" type="number" min="0" step="0.01" value={form.precio} onChange={handleChange} required /></label>
            <label>Duración (min)<input name="duracion_min" type="number" min="1" value={form.duracion_min} onChange={handleChange} required /></label>
            <label className={styles.span2}>Descripción<input name="descripcion" value={form.descripcion} onChange={handleChange} required /></label>
            <label>Categoría<select name="id_categoria" value={form.id_categoria} onChange={handleChange} required><option value="">Seleccionar</option>{services.data?.categories?.map(category => <option key={category.id_categoria} value={category.id_categoria}>{category.nombre}</option>)}</select></label>
          </div>
          {message && <div className={styles.noticeError}>{message}</div>}
          <div className={styles.formActions}><button className={styles.primary}>Guardar servicio</button></div>
        </form>
      )}

      <div className={styles.panel}>
        <div className={styles.panelHead}><div><span className={styles.panelEyebrow}>Catálogo</span><h3>Servicios disponibles</h3></div></div>
        {services.loading ? <LoadingState /> : !services.data?.items?.length ? <EmptyState title="No hay servicios registrados" description="Registra el primer servicio usando las categorías ya configuradas." /> : (
          <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Servicio</th><th>Categoría</th><th>Duración</th><th>Precio</th></tr></thead><tbody>{services.data.items.map(service => <tr key={service.id_servicio}><td><b>{service.nombre}</b><small className={styles.cellSub}>{service.descripcion}</small></td><td>{service.categoria}</td><td>{service.duracion_min} min</td><td><b>S/ {Number(service.precio).toFixed(2)}</b></td></tr>)}</tbody></table></div>
        )}
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHead}><div><span className={styles.panelEyebrow}>Seguimiento</span><h3>Atenciones registradas</h3></div></div>
        {orders.loading ? <LoadingState /> : orders.error ? <div className={styles.noticeError}>{orders.error}</div> : !orders.data?.items?.length ? <EmptyState title="No hay atenciones" description="Las reservas y atenciones reales se mostrarán aquí." /> : (
          <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>ID</th><th>Fecha</th><th>Cliente</th><th>Vehículo</th><th>Servicio</th><th>Total</th><th>Estado</th></tr></thead><tbody>{orders.data.items.map(order => <tr key={order.id_atencion}><td>#{order.id_atencion}</td><td>{order.fecha} {order.hora?.slice(0,5)}</td><td>{order.cliente}</td><td>{order.placa} · {order.marca}</td><td>{order.servicios || '—'}</td><td>S/ {Number(order.total).toFixed(2)}</td><td><span className={styles.badge}>{order.estado}</span></td></tr>)}</tbody></table></div>
        )}
      </div>
    </section>
  )
}
