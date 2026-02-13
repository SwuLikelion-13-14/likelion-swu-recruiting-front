import React, { useEffect, useState } from 'react';
import backgroundImage from '../../../assets/img/14th_home_img.png';
import Layout from '../../../components/Layout/Layout';
import styles from './AnnualPlanPage.module.css';
import { api } from '../../../api/client';

interface Event {
  eventId: number;
  sectionId: number;
  type: string;
  title: string;
  startDate: string;
  endDate: string;
  image: string;
}

interface ApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    events: Event[];
  };
}

// 타임라인 데이터
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

// 날짜 문자열을 월 번호(1-12)로 변환하는 기능
const getMonthFromDate = (dateString: string): number => {
  const date = new Date(dateString);
  return date.getMonth() + 1; // getMonth()가 0-11을 반환하기 때문에 1을 더함
};

// 이벤트 유형 및 인덱스를 기반으로 상위 위치를 계산하는 기능
const getTopPosition = (type: string, index: number): number => {
  const baseTop = type === 'HACKATHON' ? 70 : 20;
  return baseTop + (index % 3) * 50; // 이벤트 수직 분배
};

const AnnualPlanPage = () => {
  const [events, setEvents] = useState<Array<{
    id: number;
    title: string;
    monthStart: number;
    monthEnd: number;
    color: string;
    top: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnualPlan = async () => {
      try {
        const response = await api.get<ApiResponse>('/api/annual-plan');
        if (response.data.isSuccess && response.data.result) {
          // 구성 요소의 예상 형식에 맞게 API 데이터 변환
          const transformedEvents = response.data.result.events.map((event, index) => {
            const monthStart = getMonthFromDate(event.startDate);
            const monthEnd = getMonthFromDate(event.endDate);
            const isHackathon = event.type.toLowerCase() === 'hackathon';
            
            return {
              id: event.eventId,
              title: event.title,
              monthStart,
              monthEnd,
              color: isHackathon ? '#FF7710' : '#840500',
              top: getTopPosition(event.type, index)
            };
          });
          setEvents(transformedEvents);
        } else {
          setError('Failed to load annual plan data');
        }
      } catch (err) {
        console.error('Error fetching annual plan:', err);
        setError('연간 계획을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnualPlan();
  }, []);

  if (loading) {
    return (
      <div className={styles.container} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <Layout>
          <div className={styles.content}>
            <div className={styles.titleSection}>
              <h1>Annual Plan</h1>
              <p className={styles.subtitle}>서울여대 멋쟁이사자처럼 연간 일정</p>
            </div>
            <div className={styles.loading}>로딩 중...</div>
          </div>
        </Layout>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <Layout>
          <div className={styles.content}>
            <div className={styles.titleSection}>
              <h1>Annual Plan</h1>
              <p className={styles.subtitle}>서울여대 멋쟁이사자처럼 연간 일정</p>
            </div>
            <div className={styles.error}>{error}</div>
          </div>
        </Layout>
      </div>
    );
  }

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
                {events.length > 0 ? (
                  events.map((event) => {
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
                          ['--arrowColor' as string]: event.color
                        } as React.CSSProperties}
                      >
                        <div className={styles.arrowLeft}></div>
                        <div className={styles.arrowRight}></div>
                        <span className={styles.eventTitle} style={{ textAlign: 'left', display: 'block', paddingLeft: '10px' }}>{event.title}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.noEvents}>
                    등록된 일정이 없습니다.
                  </div>
                )}
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