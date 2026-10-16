import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LogIn, Menu, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import styles from '../../layouts/PublicLayout/PublicLayout.module.css'

const links = [
  ['/', 'Inicio'],
  ['/nosotros', 'Nosotros'],
  ['/ubicacion', 'Ubicación'],
  ['/servicios', 'Servicios'],
  ['/adicionales', 'Adicionales'],
  ['/precios', 'Precios'],
  ['/tienda', 'Tienda'],
  ['/reservas', 'Reservas']
]

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <NavLink to="/" className={styles.brand} aria-label="Gatrix Car Wash - inicio">
          <span className={styles.brandIcon}><img src="/gatrix-logo.png" alt="" /></span>
          <span className={styles.brandCopy}><b>GATRIX CARWASH</b><small>Cuidado automotriz</small></span>
        </NavLink>

        <button className={styles.menuButton} onClick={() => setOpen(value => !value)} aria-label="Abrir menú">
          {open ? <X size={22}/> : <Menu size={22}/>} 
        </button>

        <nav className={`${styles.nav} ${open ? styles.open : ''}`} aria-label="Navegación principal">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? styles.active : ''}>
              {label}
            </NavLink>
          ))}
          <NavLink to="/tienda" onClick={() => setOpen(false)} className={styles.cart} aria-label={`Carrito con ${count} productos`}>
            <ShoppingBag size={17}/><span>{count}</span>
          </NavLink>
          <NavLink to="/login" onClick={() => setOpen(false)} className={styles.login}><LogIn size={16}/> Iniciar sesión</NavLink>
        </nav>
      </div>
    </header>
  )
}
