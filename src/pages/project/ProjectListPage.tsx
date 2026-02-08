import React from 'react';
import backgroundImage from '../../assets/img/14th_home_img.png';
import Layout from '../../components/Layout/Layout';
import styles from './ProjectList.module.css';
import ChevronUp from '../../assets/icon/chevron_up.svg';

const ProjectListPage: React.FC = () => {
  return (
    <div 
      className={styles.container}
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      <Layout>
        <div className={styles.content}>
          <div className={styles.titleSection}>
            <h1>Projects</h1>
            <div className={styles.subtitle}>
              서울여대 멋쟁이사자처럼의 프로젝트들을 소개합니다
            </div>
          </div>
          
          {/* 프로젝트 섹션 */}
          <div className={styles.projectsContainer}>
            {/* 13th Projects */}
<div className={styles.projectSection}>
  <div className={`${styles.projectContent} ${styles.project13}`}>
    <div className={styles.titleContainer}>
      <h2 className={styles.projectTitle}>13th Projects</h2>
      <div className={styles.chevronContainer}>
        <img src={ChevronUp} alt="Toggle projects" className={styles.chevronIcon} />
      </div>
    </div>
    {/* 13th 프로젝트 아이템들이 들어갈 자리 */}
  </div>
</div>
            
            {/* 12th Projects */}
<div className={styles.projectSection}>
  <div className={`${styles.projectContent} ${styles.project12}`}>
    <div className={styles.titleContainer}>
      <h2 className={styles.projectTitle}>12th Projects</h2>
      <div className={styles.chevronContainer}>
        <img src={ChevronUp} alt="Toggle projects" className={styles.chevronIcon} />
      </div>
    </div>
    {/* 12th 프로젝트 아이템들이 들어갈 자리 */}
  </div>
</div>
            
            {/* 11th Projects */}
<div className={styles.projectSection}>
  <div className={`${styles.projectContent} ${styles.project11}`}>
    <div className={styles.titleContainer}>
      <h2 className={styles.projectTitle}>11th Projects</h2>
      <div className={styles.chevronContainer}>
        <img src={ChevronUp} alt="Toggle projects" className={styles.chevronIcon} />
      </div>
    </div>
    {/* 11th 프로젝트 아이템들이 들어갈 자리 */}
  </div>
</div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default ProjectListPage;