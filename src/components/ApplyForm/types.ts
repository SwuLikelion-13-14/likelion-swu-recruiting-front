export interface Question {
  id: number;
  apiId?: number;
  question: string;
  answer: string;
  placeholder?: string;
  type?: "text" | "password" | "file";
  file?: File | null;
  required?: boolean;
  pattern?: RegExp;
  errorMessage?: string;
  serverId?: number;
  fileLink?: string;
}

export type Mode = "edit" | "view";

/**
 * survey: 사용자 지원폼(다크)
 * result: 결과/뷰(화이트 카드)
 * admin: 관리자 상세(배경 투명 + 텍스트 검정)
 */
export type Variant = "survey" | "result" | "admin";

export interface ApplyFormProps {
  mode: Mode;
  variant: Variant;

  title: string;
  subtitle?: string;

  questions: Question[];

  onChange?: (id: number, value: string) => void;
  onFileChange?: (id: number, file: File | null) => void;

  enableConsent?: boolean;
  enableNotice?: boolean;
  enableActions?: boolean;

  consentChecked?: boolean;
  onConsentChange?: (checked: boolean) => void;

  allQuestions: Question[];

  onSubmit?: () => Promise<boolean> | void;
  onDraftSave?: (options?: { skipValidation?: boolean }) => Promise<boolean> | void;

  onDirectSubmit?: () => Promise<boolean>;
  onDirectDraftSave?: () => Promise<boolean>;

  studentIdField?: number;
  passwordField?: number;

  dbStatus?: "none" | "draft-exists" | "submitted-exists";
  isLoaded?: boolean;

  onFileDownload?: (url: string, fileName?: string) => void | Promise<void>;
}