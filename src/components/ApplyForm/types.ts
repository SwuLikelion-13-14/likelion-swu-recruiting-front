export interface Question {
  id: number
  apiId?: number 
  question: string
  answer: string
  placeholder?: string
  type?: 'text' | 'password' | 'file';
  file?: File | null
  required?: boolean
  pattern?: RegExp;
  errorMessage?: string;
  serverId?: number
  fileLink?: string 
}

export type Mode = 'edit' | 'view'
export type Variant = "survey" | "result" | "admin";


export interface ApplyFormProps {
  mode: Mode
  variant: Variant
  title: string
  subtitle?: string
  questions: Question[]
  onChange?: (id: number, value: string) => void
  onFileChange?: (id: number, file: File | null) => void;
  enableConsent?: boolean
  enableNotice?: boolean
  enableActions?: boolean
  consentChecked?: boolean
  onConsentChange?: (checked: boolean) => void
  allQuestions: Question[]
  onSubmit?: () => void
  onDraftSave?: (options?: { skipValidation?: boolean }) => void

  studentIdField?: number;  
  passwordField?: number;   
  dbStatus?: 'none' | 'draft-exists' | 'submitted-exists';
}