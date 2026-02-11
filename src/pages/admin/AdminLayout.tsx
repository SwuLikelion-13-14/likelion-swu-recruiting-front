import { Outlet, useLocation, useNavigate } from "react-router-dom";

import AdminHeader from "@/components/admin/layout/AdminHeader";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";

type AdminNavKey = "applications" | "schedule";

function getActiveNav(pathname: string): AdminNavKey {
  if (pathname.startsWith("/admin/schedule")) return "schedule";
  return "applications";
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const active: AdminNavKey = getActiveNav(location.pathname);

  const onChangeNav = (key: AdminNavKey) => {
    navigate(
      key === "applications"
        ? "/admin/applications"
        : "/admin/schedule"
    );
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <AdminHeader subtitle="서울여대 멋쟁이사자처럼 14기" />

      <div className="flex flex-1 min-h-0">
        <div className="w-[272px] shrink-0 flex-none border-r border-[#EDEDED] bg-white">
          <AdminSidebar
            active={active}
            onChange={onChangeNav}
            onLogout={handleLogout}
            className="h-full"
          />
        </div>

        <main className="flex-1 min-h-0 min-w-0 bg-[#F7F7F7] overflow-y-auto overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
