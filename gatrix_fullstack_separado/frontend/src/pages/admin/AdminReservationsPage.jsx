import { CalendarDays } from 'lucide-react'
import { api } from '../../services/api'
import { useAsyncData } from '../../hooks/useAsyncData'
import LoadingState from '../../components/feedback/LoadingState'
import EmptyState from '../../components/feedback/EmptyState'
import PageHeader from '../../components/admin/PageHeader'
import styles from './AdminPages.module.css'

export default function AdminReservationsPage() {
  const { data, loading, error } = useAsyncData(() => api('/api/admin/reservations'), [])
  return (
    <section className={styles.page}>
      <PageHeader eyebrow="Agenda" title="Reservas programadas" description="Organiza las próximas atenciones y consulta los datos de cada reserva." />
      {error && <div className={styles.noticeError}>{error}</div>}
      <div className={styles.panel}>
        <div className={styles.panelHead}><div><span className={styles.panelEyebrow}>Agenda operativa</span><h3>Próximas reservas</h3></div><span className={styles.countPill}><CalendarDays size={14}/>{data?.items?.length ?? 0}</span></div>
        {loading ? <LoadingState /> : !data?.items?.length ? <EmptyState title="No hay reservas programadas" description="Las reservas creadas desde la web pública aparecerán aquí." /> : (
          <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Código</th><th>Fecha</th><th>Cliente</th><th>Teléfono</th><th>Vehículo</th><th>Servicio</th><th>Estado</th></tr></thead><tbody>{data.items.map(item => <tr key={item.id_atencion}><td><span className={styles.code}>#{item.id_atencion}</span></td><td><b>{item.fecha}</b><small className={styles.cellSub}>{item.hora?.slice(0,5)}</small></td><td>{item.cliente}</td><td>{item.telefono}</td><td>{item.placa} · {item.marca}</td><td>{item.servicios || '—'}</td><td><span className={styles.badge}>{item.estado}</span></td></tr>)}</tbody></table></div>
        )}
      </div>
    </section>
  )
}
