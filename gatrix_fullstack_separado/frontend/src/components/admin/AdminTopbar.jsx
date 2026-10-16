import { Bell } from 'lucide-react'
import styles from '../../layouts/AdminLayout/AdminLayout.module.css'

export default function AdminTopbar({ user }) {
  return <header className={styles.topbar}>
    <div className={styles.topbarTitle}><span>Panel de control</span><b>Gestión Gatrix Car Wash</b></div>
    <div className={styles.topActions}>
      <button className={styles.bell} aria-label="Notificaciones"><Bell size={18}/><i/></button>
      <div className={styles.user}><div className={styles.avatar}>{user?.username?.slice(0,1).toUpperCase()}</div><span><b>{user?.username}</b><small>{user?.rol}</small></span></div>
    </div>
  </header>
}
