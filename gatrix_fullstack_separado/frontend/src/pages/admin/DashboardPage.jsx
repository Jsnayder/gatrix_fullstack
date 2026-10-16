import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, CalendarPlus, CircleDollarSign, ClipboardList, PackagePlus, PackageSearch, UserPlus, UsersRound } from 'lucide-react'
import { api } from '../../services/api'
import { useAsyncData } from '../../hooks/useAsyncData'
import { useAuth } from '../../context/AuthContext'
import LoadingState from '../../components/feedback/LoadingState'
import EmptyState from '../../components/feedback/EmptyState'
import PageHeader from '../../components/admin/PageHeader'
import MetricCard from '../../components/admin/MetricCard'
import styles from './AdminPages.module.css'

const modules = [
  { to:'/admin/atencion', icon:ClipboardList, title:'Atención', text:'Gestiona servicios, clientes y el seguimiento de cada vehículo.', tone:'blue' },
  { to:'/admin/almacen', icon:PackageSearch, title:'Almacén', text:'Controla productos, existencias, proveedores y movimientos.', tone:'green' },
  { to:'/admin/finanzas', icon:CircleDollarSign, title:'Finanzas', text:'Supervisa ingresos, comprobantes y movimientos financieros.', tone:'violet' }
]

const operationLabel = value => ({ INSERT:'Nuevo registro', UPDATE:'Actualización', DELETE:'Eliminación' }[String(value||'').toUpperCase()] || value || 'Movimiento')
const areaLabel = value => ({ cliente:'Clientes', vehiculo:'Vehículos', orden_atencion:'Atención', producto:'Almacén', detalle_producto:'Almacén', comprobante_venta:'Finanzas', usuario:'Usuarios' }[value] || 'Gestión')

export default function DashboardPage() {
  const { user } = useAuth()
  const { data, loading, error } = useAsyncData(() => api('/api/admin/dashboard'), [])
  if (loading) return <LoadingState label="Cargando panel..." />
  const dashboard = data || {}

  return <section className={styles.page}>
    <PageHeader eyebrow="Resumen general" title={`Bienvenido, ${user?.username || 'usuario'}`} description="Revisa la operación del día y accede rápidamente a las áreas principales de Gatrix." />
    {error && <div className={styles.notice}>{error}</div>}

    <section className={styles.heroPanel}>
      <div><span>GESTIÓN DIARIA</span><h3>Todo Gatrix en una sola vista.</h3><p>Consulta atenciones, reservas, inventario y finanzas desde un panel claro y ordenado.</p></div>
      <Link to="/admin/reservas" className={styles.heroAction}><CalendarPlus size={18}/> Nueva reserva</Link>
    </section>

    <div className={styles.metrics}>
      <MetricCard icon={ClipboardList} label="Atenciones hoy" value={dashboard.atenciones_hoy ?? 0} helper="Servicios registrados" tone="blue" />
      <MetricCard icon={PackageSearch} label="Stock por revisar" value={dashboard.stock_bajo ?? 0} helper="Productos por reponer" tone="green" />
      <MetricCard icon={CircleDollarSign} label="Ingresos del día" value={`S/ ${Number(dashboard.ingresos_hoy ?? 0).toFixed(2)}`} helper="Ventas registradas" tone="violet" />
      <MetricCard icon={CalendarDays} label="Reservas de hoy" value={dashboard.reservas_hoy ?? 0} helper="Agenda del día" tone="orange" />
    </div>

    <div className={styles.moduleGrid}>
      {modules.map(item=>{const Icon=item.icon;return <Link key={item.to} to={item.to} className={`${styles.moduleCard} ${styles[item.tone]}`}>
        <div className={styles.moduleTop}><span className={styles.moduleIcon}><Icon size={22}/></span><Icon className={styles.moduleWatermark} size={55}/></div>
        <h3>{item.title}</h3><p>{item.text}</p><span className={styles.moduleLink}>Ir al módulo <ArrowRight size={16}/></span>
      </Link>})}
    </div>

    <div className={styles.grid2}>
      <div className={styles.panel}>
        <div className={styles.panelHead}><div><span className={styles.panelEyebrow}>Actividad reciente</span><h3>Últimos movimientos</h3></div></div>
        {!dashboard.actividad?.length ? <EmptyState title="Sin actividad reciente" description="Los movimientos del sistema aparecerán aquí a medida que se registren operaciones."/> : <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Fecha</th><th>Movimiento</th><th>Área</th><th>Referencia</th></tr></thead><tbody>{dashboard.actividad.map(item=><tr key={item.id_bitacora}><td>{new Date(item.fecha_hora).toLocaleString()}</td><td><span className={styles.badge}>{operationLabel(item.operacion)}</span></td><td>{areaLabel(item.tabla_afectada)}</td><td>#{item.registro_id}</td></tr>)}</tbody></table></div>}
      </div>
      <div className={styles.panel}>
        <div className={styles.panelHead}><div><span className={styles.panelEyebrow}>Accesos rápidos</span><h3>Operaciones</h3></div></div>
        <div className={styles.quickList}>
          <Link to="/admin/reservas"><CalendarPlus size={18}/><span>Nueva reserva</span><ArrowRight size={16}/></Link>
          <Link to="/admin/clientes"><UserPlus size={18}/><span>Nuevo cliente</span><ArrowRight size={16}/></Link>
          <Link to="/admin/atencion"><ClipboardList size={18}/><span>Registrar atención</span><ArrowRight size={16}/></Link>
          <Link to="/admin/almacen"><PackagePlus size={18}/><span>Nuevo producto</span><ArrowRight size={16}/></Link>
          {user?.rol==='Administrador' && <Link to="/admin/usuarios"><UsersRound size={18}/><span>Gestionar usuarios</span><ArrowRight size={16}/></Link>}
        </div>
      </div>
    </div>
  </section>
}
