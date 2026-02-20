import backgroundImage from '../../assets/img/14th_recruit_background.png';
import Layout from '../../components/Layout/Layout';
import styles from './RecruitClosingPage.module.css';
import Banner from '../../components/ActivityContent/Banner'

const BeforeResultPage = () => {
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
                        line1="결과가 아직 발표되지 않았습니다."
                        line2="서울여대 멋쟁이사자처럼 14기 아기사자 모집 마감"
                    />

                    {/* 텍스트 3줄 */}
                    <div className={styles.textGroup}>
                        <p className={styles.textLine1}>최종 결과 발표는</p>
                        <p className={styles.textLine2}>
                            <span className={styles.orangeText}>3월 9일 10시</span>
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
                </div>
            </Layout>
        </div>
    );
};

export default BeforeResultPage;