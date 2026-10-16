import { Clock3, Sparkles } from 'lucide-react'
import { api } from '../../services/api'
import { useAsyncData } from '../../hooks/useAsyncData'
import LoadingState from '../../components/feedback/LoadingState'
import EmptyState from '../../components/feedback/EmptyState'
import PageBanner from '../../components/public/PageBanner'
import { getServiceImage } from '../../utils/serviceVisual'
import styles from './PublicPages.module.css'

export default function ServicesPage(){
  const {data,loading,error}=useAsyncData(()=>api('/api/public/services'),[])
  return <>
    <PageBanner icon={Sparkles} title="Servicios Gatrix" description="Opciones de lavado, estética y protección para mantener tu vehículo en excelentes condiciones." />
    <section className={styles.page}>
      {loading?<LoadingState label="Cargando servicios..."/>:error?<div className={styles.alert}>{error}</div>:!data?.items?.length?<EmptyState title="Servicios no disponibles" description="Pronto encontrarás aquí nuestras opciones de atención."/>:
        <div className={styles.serviceGrid}>{data.items.map((s)=><article className={styles.serviceCard} key={s.id_servicio}>
          <div className={styles.serviceImage}><img src={getServiceImage(s.categoria)} alt={s.nombre}/></div>
          <div className={styles.serviceBody}><span className={styles.serviceCategory}>{s.categoria}</span><h3>{s.nombre}</h3><p>{s.descripcion}</p><div className={styles.serviceMeta}><span><Clock3 size={14}/> {s.duracion_min} min</span><strong>S/ {Number(s.precio).toFixed(2)}</strong></div></div>
        </article>)}</div>}
    </section>
  </>
}
