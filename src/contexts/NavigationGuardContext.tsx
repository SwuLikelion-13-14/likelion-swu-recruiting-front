import { createContext, useContext, useState } from 'react'

type NavigationGuardContextType = {
  isDirty: boolean
  setDirty: (v: boolean) => void
resetDirty: (initialState: any) => void  
  validateDraft: () => boolean
  registerValidator: (fn: () => boolean) => void
  allowNavigation: () => void
}

const NavigationGuardContext = createContext<NavigationGuardContextType>({
  isDirty: false,
  setDirty: () => {},
  resetDirty: () => {}, 
  validateDraft: () => true,
  registerValidator: () => {},
  allowNavigation: () => {}
})

export const NavigationGuardProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDirty, setDirty] = useState(false)
  const [_initialState, setInitialState] = useState<any>(null)

  const resetDirty = (state: any) => {
    setInitialState(state) // 초기값 저장
    setDirty(false)        // 현재는 dirty 아님
  }

  //  ApplyForm이 등록하는 검증 함수 저장
  const [validator, setValidator] = useState<() => boolean>(() => () => true)

  const registerValidator = (fn: () => boolean) => {
    setValidator(() => fn)
  }

  const validateDraft = () => validator()
  const allowNavigation = () => setDirty(false)

  return (
    <NavigationGuardContext.Provider
      value={{
        isDirty,
        setDirty,
        resetDirty,  
        validateDraft,
        registerValidator,
        allowNavigation
      }}
    >
      {children}
    </NavigationGuardContext.Provider>
  )
}

export const useNavigationGuard = () => useContext(NavigationGuardContext)
