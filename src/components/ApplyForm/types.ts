export interface Question {
  id: number
  question: string
  answer: string
  placeholder?: string
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
  enableConsent?: boolean
  enableNotice?: boolean
  enableActions?: boolean
  consentChecked?: boolean
  onConsentChange?: (checked: boolean) => void
}


