import { useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import styles from './HackathonCards.module.css';

import likelionWhiteIcon from '../../assets/icon/likelion_white.svg';

type CardItem = {
  title: string;
  content: ReactNode;
};

type HackathonCardsProps = {
  enableHover?: boolean;
  enableReveal?: boolean;
  waveReveal?: boolean;
  waveStepMs?: number;
  threshold?: number;
  className?: string;
};

export default function HackathonCards({
  enableHover = true,
  enableReveal = true,
  waveReveal = true,
  waveStepMs = 120,
  threshold = 0.2,
  className,
}: HackathonCardsProps) {
  const cardsRef = useRef<Array<HTMLElement | null>>([]);

  const cards: CardItem[] = useMemo(
    () => [
      {
        title: '아이디어톤',
        content: (
          <div className={styles.content}>
            <p>
              <span className={styles.accent}>개발/배포 없이, 아이디어의 혁신성</span>
              <span className={styles.text}>과 논리만으로 경합하는 해커톤입니다.</span>
            </p>
            <p>
              <span className={styles.accent}>4~5월 중 진행</span>
              <span className={styles.text}>
                되며, 1차 교내 예선을 통과한 팀은 학교 대표로서 타 대학 팀들과 최종 결선을 치르게 됩니다.
              </span>
            </p>
            <p className={styles.text}>
              기존 해커톤과 다르게 서비스 기획 및 프로토타입만을 다루기 때문에, 자신의 아이디어를 마음껏 펼칠 수 있습니다.
            </p>
          </div>
        ),
      },
      {
        title: '여기톤',
        content: (
          <div className={styles.content}>
            <p>
              <span className={styles.text}>여성 IT 인재 간의 교류 및 협업 경험 확대를 위한 </span>
              <span className={styles.accent}>연합 해커톤</span>
              <span className={styles.text}>입니다.</span>
            </p>
            <p>
              <span className={styles.text}>서울권 6개 여자 대학교(서울·덕성·동덕·성신·숙명·이화) 지부가 참여하며, </span>
              <span className={styles.accent}>여름방학 중 개최</span>
              <span className={styles.text}>됩니다.</span>
            </p>
            <p className={styles.text}>
              타 대학 소속 아기사자들과 팀을 구성해 협업하며 실무적인 커뮤니케이션 역량을 강화할 수 있습니다.
            </p>
          </div>
        ),
      },
      {
        title: '중앙 해커톤',
        content: (
          <div className={styles.content}>
            <p>
              <span className={styles.accent}>전국 모든 멋사 대학 지부가 참여</span>
              <span className={styles.text}>하는 멋쟁이사자처럼 대학의 꽃이자 최대 규모의 행사입니다.</span>
            </p>
            <p>
              <span className={styles.accent}>8월 중 무박 2일로 진행</span>
              <span className={styles.text}>
                되며, 한 학기 동안 습득한 기술 스택을 활용해 동작하는 서비스를 완성할 수 있는 기회입니다.
              </span>
            </p>
          </div>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    if (!enableReveal) return;

    // wave delay 세팅
    cardsRef.current.forEach((el, idx) => {
      if (!el) return;
      const delay = waveReveal ? idx * waveStepMs : 0;
      el.style.setProperty('--reveal-delay', `${delay}ms`);
    });

    // 모션 줄이기 -> 바로 보이기
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mq?.matches) {
      cardsRef.current.forEach((el) => el && el.classList.add(styles.isVisible));
      return;
    }

    // 재진입마다 반복
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) el.classList.add(styles.isVisible);
          else el.classList.remove(styles.isVisible);
        });
      },
      { threshold }
    );

    cardsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [enableReveal, waveReveal, waveStepMs, threshold]);

  return (
    <div className={[styles.row, className].filter(Boolean).join(' ')}>
      {cards.map((c, idx) => {
        const cardClassName = [
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
            className={cardClassName}
          >
            <div className={styles.header}>
              <div className={styles.iconBox}>
                <img className={styles.icon} src={likelionWhiteIcon} alt="멋사 아이콘" />
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
