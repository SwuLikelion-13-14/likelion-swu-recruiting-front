import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeHeaderBtn } from './HomeHeaderBtn';
import CombinedButton from './CombinedButton';
import logoWhite from '@/assets/icon/logo_white.svg';
import styles from './Header.module.css';
import Modal from '@/components/Modal/Modal'
import { useNavigationGuard } from '@/contexts/NavigationGuardContext'


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
export const Header: React.FC<HeaderProps> = ({
  className = '',
  onNavigate //  받기
}) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // 폼 페이지에서만 화면 이동 제한
  const requestNavigation = (url: string) => {
    if (isDirty) {
      setPendingUrl(url)
      setWarningOpen(true)
      return
    }

    navigate(url)
  }

  const { isDirty, validateDraft, setDirty } = useNavigationGuard()
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const [warningOpen, setWarningOpen] = useState(false)
  const [draftStep1Open, setDraftStep1Open] = useState(false)
  const [draftStep2Open, setDraftStep2Open] = useState(false)


  // 메뉴 아이템 클릭 핸들러
  const handleItemClick = (itemId: string) => {
    // 지원하기 버튼 클릭 시 /front로 이동
    if (itemId === 'apply') {
      requestNavigation('/front');
      return;
    }

    // FAQ 버튼 클릭 시 /faq로 이동
    if (itemId === 'faq') {
      requestNavigation('/faq');
      return;
    }

    // Projects 버튼 클릭 시 /project로 이동
    if (itemId === 'projects') {
      requestNavigation('/project-list');
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
    <>

      <header className={`${styles.header} ${className}`} onClick={handleClickOutside}>
        {/* 헤더 내용을 감싸는 래퍼 */}
        <div className={styles['header-content']}>
          {/* 왼쪽 섹션 - 로고 */}
          <div className={`${styles['header-section']} ${styles.left}`}>
            <div
              className={styles['logo-button']}
              style={{ height: '58px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => requestNavigation('/')}
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
      </header>
      {warningOpen && (
        <Modal
          isOpen={warningOpen}
          title="WARNING"
          description={
            <span>
              페이지를 나가면<br />
              작성 중인 지원서는 저장되지 않습니다.
            </span>
          }
          extraText="현재까지 작성한 내용을 임시 저장 할까요?"
          primaryButton={{
            text: '임시저장',
            onClick: () => {
              const ok = validateDraft()

              if (!ok) {
                setWarningOpen(false)
                return
              }

              setWarningOpen(false)
              setDraftStep1Open(true)
            }
          }}
          secondaryButton={{
            text: '돌아가기',
            onClick: () => setWarningOpen(false)
          }}
          onClose={() => setWarningOpen(false)}
        />
      )}

      {draftStep1Open && (
        <Modal
          isOpen={draftStep1Open}
          title="임시 저장"
          description="지원서를 임시 저장할까요?"
          extraText={
            <span>
              3월 2일 23시 59분 까지 열람 및 수정이 가능합니다.<br /><br/>
              ‘임시 저장’ 상태의 지원서는 검토 과정에서 인정되지 않습니다.<br/>
              반드시 ‘최종 제출’을 눌러 지원서를 제출해 주세요.
            </span>
          }
          primaryButton={{
            text: '임시저장',
            onClick: () => {
              setDraftStep1Open(false)
              setDraftStep2Open(true)
            }
          }}
          secondaryButton={{
            text: '취소',
            onClick: () => setDraftStep1Open(false)
          }}
        />
      )}
      {draftStep2Open && (
        <Modal
          isOpen={draftStep2Open}
          title="지원서가 임시 저장되었습니다"
          extraText={
            <span>
              저장된 지원서는<br />
              3월 2일 23시 59분 까지<br/>
              열람 및 수정이 가능합니다.
            </span>
          }
          primaryButton={{
            text: '확인',
            onClick: () => {
              setDraftStep2Open(false)
              setDirty(false)
              navigate('/')
            }
          }}
        />
      )}


    </>
  )

};

export default Header;
