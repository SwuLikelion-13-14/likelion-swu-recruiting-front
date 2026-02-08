import { useState } from 'react'
import styles from './ApplyForm.module.css'
import type { ApplyFormProps } from './types'
import checkboxDefault from '@/assets/icon/checkbox_default.svg'
import checkboxChecked from '@/assets/icon/checkbox_checked.svg'
import noticeIcon from '@/assets/icon/alert_octagon.svg'

type StudentStatus =
  | 'invalid'
  | 'draft-exists'
  | 'submitted-exists'
  | 'valid'

const STUDENT_ID = 15

const studentMessages: Record<StudentStatus, string> = {
  invalid: '형식이 다릅니다. 숫자 10자리를 입력하세요.',
  'draft-exists': '임시저장 된 지원서가 이미 있습니다. 여러 개의 지원서를 임시저장할 수 없습니다.',
  'submitted-exists': '이미 지원서를 최종 제출한 기록이 존재합니다. 중복 지원은 불가합니다.',
  valid: '지원 가능한 학번입니다.'
}


// 중복 학번 검증 api 연결 자리
const mockCheckStudentId = (id: string): StudentStatus => {
  if (!/^\d{10}$/.test(id)) return 'invalid'
  if (id === '1234567890') return 'draft-exists'
  if (id === '2026000000') return 'submitted-exists'
  return 'valid'
}

type ButtonState = 'default' | 'unactive'

