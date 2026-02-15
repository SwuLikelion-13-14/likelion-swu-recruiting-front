import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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

import AdminLayout from "@/pages/admin/AdminLayout";
import AdminApplicationsPage from "@/pages/admin/AdminApplicationsPage";
import AdminApplicationDetailPage from "@/pages/admin/AdminApplicationDetailPage";
import AdminSchedulePage from "@/pages/admin/AdminSchedulePage";

import MobileGuardModal from "@/components/MobileGuardModal";

const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
  const isAuth = localStorage.getItem("admin-auth") === "true";
  if (!isAuth) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App = () => {
  return (
    <>
      <MobileGuardModal breakpoint={768} />

      <Routes>
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

        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminLayout />
            </ProtectedAdmin>
          }
        >
          <Route index element={<Navigate to="applications" replace />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="schedule" element={<AdminSchedulePage />} />
          <Route
            path="applications/detail/:code"
            element={<AdminApplicationDetailPage />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;