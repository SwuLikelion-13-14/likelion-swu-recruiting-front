import React, { useState, useRef } from 'react';
import './CombinedButton.css';

// CombinedButton 컴포넌트의 props 타입 정의
type CombinedButtonProps = {
  onProjectsClick?: () => void;
  onFaqClick?: () => void;
};

// Projects와 FAQ를 하나의 버튼으로 결합한 컴포넌트
// 왼쪽 클릭 시 프로젝트, 오른쪽 클릭 시 FAQ로 동작
const CombinedButton: React.FC<CombinedButtonProps> = ({ onProjectsClick, onFaqClick }) => {
  // 마우스 호버 상태를 관리하는 상태 (왼쪽/오른쪽)
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);
  // 버튼 요소에 대한 참조
  const buttonRef = useRef<HTMLDivElement>(null);

  // 마우스 이동 이벤트 핸들러
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    
    // 버튼 내에서의 마우스 x 좌표 계산
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // 요소 내에서의 x 좌표
    const width = rect.width;
    
    // 마우스가 버튼의 왼쪽/오른쪽 중 어디에 있는지에 따라 상태 업데이트
    if (x < width / 2) {
      setHoverSide('left');
    } else {
      setHoverSide('right');
    }
  };

  // 마우스가 버튼을 벗어났을 때 호버 상태 초기화
  const handleMouseLeave = () => {
    setHoverSide(null);
  };

  // 버튼 클릭 이벤트 핸들러
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    
    // 클릭한 위치가 버튼의 왼쪽인지 오른쪽인지 확인
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // 클릭한 위치에 따라 다른 핸들러 호출
    if (x < width / 2) {
      onProjectsClick?.(); // 왼쪽 클릭 시 프로젝트 핸들러 호출
    } else {
      onFaqClick?.(); // 오른쪽 클릭 시 FAQ 핸들러 호출
    }
  };

  return (
    <div 
      ref={buttonRef}
      className={`combined-button ${hoverSide ? `hover-${hoverSide}` : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* 왼쪽 Projects 텍스트 - 호버 시 active 클래스 추가 */}
      <span className={`label ${hoverSide === 'left' ? 'active' : ''}`}>Projects</span>
      {/* 구분선 */}
      <span className="divider"></span>
      {/* 오른쪽 FAQ 텍스트 - 호버 시 active 클래스 추가 */}
      <span className={`text-wrapper ${hoverSide === 'right' ? 'active' : ''}`}>FAQ</span>
    </div>
  );
};

export default CombinedButton;
