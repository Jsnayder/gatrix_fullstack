import { Tags } from 'lucide-react'
import { api } from '../../services/api'
import { useAsyncData } from '../../hooks/useAsyncData'
import EmptyState from '../../components/feedback/EmptyState'
import LoadingState from '../../components/feedback/LoadingState'
import PageBanner from '../../components/public/PageBanner'
import styles from './PublicPages.module.css'

export default function PricesPage(){
  const {data,loading,error}=useAsyncData(()=>api('/api/public/services'),[])
  return <>
    <PageBanner icon={Tags} title="Precios" description="Consulta el tarifario disponible y compara la duración de cada servicio." />
    <section className={styles.page}>
      <div className={styles.pageHead}><span>Tarifario</span><h1>Elige el servicio que necesitas</h1><p>Precios claros para que puedas organizar tu atención antes de reservar.</p></div>
      {loading?<LoadingState/>:error?<div className={styles.alert}>{error}</div>:!data?.items?.length?<EmptyState title="Tarifario no disponible" description="Pronto publicaremos nuestros servicios y precios."/>:<div className={styles.pricePanel}>{data.items.map(item=><div className={styles.priceRow} key={item.id_servicio}><b>{item.nombre}</b><span>{item.categoria}</span><span>{item.duracion_min} min</span><strong>S/ {Number(item.precio).toFixed(2)}</strong></div>)}</div>}
    </section>
  </>
}
