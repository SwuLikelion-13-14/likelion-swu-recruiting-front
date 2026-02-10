import React from 'react';
import styles from './RecruitTrackPage.module.css';

import toolDatabase from '../../assets/icon/tool_database.svg';
import toolFigma from '../../assets/icon/tool_figma.svg';
import toolGit from '../../assets/icon/tool_git.svg';

const TRACKS = [
  { id: 'PD', titleKr: '기획 디자인', titleEn: 'Product Management\n& Design Track', icon: toolFigma, link: '/design' },
  { id: 'FE', titleKr: '프론트엔드 개발', titleEn: 'Frontend Dev Track', icon: toolGit, link: '/front' },
  { id: 'BE', titleKr: '백엔드 개발', titleEn: 'Backend Dev Track', icon: toolDatabase, link: '/back' },
];

export default function RecruitTrackPage() {
  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.pageTitle}>지원할 트랙을 선택해 주세요</h2>
      <div className={styles.trackRow}>
        {TRACKS.map((t) => (
          <button
            key={t.id}
            className={styles.trackCard}
            onClick={() => window.location.href = t.link}
          >
            <div className={styles.trackInner}>
              <img src={t.icon} alt="" className={styles.trackIcon} />
              <div className={styles.trackText}>
                <div className={styles.trackTitle}>{t.titleKr}</div>
                <div className={styles.trackSub}>{t.titleEn}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
