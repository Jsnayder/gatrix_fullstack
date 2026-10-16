import styles from './Feedback.module.css'
export default function LoadingState({ label='Cargando...', fullScreen=false }) {
  return <div className={`${styles.state} ${fullScreen ? styles.full : ''}`}><span className={styles.spinner}/><p>{label}</p></div>
}
