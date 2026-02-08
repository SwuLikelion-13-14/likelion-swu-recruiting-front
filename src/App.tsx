import { Routes, Route } from 'react-router-dom'
import FrontPage from '@/pages/apply/FrontPage'
import HomePage from './pages/home/HomePage';
import AnnualPlanPage from './pages/home/annual-plan/AnnualPlanPage';
import ProjectListPage from './pages/project/ProjectListPage';

const App = () => {
  return (
    <Routes>
      <Route path="/front" element={<FrontPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/annual-plan" element={<AnnualPlanPage /> } />
      <Route path="/project-list" element={<ProjectListPage />} />
    </Routes>
  )
}

export default App;
