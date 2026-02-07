import { Routes, Route } from 'react-router-dom'
import FrontPage from '@/pages/apply/FrontPage'


const App = () => {
  return (
    <Routes>
      <Route path="/front" element={<FrontPage />} />
    </Routes>
  )
}

export default App;
