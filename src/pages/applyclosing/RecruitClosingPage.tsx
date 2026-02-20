import backgroundImage from '../../assets/img/14th_recruit_background.png';
import Layout from '../../components/Layout/Layout';
import styles from './RecruitClosingPage.module.css';
import Banner from '../../components/ActivityContent/Banner'

const RecruitClosingPage = () => {
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
                        <p className={styles.text1}>현재는 14기 아기사자 모집이 완료되었습니다.</p>
                        <p className={styles.text2}>2027년 15기 아기사자 모집을 기다려주세요.</p>
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

export default RecruitClosingPage;