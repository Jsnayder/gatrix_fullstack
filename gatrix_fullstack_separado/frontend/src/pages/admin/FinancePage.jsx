import { Banknote, FileText } from 'lucide-react'
import { api } from '../../services/api'
import { useAsyncData } from '../../hooks/useAsyncData'
import LoadingState from '../../components/feedback/LoadingState'
import EmptyState from '../../components/feedback/EmptyState'
import PageHeader from '../../components/admin/PageHeader'
import MetricCard from '../../components/admin/MetricCard'
import styles from './AdminPages.module.css'

export default function FinancePage() {
  const { data, loading, error } = useAsyncData(() => api('/api/admin/finance'), [])
  return (
    <section className={styles.page}>
      <PageHeader eyebrow="Finanzas" title="Control financiero" description="Consulta ingresos, comprobantes de venta y el movimiento financiero del negocio." />
      {error && <div className={styles.noticeError}>{error}</div>}
      <div className={styles.metricsThree}>
        <MetricCard icon={Banknote} label="Ingresos hoy" value={`S/ ${Number(data?.summary?.ingresos_hoy || 0).toFixed(2)}`} helper="Importe total" tone="green" />
        <MetricCard icon={FileText} label="Comprobantes hoy" value={data?.summary?.comprobantes_hoy || 0} helper="Ventas activas" tone="blue" />
      </div>
      <div className={styles.panel}>
        <div className={styles.panelHead}><div><span className={styles.panelEyebrow}>Movimientos</span><h3>Comprobantes de venta</h3></div></div>
        {loading ? <LoadingState /> : !data?.items?.length ? <EmptyState title="Sin movimientos financieros" description="Cuando se registren comprobantes de venta aparecerán aquí." /> : (
          <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Fecha</th><th>Comprobante</th><th>Método</th><th>Importe</th><th>Estado SUNAT</th></tr></thead><tbody>{data.items.map(item => <tr key={item.id_comprobante}><td>{item.fecha_emision}</td><td><b>{item.tipo_comprobante}</b> {item.serie}-{item.numero}</td><td>{item.metodo_pago}</td><td><b>S/ {Number(item.importe_total).toFixed(2)}</b></td><td><span className={styles.badge}>{item.estado_sunat}</span></td></tr>)}</tbody></table></div>
        )}
      </div>
    </section>
  )
}
