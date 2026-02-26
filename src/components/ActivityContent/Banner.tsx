import styles from './Banner.module.css'

interface BannerProps {
  line1: string  // 첫 번째 줄
  line2: string  // 두 번째 줄
  sameStyle?: boolean   
  className?: string   
}

const Banner = ({ line1, line2, sameStyle = false, className }: BannerProps) => {
  return (
     <div className={`${styles.banner} ${className ?? ''}`}>
      <p className={styles.line1}>{line1}</p>
      <p className={sameStyle ? styles.line1 : styles.line2}>
        {line2}
      </p>
    </div>
  )
}

export default Banner
