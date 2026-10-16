import { PackageOpen } from 'lucide-react'
import styles from './Feedback.module.css'
export default function EmptyState({ title='Aún no hay registros', description='Cuando se agreguen datos aparecerán aquí.' }) {
  return <div className={styles.empty}><PackageOpen size={34}/><h3>{title}</h3><p>{description}</p></div>
}
