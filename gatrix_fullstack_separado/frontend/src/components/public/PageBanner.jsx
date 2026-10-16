import styles from '../../layouts/PublicLayout/PublicLayout.module.css'

export default function PageBanner({ icon: Icon, title, description }) {
  return (
    <section className={styles.pageBanner}>
      <div className={styles.pageBannerInner}>
        {Icon && <span className={styles.pageBannerIcon}><Icon size={24}/></span>}
        <div><h1>{title}</h1>{description && <p>{description}</p>}</div>
      </div>
    </section>
  )
}
