import { useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import styles from './ActivityCards.module.css';

import scheduleIcon from '../../assets/icon/schedule_red.svg';
import studyIcon from '../../assets/icon/study_red.svg';
import collaboIcon from '../../assets/icon/collaboWork_red.svg';

type CardItem = {
  icon: string;
  alt: string;
  title: string;
  content: ReactNode;
};

type ActivityCardsProps = {
  enableHover?: boolean;
  enableReveal?: boolean;
  waveReveal?: boolean;
  waveStepMs?: number;
  threshold?: number;
};

export default function ActivityCards({
  enableHover = true,
  enableReveal = true,
  waveReveal = true,
  waveStepMs = 120,
  threshold = 0.2,
}: ActivityCardsProps) {
  const cardsRef = useRef<Array<HTMLElement | null>>([]);

  const cards: CardItem[] = useMemo(
    () => [
      {
        icon: scheduleIcon,
        alt: '정기 세션 아이콘',
        title: '정기 세션',
        content: (
          <div className={styles.desc}>
            <p>
              1학기 동안{' '}
              <span className={styles.nowrap}>
                <span className={styles.highlight}>매주 목요일 오후 7시</span>에
              </span>{' '}
              정기 세션이 진행 됩니다.
            </p>
            <br></br>
            <p>
              각 트랙 별로 나뉘어 진행 되며, 장소 및 시간 등 자세한 일정은 디스코드 공지 채널에서 당일 안내 됩니다.
            </p>
          </div>
        ),
      },
      {
        icon: studyIcon,
        alt: '스터디 아이콘',
        title: '스터디',
        content: (
          <div className={styles.desc}>
            <p>
              각 파트 별로{' '}
              <span className={styles.nowrap}>
                <span className={styles.highlight}>1학기 동안 스터디</span>를
              </span>{' '}
              진행 합니다.
            </p>
            <br></br>
            <p>
              <span className={styles.highlight}>정기 세션과 병행</span>하여 진행되며, 세션에서 배운 내용을 바탕으로 심화 학습하여
              자신의 지식과 스킬을 발전시킬 수 있습니다.
            </p>
          </div>
        ),
      },
      {
        icon: collaboIcon,
        alt: '협업 프로젝트 아이콘',
        title: '협업 프로젝트',
        content: (
          <div className={styles.desc}>
            <p>
              기획/디자인, 프론트, 백{' '}
              <span className={styles.nowrap}>
                <span className={styles.highlight}>모든 파트가 협업</span>하여
              </span>{' '}
              프로젝트를 진행합니다.
            </p>
            <br></br>
            <p>
              1학기는{' '}
              <span className={styles.nowrap}>
                <span className={styles.highlight}>해커톤 대비 토이 프로젝트</span>를
              </span>
              , 2학기는{' '}
              <span className={styles.nowrap}>
                <span className={styles.highlight}>‘슈멋사 프로젝트’</span>를
              </span>{' '}
              통해 서비스 기획부터 배포까지 경험을 쌓을 수 있습니다.
            </p>
          </div>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    if (!enableReveal) return;

    cardsRef.current.forEach((el, idx) => {
      if (!el) return;
      const delay = waveReveal ? idx * waveStepMs : 0;
      el.style.setProperty('--reveal-delay', `${delay}ms`);
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.classList.add(styles.isVisible);
          obs.unobserve(el);
        });
      },
      { threshold }
    );

    cardsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [enableReveal, waveReveal, waveStepMs, threshold]);

  return (
    <div className={styles.row}>
      {cards.map((c, idx) => {
        const className = [
          styles.card,
          enableReveal ? styles.reveal : '',
          enableHover ? styles.hoverable : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <article
            key={c.title}
            ref={(el) => {
              cardsRef.current[idx] = el;
            }}
            className={className}
          >
            <div className={styles.header}>
              <div className={styles.iconBox}>
                <img className={styles.icon} src={c.icon} alt={c.alt} />
              </div>
              <h3 className={styles.title}>{c.title}</h3>
            </div>

            <div className={styles.body}>{c.content}</div>
          </article>
        );
      })}
    </div>
  );
}
