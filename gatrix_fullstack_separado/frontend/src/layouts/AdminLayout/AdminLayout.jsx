import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminTopbar from '../../components/admin/AdminTopbar'
import styles from './AdminLayout.module.css'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = async () => { await logout(); navigate('/login') }
  return <div className={styles.shell}>
    <AdminSidebar isAdmin={user?.rol==='Administrador'} onLogout={handleLogout}/>
    <section className={styles.content}><AdminTopbar user={user}/><main className={styles.main}><Outlet/></main></section>
  </div>
}
