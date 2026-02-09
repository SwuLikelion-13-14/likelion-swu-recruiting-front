import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { NavigationGuardProvider } from '@/contexts/NavigationGuardContext'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NavigationGuardProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NavigationGuardProvider>
  </StrictMode>
)
