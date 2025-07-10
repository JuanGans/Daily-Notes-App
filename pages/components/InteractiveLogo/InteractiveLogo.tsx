import React, { useEffect, useRef } from 'react'
import styles from './InteractiveLogo.module.css'

interface InteractiveLogoProps {
  className?: string
  size?: string
  isOpen?: boolean           // Untuk kontrol apakah logo sedang dalam mode terbuka
  toggle?: () => void        // Fungsi toggle sidebar
}

const InteractiveLogo: React.FC<InteractiveLogoProps> = ({
  className = '',
  size = '8px',
  isOpen = true,
  toggle,
}) => {
  const dayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (dayRef.current) {
      dayRef.current.textContent = 'ND'
    }
  }, [])

  return (
    <div
      className={`${className}`}
      onClick={toggle}
      style={{ fontSize: size, cursor: 'pointer' }}
      title="Toggle Sidebar"
    >
      <div className={styles['logo-container-interactive']}>
        <div className={styles['icon-wrapper-interactive']}>
          <div className={styles['notebook-base-interactive']}></div>
          <div className={`${styles['page-interactive']} ${styles['page-3-interactive']}`}></div>
          <div className={`${styles['page-interactive']} ${styles['page-2-interactive']}`}></div>
          <div className={`${styles['page-interactive']} ${styles['page-1-interactive']}`}>
            <div className={styles['top-page-content-interactive']}>
              <div className={styles['calendar-header-interactive']}></div>
              <div className={styles['calendar-day-interactive']} ref={dayRef}></div>
            </div>
          </div>
        </div>

        {/* Tampilkan teks Notes Daily hanya jika sidebar terbuka */}
        {isOpen && (
          <div className={styles['logo-text-interactive']}>Notes Daily</div>
        )}
      </div>
    </div>
  )
}

export default InteractiveLogo
