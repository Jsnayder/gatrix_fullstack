import { Link } from 'react-router-dom'
import { CalendarCheck, Clock3, Droplets, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react'
import { api } from '../../services/api'
import { useAsyncData } from '../../hooks/useAsyncData'
import EmptyState from '../../components/feedback/EmptyState'
import { getServiceImage } from '../../utils/serviceVisual'
import styles from './PublicPages.module.css'

export default function HomePage(){
  const { data } = useAsyncData(() => api('/api/public/services'), [])
  const featured = data?.items?.slice(0, 3) ?? []

  return <>
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <span className={styles.eyebrow}><Sparkles size={15}/> Cuidado automotriz profesional</span>
        <h1>El brillo que tu auto <span className={styles.accent}>merece.</span></h1>
        <p className={styles.heroLead}>Lavado, estética y protección vehicular con una atención sencilla desde la reserva hasta la entrega de tu vehículo.</p>
        <div className={styles.heroActions}>
          <Link className={styles.primary} to="/reservas"><CalendarCheck size={17}/> Reservar ahora</Link>
          <Link className={styles.secondary} to="/servicios">Ver servicios</Link>
        </div>
        <div className={styles.heroHighlights}>
          <span><Clock3 size={16}/> Atención organizada</span>
          <span><ShieldCheck size={16}/> Cuidado responsable</span>
          <span><WandSparkles size={16}/> Acabado profesional</span>
        </div>
      </div>
      <div className={styles.heroVisual}>
        <div className={styles.heroCard}>
          <img src="/img/Imagen01.png" alt="Servicio de cuidado automotriz Gatrix"/>
          <div className={styles.heroCardFoot}><b>Gatrix Car Wash</b><span>Reserva · Servicio · Cuidado</span></div>
        </div>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.sectionHead}><span>Experiencia Gatrix</span><h2>Tu vehículo, cuidado de principio a fin</h2><p>Una experiencia pensada para que reservar, elegir un servicio y cuidar tu auto sea rápido y claro.</p></div>
      <div className={styles.featureGrid}>
        <article className={styles.featureCard}><div className={styles.featureIcon}><Droplets/></div><h3>Lavado especializado</h3><p>Opciones para limpieza exterior, interior y mantenimiento según la necesidad de tu vehículo.</p></article>
        <article className={styles.featureCard}><div className={styles.featureIcon}><CalendarCheck/></div><h3>Reserva en línea</h3><p>Elige tu servicio, fecha y hora para organizar tu atención sin llamadas innecesarias.</p></article>
        <article className={styles.featureCard}><div className={styles.featureIcon}><ShieldCheck/></div><h3>Atención confiable</h3><p>Seguimiento ordenado de cada servicio para ofrecer una experiencia clara y profesional.</p></article>
      </div>
    </section>

    <section className={styles.sectionAlt}>
      <div className={styles.sectionHead}><span>Servicios destacados</span><h2>Encuentra el cuidado ideal</h2><p>Revisa las opciones disponibles y elige la que mejor se adapte a tu vehículo.</p></div>
      {!featured.length ? <EmptyState title="Próximamente" description="Estamos preparando nuestra lista de servicios."/> :
        <div className={styles.serviceGrid}>{featured.map((service)=><article className={styles.serviceCard} key={service.id_servicio}>
          <div className={styles.serviceImage}><img src={getServiceImage(service.categoria)} alt={service.nombre}/></div>
          <div className={styles.serviceBody}><span className={styles.serviceCategory}>{service.categoria}</span><h3>{service.nombre}</h3><p>{service.descripcion}</p><div className={styles.serviceMeta}><span><Clock3 size={14}/> {service.duracion_min} min</span><strong>S/ {Number(service.precio).toFixed(2)}</strong></div></div>
        </article>)}</div>}
      <div className={styles.centerAction}><Link className={styles.navyButton} to="/servicios">Ver todos los servicios</Link></div>
    </section>

    <section className={styles.promoSection}>
      <div className={styles.promoCard}>
        <div><span>Cuidado completo</span><h2>¿Listo para renovar el aspecto de tu auto?</h2><p>Reserva tu atención y deja que Gatrix se encargue del resto.</p></div>
        <Link to="/reservas" className={styles.primary}>Agendar atención</Link>
      </div>
    </section>
  </>
}
