import { NavLink } from 'react-router-dom'
import { CalendarDays, CircleDollarSign, ClipboardList, LayoutDashboard, LogOut, PackageSearch, ShieldCheck, UsersRound } from 'lucide-react'
import styles from '../../layouts/AdminLayout/AdminLayout.module.css'

const mainNav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Inicio', end: true },
  { to: '/admin/clientes', icon: UsersRound, label: 'Clientes' },
  { to: '/admin/atencion', icon: ClipboardList, label: 'Atención' },
  { to: '/admin/almacen', icon: PackageSearch, label: 'Almacén' },
  { to: '/admin/finanzas', icon: CircleDollarSign, label: 'Finanzas' },
  { to: '/admin/reservas', icon: CalendarDays, label: 'Reservas' }
]

function NavigationLink({ item }) {
  const Icon = item.icon
  return <NavLink to={item.to} end={item.end} className={({isActive})=>isActive?styles.active:''}><span className={styles.navIcon}><Icon size={19}/></span><span>{item.label}</span></NavLink>
}

export default function AdminSidebar({ isAdmin, onLogout }) {
  return <aside className={styles.sidebar}>
    <NavLink className={styles.brand} to="/admin">
      <span className={styles.brandLogo}><img src="/gatrix-logo.png" alt=""/></span>
      <div><b>GATRIX</b><small>CARWASH</small></div>
    </NavLink>
    <div className={styles.sideCaption}>Operaciones</div>
    <nav className={styles.nav}>{mainNav.map(item=><NavigationLink key={item.to} item={item}/>)}</nav>
    {isAdmin && <><div className={styles.sideCaption}>Administración</div><nav className={styles.nav}><NavigationLink item={{to:'/admin/usuarios',icon:ShieldCheck,label:'Usuarios'}}/></nav></>}
    <div className={styles.sidebarFooter}>
      <button className={styles.logout} onClick={onLogout}><LogOut size={18}/><span>Cerrar sesión</span></button>
      <small>Gatrix Car Wash · 2026</small>
    </div>
  </aside>
}
