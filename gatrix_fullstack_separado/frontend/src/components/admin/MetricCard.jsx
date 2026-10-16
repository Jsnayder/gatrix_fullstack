import styles from './MetricCard.module.css'

export default function MetricCard({ icon: Icon, label, value, helper, tone = 'blue' }) {
  return (
    <article className={`${styles.card} ${styles[tone]}`}>
      <div className={styles.icon}><Icon size={23} strokeWidth={2}/></div>
      <div className={styles.body}>
        <span>{label}</span>
        <strong>{value}</strong>
        {helper && <small>{helper}</small>}
      </div>
    </article>
  )
}
