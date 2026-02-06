import React from 'react';
import './HomeHeaderBtn.css';

/* HomeHeaderBtn 컴포넌트의 props 타입 정의/ 로고 또는 텍스트 라벨을 표시하는 다용도 버튼 컴포넌트 */
type HomeHeaderBtnProps = {
  className?: string;              //추가적인 CSS 클래스
  length?: 'short' | 'long';       //버튼 길이 (짧게/길게)
  status?: 'default' | 'hover' | 'active';  //버튼 상태
  type: 'logo' | 'label';          //버튼 타입 (로고 또는 텍스트 라벨)
  LIKELIONSwuLogoIconSwuLogo?: string;  //SWU 로고 아이콘 이미지 경로
  LIKELIONSwuLogoLikelionSwu?: string;  //LIKELION SWU 로고 텍스트 이미지 경로
  menu?: string;                   //메뉴 텍스트 (첫 번째)
  menu2?: string;                  //메뉴 텍스트 (두 번째, 선택사항)
  onClick?: () => void;            //클릭 이벤트 핸들러
};

/* 홈 헤더에 사용되는 버튼 컴포넌트 로고 또는 텍스트 라벨을 표시하며, 클릭 가능한 인터랙티브 요소 */
export const HomeHeaderBtn: React.FC<HomeHeaderBtnProps> = ({
  className = '',            // 추가 CSS 클래스
  length = 'short',          // 기본값: 짧은 길이
  status = 'default',        // 기본 상태: 기본
  type,                     // 필수: 버튼 타입 (로고 또는 라벨)
  LIKELIONSwuLogoIconSwuLogo, // SWU 로고 아이콘
  LIKELIONSwuLogoLikelionSwu, // LIKELION SWU 로고 텍스트
  menu,                     // 메인 메뉴 텍스트
  menu2,                    // 서브 메뉴 텍스트 (선택사항)
  onClick,                  // 클릭 핸들러
}) => {
  // 버튼 클래스 동적 생성
  const buttonClasses = [
    'home-header-btn',                     // 기본 클래스
    `home-header-btn-${length}`,           // 길이에 따른 클래스 (short/long)
    status === 'active' ? 'home-header-btn-active' : '',  // 활성 상태 클래스
    className,                             // 추가 클래스
  ].filter(Boolean).join(' ');             // 빈 문자열 제거 후 공백으로 연결

  // 로고 타입 버튼 렌더링
  if (type === 'logo') {
    return (
      <div className={buttonClasses}>
        {/* SWU 로고 아이콘 */}
        {LIKELIONSwuLogoIconSwuLogo && (
          <img 
            className="logo-icon" 
            alt="SWU Logo" 
            src={LIKELIONSwuLogoIconSwuLogo} 
          />
        )}
        {/* LIKELION SWU 로고 텍스트 */}
        {LIKELIONSwuLogoLikelionSwu && (
          <img 
            className="logo-text" 
            alt="LIKELION SWU" 
            src={LIKELIONSwuLogoLikelionSwu} 
          />
        )}
      </div>
    );
  }

  // 라벨 타입 버튼 렌더링
  return (
    <button 
      className={buttonClasses}
      onClick={onClick}
    >
      <span className="button-text">{menu || 'menu'}</span>
      {menu2 && <span className="button-text">{menu2}</span>}
    </button>
  );
};

export default HomeHeaderBtn;
