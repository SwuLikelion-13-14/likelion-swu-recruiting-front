export interface Question {
  id: number
  question: string
  answer: string
  placeholder?: string
  type?: 'text' | 'file'
  file?: File | null
}

export type Mode = 'edit' | 'view'
export type Variant = 'survey' | 'result'

export interface ApplyFormProps {
  mode: Mode
  variant: Variant
  title: string
  subtitle?: string
  questions: Question[]
  onChange?: (id: number, value: string) => void
  onFileChange?: (id: number, file: File) => void 
  enableConsent?: boolean
  enableNotice?: boolean
  enableActions?: boolean
  consentChecked?: boolean
  onConsentChange?: (checked: boolean) => void
}


