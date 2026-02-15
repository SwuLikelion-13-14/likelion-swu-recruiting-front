import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/img/14th_home_img.png';
import Layout from '../../components/Layout/Layout';
import styles from './ApplyPage.module.css';
import ApplyBox from '@/components/ApplyBox/ApplyBox'
import chevronRight from '@/assets/icon/chevron_right_small.svg';
import { useEffect } from 'react';


const ApplyPage = () => {

    const navigate = useNavigate();
    useEffect(() => {
        // 목표 시간: 2월 16일 오전 12시 50분
        const targetDate = new Date('2026-02-16T00:55:00');

        const now = new Date();
        const delay = targetDate.getTime() - now.getTime(); // ms 단위

        if (delay > 0) {
            const timer = setTimeout(() => {
                navigate('/faq'); // 목표 시간 이후 페이지 이동
            }, delay);

            return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
        } else {
            // 이미 목표 시간이 지난 경우 바로 이동
            navigate('/faq');
        }
    }, [navigate]);

    return (
        <div
            className={styles.container}
            style={{
                backgroundImage: `url(${backgroundImage})`
            }}
        >
            <Layout>
                <div className={styles.pageWrapper}>
                    {/* 중앙 사각형 박스 */}
                    <ApplyBox />
                    <button className={styles.bottomButton}
                        onClick={() => navigate('/recruit')} >
                        <div className={styles.bottomButtonBg} />
                        <span>14기 아기사자 모집 정보 보기</span>
                        <img src={chevronRight} alt="arrow" className={styles.chevronRight} />
                    </button>
                </div>
            </Layout>
        </div>
    );
};

export default ApplyPage;
