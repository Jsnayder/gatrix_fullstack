import { Facebook, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import styles from '../../layouts/PublicLayout/PublicLayout.module.css'

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrandBlock}>
          <div className={styles.footerBrand}><img src="/gatrix-logo.png" alt=""/><span>GATRIX CARWASH</span></div>
          <p>Lavado, estética y cuidado vehicular con una atención clara, rápida y profesional.</p>
        </div>
        <div className={styles.footerColumn}>
          <b>Enlaces rápidos</b>
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/servicios">Servicios</NavLink>
          <NavLink to="/tienda">Tienda</NavLink>
          <NavLink to="/reservas">Reservas</NavLink>
        </div>
        <div className={styles.footerColumn}>
          <b>Contacto</b>
          <span><Phone size={15}/> 987 654 321</span>
          <span><Mail size={15}/> contacto@gatrixcarwash.pe</span>
          <span><MapPin size={15}/> Av. Los Ingenieros 456, La Molina</span>
          <div className={styles.socials}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={17}/></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={18}/></a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>© 2026 Gatrix Car Wash · Todos los derechos reservados</div>
    </footer>
  )
}
