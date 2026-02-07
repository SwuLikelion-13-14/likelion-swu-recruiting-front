import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import AnnualPlanPage from "./pages/home/annual-plan/AnnualPlanPage";
import ProjectListPage from "./pages/project/ProjectListPage";
import FaqPage from "./pages/faq/FaqPage";
import ActivityContentPage from "./pages/home/ActivityContentPage";
import LeadersPage from "./pages/home/LeadersPage";
import RecruitPage from "./pages/recruit/RecruitPage";

import ApplyPage from "@/pages/apply/ApplyPage";
import RecruitTrackPage from "./pages/apply/RecruitTrackPage";
import FrontPage from "@/pages/apply/FrontPage";
import DesignPage from "./pages/apply/DesignPage";
import BackPage from "./pages/apply/BackPage";

// ✅ Admin
import AdminApplicationsPage from "@/pages/admin/AdminApplicationsPage";

const App = () => {
  return (
    <Routes>
      {/* App (User) */}
      <Route path="/" element={<HomePage />} />
      <Route path="/annual-plan" element={<AnnualPlanPage />} />
      <Route path="/project-list" element={<ProjectListPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/activity-content" element={<ActivityContentPage />} />
      <Route path="/leaders" element={<LeadersPage />} />
      <Route path="/recruit" element={<RecruitPage />} />
      <Route path="/recruit-track" element={<RecruitTrackPage />} />
      <Route path="/front" element={<FrontPage />} />
      <Route path="/design" element={<DesignPage />} />
      <Route path="/back" element={<BackPage />} />

      {/* Admin */}
      <Route path="/admin/applications" element={<AdminApplicationsPage />} />
    </Routes>
  );
};

export default App;
