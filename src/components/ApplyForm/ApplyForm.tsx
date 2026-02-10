import { useState, useEffect } from 'react'
import styles from './ApplyForm.module.css'
import type { ApplyFormProps } from './types'
import checkboxDefault from '@/assets/icon/checkbox_default.svg'
import checkboxChecked from '@/assets/icon/checkbox_checked.svg'
import noticeIcon from '@/assets/icon/alert_octagon.svg'
import type { Question } from '@/components/ApplyForm/types'
import ApplyFormActions from './ApplyFormActions'
import Modal from '@/components/Modal/Modal'
import { useNavigationGuard } from '@/contexts/NavigationGuardContext'


type StudentStatus =
  | 'invalid'
  | 'draft-exists'
  | 'submitted-exists'
  | 'valid'

const STUDENT_ID = 15
const PASSWORD_ID = 16


const studentMessages: Record<StudentStatus, string> = {
  invalid: '형식이 다릅니다. 숫자 10자리를 입력하세요.',
  'draft-exists': '임시저장 된 지원서가 이미 있습니다. 여러 개의 지원서를 임시저장할 수 없습니다.',
  'submitted-exists': '이미 지원서를 최종 제출한 기록이 존재합니다. 중복 지원은 불가합니다.',
  valid: '지원 가능한 학번입니다.'
}

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
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'submitted' | 'draft' | null>(null)

  const { setDirty, registerValidator } = useNavigationGuard()

  const passwordAnswer =
    allQuestions.find(q => q.id === PASSWORD_ID)?.answer ?? ''


  useEffect(() => {
    if (studentStatus === 'submitted-exists') {
      const timer = setTimeout(() => {
        setModalType('submitted')
        setModalOpen(true)
      }, 3000)
      return () => clearTimeout(timer)
    }

    if (studentStatus === 'draft-exists') {
      const timer = setTimeout(() => {
        setModalType('draft')
        setModalOpen(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [studentStatus])

  

  const handleBlur = (currentId: number, allQuestions: Question[]) => {
    const newErrors: { [id: number]: string } = {}
    const newSuccess: { [id: number]: string } = {}

    const currentIndex = allQuestions.findIndex(q => q.id === currentId)
    if (currentIndex === -1) return

    for (let i = 0; i <= currentIndex; i++) {
      const q = allQuestions[i]

      if (q.type === 'file') {
        if (q.required && !q.file) {
          newErrors[q.id] = '기획디자인 트랙 지원자는 필수 답변 항목입니다.'
        }
        continue
      }

      if (q.id !== STUDENT_ID && q.required && !q.answer.trim()) {
        newErrors[q.id] = '필수 답변 항목입니다.'
      } else if (q.pattern && !q.pattern.test(q.answer)) {
        newErrors[q.id] = q.errorMessage || '형식이 다릅니다. 숫자 4자리를 입력하세요.'
      } else if (q.pattern && q.pattern.test(q.answer)) {
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
  

  const validateInfoSection = () => {
    const studentOk = studentStatus === 'valid'
    const passwordOk = /^\d{4}$/.test(passwordAnswer)

    if (!studentOk || !passwordOk) {
      const newErrors: { [id: number]: string } = {}

      if (!studentOk) {
        newErrors[STUDENT_ID] = '필수 답변 항목입니다.'
      }


      if (!passwordOk) {
        newErrors[PASSWORD_ID] = '필수 답변 항목입니다.'
      }

      setErrors(prev => ({
        ...prev,
        ...newErrors
      }))


      const firstErrorId = !studentOk
        ? STUDENT_ID
        : PASSWORD_ID

      requestAnimationFrame(() => {
        document
          .getElementById(`field-${firstErrorId}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })

      return false
    }


    return true
  }

  useEffect(() => {
    registerValidator(validateInfoSection)
  }, [studentStatus, passwordAnswer])


  // 버튼 상태 계산
  const hasAnyInput = questions.some(q => q.answer.trim() !== '')
  useEffect(() => {
    setDirty(hasAnyInput)
  }, [hasAnyInput])

  const requiredFilled = questions
    .filter(q => q.required)
    .every(q => (q.type === 'file' ? !!q.file : q.answer.trim() !== ''))

  const studentValid = studentStatus === 'valid'
  const passwordValid = /^\d{4}$/.test(passwordAnswer)
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

  return (
    <section className={`${styles.wrapper} ${variant === 'survey' ? styles.bgDark : styles.bgWhite}`}>
      {/* 헤더 */}
      <header className={styles.header}>
        <h1 className={`${styles.title} ${variant === 'survey' ? styles.titleColored : styles.titleBlack}`}>
          {title}
        </h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>

      {/* 폼 */}
      <div id="info-section" className={styles.form}>
        {questions.map((item) => (
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
                    {mode === 'view' ? '파일 다운로드' : item.file ? '파일 변경하기' : '파일 업로드'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <input
                  id={`field-${item.id}`}
                  type={item.type ?? 'text'}
                  className={`${styles.input} ${item.id === STUDENT_ID
                    ? errors[item.id]
                      ? styles.inputError
                      : studentStatus === 'valid'
                        ? styles.inputSuccess
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
                      const newErrors = { ...errors }
                      delete newErrors[STUDENT_ID]   // validate 에러 제거
                      setErrors(newErrors)

                      setStudentStatus(mockCheckStudentId(value)) // 즉시 invalid/valid 계산
                      return
                    }


                    if (item.id === PASSWORD_ID) {
                      const newErrors = { ...errors }
                      const newSuccess = { ...success }

                      // validate에서 생긴 필수 에러 제거
                      delete newErrors[PASSWORD_ID]

                      if (!/^\d{4}$/.test(value)) {
                        newErrors[PASSWORD_ID] = '형식이 다릅니다. 숫자 4자리를 입력하세요.'
                        delete newSuccess[PASSWORD_ID]
                      } else {
                        newSuccess[PASSWORD_ID] = '비밀번호가 설정되었습니다.'
                        delete newErrors[PASSWORD_ID]
                      }

                      setErrors(newErrors)
                      setSuccess(newSuccess)
                      return
                    }

                  }}
                  onBlur={() => handleBlur(item.id, allQuestions)}
                />
                {item.id === STUDENT_ID ? (
                  <div
                    className={
                      errors[item.id]
                        ? styles.errorText
                        : studentStatus === 'valid'
                          ? styles.successText
                          : styles.errorText
                    }
                  >
                    {errors[item.id] || (studentStatus ? studentMessages[studentStatus] : '')}
                  </div>
                ) : (
                  <>
                    {errors[item.id] && <div className={styles.errorText}>{errors[item.id]}</div>}
                    {success[item.id] && !errors[item.id] && <div className={styles.successText}>{success[item.id]}</div>}
                  </>
                )}

              </>
            )}
          </div>
        ))}
      </div>

      {/* 동의서*/}
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

      {/* 유의사항 */}
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
          </div>

          {/* ApplyFormActions 컴포넌트 */}
          {enableActions && (
            <ApplyFormActions
              cancelState={cancelState}
              draftState={draftState}
              submitState={submitState}
              onDraftSave={() => console.log('임시저장')}
              onSubmit={() => console.log('최종제출')}
              onCancelConfirmed={() => window.location.href = '/'} // 홈 이동
            />
          )}
        </section>
      )}
      {modalOpen && modalType === 'submitted' && (
        <Modal
          isOpen={modalOpen}
          title="이미 최종 제출한 지원서가 있습니다"
          description={
            <span>
              중복 지원은 불가하므로,<br />
              현재 작성 중인 지원서는 <span style={{ color: '#FF7710' }}>‘작성 취소’</span> 해주세요.
            </span>
          }
          extraText={
            <span>
              최종 제출한 지원서는 해당 학번으로 로그인하여,<br />
              <span style={{ color: '#FF7710' }}>3월 2일 23시 59분까지</span><br />
              열람 및 수정이 가능합니다.
            </span>
          }
          primaryButton={{
            text: '확인',
            onClick: () => setModalOpen(false)
          }}
          onClose={() => setModalOpen(false)}
        />
      )}

      {modalOpen && modalType === 'draft' && (
        <Modal
          isOpen={modalOpen}
          title="이미 임시저장된 지원서가 있습니다"
          description={
            <span>
              여러 개의 지원서를 임시저장 할 수 없으므로,<br />
              현재 작성 중인 지원서는 <span style={{ color: '#FF7710' }}>‘작성 취소’</span> 해주세요.
            </span>
          }
          extraText={
            <span>
              해당 학번으로 다시 로그인하여,<br />
              기존에 임시 저장한 지원서를 다시 확인해 주세요.
              <br /><br />
              현재 작성 된 내용은 <span style={{ color: '#FF7710' }}>저장되지 않으니,</span><br />
              <span style={{ color: '#FF7710' }}>복사/붙여넣기를 권장 드립니다.</span>
            </span>
          }
          primaryButton={{
            text: '확인',
            onClick: () => setModalOpen(false)
          }}
          onClose={() => setModalOpen(false)}
        />
      )}

    </section>
  )
}

export default ApplyForm