const ApplyForm = ({
  mode,
  variant,
  title,
  subtitle,
  questions,
  onChange,
  onFileChange,
  enableConsent,
  enableNotice,
  enableActions,
  consentChecked,
  onConsentChange,
  allQuestions
}: ApplyFormProps) => {

  const [errors, setErrors] = useState<{ [id: number]: string }>({})
  const [success, setSuccess] = useState<{ [id: number]: string }>({})
  const [studentStatus, setStudentStatus] = useState<StudentStatus | undefined>(undefined)

  const handleBlur = (index: number) => {
    const newErrors: { [id: number]: string } = {}
    const newSuccess: { [id: number]: string } = {}

    for (let i = 0; i <= index; i++) {
      const q = questions[i]

      if (q.type === 'file') {
        if (q.required && !q.file) {
          newErrors[q.id] = '기획디자인 트랙 지원자는 필수 답변 항목입니다.'
        }
        continue
      }

      if (q.id !== STUDENT_ID && q.required && !q.answer.trim()) {
        newErrors[q.id] = '필수 답변 항목입니다.'
        continue
      }

      if (q.pattern && !q.pattern.test(q.answer)) {
        newErrors[q.id] = q.errorMessage || '형식이 다릅니다. 숫자 4자리를 입력하세요.'
        continue
      }

      if (q.pattern && q.pattern.test(q.answer)) {
        newSuccess[q.id] = '비밀번호가 설정되었습니다.'
      }
    }

    setErrors(newErrors)
    setSuccess(newSuccess)
  }

  const handleFileUpload = (id: number) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      onFileChange?.(id, file)
      onChange?.(id, file.name)

      const newErrors = { ...errors }
      const newSuccess = { ...success }

      setErrors(newErrors)
      setSuccess(newSuccess)
    }
    input.click()
  }

  // ✅ ===== 버튼 상태 계산 =====

  const hasAnyInput = questions.some(q => q.answer.trim() !== '')
  const requiredFilled = allQuestions
    .filter(q => q.required)
    .every(q => {
      if (q.type === 'file') {
        return !!q.file
      }
      return q.answer.trim() !== ''
    })

  const studentValid = studentStatus === 'valid'
  const passwordValid = Object.keys(success).length > 0
  const consentOk = !!consentChecked

  const cancelState: ButtonState = 'default'

  const draftState: ButtonState =
    hasAnyInput && studentValid && passwordValid && consentOk
      ? 'default'
      : 'unactive'

  const submitState: ButtonState =
    requiredFilled && studentValid && passwordValid && consentOk
      ? 'default'
      : 'unactive'

  // =============================

  return (
    <section className={`${styles.wrapper} ${variant === 'survey' ? styles.bgDark : styles.bgWhite}`}>
      <header className={styles.header}>
        <h1 className={`${styles.title} ${variant === 'survey' ? styles.titleColored : styles.titleBlack}`}>
          {title}
        </h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>

      <div className={styles.form}>
        {questions.map((item, index) => (
          <div className={styles.item} key={item.id}>
            <p className={`${styles.question} ${variant === 'survey' ? styles.colored : styles.blackinput}`}>
              {item.question}
            </p>

            {item.type === 'file' ? (
              <div className={styles.fileInputWrapper}>
                <input
                  className={`${styles.input} ${errors[item.id] ? styles.inputError : success[item.id] ? styles.inputSuccess : ''}`}
                  value={item.answer}
                  placeholder={item.placeholder}
                  onChange={e => onChange?.(item.id, e.target.value)}
                />

                <div className={styles.fileBottomRow}>
                  <div>
                    {errors[item.id] && <div className={`${styles.errorText} ${styles.fileErrorText}`}>{errors[item.id]}</div>}
                    {success[item.id] && !errors[item.id] && <div className={`${styles.successText} ${styles.fileErrorText}`}>{success[item.id]}</div>}
                  </div>

                  <button
                    className={styles.uploadButton}
                    onClick={() => handleFileUpload(item.id)}
                    disabled={mode === 'view'}
                  >
                    {mode === 'view'
                      ? '파일 다운로드'
                      : item.file
                        ? '파일 변경하기'
                        : '파일 업로드'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <input
                  type={item.type ?? 'text'}
                  className={`${styles.input} ${item.id === STUDENT_ID
                    ? studentStatus === 'valid'
                      ? styles.inputSuccess
                      : studentStatus
                        ? styles.inputError
                        : ''
                    : errors[item.id]
                      ? styles.inputError
                      : success[item.id]
                        ? styles.inputSuccess
                        : ''
                    }`}
                  value={item.answer}
                  placeholder={item.placeholder}
                  readOnly={mode === 'view'}
                  onChange={e => {
                    const value = e.target.value
                    onChange?.(item.id, value)

                    if (item.id === STUDENT_ID) {
                      const status = mockCheckStudentId(value)
                      setStudentStatus(status)
                      return
                    }

                    const q = questions.find(q => q.id === item.id)
                    if (!q) return
                    const newErrors = { ...errors }
                    const newSuccess = { ...success }

                    if (item.id !== STUDENT_ID && q.required && !value.trim()) {
                      newErrors[item.id] = '필수 답변 항목입니다.'
                      delete newSuccess[item.id]
                    } else if (q.pattern && !q.pattern.test(value)) {
                      newErrors[item.id] = q.errorMessage || '형식이 잘못되었습니다.'
                      delete newSuccess[item.id]
                    } else if (q.pattern && q.pattern.test(value)) {
                      newSuccess[item.id] = '비밀번호가 설정되었습니다.'
                      delete newErrors[item.id]
                    } else {
                      delete newErrors[item.id]
                      delete newSuccess[item.id]
                    }

                    setErrors(newErrors)
                    setSuccess(newSuccess)
                  }}
                  onBlur={() => handleBlur(index)}
                />

                {item.id === STUDENT_ID && studentStatus && (
                  <div className={studentStatus === 'valid' ? styles.successText : styles.errorText}>
                    {studentMessages[studentStatus]}
                  </div>
                )}

                {errors[item.id] && <div className={styles.errorText}>{errors[item.id]}</div>}
                {success[item.id] && !errors[item.id] && <div className={styles.successText}>{success[item.id]}</div>}
              </>
            )}
          </div>
        ))}
      </div>

      {enableConsent && (
        <section className={styles.consentSection}>
          <h2 className={styles.consentTitle}>
            지원서 제출을 위한<br />
            개인정보 수집 및 이용 동의서
          </h2>
          <ol className={styles.consentList}>
            <li>
              <p className={styles.listTitle}>수집하는 개인정보 항목</p>
              <div className={styles.consentBox}>
                필수 항목 : 이름, 학번, 전화번호, 이메일 주소, 학과(본전공, 복수전공), 본인확인용 비밀번호
              </div>
            </li>
            <li>
              <p className={styles.listTitle}>개인정보의 보유 및 이용 기간</p>
              <div className={styles.consentBox}>
                수집된 개인정보는 지원 기간 종료 및 선발 완료 후 6개월간 보관하며, 이후 지체 없이 파기합니다.
              </div>
              <div className={styles.consentBox}>
                지원자가 개인정보 삭제를 요청할 경우 즉시 파기합니다.
              </div>
            </li>
            <li>
              <p className={styles.listTitle}>동의 거부 권리 및 불이익 안내</p>
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
            <span className={styles.checkboxText}>위 내용에 동의합니다.</span>
          </label>
        </section>
      )}

      {enableNotice && (
        <section className={styles.noticeSection}>
          <h2 className={styles.noticeTitle}>지원서 제출 시 유의 사항</h2>
          <div className={styles.noticeItems}>
            <div className={styles.noticeItem}>
              <img src={noticeIcon} alt="" className={styles.noticeIcon} />
              <div className={styles.noticeTextGroup}>
                <p className={styles.noticeText}>지원 트랙을 변경하고 싶어요.</p>
                <p className={styles.noticeTextDetail}>
                  현재 작성 중인 지원서 페이지 내에서 트랙을 변경하는 것은 <span className={styles.highlight}>불가능</span> 합니다. <br />
                  작성 중인 지원서의 <span className={styles.highlight}>‘작성 취소’</span>를 누른 후, <br />
                  변경하고 싶은 트랙을 선택하여 지원서를 다시 작성해 주세요. <br />
                  내용은 <span className={styles.highlight}>자동 저장되지 않으므로</span> 복사/붙여넣기를 권장 드립니다.
                </p>
              </div>
            </div>
            <div className={styles.noticeItem}>
              <img src={noticeIcon} alt="" className={styles.noticeIcon} />
              <div className={styles.noticeTextGroup}>
                <p className={styles.noticeText}>제출한 지원서를 수정할 수 있나요?</p>
                <p className={styles.noticeTextDetail}>
                  1차 서류 모집 기간 내에 한하여 <span className={styles.highlight}>수정 가능</span> 합니다. <span className={styles.highlight}>학번과 본인 확인용 비밀번호</span>를 입력 후, <br />
                  최종 제출 또는 임시 저장한 지원서를 다시 수정할 수 있습니다.
                  <br /><br />
                  1차 서류 모집 기간이 끝나면, 지원서 수정 및 열람은 <span className={styles.highlight}>불가능</span> 합니다.
                </p>
              </div>
            </div>
            <div className={styles.noticeItem}>
              <img src={noticeIcon} alt="" className={styles.noticeIcon} />
              <div className={styles.noticeTextGroup}>
                <p className={styles.noticeText}>여러 트랙의 지원서를 제출 할 수 있나요?</p>
                <p className={styles.noticeTextDetail}>
                  본 모집은 <span className={styles.highlight}>1인당 1개의 트랙에 한하여</span> 1회만 지원 가능합니다.
                </p>
              </div>
            </div>
          </div>
          {/*  버튼 영역 */}
          {enableActions && (
            <div className={styles.actionRow}>
              <button className={`${styles.actionButton} ${styles[cancelState]}`}>
                작성 취소
              </button>

              <button
                className={`${styles.actionButton} ${styles[draftState]}`}
                disabled={draftState === 'unactive'}
              >
                임시 저장
              </button>

              <button
                className={`${styles.actionButton} ${styles[submitState]}`}
                disabled={submitState === 'unactive'}
              >
                최종 제출
              </button>
            </div>
          )}

        </section>
      )}
    </section>
  )
}

export default ApplyForm
