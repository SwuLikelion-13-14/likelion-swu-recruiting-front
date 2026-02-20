import backgroundImage from '../../assets/img/14th_home_img.png';
import Layout from '../../components/Layout/Layout';
import styles from './ApplyPage.module.css';
import ApplyBox from '@/components/ApplyBox/ApplyBox'
import RecruitInfoButton from '@/components/ActivityContent/RecruitInfoButton';

const ApplyPage = () => {
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
                    <RecruitInfoButton />
                </div>
            </Layout>
        </div>
    );
};

export default ApplyPage;
