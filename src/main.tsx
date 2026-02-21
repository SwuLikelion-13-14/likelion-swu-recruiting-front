import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { NavigationGuardProvider } from '@/contexts/NavigationGuardContext'

createRoot(document.getElementById('root')!).render(

  <BrowserRouter>
    <NavigationGuardProvider>
      <App />
    </NavigationGuardProvider>
  </BrowserRouter>

)
