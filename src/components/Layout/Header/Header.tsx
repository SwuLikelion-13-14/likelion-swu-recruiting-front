import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeHeaderBtn } from './HomeHeaderBtn';
import CombinedButton from './CombinedButton';
import logoWhite from '@/assets/icon/logo_white.svg';
import ArrowRight from '@/assets/icon/arrow-right.svg';
import styles from './Header.module.css';
import ChevronLeftSmall from '@/assets/icon/chevron_left_small.svg';

// Header 컴포넌트의 props 타입 정의
type HeaderProps = {
  className?: string;
  onNavigate?: (url: string) => void; // ← 핵심
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
  const navigate = useNavigate();
  // 현재 활성화된 메뉴 아이템의 ID를 저장하는 상태
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 메뉴 아이템 클릭 핸들러
  const handleItemClick = (itemId: string) => {
    // 지원하기 버튼 클릭 시 /front로 이동
    if (itemId === 'apply') {
      navigate('/apply');
      return;
    }

    // FAQ 버튼 클릭 시 /faq로 이동
    if (itemId === 'faq') {
      navigate('/faq');
      return;
    }

    // Projects 버튼 클릭 시 /project로 이동
    if (itemId === 'projects') {
      navigate('/project-list');
      return;
    }

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
    <header className={className} onClick={handleClickOutside}>

      {/* 모바일 헤더 (ApplyHeader와 동일 구조) */}
      <div className="pc:hidden w-full px-4 py-[14px] flex items-center justify-between bg-gradient-to-b from-black/75 to-black/0 backdrop-blur-[6px]">

        {/* 왼쪽 (햄버거 + 로고) */}
        <div className="flex items-center gap-2">
          {/* 햄버거 */}
          <button className="w-8 h-8 flex flex-col justify-center items-center gap-[4px]" onClick={() => setIsMenuOpen(true)}>
            <span className="w-4 h-[2px] bg-[#BDBDBD]" />
            <span className="w-4 h-[2px] bg-[#BDBDBD]" />
            <span className="w-4 h-[2px] bg-[#BDBDBD]" />
          </button>

          {/* 로고 */}
          <img
            src={logoWhite}
            alt="logo"
            className="w-[102px] h-[14px] object-contain cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>

        {/* 오른쪽 지원하기 버튼 */}
        <button
          onClick={() => handleItemClick('apply')}
          className="relative w-[124px] h-8 rounded-[60px] outline outline-1 outline-white/20 flex items-center justify-center gap-2 overflow-hidden"
          style={{
            boxShadow:
              'inset 2px 2px 8.1px rgba(255,255,255,0.5), inset -10px -10px 8px 2px rgba(255,74,67,0.2)'
          }}
        >
          {/* radial glow */}
          <div className="absolute w-[676px] h-[676px] -left-[390px] -top-[456px] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(255,0,0,0.34)_0%,rgba(255,0,0,0.03)_100%)] rounded-full" />

          <span className="relative text-[#BDBDBD] text-xs font-bold">
            14기 지원하기
          </span>

          {/* 화살표 */}
          <img src={ArrowRight} alt="arrow" className="w-4 h-4" />
        </button>
      </div>

      {/* 모바일 슬라이드 메뉴 */}
      <div
        className={`
          fixed top-0 left-0
          h-screen
          bg-black
          z-50
          w-[calc(100vw-100px)] max-w-[340px]
          transition-transform duration-[500ms] ease-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
       `}
      >
        {/* 상단 */}
        <div className="flex items-center justify-between px-4 py-[14px]">
          <img
            src={logoWhite}
            alt="logo"
            className="w-[102px] h-[14px]"
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/');
            }}
          />
          <img
            src={ChevronLeftSmall}
            alt="close"
            className="w-[10px] h-[26px] cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          />
        </div>

        {/* 메뉴 목록 */}
        <div className="flex flex-col gap-[30px] px-5 mt-[40px] text-white text-[20px] font-semibold">
          <div
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/');
            }}
            className="cursor-pointer"
          >
            Home
          </div>

          <div
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/project-list');
            }}
            className="cursor-pointer"
          >
            Projects
          </div>

          <div
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/faq');
            }}
            className="cursor-pointer"
          >
            FAQ
          </div>

          {/* 지원하기 버튼 */}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/apply');
            }}
            className="relative w-fit px-[16px] py-2 rounded-[60px] outline outline-1 outline-white/20 flex items-center gap-2 overflow-hidden mt-4"
            style={{
              boxShadow:
                'inset 2px 2px 8.1px rgba(255,255,255,0.5), inset -10px -10px 8px 2px rgba(255,74,67,0.2)'
            }}
          >
            <div className="absolute w-[676px] h-[676px] -left-[390px] -top-[456px] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(255,0,0,0.34)_0%,rgba(255,0,0,0.03)_100%)] rounded-full" />
            <span className="relative z-10 text-[#BDBDBD] text-[14px] font-bold">
              14기 지원하기
            </span>
            <img
              src={ArrowRight}
              alt="arrow"
              className="relative z-10 w-4 h-4"
            />
          </button>
        </div>
      </div>


      {/* ✅ PC 헤더 (기존 그대로 유지) */}
      <div className="hidden pc:block">
        {/* 헤더 컨테이너 - 외부 클릭 감지를 위해 onClick 이벤트 연결 */}
        <div className={`${styles.header}`}>

          {/* 헤더 내용을 감싸는 래퍼 */}
          <div className={styles['header-content']}>

            {/* 왼쪽 섹션 - 로고 */}
            <div className={`${styles['header-section']} ${styles.left}`}>
              <div
                className={styles['logo-button']}
                style={{ height: '58px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => navigate('/')}
              >
                {/* 홈 헤더 로고 버튼 - 클릭 시 홈으로 이동 */}
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
        </div>
      </div>

    </header>
  );
};

export default Header;