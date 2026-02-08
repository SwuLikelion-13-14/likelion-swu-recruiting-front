import { Routes, Route } from 'react-router-dom'
import FrontPage from '@/pages/apply/FrontPage'
import HomePage from './pages/home/HomePage';
import DesignPage from './pages/apply/DesignPage';
import BackPage from './pages/apply/BackPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/front" element={<FrontPage />} />
      <Route path="/design" element={<DesignPage />} />
      <Route path="/back" element={<BackPage />} />
    </Routes>
  )
}

export default App;
