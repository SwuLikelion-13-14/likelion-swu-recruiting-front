import styles from './ApplyBox.module.css';
import Logo from '@/assets/icon/logo_small_orange.svg';
import OrIcon from '@/assets/icon/or_svg.svg';

const ApplyBox = () => {
  return (
    <div className={styles.wrapper}>
      {/* 원형 그래디언트 배경 */}
      <div className={styles.gradientCircle1} />
      <div className={styles.gradientCircle2} />

      {/* 콘텐츠 영역 */}
      <div className={styles.content}>
        {/* 상단 로고 아이콘 */}
        <img src={Logo} alt="Logo" className={styles.topIcon} />

        {/* 타이틀 */}
        <h2 className={styles.title}>지원서 작성</h2>

        {/* 타이틀 아래 한 줄 텍스트 */}
        <p className={styles.subText}>작성했던 지원서가 있나요?</p>

        {/* 학번 & 비밀번호 입력 */}
        <div className={styles.inputGroup}>
          <div className={styles.inputField}>
            <label>학번</label>
            <input placeholder="학번 10자리를 입력하세요" />
          </div>
          <div className={styles.inputField}>
            <label>비밀번호</label>
            <input placeholder="숫자 4자리를 입력하세요" />
          </div>
        </div>

        {/* 버튼들 */}
        <button className={styles.primaryButton}>내 지원서 보기</button>

        {/* 버튼 사이 라인 + or 아이콘 */}
<div className={styles.orWrapper}>
  <div className={styles.orLine}></div>
  <img src={OrIcon} alt="or" className={styles.orIcon} />
  <div className={styles.orLine}></div>
</div>


        <p className={styles.subText}>지원서를 처음 작성하시나요?</p>

        <button className={styles.secondaryButton}>새 지원서 작성하기</button>
      </div>
    </div>
  );
};

export default ApplyBox;
