import { useState } from 'react'
import { Boxes, Eye, EyeOff, Image, PackagePlus, TriangleAlert } from 'lucide-react'
import { api } from '../../services/api'
import { useAsyncData } from '../../hooks/useAsyncData'
import LoadingState from '../../components/feedback/LoadingState'
import EmptyState from '../../components/feedback/EmptyState'
import PageHeader from '../../components/admin/PageHeader'
import MetricCard from '../../components/admin/MetricCard'
import styles from './AdminPages.module.css'

const initialForm = {
  codigo: '',
  descripcion: '',
  unidad_medida: 'unidad',
  precio_unitario: '',
  id_categoria: '',
  stock_minimo: '0',
  stock_actual: '0',
  ubicacion: '',
  imagen_url: '',
  visible_tienda: false
}

export default function InventoryPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const { data, loading, error, reload } = useAsyncData(() => api('/api/admin/products'), [])

  const lowStock = data?.items?.filter(item => Number(item.stock_actual) <= Number(item.stock_minimo)).length ?? 0
  const published = data?.items?.filter(item => item.visible_tienda).length ?? 0

  const handleChange = event => {
    const { name, value, type, checked } = event.target
    setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setMessage('')
    try {
      await api('/api/admin/products', { method: 'POST', body: JSON.stringify(form) })
      setForm(initialForm)
      setShowForm(false)
      await reload()
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Inventario"
        title="Módulo de Almacén"
        description="Controla productos, existencias, categorías y disponibilidad para la tienda."
        actions={<button className={styles.primary} onClick={() => setShowForm(value => !value)}><PackagePlus size={18}/>{showForm ? 'Cerrar formulario' : 'Nuevo producto'}</button>}
      />

      {error && <div className={styles.noticeError}>{error}</div>}

      <div className={styles.metricsThree}>
        <MetricCard icon={Boxes} label="Productos activos" value={data?.items?.length ?? 0} helper="Inventario registrado" tone="blue" />
        <MetricCard icon={TriangleAlert} label="Stock bajo" value={lowStock} helper="Stock actual ≤ mínimo" tone="orange" />
        <MetricCard icon={Eye} label="Publicados en tienda" value={published} helper="visible_tienda = true" tone="green" />
      </div>

      {showForm && (
        <form className={`${styles.panel} ${styles.formSection}`} onSubmit={handleSubmit}>
          <div className={styles.formSectionHead}><span className={styles.formIcon}><PackagePlus size={22}/></span><div><h3>Registrar producto</h3><p>Incluye los campos imagen_url y visible_tienda definidos para la tienda pública.</p></div></div>
          <div className={styles.formGrid}>
            <label>Código<input name="codigo" value={form.codigo} onChange={handleChange} required /></label>
            <label>Descripción<input name="descripcion" value={form.descripcion} onChange={handleChange} required /></label>
            <label>Unidad de medida<input name="unidad_medida" value={form.unidad_medida} onChange={handleChange} required /></label>
            <label>Precio unitario<input name="precio_unitario" type="number" step="0.01" min="0" value={form.precio_unitario} onChange={handleChange} required /></label>
            <label>Categoría<select name="id_categoria" value={form.id_categoria} onChange={handleChange} required><option value="">Seleccionar categoría</option>{data?.categories?.map(category => <option key={category.id_categoria} value={category.id_categoria}>{category.nombre}</option>)}</select></label>
            <label>Ubicación<input name="ubicacion" value={form.ubicacion} onChange={handleChange} placeholder="Ej. Estante A-2" /></label>
            <label>Stock mínimo<input name="stock_minimo" type="number" min="0" value={form.stock_minimo} onChange={handleChange} required /></label>
            <label>Stock actual<input name="stock_actual" type="number" min="0" value={form.stock_actual} onChange={handleChange} required /></label>
            <label className={styles.span2}>URL de imagen<input name="imagen_url" type="url" value={form.imagen_url} onChange={handleChange} placeholder="https://..." /></label>
            <label className={styles.checkLabel}><input name="visible_tienda" type="checkbox" checked={form.visible_tienda} onChange={handleChange} /><span>Visible en tienda pública</span></label>
          </div>
          {message && <div className={styles.noticeError}>{message}</div>}
          <div className={styles.formActions}><button className={styles.primary}>Guardar producto</button></div>
        </form>
      )}

      <div className={styles.panel}>
        <div className={styles.panelHead}><div><span className={styles.panelEyebrow}>Control de stock</span><h3>Inventario de productos</h3></div><span className={styles.countPill}>{data?.items?.length ?? 0} registros</span></div>
        {loading ? <LoadingState /> : !data?.items?.length ? <EmptyState title="Inventario vacío" description="Las categorías ya están configuradas. Registra productos desde “Nuevo producto”." /> : (
          <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Código</th><th>Producto</th><th>Categoría</th><th>Stock</th><th>Mínimo</th><th>Precio</th><th>Imagen</th><th>Tienda</th></tr></thead><tbody>{data.items.map(product => <tr key={product.id_producto}>
            <td><span className={styles.code}>{product.codigo}</span></td>
            <td><b>{product.descripcion}</b><small className={styles.cellSub}>{product.unidad_medida}</small></td>
            <td>{product.categoria || '—'}</td>
            <td className={Number(product.stock_actual) <= Number(product.stock_minimo) ? styles.dangerText : ''}>{product.stock_actual}</td>
            <td>{product.stock_minimo}</td>
            <td><b>S/ {Number(product.precio_unitario).toFixed(2)}</b></td>
            <td>{product.imagen_url ? <span className={styles.statusOk}><Image size={13}/> Configurada</span> : <span className={styles.statusMuted}>Sin imagen</span>}</td>
            <td>{product.visible_tienda ? <span className={styles.statusOk}><Eye size={13}/> Visible</span> : <span className={styles.statusMuted}><EyeOff size={13}/> Oculto</span>}</td>
          </tr>)}</tbody></table></div>
        )}
      </div>
    </section>
  )
}
