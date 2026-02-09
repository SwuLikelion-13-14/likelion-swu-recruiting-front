import styles from './RecruitKeywordSection.module.css';
import checkRed from '../../assets/icon/check_red.svg';

import { motion } from 'framer-motion';
import { useScrollReveal } from '../RecruitContent/ScrollMotion/useScrollReveal';
import { fadeUp, waveContainer, waveItem } from '../RecruitContent/ScrollMotion/motionPresets';

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.bulletRow}>
      <img src={checkRed} alt="" className={styles.checkIcon} />
      <div className={styles.bulletText}>{children}</div>
    </div>
  );
}

export default function RecruitKeywordSection() {
  const { ref: headerRef, controls: headerControls } = useScrollReveal({ amount: 0.6 });
  const { ref: circlesRef, controls: circlesControls } = useScrollReveal({ amount: 0.25 });
  const { ref: boxRef, controls: boxControls } = useScrollReveal({ amount: 0.25 });

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
        <h2 className="text-bold-48 text-primary-60 text-center">Recruit Keyword</h2>
        <p className="text-medium-28 text-gray-white text-center">
          서울여대 멋쟁이사자처럼 14기에서는 이런 분을 원해요
        </p>
      </motion.div>

      <div className={styles.content}>
        {/* 원 3개: 좌->우 파도 */}
        <motion.div
          ref={circlesRef as any}
          className={styles.keywordGlow}
          initial="hidden"
          animate={circlesControls}
          variants={waveContainer}
        >
          <div className={styles.keywordRow}>
            <motion.div className={styles.keywordCircle} variants={waveItem}>
              <span className={styles.keywordText}>열정</span>
            </motion.div>

            <motion.div className={styles.keywordConnector} variants={waveItem} />

            <motion.div className={styles.keywordCircle} variants={waveItem}>
              <span className={styles.keywordText}>도전</span>
            </motion.div>

            <motion.div className={styles.keywordConnector} variants={waveItem} />

            <motion.div className={styles.keywordCircle} variants={waveItem}>
              <span className={styles.keywordText}>협력</span>
            </motion.div>
          </div>
        </motion.div>

        {/* 박스 1개: 아래->위 */}
        <motion.div
          ref={boxRef as any}
          className={styles.keywordBox}
          initial="hidden"
          animate={boxControls}
          variants={fadeUp}
        >
          <div className={styles.group}>
            <Bullet>
              지식과 경험이 뛰어나지 않아도, 배움과 성장에 대한{' '}
              <span className={styles.emph}>열정</span>을 가진 분
            </Bullet>
            <Bullet>
              실패를 두려워하지 않고 끝까지 완주할 <span className={styles.emph}>도전</span> 정신을 갖춘 분
            </Bullet>
            <Bullet>
              동료와 능동적으로 소통하고 <span className={styles.emph}>협력</span>하여 시너지를 낼 수 있는 분
            </Bullet>
          </div>

          <div className={styles.group}>
            <Bullet>서울여대 지부 및 멋사 공식 일정에 적극적으로 참여 가능한 분</Bullet>
            <Bullet>재학·휴학·편입·졸업유예 상태의 서울여자대학교 학우</Bullet>
            <Bullet>IT 서비스 기획과 개발 및 창업 프로세스에 관심이 있는 분</Bullet>
            <Bullet>개발 경험이 없어도 실전 협업을 통해 배우고자 하는 의지를 갖춘 분</Bullet>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
