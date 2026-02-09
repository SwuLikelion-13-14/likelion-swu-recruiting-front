import { useState } from 'react'
import styles from './ApplyForm.module.css'
import Modal from '@/components/Modal/Modal'

type ButtonState = 'default' | 'unactive'

interface ApplyFormActionsProps {
  cancelState: ButtonState
  draftState: ButtonState
  submitState: ButtonState
  onDraftSave?: () => void
  onSubmit?: () => void
  onCancelConfirmed?: () => void
}

const ApplyFormActions = ({
  cancelState,
  draftState,
  submitState,
  onDraftSave,
  onSubmit,
  onCancelConfirmed
}: ApplyFormActionsProps) => {
  const [isCancelStep1Open, setIsCancelStep1Open] = useState(false)
  const [isCancelStep2Open, setIsCancelStep2Open] = useState(false)

  return (
    <>
      <div className={styles.actionRow}>
        <button
          className={`${styles.actionButton} ${styles[cancelState]}`}
          onClick={() => setIsCancelStep1Open(true)}
        >
          작성 취소
        </button>

        <button
          className={`${styles.actionButton} ${styles[draftState]}`}
          disabled={draftState === 'unactive'}
          onClick={onDraftSave}
        >
          임시 저장
        </button>

        <button
          className={`${styles.actionButton} ${styles[submitState]}`}
          disabled={submitState === 'unactive'}
          onClick={onSubmit}
        >
          최종 제출
        </button>
      </div>

      {/* Step1 */}
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

      {/* Step2 */}
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
    </>
  )
}

export default ApplyFormActions
