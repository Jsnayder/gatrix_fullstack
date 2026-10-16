import { Gem, Gift, ShieldCheck, Sparkles } from 'lucide-react'
import PageBanner from '../../components/public/PageBanner'
import styles from './PublicPages.module.css'

const extras = [
  { image:'/img/Imagen07.png', icon:ShieldCheck, title:'Protección y acabado', text:'Opciones de cuidado para conservar el brillo y proteger la superficie del vehículo.' },
  { image:'/img/Imagen08.png', icon:Sparkles, title:'Limpieza de tapicería', text:'Cuidado interior pensado para asientos, superficies y zonas de uso frecuente.' },
  { image:'/img/Imagen09.png', icon:Gift, title:'Promociones especiales', text:'Revisa nuestras campañas y beneficios disponibles durante la temporada.' },
  { image:'/img/Imagen10.png', icon:Gem, title:'Experiencia Gatrix', text:'Complementos pensados para hacer más cómoda tu visita mientras atendemos tu vehículo.' }
]

export default function AdditionalPage(){
  return <>
    <PageBanner icon={Gem} title="Adicionales y promociones" description="Complementa tu servicio con opciones pensadas para el cuidado y comodidad." />
    <section className={styles.page}>
      <div className={styles.galleryGrid}>{extras.map(item=>{const Icon=item.icon; return <article className={styles.galleryCard} key={item.title}><img src={item.image} alt={item.title}/><div><span className={styles.galleryIcon}><Icon size={17}/></span><h3>{item.title}</h3><p>{item.text}</p></div></article>})}</div>
    </section>
  </>
}
