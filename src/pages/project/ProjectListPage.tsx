import React from 'react';
import backgroundImage from '../../assets/img/14th_home_img.png';
import Layout from '../../components/Layout/Layout';
import styles from './ProjectList.module.css';

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
          
          {/* 프로젝트 리스트가 들어갈 부분 */}
          <div className={styles.projectList}>
            {/* 프로젝트 아이템*/}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default ProjectListPage;