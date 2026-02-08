import { Routes, Route } from 'react-router-dom'
import FrontPage from '@/pages/apply/FrontPage'
import HomePage from './pages/home/HomePage';


const App = () => {
  return (
    <Routes>
      <Route path="/front" element={<FrontPage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

export default App;
