import React, { useState } from 'react';
import backgroundImage from '../../assets/img/14th_home_img.png';
import Layout from '../../components/Layout/Layout';
import styles from './ProjectList.module.css';
import ChevronUp from '../../assets/icon/chevron_up.svg';

const ProjectListPage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    '13th': true,
    '12th': true,
    '11th': true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
              <div className={`${styles.projectContent} ${styles.project13} ${!expandedSections['13th'] ? styles.collapsed : ''}`}>
                <div 
                  className={styles.titleContainer} 
                  onClick={() => toggleSection('13th')}
                >
                  <h2 className={styles.projectTitle}>13th Projects</h2>
                  <div className={styles.chevronContainer}>
                    <img 
                      src={ChevronUp} 
                      alt="Toggle projects" 
                      className={`${styles.chevronIcon} ${!expandedSections['13th'] ? styles.rotated : ''}`} 
                    />
                  </div>
                </div>
                {expandedSections['13th'] && (
                  <>
                    <div className={styles.filterBar}>
                      <label className={styles.filterItem}>
                        <input type="checkbox" className={styles.checkbox} />
                        <span>여기톤 대비 토이 프로젝트</span>
                      </label>
                      <div className={styles.filterSpacer} />
                      <label className={styles.filterItem}>
                        <input type="checkbox" className={styles.checkbox} />
                        <span>중앙 해커톤</span>
                      </label>
                      <div className={styles.filterSpacer} />
                      <label className={styles.filterItem}>
                        <input type="checkbox" className={styles.checkbox} />
                        <span>슈멋사 프로젝트</span>
                      </label>
                    </div>
                    <div className={styles.projectsGrid}>
                      {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={`13th-${item}`} className={styles.projectCard}>
                          <div className={styles.projectImage}>
                            {/* Project image 나중에 추가 */}
                          </div>
                          <div className={styles.projectInfo}>
                            <div className={styles.projectFilter}>
                              {['여기톤 대비 토이 프로젝트', '중앙 해커톤', '슈멋사 프로젝트'][(item - 1) % 3]}
                            </div>
                            <h3>프로젝트 제목 {item}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* 12th Projects */}
            <div className={styles.projectSection}>
              <div className={`${styles.projectContent} ${styles.project12} ${!expandedSections['12th'] ? styles.collapsed : ''}`}>
                <div 
                  className={styles.titleContainer} 
                  onClick={() => toggleSection('12th')}
                >
                  <h2 className={styles.projectTitle}>12th Projects</h2>
                  <div className={styles.chevronContainer}>
                    <img 
                      src={ChevronUp} 
                      alt="Toggle projects" 
                      className={`${styles.chevronIcon} ${!expandedSections['12th'] ? styles.rotated : ''}`} 
                    />
                  </div>
                </div>
                {expandedSections['12th'] && (
                  <>
                    <div className={styles.filterBar}>
                      <label className={styles.filterItem}>
                        <input type="checkbox" className={styles.checkbox} />
                        <span>여기톤 대비 토이 프로젝트</span>
                      </label>
                      <div className={styles.filterSpacer} />
                      <label className={styles.filterItem}>
                        <input type="checkbox" className={styles.checkbox} />
                        <span>중앙 해커톤</span>
                      </label>
                      <div className={styles.filterSpacer} />
                      <label className={styles.filterItem}>
                        <input type="checkbox" className={styles.checkbox} />
                        <span>슈멋사 프로젝트</span>
                      </label>
                    </div>
                    <div className={styles.projectsGrid}>
                      {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={`12th-${item}`} className={styles.projectCard}>
                          <div className={styles.projectImage}>
                            {/* Project image 나중에 추가*/}
                          </div>
                          <div className={styles.projectInfo}>
                            <div className={styles.projectFilter}>
                              {['여기톤 대비 토이 프로젝트', '중앙 해커톤', '슈멋사 프로젝트'][(item - 1) % 3]}
                            </div>
                            <h3>프로젝트 제목 {item}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* 11th Projects */}
            <div className={styles.projectSection}>
              <div className={`${styles.projectContent} ${styles.project11} ${!expandedSections['11th'] ? styles.collapsed : ''}`}>
                <div 
                  className={styles.titleContainer} 
                  onClick={() => toggleSection('11th')}
                >
                  <h2 className={styles.projectTitle}>11th Projects</h2>
                  <div className={styles.chevronContainer}>
                    <img 
                      src={ChevronUp} 
                      alt="Toggle projects" 
                      className={`${styles.chevronIcon} ${!expandedSections['11th'] ? styles.rotated : ''}`} 
                    />
                  </div>
                </div>
                {expandedSections['11th'] && (
                  <>
                    <div className={styles.filterBar}>
                      <label className={styles.filterItem}>
                        <input type="checkbox" className={styles.checkbox} />
                        <span>중앙 해커톤</span>
                      </label>
                      <div className={styles.filterSpacer} />
                      <label className={styles.filterItem}>
                        <input type="checkbox" className={styles.checkbox} />
                        <span>슈멋사 프로젝트</span>
                      </label>
                    </div>
                    <div className={styles.projectsGrid}>
                      {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={`11th-${item}`} className={styles.projectCard}>
                          <div className={styles.projectImage}>
                            {/* Project image 나중에 추가 */}
                          </div>
                          <div className={styles.projectInfo}>
                            <div className={styles.projectFilter}>
                              {['중앙 해커톤', '슈멋사 프로젝트'][(item - 1) % 2]}
                            </div>
                            <h3>프로젝트 제목 {item}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default ProjectListPage;