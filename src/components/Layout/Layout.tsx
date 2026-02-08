import { Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import styles from './Layout.module.css';

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div 
      className={styles.layoutContainer}
    >
      <Header />
      
      {/* 본문 영역: children이 있으면 children을, 없으면 Outlet을 렌더링 */}
      <main className={styles.mainContent}>
        {children || <Outlet />}
      </main>

      <div className={styles.footerContainer}>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;