import styles from './RecruitScheduleSection.module.css';

import glassApply from '../../assets/icon/glass_apply.svg';
import glassSelection from '../../assets/icon/glass_selection.svg';
import glassInterview from '../../assets/icon/glass_interview.svg';
import glassFinal from '../../assets/icon/glass_final.svg';
import chevronRightSmall from '../../assets/icon/chevron_right_small.svg';

import { motion } from 'framer-motion';
import { useScrollReveal } from '../RecruitContent/ScrollMotion/useScrollReveal';
import { fadeUp, waveContainer, waveItem } from '../RecruitContent/ScrollMotion/motionPresets';

type Step = {
  key: 'apply' | 'selection' | 'interview' | 'final';
  icon: string;
  title: string;
  desc: React.ReactNode;
};

function Arrow() {
  return (
    <motion.div className={styles.arrowWrap} aria-hidden="true" variants={waveItem}>
      <img src={chevronRightSmall} alt="" className={styles.arrowImg} />
    </motion.div>
  );
}

function StepCard({ step }: { step: Step }) {
  return (
    <motion.div className={styles.card} data-type={step.key} variants={waveItem}>
      <div className={styles.iconBox}>
        <img src={step.icon} alt="" className={styles.iconImg} />
      </div>
      <div className={styles.textBox}>
        <div className={styles.cardTitle}>{step.title}</div>
        <div className={styles.cardDesc}>{step.desc}</div>
      </div>
    </motion.div>
  );
}

export default function RecruitScheduleSection() {
  const steps: Step[] = [
    {
      key: 'apply',
      icon: glassApply,
      title: '서류 모집',
      desc: (
        <>
          <span className={styles.emph}>2월 16일 ~ 3월 2일</span>
          <span className={styles.dim}>
            <br />
            사이트에서 서류 접수 가능
            <br />
          </span>
          <span className={styles.emph}>3월 2일 23시 59분 마감</span>
        </>
      ),
    },
    {
      key: 'selection',
      icon: glassSelection,
      title: '서류 합격 발표',
      desc: (
        <>
          <span className={styles.emph}>3월 4일 오전 10시 발표</span>
          <span className={styles.dim}>
            <br />
            사이트 내 로그인 후
            <br />
            개별적으로 결과 확인 가능
          </span>
        </>
      ),
    },
    {
      key: 'interview',
      icon: glassInterview,
      title: '면접',
      desc: (
        <>
          <span className={styles.emph}>3월 5일</span>
          <span className={styles.dim}>
            {' '}
            진행 예정,
            <br />
            장소 및 세부사항은
            <br />
            추후 사이트 내에서 안내
          </span>
        </>
      ),
    },
    {
      key: 'final',
      icon: glassFinal,
      title: '최종 합격 발표',
      desc: (
        <>
          <span className={styles.emph}>3월 9일 오전 10시 발표</span>
          <span className={styles.dim}>
            <br />
            사이트 내에 로그인 후
            <br />
            개별 결과를 확인 가능
          </span>
        </>
      ),
    },
  ];

  // 섹션 진입/이탈마다 반복
  const { ref: headerRef, controls: headerControls } = useScrollReveal({ amount: 0.6 });
  const { ref: rowRef, controls: rowControls } = useScrollReveal({ amount: 0.25 });

  return (
    <section className={styles.section}>
      {/* 타이틀/서브타이틀: 아래->위 */}
      <motion.div
        ref={headerRef as any}
        className={styles.header}
        initial="hidden"
        animate={headerControls}
        variants={fadeUp}
      >
        <h2 className="text-bold-48 text-primary-60 text-center">Recruit Schedule</h2>
        <p className="text-medium-28 text-gray-white text-center">
          서울여대 멋쟁이사자처럼 14기 아기사자 모집 일정
        </p>
      </motion.div>

      {/* 카드들: 좌->우 파도 + 아래->위 */}
      <motion.div
        ref={rowRef as any}
        className={styles.row}
        initial="hidden"
        animate={rowControls}
        variants={waveContainer}
      >
        <StepCard step={steps[0]} />
        <Arrow />
        <StepCard step={steps[1]} />
        <Arrow />
        <StepCard step={steps[2]} />
        <Arrow />
        <StepCard step={steps[3]} />
      </motion.div>
    </section>
  );
}
