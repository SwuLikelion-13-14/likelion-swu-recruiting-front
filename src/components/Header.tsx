import React, { useState } from 'react';
import { HomeHeaderBtn } from './HomeHeaderBtn';
import CombinedButton from './CombinedButton';
import logoWhite from '../assets/icon/logo_white.svg';
import styles from './Header.module.css';

// Header 컴포넌트의 props 타입 정의
type HeaderProps = {
  className?: string;
};

/* 왼쪽 메뉴 항목들 (현재는 사용되지 않는데 나중에 처리할게요)
const leftMenuItems = [
  { id: 'projects', label: 'Projects' },
  { id: 'faq', label: 'FAQ' },
];*/

// 오른쪽 메뉴 항목들 (지원하기 버튼)
const rightMenuItems = [
  { id: 'apply', label: '14기 지원하기' },
];

/*웹사이트 상단 헤더 컴포넌트/로고, 네비게이션, 지원하기 버튼 */
export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  // 현재 활성화된 메뉴 아이템의 ID를 저장하는 상태
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // 메뉴 아이템 클릭 핸들러
  const handleItemClick = (itemId: string) => {
    // 이미 활성화된 아이템을 클릭하면 비활성화, 아니면 활성화
    if (activeItem === itemId) {
      setActiveItem(null);
    } else {
      setActiveItem(itemId);
    }
  };

  // 헤더 외부 클릭 시 활성화된 메뉴 닫기
  const handleClickOutside = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // 홈 헤더 버튼이나 네비게이션 아이템 외부를 클릭한 경우에만 활성화 해제
    if (!target.closest(`.${styles['home-header-btn']}`) && !target.closest(`.${styles['nav-item']}`)) {
      setActiveItem(null);
    }
  };

  return (
    // 헤더 컨테이너 - 외부 클릭 감지를 위해 onClick 이벤트 연결
    <header className={`${styles.header} ${className}`} onClick={handleClickOutside}>
      {/* 헤더 내용을 감싸는 래퍼 */}
      <div className={styles['header-content']}>
        {/* 왼쪽 섹션 - 로고 */}
        <div className={`${styles['header-section']} ${styles.left}`}>
          <div className={styles['logo-button']} style={{ height: '58px', display: 'flex', alignItems: 'center' }}>
            {/* 홈 헤더 로고 버튼 */}
            <HomeHeaderBtn
              type="logo"
              LIKELIONSwuLogoLikelionSwu={logoWhite}
              className={styles['logo-button']}
            />
          </div>
        </div>
        
        {/* 중앙 섹션 - 네비게이션 */}
        <div className={`${styles['header-section']} ${styles.center}`}>
          <nav className={styles['header-nav']}>
            <div className={styles['combined-button-container']}>
              {/* 프로젝트/FAQ 결합 버튼 */}
              <CombinedButton 
                onProjectsClick={() => handleItemClick('projects')}
                onFaqClick={() => handleItemClick('faq')}
              />
            </div>
          </nav>
        </div>
        
        {/* 오른쪽 섹션 - 지원하기 버튼 */}
        <div className={`${styles['header-section']} ${styles.right}`}>
          <ul className={styles['nav-list']}>
            {rightMenuItems.map((item) => (
              <li key={item.id} className={styles['nav-item']}>
                {/* 지원하기 버튼 */}
                <HomeHeaderBtn
                  type="label"
                  length="long"
                  menu={item.label}
                  status={activeItem === item.id ? 'active' : 'default'}
                  onClick={() => handleItemClick(item.id)}
                  className={styles['apply-button']}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
