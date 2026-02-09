import { Routes, Route } from 'react-router-dom'
import FrontPage from '@/pages/apply/FrontPage'
import HomePage from './pages/home/HomePage';
import DesignPage from './pages/apply/DesignPage';
import BackPage from './pages/apply/BackPage';
import AnnualPlanPage from './pages/home/annual-plan/AnnualPlanPage';
import ProjectListPage from './pages/project/ProjectListPage';
import FaqPage from './pages/faq/FaqPage';
import ApplyPage from '@/pages/apply/ApplyPage'
import ActivityContentPage from './pages/home/ActivityContentPage';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/annual-plan" element={<AnnualPlanPage /> } />
      <Route path="/project-list" element={<ProjectListPage />} />
      <Route path="/front" element={<FrontPage />} />
      <Route path="/design" element={<DesignPage />} />
      <Route path="/back" element={<BackPage />} />
      <Route path="/faq" element={<FaqPage /> } />
      <Route path="/apply" element={<ApplyPage /> } />
      <Route path="/activity-content" element={<ActivityContentPage />} />
    </Routes>
  )
}

export default App;
