
import styles from './Modal.module.css';
import type { ModalProps } from '@/types/modal'

const Modal = ({
    isOpen,
    title,
    description,
    extraText,
    primaryButton,
    secondaryButton,
    onClose,
}: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modalWrapper}>
                <div className={styles.content}>
                    {/* 타이틀 */}
                    <div className={styles.title}>{title}</div>

                    {/* 세부 텍스트 (선택) */}
                    {description && <div className={styles.description}>{description}</div>}

                    {/* 추가 안내 텍스트 (선택) */}
                    {extraText && <div className={styles.extraText}>{extraText}</div>}

                    {/* 버튼 */}
                    <div className={styles.buttons}>
                        {secondaryButton && (
                            <button
                                className={
                                    secondaryButton.active === false
                                        ? styles.deactiveButton
                                        : secondaryButton.styleClass || styles.secondaryButton
                                }
                                onClick={secondaryButton.onClick ?? onClose}
                            >
                                {secondaryButton.text}
                            </button>
                        )}

                        {primaryButton && (
                            <button
                                className={
                                    primaryButton.active === false
                                        ? styles.deactiveButton
                                        : primaryButton.styleClass || styles.primaryButton
                                }
                                onClick={primaryButton.onClick ?? onClose}
                            >
                                {primaryButton.text}
                            </button>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
