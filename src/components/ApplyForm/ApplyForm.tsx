import styles from './ApplyForm.module.css'
import type { ApplyFormProps } from './types'
import checkboxDefault from '@/assets/icon/checkbox_default.svg'
import checkboxChecked from '@/assets/icon/checkbox_checked.svg'
import noticeIcon from '@/assets/icon/alert_octagon.svg'

console.log(checkboxDefault)


const ApplyForm = ({
  mode,
  variant,
  title,
  subtitle,
  questions,
  onChange,
  enableConsent,
  enableNotice,
  enableActions,
  consentChecked,
  onConsentChange
}: ApplyFormProps) => {
  return (
    <section
      className={`${styles.wrapper} ${variant === 'survey'
        ? styles.bgDark
        : styles.bgWhite
        }`}
    >
      <header className={styles.header}>
        <h1
          className={`${styles.title} ${variant === 'survey'
            ? styles.titleColored
            : styles.titleBlack
            }`}
        >
          {title}
        </h1>

        {subtitle && (
          <p className={styles.subtitle}>{subtitle}</p>
        )}
      </header>

      <div className={styles.form}>
        {questions.map(item => (
          <div className={styles.item} key={item.id}>
            <p
              className={`${styles.question} ${variant === 'survey'
                ? styles.colored
                : styles.black
                }`}
            >
              {item.question}
            </p>

            <input
              className={styles.input}
              value={item.answer}
              placeholder={item.placeholder}
              readOnly={mode === 'view'}
              onChange={e =>
                onChange?.(item.id, e.target.value)
              }
            />
          </div>
        ))}
      </div>
      {/* ===== 동의 영역 ===== */}
      {enableConsent && (
        <section className={styles.consentSection}>
          <h2 className={styles.consentTitle}>
            지원서 제출을 위한<br />
            개인정보 수집 및 이용 동의서
          </h2>

          <ol className={styles.consentList}>
            <li>
              <p className={styles.listTitle}>
                수집하는 개인정보 항목
              </p>
              <div className={styles.consentBox}>
                필수 항목 : 이름, 학번, 전화번호, 이메일 주소, 학과(본전공, 복수전공), 본인확인용 비밀번호
              </div>
            </li>

            <li>
              <p className={styles.listTitle}>
                개인정보의 보유 및 이용 기간
              </p>

              <div className={styles.consentBox}>
                수집된 개인정보는 지원 기간 종료 및 선발 완료 후 6개월간 보관하며, 이후 지체 없이 파기합니다.
              </div>

              <div className={styles.consentBox}>
                지원자가 개인정보 삭제를 요청할 경우 즉시 파기합니다.
              </div>
            </li>

            <li>
              <p className={styles.listTitle}>
                동의 거부 권리 및 불이익 안내
              </p>
              <div className={styles.consentBox}>
                귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다.
              </div>
              <div className={styles.consentBox}>
                필수 항목에 대한 동의를 거부하실 경우, 지원 및 심사 대상에서 제외될 수 있습니다.
              </div>
            </li>
          </ol>

          <label className={styles.consentCheck}>
            <input
              type="checkbox"
              checked={consentChecked}
              disabled={mode === 'view'}
              onChange={e => onConsentChange?.(e.target.checked)}
            />

            <img
              src={consentChecked ? checkboxChecked : checkboxDefault}
              className={styles.checkboxIcon}
              alt=""
            />

            <span className={styles.checkboxText}>
              위 내용에 동의합니다.
            </span>
          </label>


        </section>
      )}

      {enableNotice && (
        <section className={styles.noticeSection}>
          <h2 className={styles.noticeTitle}>
            지원서 제출 시 유의 사항
          </h2>

          <div className={styles.noticeItems}>
            <div className={styles.noticeItem}>
              <img
                src={noticeIcon}
                alt=""
                className={styles.noticeIcon}
              />
              <div className={styles.noticeTextGroup}>
                <p className={styles.noticeText}>
                  지원 트랙을 변경하고 싶어요.
                </p>

                <p className={styles.noticeTextDetail}>
                  현재 작성 중인 지원서 페이지 내에서 트랙을 변경하는 것은 <span className={styles.highlight}>불가능</span> 합니다.
                  작성 중인 지원서의 <span className={styles.highlight}>‘작성 취소’</span>를 누른 후,
                  변경하고 싶은 트랙을 선택하여 지원서를 다시 작성해 주세요.
                  내용은 <span className={styles.highlight}>자동 저장되지 않으므로</span> 복사/붙여넣기를 권장 드립니다.
                </p>
              </div>
            </div>

            <div className={styles.noticeItem}>
              <img
                src={noticeIcon}
                alt=""
                className={styles.noticeIcon}
              />
              <div className={styles.noticeTextGroup}>
                <p className={styles.noticeText}>
                  제출한 지원서를 수정할 수 있나요?
                </p>

                <p className={styles.noticeTextDetail}>
                  1차 서류 모집 기간 내에 한하여 <span className={styles.highlight}>수정 가능</span> 합니다. <span className={styles.highlight}>학번과 본인 확인용 비밀번호</span>를 입력 후,
                  변경하고 싶은 트랙을 선택하여 지원서를 다시 작성해 주세요.
                  최종 제출 또는 임시 저장한 지원서를 다시 수정할 수 있습니다.
                  <br/>
                  <br/>
                  1차 서류 모집 기간이 끝나면, 지원서 수정 및 열람은 <span className={styles.highlight}>불가능</span> 합니다.
                </p>
              </div>
            </div>

            <div className={styles.noticeItem}>
              <img
                src={noticeIcon}
                alt=""
                className={styles.noticeIcon}
              />
              <div className={styles.noticeTextGroup}>
                <p className={styles.noticeText}>
                  여러 트랙의 지원서를 제출 할 수 있나요?
                </p>

                <p className={styles.noticeTextDetail}>
                  본 모집은 <span className={styles.highlight}>1인당 1개의 트랙에 한하여</span> 1회만 지원 가능합니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

    </section>
  )
}

export default ApplyForm
