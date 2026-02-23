import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeHeaderBtn } from './HomeHeaderBtn';
import CombinedButton from './CombinedButton';
import logoWhite from '@/assets/icon/logo_white.svg';
import styles from './Header.module.css';
import Modal from '@/components/Modal/Modal';
import ArrowRight from '@/assets/icon/arrow-right.svg';
import ChevronLeftSmall from '@/assets/icon/chevron_left_small.svg';

// 지원폼 전용 헤더
export const ApplyHeader: React.FC = () => {
    const navigate = useNavigate();

    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);
    const [warningOpen, setWarningOpen] = useState(false);
    const [shouldNavigate, setShouldNavigate] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 항상 최신 상태 참조
    const isDirtyRef = useRef(true); // 지원폼 전용이라 무조건 작성 중으로 취급

    useEffect(() => {
        if (shouldNavigate) {
            console.log('useEffect navigate 실행:', shouldNavigate); // 추가
            navigate(shouldNavigate);
            setShouldNavigate(null);
        }
    }, [shouldNavigate, navigate]);

    // 화면 이동 요청
    const requestNavigation = (url: string) => {
        if (isDirtyRef.current) {
            setPendingUrl(url);
            setWarningOpen(true);
            return;
        }
        navigate(url);
    };

    // 메뉴 클릭
    const handleItemClick = (itemId: string) => {
        if (itemId === 'apply') {
            navigate('/apply');
            return;
        }
        if (itemId === 'faq') {
            requestNavigation('/faq');
            return;
        }
        if (itemId === 'projects') {
            requestNavigation('/project-list');
            return;
        }
        setActiveItem(activeItem === itemId ? null : itemId);
    };

    const handleClickOutside = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest(`.${styles['home-header-btn']}`) && !target.closest(`.${styles['nav-item']}`)) {
            setActiveItem(null);
        }
    };

    const handleLeave = () => {
        const url = pendingUrl;

        setWarningOpen(false);
        setPendingUrl(null);

        if (url) {
            window.location.href = url;
        }
    };

    return (
        <>
            <header onClick={handleClickOutside}>

                {/* 모바일 헤더 */}
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
                            onClick={() => requestNavigation('/')}
                        />
                    </div>

                    {/* 오른쪽 지원하기 버튼 */}
                    <button
                        onClick={() => handleItemClick('apply')}
                        className="relative w-[114px] h-8 rounded-[60px] outline outline-1 outline-white/20 flex items-center justify-center gap-2 overflow-hidden"
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
                        transition-transform duration-[700ms] ease-out
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
                                requestNavigation('/');
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
                        <div onClick={() => { setIsMenuOpen(false); requestNavigation('/'); }} className="cursor-pointer">Home</div>
                        <div onClick={() => { setIsMenuOpen(false); requestNavigation('/project-list'); }} className="cursor-pointer">Projects</div>
                        <div onClick={() => { setIsMenuOpen(false); requestNavigation('/faq'); }} className="cursor-pointer">FAQ</div>

                        {/* 지원하기 버튼 */}
                        <button
                            onClick={() => { setIsMenuOpen(false); handleItemClick('apply'); }}
                            className="relative w-fit px-[16px] py-2 rounded-[60px] outline outline-1 outline-white/20 flex items-center gap-2 overflow-hidden"
                            style={{
                                boxShadow:
                                    'inset 2px 2px 8.1px rgba(255,255,255,0.5), inset -10px -10px 8px 2px rgba(255,74,67,0.2)'
                            }}
                        >
                            <div className="absolute w-[676px] h-[676px] -left-[390px] -top-[456px] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(255,0,0,0.34)_0%,rgba(255,0,0,0.03)_100%)] rounded-full" />
                            <span className="relative text-[#BDBDBD] text-xs font-bold">
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

                {/* PC 헤더 (기존 그대로 유지) */}
                <div className="hidden pc:block">
                    <div className={styles.header}>
                        <div className={styles['header-content']}>
                            <div className={`${styles['header-section']} ${styles.left}`}>
                                <div
                                    className={styles['logo-button']}
                                    style={{ height: '58px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                    onClick={() => requestNavigation('/')}
                                >
                                    <HomeHeaderBtn type="logo" LIKELIONSwuLogoLikelionSwu={logoWhite} />
                                </div>
                            </div>

                            <div className={`${styles['header-section']} ${styles.center}`}>
                                <nav className={styles['header-nav']}>
                                    <div className={styles['combined-button-container']}>
                                        <CombinedButton
                                            onProjectsClick={() => handleItemClick('projects')}
                                            onFaqClick={() => handleItemClick('faq')}
                                        />
                                    </div>
                                </nav>
                            </div>

                            <div className={`${styles['header-section']} ${styles.right}`}>
                                <ul className={styles['nav-list']}>
                                    <li className={styles['nav-item']}>
                                        <HomeHeaderBtn
                                            type="label"
                                            length="long"
                                            menu="14기 지원하기"
                                            status={activeItem === 'apply' ? 'active' : 'default'}
                                            onClick={() => handleItemClick('apply')}
                                            className={styles['apply-button']}
                                        />
                                    </li>
                                </ul>
                            </div>
                        </div>
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
                    extraText={
                        <span>
                            지원서 작성을 취소하고, 페이지를 나갈까요?<br />
                            작성된 내용은 저장되지 않습니다.
                        </span>
                    }
                    primaryButton={{ text: '나가기', onClick: handleLeave }}
                    secondaryButton={{
                        text: '지원서로 돌아가기',
                        onClick: () => {
                            setWarningOpen(false);
                            setPendingUrl(null);
                        }
                    }}
                    onClose={() => {
                        setWarningOpen(false);
                        setPendingUrl(null);
                    }}
                />
            )}
        </>
    );
};

export default ApplyHeader;