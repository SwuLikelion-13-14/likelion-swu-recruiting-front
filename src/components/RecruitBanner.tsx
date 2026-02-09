import styles from './RecruitBanner.module.css';

type Props = {
  isRecruiting?: boolean; // true: 모집중(버튼 노출), false: 모집마감(버튼 없음)
  onApplyClick?: () => void;
};

export default function RecruitBanner({ isRecruiting = true, onApplyClick }: Props) {
  return (
    <section className={styles.banner} aria-label="모집 배너">
      <div className={styles.inner}>
        <div className={styles.textBlock}>
          <h3 className={styles.title}>
            {isRecruiting ? '14기 아기사자 모집 중' : '14기 아기사자 모집 마감'}
          </h3>
          <p className={styles.subTitle}>
            {isRecruiting
              ? '서울여대 멋쟁이사자처럼 14기에 지원하세요!'
              : '지금은 모집 기간이 아닙니다.'}
          </p>
        </div>

        {isRecruiting && (
          <button type="button" className={styles.applyBtn} onClick={onApplyClick}>
            14기 지원하기
          </button>
        )}
      </div>
    </section>
  );
}
