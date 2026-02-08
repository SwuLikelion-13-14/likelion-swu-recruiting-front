import React from 'react';
import backgroundImage from '../../../assets/img/14th_home_img.png';
import Layout from '../../../components/Layout/Layout';
import styles from './AnnualPlanPage.module.css';

// data for the timeline
const months = [
  { id: 1, date: '26.01' },
  { id: 2, date: '26.02' },
  { id: 3, date: '26.03' },
  { id: 4, date: '26.04' },
  { id: 5, date: '26.05' },
  { id: 6, date: '26.06' },
  { id: 7, date: '26.07' },
  { id: 8, date: '26.08' },
  { id: 9, date: '26.09' },
  { id: 10, date: '26.10' },
  { id: 11, date: '26.11' },
  { id: 12, date: '26.12' },
];

// events data
const events = [
  { 
    id: 1, 
    title: '14기 아기사자 리크루팅', 
    monthStart: 2, 
    monthEnd: 2,
    color: '#840500',
    top: 20
  },
  { 
    id: 2, 
    title: '1학기 정기 세션 및 스터디', 
    monthStart: 3.2, 
    monthEnd: 5.8,
    color: '#840500',
    top: 70
  },
  { 
    id: 3, 
    title: '중앙 아이디어톤', 
    monthStart: 4.84, 
    monthEnd: 4.9,
    color: '#FF7710',
    top: 120
  },
  { 
    id: 4, 
    title: '여기톤', 
    monthStart: 6.0, 
    monthEnd: 5.8,
    color: '#FF7710',
    top: 170
  },
  { 
    id: 8, 
    title: '여기톤', 
    monthStart: 7.0, 
    monthEnd: 6.5,
    color: '#FF7710',
    top: 70
  },
  { 
    id: 7, 
    title: '중앙해커톤', 
    monthStart: 8, 
    monthEnd: 7.9,
    color: '#FF7710',
    top: 170
  },
  { 
    id: 5, 
    title: '슈멋사 프로젝트', 
    monthStart: 8.92, 
    monthEnd: 11.8,
    color: '#840500',
    top: 70
  },
  { 
    id: 6, 
    title: '권역별 연합 해커톤 & 기업 연계 해커톤', 
    monthStart: 8.92, 
    monthEnd: 11.8,
    color: '#FF7710',
    top: 120
  },
];

const AnnualPlanPage = () => {
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
            <h1>Annual Plan</h1>
            <p className={styles.subtitle}>서울여대 멋쟁이사자처럼 연간 일정</p>
          </div>
          
          <div className={styles.scheduleLegend}>
            <div className={styles.legendItem}>
              <div className={styles.colorBox} style={{ backgroundColor: '#840500' }}></div>
              <span>서울여대 멋쟁이사자처럼 일정</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.colorBox} style={{ backgroundColor: '#FF7710' }}></div>
              <span>해커톤</span>
            </div>
          </div>

          <div className={styles.timelineContainer}>
            <div className={styles.timelineGrid}>
              {/* Grid with two rows */}
              <div className={styles.gridContainer}>
                {/* First row with dates */}
                <div className={styles.gridRow}>
                  {months.slice(0, 6).map((month, index) => (
                    <div key={`cell-0-${index}`} className={styles.gridCell}>
                      <span className={styles.dateText}>{month.date}</span>
                    </div>
                  ))}
                </div>
                
                {/* Second row with dates */}
                <div className={styles.gridRow}>
                  {months.slice(6).map((month, index) => (
                    <div key={`cell-1-${index}`} className={styles.gridCell}>
                      <span className={styles.dateText}>{month.date}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Event bars */}
              <div className={styles.eventsContainer}>
                {events.map((event) => {
  // 행 계산 (6개월 단위로 나누기)
  const row = Math.floor((event.monthStart - 1) / 6);
  // 행 내에서의 상대적 위치 계산
  const colInRow = (event.monthStart - 1) % 6;
  const left = (colInRow * 190) + 'px';
  const width = ((event.monthEnd - event.monthStart + 1) * 190 - 10) + 'px';
  // 행에 따른 top 값 조정 (기존 top + 행 높이 * 행 번호)
  const top = (event.top + (row * 250)) + 'px';
  
  return (
    <div 
      key={event.id}
      className={styles.eventBar}
      style={{
        left,
        width,
        top,
        backgroundColor: event.color,
        '--arrowColor': event.color
      } as React.CSSProperties}
    >
      <div className={styles.arrowLeft}></div>
      <div className={styles.arrowRight}></div>
      <span className={styles.eventTitle} style={{ textAlign: 'left', display: 'block', paddingLeft: '10px' }}>{event.title}</span>
    </div>
  );
})}
              </div>
            </div>
          </div>
          <div style={{
              color: '#FFF',
              textAlign: 'right',
              fontFamily: 'Pretendard',
              fontSize: '18px',
              fontWeight: 300,
              marginTop: '20px',
              paddingRight: '190px'
            }}>
              * 일부 일정은 변경될 수 있습니다.
            </div>
        </div>
      </Layout>
    </div>
  );
};

export default AnnualPlanPage;