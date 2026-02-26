import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/img/14th_home_img.png';
import Layout from '../../components/Layout/Layout';
import styles from './ApplyPage.module.css';
import ApplyBox from '@/components/ApplyBox/ApplyBox'
import chevronRight from '@/assets/icon/chevron_right_small.svg';


const ApplyPage = () => {

const navigate = useNavigate();
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
