import styles from './Footer.module.css';

/* 웹사이트 하단 푸터 컴포넌트/ 연락처 정보와 저작권 정보를 표시 */
export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-content']}>
        {/* 왼쪽 섹션: 연락처 정보 */}
        <div className={styles['footer-left']}>
          <span>Contact @likelion_swu</span>
        </div>
        {/* 오른쪽 섹션: 저작권 정보 */}
        <div className={styles['footer-right']}>
          <span>Copyright 2026. LIKELIONSWU 14th All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
