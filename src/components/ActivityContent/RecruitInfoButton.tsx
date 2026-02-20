import { useNavigate } from 'react-router-dom';
import styles from './RecruitInfoButton.module.css';
import chevronRight from '@/assets/icon/chevron_right_small.svg'

const RecruitInfoButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className={styles.bottomButton}
      onClick={() => navigate('/recruit')}
    >
      <div className={styles.bottomButtonBg} />
      <span>14기 아기사자 모집 정보 보기</span>
      <img
        src={chevronRight}
        alt="arrow"
        className={styles.chevronRight}
      />
    </button>
  );
};

export default RecruitInfoButton;