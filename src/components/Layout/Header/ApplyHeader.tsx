import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeHeaderBtn } from './HomeHeaderBtn';
import CombinedButton from './CombinedButton';
import logoWhite from '@/assets/icon/logo_white.svg';
import styles from './Header.module.css';
import Modal from '@/components/Modal/Modal';

// 지원폼 전용 헤더
export const ApplyHeader: React.FC = () => {
    const navigate = useNavigate();

    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);
    const [warningOpen, setWarningOpen] = useState(false);
    const [shouldNavigate, setShouldNavigate] = useState<string | null>(null);


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
            <header className={styles.header} onClick={handleClickOutside}>
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
