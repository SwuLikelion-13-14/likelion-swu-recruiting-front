import styles from './CompletionFeeCards.module.css';

import glassDoc from '../../assets/icon/glass_doc.svg';
import glassWallet from '../../assets/icon/glass_wallet.svg';

type Props = {
  completionItems?: string[];
  feeItems?: string[];
};

export default function CompletionFeeCards({
  completionItems = [
    '중앙 아이디어톤, 중앙해커톤 필수 참여',
    '연합/기업 해커톤 1회 이상 참여',
    '경고 3회(지각·미제출) 또는 결석 1회 시 아웃 1회',
    '누적 아웃 3회 시 퇴부',
  ],
  feeItems = [
    '50,000원 (입부 후, 1회 일괄 납부)',
    '공간 대여, 굿즈 제작, 새터 및 회식 등에서 사용',
  ],
}: Props) {
  return (
    <div className={styles.wrapper}>
      {/* Row 1: 수료 조건 */}
      <div className={`${styles.row} ${styles.rowTop}`}>
        <div className={`${styles.card} ${styles.smallCard}`}>
          <img className={styles.floatIcon} src={glassDoc} alt="" aria-hidden="true" />
          <div className={styles.smallTitle}>수료 조건</div>
        </div>

        <div className={`${styles.card} ${styles.bigCard}`}>
          <ul className={styles.list}>
            {completionItems.map((text) => (
              <li key={text} className={styles.listItem}>
                <span className={styles.checkIcon} aria-hidden="true" />
                <span className={styles.itemText}>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* connector */}
        <div className={styles.connector} aria-hidden="true">
          <span className={styles.dotLeft} />
          <span className={styles.line} />
          <span className={styles.dotRight} />
        </div>
      </div>

      {/* Row 2: 회비 안내 */}
      <div className={`${styles.row} ${styles.rowBottom}`}>
        <div className={`${styles.card} ${styles.bigCard}`}>
          <div className={styles.feeBox}>
            {feeItems.map((text) => (
              <div key={text} className={styles.feeRow}>
                <span className={styles.feeText}>{text}</span>
                <span className={styles.checkIcon} aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.card} ${styles.smallCard}`}>
          <img className={styles.floatIcon} src={glassWallet} alt="" aria-hidden="true" />
          <div className={styles.smallTitle}>회비 안내</div>
        </div>

        {/* connector */}
        <div className={styles.connector} aria-hidden="true">
          <span className={styles.dotLeft} />
          <span className={styles.line} />
          <span className={styles.dotRight} />
        </div>
      </div>
    </div>
  );
}
