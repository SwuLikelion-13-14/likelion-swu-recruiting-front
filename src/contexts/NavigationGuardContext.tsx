import { createContext, useContext, useState } from 'react'

type NavigationGuardContextType = {
  isDirty: boolean
  setDirty: (v: boolean) => void

  // 🔥 추가
  validateDraft: () => boolean
  registerValidator: (fn: () => boolean) => void
}

const NavigationGuardContext = createContext<NavigationGuardContextType>({
  isDirty: false,
  setDirty: () => {},
  validateDraft: () => true,
  registerValidator: () => {}
})

export const NavigationGuardProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDirty, setDirty] = useState(false)

  //  ApplyForm이 등록하는 검증 함수 저장
  const [validator, setValidator] = useState<() => boolean>(() => () => true)

  const registerValidator = (fn: () => boolean) => {
    setValidator(() => fn)
  }

  const validateDraft = () => {
    return validator()
  }

  return (
    <NavigationGuardContext.Provider
      value={{
        isDirty,
        setDirty,
        validateDraft,
        registerValidator
      }}
    >
      {children}
    </NavigationGuardContext.Provider>
  )
}

export const useNavigationGuard = () => useContext(NavigationGuardContext)
