import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backgroundImage from '../../assets/img/14th_home_img.png';
import Layout from '../../components/Layout/Layout';
import styles from './ProjectList.module.css';
import ChevronUp from '../../assets/icon/chevron_up.svg';

interface Project {
  name: string;
  description: string;
  thumbnail: string;
  projectCategory: string;
}

interface ProjectCohort {
  cohort: number;
  projects: Project[];
}

interface ApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    title: string;
    subtitle: string;
    projects: ProjectCohort[];
  };
}

const ProjectListPage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [projectData, setProjectData] = useState<{
    title: string;
    subtitle: string;
    projects: ProjectCohort[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<{[cohort: number]: string[]}>({});

  // 프로젝트 카테고리 목록 (11기에는 '여기톤 대비 토이 프로젝트'가 없음)
  const getProjectCategories = (cohort: number) => {
    if (cohort === 11) {
      return ['중앙 해커톤', '슈멋사 프로젝트'];
    }
    return ['여기톤 대비 토이 프로젝트', '중앙 해커톤', '슈멋사 프로젝트'];
  };

  // 체크박스 상태 변경 핸들러
  const handleCategoryChange = (cohort: number, category: string) => {
    setSelectedCategories(prev => {
      const cohortCategories = prev[cohort] || [];
      const newCategories = cohortCategories.includes(category)
        ? cohortCategories.filter(c => c !== category)
        : [...cohortCategories, category];
      return {
        ...prev,
        [cohort]: newCategories
      };
    });
  };

  // 프로젝트 필터링 함수
  const filterProjects = (cohort: number, projects: Project[]) => {
    const cohortCategories = selectedCategories[cohort] || [];
    if (cohortCategories.length === 0) return projects;
    return projects.filter(project => 
      cohortCategories.includes(project.projectCategory)
    );
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/project`;
        const response = await axios.get<ApiResponse>(apiUrl, {
          timeout: 5000,
          validateStatus: (status) => status < 500
        });

        if (response.data.isSuccess) {
          setProjectData(response.data.result);
          const sections: {[key: string]: boolean} = {};
          response.data.result.projects.forEach(cohort => {
            sections[`${cohort.cohort}th`] = true;
          });
          setExpandedSections(sections);
        } else {
          setError(response.data.message || '프로젝트를 불러오는 데 실패했습니다.');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('프로젝트를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100%'
      }}
    >
      <Layout>
        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>로딩 중...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : projectData ? (
            <>
              <div className={styles.titleSection}>
                <h1>{projectData.title}</h1>
                <div className={styles.subtitle}>
                  {projectData.subtitle}
                </div>
              </div>
              
              <div className={styles.projectsContainer}>
                {projectData.projects.map((cohort) => {
                  const sectionKey = `${cohort.cohort}th`;
                  return (
                    <div key={sectionKey} className={styles.projectSection}>
                      <div 
                        className={`${styles.projectContent} ${styles[`project${cohort.cohort}`]} ${!expandedSections[sectionKey] ? styles.collapsed : ''}`}
                      >
                        <div 
                          className={styles.titleContainer}
                          onClick={() => toggleSection(sectionKey)}
                        >
                          <h2 className={styles.projectTitle}>{cohort.cohort}기 Projects</h2>
                          <div className={styles.chevronContainer}>
                            <img 
                              src={ChevronUp} 
                              alt="Toggle projects" 
                              className={`${styles.chevronIcon} ${!expandedSections[sectionKey] ? styles.rotated : ''}`} 
                            />
                          </div>
                        </div>
                        
                        {expandedSections[sectionKey] && (
                          <>
                            <div className={styles.filterBar}>
                              {getProjectCategories(cohort.cohort).map((category) => (
                                <React.Fragment key={category}>
                                  <label className={styles.filterItem}>
                                    <input 
                                      type="checkbox" 
                                      className={styles.checkbox}
                                      checked={selectedCategories[cohort.cohort]?.includes(category) || false}
                                      onChange={() => handleCategoryChange(cohort.cohort, category)}
                                    />
                                    <span>{category}</span>
                                  </label>
                                  <div className={styles.filterSpacer} />
                                </React.Fragment>
                              ))}
                            </div>
                            <div className={styles.projectGrid}>
                              {filterProjects(cohort.cohort, cohort.projects).map((project, index) => (
                                <div key={`${sectionKey}-${index}`} className={styles.projectCard}>
                                  <div className={styles.projectImage}>
                                    {project.thumbnail ? (
                                      <img src={project.thumbnail} alt={project.name} className={styles.thumbnailImage} />
                                    ) : (
                                      <div className={styles.placeholderImage}></div>
                                    )}
                                  </div>
                                  <div className={styles.projectInfo}>
                                    <div className={styles.projectHeader}>
                                      <h3 className={styles.projectName}>{project.name}</h3>
                                      <span className={styles.projectCategory}>
                                        {project.projectCategory}
                                      </span>
                                    </div>
                                    <p className={styles.projectDescription}>{project.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className={styles.error}>프로젝트 데이터가 없습니다.</div>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default ProjectListPage;