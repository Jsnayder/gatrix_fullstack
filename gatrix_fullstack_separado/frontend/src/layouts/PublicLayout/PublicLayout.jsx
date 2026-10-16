import { Outlet } from 'react-router-dom'
import SiteHeader from '../../components/public/SiteHeader'
import SiteFooter from '../../components/public/SiteFooter'
import styles from './PublicLayout.module.css'

export default function PublicLayout() {
  return (
    <div className={styles.shell}>
      <SiteHeader />
      <main className={styles.main}><Outlet /></main>
      <SiteFooter />
    </div>
  )
}
