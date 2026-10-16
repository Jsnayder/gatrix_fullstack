import { Clock3, ExternalLink, MapPin, Navigation, ParkingCircle } from 'lucide-react'
import PageBanner from '../../components/public/PageBanner'
import styles from './PublicPages.module.css'

const MAP_EMBED_URL = 'https://www.google.com/maps?q=Av.%20Los%20Ingenieros%20456%2C%20La%20Molina%2C%20Lima%2C%20Per%C3%BA&output=embed'
const MAP_LINK_URL = 'https://www.google.com/maps/search/?api=1&query=Av.%20Los%20Ingenieros%20456%2C%20La%20Molina%2C%20Lima%2C%20Per%C3%BA'

export default function LocationPage(){
  return <>
    <PageBanner icon={MapPin} title="Encuéntranos" description="Visítanos y disfruta de una atención organizada para tu vehículo." />
    <section className={styles.page}>
      <div className={styles.locationHero}>
        <div className={styles.locationMainGrid}>
          <div className={styles.locationCard}>
            <span className={styles.locationIcon}><MapPin/></span>
            <div className={styles.locationContent}>
              <span className={styles.locationLabel}>Nuestra ubicación</span>
              <h2>Gatrix Car Wash</h2>
              <p>Av. Los Ingenieros 456, La Molina</p>
              <small>Referencia: zona comercial de fácil acceso.</small>
              <a className={styles.mapButton} href={MAP_LINK_URL} target="_blank" rel="noreferrer">
                <Navigation size={17}/> Abrir en Google Maps <ExternalLink size={15}/>
              </a>
            </div>
          </div>

          <div className={styles.mapCard}>
            <div className={styles.mapHeader}>
              <div>
                <span>Google Maps</span>
                <strong>Cómo llegar a Gatrix</strong>
              </div>
              <MapPin size={22}/>
            </div>
            <iframe
              className={styles.mapFrame}
              src={MAP_EMBED_URL}
              title="Ubicación de Gatrix Car Wash en Google Maps"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        <div className={styles.locationInfoGrid}>
          <article className={styles.infoTile}><Clock3/><div><b>Horario de atención</b><span>Lunes a sábado · 8:00 a. m. – 7:00 p. m.</span></div></article>
          <article className={styles.infoTile}><ParkingCircle/><div><b>Estacionamiento</b><span>Área de ingreso y espera para clientes.</span></div></article>
          <article className={styles.infoTile}><Navigation/><div><b>Cómo llegar</b><span>Consulta la ruta directamente en Google Maps desde el mapa superior.</span></div></article>
        </div>
      </div>
    </section>
  </>
}
