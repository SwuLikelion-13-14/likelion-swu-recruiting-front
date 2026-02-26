import { useMemo, useState } from 'react';
import styles from './RecruitTrackSection.module.css';

import toolDatabase from '../../assets/icon/tool_database.svg';
import toolFigma from '../../assets/icon/tool_figma.svg';
import toolGit from '../../assets/icon/tool_git.svg';
import checkRed from '../../assets/icon/check_red.svg';

import { motion } from 'framer-motion';
import { useScrollReveal } from '../RecruitContent/ScrollMotion/useScrollReveal';
import { fadeUp, waveContainer, waveItem } from '../RecruitContent/ScrollMotion/motionPresets';

type TrackId = 'PD' | 'FE' | 'BE';

const TRACKS: Array<{
  id: TrackId;
  titleKr: string;
  titleEn: string;
  icon: string;
}> = [
  { id: 'PD', titleKr: '기획 디자인', titleEn: 'Product Management\n& Design Track', icon: toolFigma },
  { id: 'FE', titleKr: '프론트엔드 개발', titleEn: 'Frontend Dev Track', icon: toolGit },
  { id: 'BE', titleKr: '백엔드 개발', titleEn: 'Backend Dev Track', icon: toolDatabase },
];

const TRACK_BULLETS: Record<TrackId, string[]> = {
  PD: [
    'Team Leader로 프로젝트의 진행을 리드',
    '디자인 툴을 익히고 웹 디자인 이론과 용어 배움',
    '서비스 기획자, 디자이너가 되기 위한 역량 키움',
  ],
  FE: [
    '사용자의 눈에 보이는 레이아웃과 디자인 요소를 시각화',
    '웹 클라이언트 개발을 위한 기초부터 심화까지의 스킬 학습',
    'HTML, CSS, Javascript를 바탕으로 기초 개발 역량 학습',
  ],
  BE: [
    '눈에 보이지 않는 서버를 전반적으로 담당',
    '서비스 요구사항에 맞춰 API를 개발하고 서비스 배포 및 데이터 관리',
    'Django, Spring 등 다양한 프레임워크 기반으로 전체적 인프라 구현',
  ],
};

export default function RecruitTrackSection() {
  const [active, setActive] = useState<TrackId>('PD');
  const bullets = useMemo(() => TRACK_BULLETS[active], [active]);

  // 스크롤 재진입마다 반복(진입 show / 이탈 hidden)
  const { ref: headerRef, controls: headerControls } = useScrollReveal({ amount: 0.6 });
  const { ref: cardsRef, controls: cardsControls } = useScrollReveal({ amount: 0.25 });
  const { ref: boxRef, controls: boxControls } = useScrollReveal({ amount: 0.25 });

  return (
    <section className={styles.section}>
      {/* Title / Subtitle : 아래 -> 위 */}
      <motion.div
        ref={headerRef as any}
        className={styles.header}
        initial="hidden"
        animate={headerControls}
        variants={fadeUp}
      >
        <h2 className="text-bold-48 text-primary-60 text-center">Recruit Track</h2>
        <p className="text-medium-28 text-gray-white text-center">
          서울여대 멋쟁이사자처럼 14기 아기사자 모집 트랙
        </p>
      </motion.div>

      <div className={styles.content}>
        {/* Cards : 좌 -> 우 파도 + 아래 -> 위 */}
        <motion.div
          ref={cardsRef as any}
          className={styles.trackRow}
          initial="hidden"
          animate={cardsControls}
          variants={waveContainer}
        >
          {TRACKS.map((t) => {
            const selected = t.id === active;

            return (
              <motion.button
                key={t.id}
                type="button"
                className={[styles.trackCard, selected ? styles.selected : ''].join(' ')}
                onClick={() => setActive(t.id)}
                aria-pressed={selected}
                variants={waveItem}
              >
                <div className={styles.trackInner}>
                  <img src={t.icon} alt="" className={styles.trackIcon} />
                  <div className={styles.trackText}>
                    <div className={styles.trackTitle}>{t.titleKr}</div>
                    <div className={styles.trackSub}>{t.titleEn}</div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* descBox : 아래 -> 위 */}
      <motion.div
        ref={boxRef as any}
        className={[
            styles.descBox,
            active === 'PD' ? styles.descBoxPD : '',
            active === 'FE' ? styles.descBoxFE : '',
            active === 'BE' ? styles.descBoxBE : '',
        ].join(' ')}
        initial="hidden"
        animate={boxControls}
        variants={fadeUp}
        >
        <div className={styles.bulletList}>
            {bullets.map((text) => (
            <div key={text} className={styles.bulletRow}>
                <img src={checkRed} alt="" className={styles.checkIcon} />
                <p className={styles.bulletText}>{text}</p>
            </div>
            ))}
        </div>
        </motion.div>
      </div>
    </section>
  );
}
