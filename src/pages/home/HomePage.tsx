import backgroundImage from '../../assets/img/14th_home_img.png';
import animatedGif from '../../assets/img/home_background-loop.pink.gif';
import logo from '../../assets/icon/logo_LIKELION UNIV. SWU 14TH.svg';
import chevronRight from '../../assets/icon/chevron_right.svg';
import Layout from '../../components/Layout/Layout';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div 
      className={styles.container}
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      <Layout>
        <div className={styles.content}>
          {/* 로고와 제목을 감싸는 섹션 */}
          <div className={styles.logoSection}>
            {/* 로고 이미지 */}
            <img 
              src={logo} 
              alt="LIKELION UNIV. SWU 14TH" 
              className={styles.logo}
            />
            {/* 메인 타이틀 */}
            <p className={styles.title}>
              잠재된 가능성을 실현시킬 기회
            </p>
          </div>
          
          <div className={styles.mainContent}>
            {/* Cards Section */}
            <div className={styles.cardsSection}>
              {/* Activity Card */}
              <div className={styles.card}>
                <div className={styles.cardBg}>
                  <div className={styles.radialGradient1} />
                  <div className={styles.radialGradient2} />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.cardTitle}>Activity</h3>
                      <p className={styles.cardDescription}>
                        서울여대 멋쟁이사자처럼의 활동을 소개합니다
                      </p>
                    </div>
                    <img 
                      src={chevronRight} 
                      alt="arrow" 
                      className={styles.arrowIcon}
                    />
                  </div>
                </div>
              </div>
              
              {/* Annual Plan Card */}
              <div className={styles.card}>
                <div className={styles.cardBg}>
                  <div className={styles.radialGradient1} />
                  <div className={styles.radialGradient2} />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.cardTitle}>Annual Plan</h3>
                      <p className={styles.cardDescription}>
                        자세한 연간 일정을 확인해 보세요
                      </p>
                    </div>
                    <img 
                      src={chevronRight} 
                      alt="arrow" 
                      className={styles.arrowIcon}
                    />
                  </div>
                </div>
              </div>
              
              {/* 14th Leaders Card */}
              <div className={styles.card}>
                <div className={styles.cardBg}>
                  <div className={styles.radialGradient1} />
                  <div className={styles.radialGradient2} />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.cardTitle}>14th Leaders</h3>
                      <p className={styles.cardDescription}>
                        14기를 이끌어 갈 운영진들을 소개합니다
                      </p>
                    </div>
                    <img 
                      src={chevronRight} 
                      alt="arrow" 
                      className={styles.arrowIcon}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽 GIF with frame */}
            <div className={styles.gifContainer}>
              <div className={styles.glassFrame}>
                <div className={styles.glassGradient1} />
                <div className={styles.glassGradient2} />
                <div className={styles.glassHighlight} />
                <div className={styles.glassReflection} />
                <img 
                  src={animatedGif} 
                  alt="Star Icon" 
                  className={styles.animatedGif}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default HomePage;
