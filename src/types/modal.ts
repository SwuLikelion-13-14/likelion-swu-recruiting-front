import type { ReactNode } from 'react';

export interface ModalButton {
  text: string;
  onClick?: () => void; // 나중에 동작 연결
  active?: boolean;     // 활성/비활성 상태
  styleClass?: string;
}

export interface ModalProps {
  isOpen: boolean;
  title: string;            // 모달 상단 타이틀
  description?: string | ReactNode 
  extraText?: string | ReactNode 
  primaryButton?: ModalButton;
  secondaryButton?: ModalButton;
  onClose?: () => void;
}
