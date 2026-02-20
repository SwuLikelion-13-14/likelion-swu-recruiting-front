import backgroundImage from '../../assets/img/14th_recruit_background.png';
import Layout from '../../components/Layout/Layout';
import styles from './RecruitClosingPage.module.css';
import Banner from '../../components/ActivityContent/Banner'
import RecruitInfoButton from '@/components/ActivityContent/RecruitInfoButton';

const ApplyEndPage = () => {
    return (
        <div
            className={styles.container}
            style={{
                backgroundImage: `url(${backgroundImage})`,
            }}
        >
            <Layout>
                <div className={styles.centerContent}>
                    {/* 배너 */}
                    <Banner
                        line1="14기 아기사자 모집 마감"
                        line2="지금은 모집 기간이 아닙니다."
                    />

                    {/* 텍스트 3줄 */}
                    <div className={styles.textGroup}>
                        <p className={styles.textLine1}>1차 서류 결과 발표는</p>
                        <p className={styles.textLine2}>
                            <span className={styles.orangeText}>3월 4일 10시</span>
                            <span className={styles.whiteText}>에 발표됩니다.</span>
                        </p>
                    </div>
                    <p className={styles.textinsta}>
                        <span className={styles.keyword}>문의</span>
                        <span className={styles.middleText}>서울여대 멋쟁이사자처럼 인스타그램</span>
                        <a
                            href="https://www.instagram.com/likelion_swu?igsh=MWZ4ZmVldmg2eTBkag=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.instagram}
                        >@likelion_swu</a>
                    </p>

                    <RecruitInfoButton />

                </div>
            </Layout>
        </div>
    );
};

export default ApplyEndPage;