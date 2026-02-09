import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './SessionCurriculum.module.css';

import pdOn from '../assets/icon/P_D_red_icon_on.svg';
import pdOff from '../assets/icon/P_D_gray_icon_off.svg';
import feOn from '../assets/icon/front_red_icon_on.svg';
import feOff from '../assets/icon/front_gary_icon_off.svg';
import beOn from '../assets/icon/back_red_icon_on.svg';
import beOff from '../assets/icon/back_gray_icon_off.svg';

type TrackKey = 'PD' | 'FE' | 'BE';

export type CurriculumItem = {
  week: number;
  title: string;
};

type SessionCurriculumProps = {
  initialTrack?: TrackKey;
  data?: Partial<Record<TrackKey, CurriculumItem[]>>;
  noteText?: string;
};

export default function SessionCurriculum({
  initialTrack = 'PD',
  data,
  noteText = `* 백엔드 트랙의 경우, 정기세션에서는 SpringBoot를, 1학기 스터디에서는 Django를 학습합니다.
스터디 커리큘럼 등, 더 궁금하신 사항은 공식 인스타그램 계정’@likelion_swu’으로 문의 부탁드립니다.`,
}: SessionCurriculumProps) {
  const [active, setActive] = useState<TrackKey>(initialTrack);

  const listRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);

  const dragRef = useRef({
    isDragging: false,
    startClientY: 0,
    startScrollTop: 0,
    pointerId: -1,
  });

  const tracks = useMemo(
    () => [
      { key: 'PD' as const, label: 'P&D', iconOn: pdOn, iconOff: pdOff },
      { key: 'FE' as const, label: 'FE', iconOn: feOn, iconOff: feOff },
      { key: 'BE' as const, label: 'BE', iconOn: beOn, iconOff: beOff },
    ],
    []
  );

  const defaultPD: CurriculumItem[] = useMemo(
    () => [
      { week: 1, title: '문제 정의 - IT 서비스 협업 구조 이해' },
      { week: 2, title: '사용자 이해 - Figma 입문 & 사용자 시나리오 보드 제작' },
      { week: 3, title: '구조 설계 - IA(정보 구조) 제작' },
      { week: 4, title: '흐름 설계 - 사용자 플로우(User Flow) 설계' },
      { week: 5, title: 'UI 구조화 - 컴포넌트 & Auto Layout' },
      { week: 6, title: '화면 설계 - 와이어프레임 제작 & UX 테스트(1차)' },
      { week: 7, title: '명세화 - 기능 명세서 작성' },
      { week: 8, title: '디자인 시스템 - 디자인 시스템 기초' },
      { week: 9, title: '시각 설계 - High-Fi UI 디자인 & UX 테스트(2차)' },
      { week: 10, title: '협업 마무리 - 개발 협업을 위한 정리' },
    ],
    []
  );

  const defaultFE: CurriculumItem[] = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        week: i + 1,
        title: '커리큘럼 준비중',
      })),
    []
  );

  const defaultBE: CurriculumItem[] = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        week: i + 1,
        title: '커리큘럼 준비중',
      })),
    []
  );

  const curriculumByTrack: Record<TrackKey, CurriculumItem[]> = useMemo(
    () => ({
      PD: data?.PD ?? defaultPD,
      FE: data?.FE ?? defaultFE,
      BE: data?.BE ?? defaultBE,
    }),
    [data, defaultPD, defaultFE, defaultBE]
  );

  const items = curriculumByTrack[active];

  useEffect(() => {
    const el = listRef.current;
    const handle = handleRef.current;
    if (!el || !handle) return;

    // 트랙 바뀌면 스크롤 맨 위로 리셋
    el.scrollTop = 0;

    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));

    const getMetrics = () => {
      const viewH = el.clientHeight;
      const scrollH = el.scrollHeight;
      const maxScroll = Math.max(1, scrollH - viewH);

      const rawHandleH = (viewH * viewH) / Math.max(scrollH, 1);
      const handleH = Math.max(80, Math.min(viewH, rawHandleH));
      handle.style.height = `${handleH}px`;

      const maxHandleY = Math.max(0, viewH - handleH);
      return { maxScroll, maxHandleY };
    };

    const sync = () => {
      const { maxScroll, maxHandleY } = getMetrics();
      const ratio = el.scrollTop / maxScroll;
      handle.style.transform = `translateY(${ratio * maxHandleY}px)`;
    };

    // 리스트 휠 스크롤 금지
    const preventWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    // 드래그 바(handle)로만 스크롤
    const onHandlePointerDown = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();

      dragRef.current.isDragging = true;
      dragRef.current.startClientY = e.clientY;
      dragRef.current.startScrollTop = el.scrollTop;
      dragRef.current.pointerId = e.pointerId;

      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    const onHandlePointerMove = (e: PointerEvent) => {
      if (!dragRef.current.isDragging) return;

      const { maxScroll, maxHandleY } = getMetrics();
      if (maxHandleY <= 0) return;

      const deltaY = e.clientY - dragRef.current.startClientY;
      const ratio = maxScroll / maxHandleY;

      el.scrollTop = clamp(
        dragRef.current.startScrollTop + deltaY * ratio,
        0,
        maxScroll
      );
      sync();
    };

    const endDrag = () => {
      if (!dragRef.current.isDragging) return;
      dragRef.current.isDragging = false;

      try {
        (handle as HTMLElement).releasePointerCapture(dragRef.current.pointerId);
      } catch {
        // ignore
      }
    };

    sync();

    const onScroll = () => requestAnimationFrame(sync);
    const onResize = () => requestAnimationFrame(sync);

    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    el.addEventListener('wheel', preventWheel, { passive: false });

    handle.addEventListener('pointerdown', onHandlePointerDown);
    handle.addEventListener('pointermove', onHandlePointerMove);
    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);

    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      el.removeEventListener('wheel', preventWheel as any);

      handle.removeEventListener('pointerdown', onHandlePointerDown);
      handle.removeEventListener('pointermove', onHandlePointerMove);
      handle.removeEventListener('pointerup', endDrag);
      handle.removeEventListener('pointercancel', endDrag);
    };
  }, [active, items.length]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.outerBox}>
        {/* Left: Track Tabs */}
        <aside className={styles.leftRail}>
          <div className={styles.trackStack}>
            {tracks.map((t) => {
              const isActive = t.key === active;
              return (
                <button
                  key={t.key}
                  type="button"
                  className={[
                    styles.trackBtn,
                    isActive ? styles.trackBtnActive : styles.trackBtnDefault,
                  ].join(' ')}
                  onClick={() => setActive(t.key)}
                  aria-pressed={isActive}
                  aria-label={t.label}
                >
                  <img
                    className={styles.trackIcon}
                    src={isActive ? t.iconOn : t.iconOff}
                    alt=""
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right: Scroll List */}
        <section className={styles.rightPanel}>
          <div className={styles.listWrap} ref={listRef}>
            {items.map((it) => (
              <div key={`${active}-${it.week}`} className={styles.itemRow}>
                <div className={styles.weekPill}>
                  <span className={styles.weekText}>WEEK</span>
                  <span className={styles.weekText}>{it.week}</span>
                </div>
                <div className={styles.itemTitle} title={it.title}>
                  {it.title}
                </div>
              </div>
            ))}
          </div>

          {/* Custom Scrollbar */}
          <div className={styles.scrollBarArea} aria-hidden="true">
            <div className={styles.scrollTrack}>
              <div className={styles.scrollThumb} ref={handleRef} />
            </div>
          </div>
        </section>
      </div>

      <p className={styles.note}>{noteText}</p>
    </div>
  );
}
