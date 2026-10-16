import { CheckCircle2, Heart, Medal, Sparkles, UsersRound } from 'lucide-react'
import PageBanner from '../../components/public/PageBanner'
import styles from './PublicPages.module.css'

export default function AboutPage(){
  return <>
    <PageBanner icon={UsersRound} title="Nuestra historia" description="Pasión por el cuidado automotriz y una atención que busca marcar la diferencia." />
    <section className={styles.page}>
      <div className={styles.split}>
        <div className={styles.imagePanel}><img src="/img/Imagen01.png" alt="Gatrix Car Wash"/></div>
        <div className={styles.textPanel}>
          <span className={styles.kicker}>Sobre Gatrix</span>
          <h2>Brillo, protección y cuidado en cada detalle</h2>
          <p>Gatrix Car Wash nace con la idea de ofrecer una experiencia de cuidado vehicular más ordenada, cómoda y profesional. Cada atención busca combinar un buen servicio con procesos claros para el cliente.</p>
          <p>Trabajamos para que cada visita sea sencilla: eliges el servicio, reservas tu horario y nosotros nos encargamos del cuidado de tu vehículo.</p>
          <div className={styles.bulletList}>
            <div className={styles.bullet}><CheckCircle2 size={18}/> Atención clara desde la reserva hasta la entrega.</div>
            <div className={styles.bullet}><CheckCircle2 size={18}/> Servicios organizados para distintas necesidades.</div>
            <div className={styles.bullet}><CheckCircle2 size={18}/> Cuidado responsable de cada vehículo.</div>
          </div>
        </div>
      </div>
      <div className={styles.sectionHead}><span>Nuestros valores</span><h2>Lo que nos representa</h2></div>
      <div className={styles.featureGrid}>
        <article className={styles.featureCard}><div className={styles.featureIcon}><Medal/></div><h3>Calidad</h3><p>Cuidamos los detalles para entregar una experiencia consistente y profesional.</p></article>
        <article className={styles.featureCard}><div className={styles.featureIcon}><Sparkles/></div><h3>Innovación</h3><p>Buscamos mejorar continuamente la forma en que atendemos y cuidamos cada vehículo.</p></article>
        <article className={styles.featureCard}><div className={styles.featureIcon}><Heart/></div><h3>Compromiso</h3><p>Tratamos cada auto con responsabilidad y respeto por el tiempo de nuestros clientes.</p></article>
      </div>
    </section>
  </>
}
