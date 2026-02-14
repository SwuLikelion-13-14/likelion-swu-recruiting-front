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

const months = [
  { id: 1, date: '26.01' }, { id: 2, date: '26.02' }, { id: 3, date: '26.03' },
  { id: 4, date: '26.04' }, { id: 5, date: '26.05' }, { id: 6, date: '26.06' },
  { id: 7, date: '26.07' }, { id: 8, date: '26.08' }, { id: 9, date: '26.09' },
  { id: 10, date: '26.10' }, { id: 11, date: '26.11' }, { id: 12, date: '26.12' },
];

const getPreciseMonth = (dateString: string): number => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const daysInMonth = new Date(date.getFullYear(), month, 0).getDate();
  return month + (day - 1) / daysInMonth;
};

const getPreciseEndMonth = (dateString: string): number => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const daysInMonth = new Date(date.getFullYear(), month, 0).getDate();
  return month + (day / daysInMonth);
};

const getTopPosition = (type: string, index: number): number => {
  const baseTop = type.toLowerCase() === 'hackathon' ? 80 : 25;
  return baseTop + (index % 3) * 45;
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
          const sortedEvents = [...response.data.result.events].sort(
            (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );

          const transformedEvents = sortedEvents.map((event, index) => ({
            id: event.eventId,
            title: event.title,
            monthStart: getPreciseMonth(event.startDate),
            monthEnd: getPreciseEndMonth(event.endDate),
            color: event.type.toLowerCase() === 'hackathon' ? '#FF7710' : '#840500',
            top: getTopPosition(event.type, index)
          }));
          setEvents(transformedEvents);
        } else {
          setError('데이터를 불러오는 데 실패했습니다.');
        }
      } catch (err) {
        setError('연간 계획을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnualPlan();
  }, []);

  // 행별로 이벤트를 렌더링하는 함수
  const renderEventsInRow = (rowStartMonth: number, rowEndMonth: number) => {
  const CELL_WIDTH = 190;

  return events
    .filter(event => {
      // 해당 행의 시작(예: 1)과 끝(예: 6) 사이에 걸쳐 있는지 체크
      const isOverlapping = event.monthStart <= (rowEndMonth + 0.99) && event.monthEnd >= rowStartMonth;
      return isOverlapping;
    })
    .map(event => {
      // 현재 행의 범위 내에서만 시작과 끝점 잡기
      // 1행이면 1.0 ~ 7.0(7월 1일 00시) 사이로 제한
      const displayStart = Math.max(event.monthStart, rowStartMonth);
      const displayEnd = Math.min(event.monthEnd, rowEndMonth + 1);

      // 만약 계산된 종료지점이 시작지점보다 작거나 같으면 그리지 않음
      if (displayEnd <= displayStart) return null;

      const left = (displayStart - rowStartMonth) * CELL_WIDTH;
      const widthVal = (displayEnd - displayStart) * CELL_WIDTH;
      
      // 막대기 너비가 0보다 클 때만 렌더링
      if (widthVal <= 0) return null;

      const width = widthVal < 120 ? '120px' : `${widthVal}px`;

      return (
        <div
          key={`${event.id}-${rowStartMonth}`}
          className={styles.eventBar}
          style={{
            left: `${left}px`,
            width,
            top: `${event.top}px`,
            backgroundColor: event.color,
            ['--arrowColor' as string]: event.color,
            zIndex: widthVal < 120 ? 10 : 1
          } as React.CSSProperties}
        >
          
          {/* 실제 종료일이 현재 행 범위 안에 있을 때만 오른쪽 화살표 */}
          {event.monthEnd > rowStartMonth && event.monthEnd <= rowEndMonth + 1 && (
            <div className={styles.arrowRight}></div>
          )}
          <span className={styles.eventTitle}>{event.title}</span>
        </div>
      );
    });
};

  if (loading || error) {
    return (
      <div className={styles.container} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <Layout>
          <div className={styles.content}>
            <div className={styles.loading}>{loading ? '로딩 중...' : error}</div>
          </div>
        </Layout>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage} style={{ backgroundImage: `url(${backgroundImage})` }} />
      <div className={styles.overlay} />
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
              <div className={styles.gridContainer}>
                {/* 상반기 행 */}
                <div className={styles.gridRow}>
                  {months.slice(0, 6).map((m) => (
                    <div key={m.id} className={styles.gridCell}>
                      <span className={styles.dateText}>{m.date}</span>
                    </div>
                  ))}
                  <div className={styles.rowEventsContainer}>
                    {renderEventsInRow(1, 6)}
                  </div>
                </div>

                {/* 하반기 행 */}
                <div className={styles.gridRow}>
                  {months.slice(6).map((m) => (
                    <div key={m.id} className={styles.gridCell}>
                      <span className={styles.dateText}>{m.date}</span>
                    </div>
                  ))}
                  <div className={styles.rowEventsContainer}>
                    {renderEventsInRow(7, 12)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className={styles.notice}>* 일부 일정은 변경될 수 있습니다.</p>
        </div>
      </Layout>
    </div>
  );
};

export default AnnualPlanPage;