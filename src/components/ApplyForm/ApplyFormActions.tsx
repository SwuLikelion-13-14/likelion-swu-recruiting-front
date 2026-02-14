import { useState, useEffect } from 'react'
import styles from './ApplyForm.module.css'
import Modal from '@/components/Modal/Modal'

type ButtonState = 'default' | 'unactive'

interface ApplyFormActionsProps {
  cancelState: ButtonState
  draftState: ButtonState
  submitState: ButtonState
  onDraftSave?: (options?: { skipValidation?: boolean }) => void
  onSubmit?: () => void
  onCancelConfirmed?: () => void
  hasInput?: boolean // 폼에 입력이 있는지
}

const ApplyFormActions = ({
  cancelState,
  draftState,
  submitState,
  onDraftSave,
  onSubmit,
  onCancelConfirmed,
  hasInput = false
}: ApplyFormActionsProps) => {
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
  const [isCancelStep1Open, setIsCancelStep1Open] = useState(false)
  const [isCancelStep2Open, setIsCancelStep2Open] = useState(false)
  const [isSubmitStep1Open, setIsSubmitStep1Open] = useState(false)
  const [isSubmitStep2Open, setIsSubmitStep2Open] = useState(false)
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)
  const [isDraftStep1Open, setIsDraftStep1Open] = useState(false)
  const [isDraftStep2Open, setIsDraftStep2Open] = useState(false)


  // 브라우저 새로고침/닫기 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasInput) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasInput])


  const handleDraftSave = () => {
  setIsDraftStep1Open(true)
}


  return (
    <>
      <div className={styles.actionRow}>
        {/* 작성 취소 버튼 */}
        <button
          className={`${styles.actionButton} ${styles[cancelState]}`}
          onClick={() => setIsCancelStep1Open(true)}
        >
          작성 취소
        </button>

        {/* 임시 저장 버튼 */}
        <button
          className={`${styles.actionButton} ${styles[draftState]}`}
          disabled={draftState === 'unactive'}
          onClick={handleDraftSave}
        >
          임시 저장
        </button>

        {/* 최종 제출 버튼 */}
        <button
          className={`${styles.actionButton} ${styles[submitState]}`}
          disabled={submitState === 'unactive'}
          onClick={() => setIsSubmitStep1Open(true)}
        >
          최종 제출
        </button>
      </div>

      {/* 작성 취소 Step1 */}
      {isCancelStep1Open && (
        <Modal
          isOpen={isCancelStep1Open}
          title="작성 취소"
          description="지원서의 작성을 취소할까요?"
          extraText="현재까지 작성된 내용은 모두 삭제됩니다."
          primaryButton={{
            text: '작성취소',
            onClick: () => {
              setIsCancelStep1Open(false)
              setIsCancelStep2Open(true)
            }
          }}
          secondaryButton={{
            text: '돌아가기',
            onClick: () => setIsCancelStep1Open(false)
          }}
          onClose={() => setIsCancelStep1Open(false)}
        />
      )}

      {/* 작성 취소 Step2 */}
      {isCancelStep2Open && (
        <Modal
          isOpen={isCancelStep2Open}
          title="지원서 작성 취소"
          extraText="지원서가 정상적으로 삭제되었습니다."
          primaryButton={{
            text: '확인',
            onClick: () => {
              setIsCancelStep2Open(false)
              onCancelConfirmed?.()
            }
          }}
          onClose={() => setIsCancelStep2Open(false)}
        />
      )}

      {/* 제출 Step1 */}
      {isSubmitStep1Open && (
        <Modal
          isOpen={isSubmitStep1Open}
          title="최종 제출"
          description="지원서를 최종 제출할까요?"
          extraText={
            <span>
              3월 2일 23시 59분까지<br />
              열람 및 수정이 가능합니다.
            </span>
          }
          primaryButton={{
  text: '제출하기',
  onClick: async () => {
    try {
      if(onSubmit){
        await onSubmit(); // handleFinalSubmit async 호출
      }
      setIsSubmitStep1Open(false);
      setIsSubmitStep2Open(true);
    } catch(err) {
      console.error('제출 실패:', err);
    }
  }
}}

          secondaryButton={{
            text: '취소',
            onClick: () => setIsSubmitStep1Open(false)
          }}
          onClose={() => setIsSubmitStep1Open(false)}
        />
      )}

      {/* 제출 Step2 */}
      {isSubmitStep2Open && (
        <Modal
          isOpen={isSubmitStep2Open}
          title="지원해주셔서 감사합니다!"
          extraText="지원서가 정상적으로 접수되었습니다."
          primaryButton={{
            text: '확인',
            onClick: () => {
              setIsSubmitStep2Open(false)
              window.location.href = '/'
            }
          }}
          onClose={() => setIsSubmitStep2Open(false)}
        />
      )}

      {/* 경고 모달 */}
      {isWarningModalOpen && (
        <Modal
          isOpen={isWarningModalOpen}
          title="페이지를 벗어나시겠습니까?"
          description="작성 중인 내용이 저장되지 않을 수 있습니다."
          primaryButton={{
            text: '계속 진행',
            onClick: () => {
              setIsWarningModalOpen(false)
              pendingAction?.()
              setPendingAction(null)
            }
          }}
          secondaryButton={{
            text: '돌아가기',
            onClick: () => {
              setIsWarningModalOpen(false)
              setPendingAction(null)
            }
          }}
          onClose={() => {
            setIsWarningModalOpen(false)
            setPendingAction(null)
          }}
        />
      )}

      {/* 임시저장 Step1 */}
      {isDraftStep1Open && (
        <Modal
          isOpen={isDraftStep1Open}
          title="임시 저장"
          description="지원서를 임시 저장할까요?"
          extraText={
            <span>
              3월 2일 23시 59분 까지 열람 및 수정이 가능합니다.<br /><br />
              ‘임시 저장’ 상태의 지원서는 검토 과정에서 인정되지 않습니다.<br />
              반드시 ‘최종 제출’을 눌러 지원서를 제출해 주세요.
            </span>
          }
          primaryButton={{
  text: '임시저장',
  onClick: async () => {
    try {
      if(onDraftSave){
        await onDraftSave({ skipValidation: false })
      }
      setIsDraftStep1Open(false)
      setIsDraftStep2Open(true)
    } catch(err) {
      console.error('임시저장 실패:', err)
    }
  }
}}

          secondaryButton={{
            text: '취소',
            onClick: () => setIsDraftStep1Open(false)
          }}
        />
      )}

      {/* 임시저장 Step2 */}
      {isDraftStep2Open && (
        <Modal
          isOpen={isDraftStep2Open}
          title="지원서가 임시 저장되었습니다"
          extraText={
            <span>
              저장된 지원서는<br />
              3월 2일 23시 59분 까지<br />
              열람 및 수정이 가능합니다.
            </span>
          }
          primaryButton={{
            text: '확인',
            onClick: () => {
              setIsDraftStep2Open(false)
              window.location.href = '/'  // 홈 이동
            }
          }}
        />
      )}

    </>
  )
}

export default ApplyFormActions
