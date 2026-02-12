import type { ComponentType, SVGProps } from "react";

import SquareIcon from "@/assets/icon/admin_file.svg?react";
import CalendarIcon from "@/assets/icon/admin_calendar.svg?react";
import LogoutIcon from "@/assets/icon/admin_logout.svg?react";

type AdminNavKey = "applications" | "schedule";

interface AdminSidebarProps {
  active: AdminNavKey;
  onChange: (key: AdminNavKey) => void;
  onLogout?: () => void;
  className?: string;
}

type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>;

function NavItem({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: SvgIcon;
  label: string;
}) {
  const base =
    "flex items-center gap-[10px] px-4 py-3 self-stretch rounded-xl text-[15px] font-medium";
  const activeCls = "bg-[#2B2B2B] text-white";
  const inactiveCls = "text-[#444444] hover:bg-[#F3F3F3]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${active ? activeCls : inactiveCls}`}
    >
      <Icon
        className={`w-6 h-6 stroke-current ${
          active ? "text-[#F5F5F5]" : "text-[#424242]"
        }`}
      />
      <span>{label}</span>
    </button>
  );
}

export default function AdminSidebar({
  active,
  onChange,
  onLogout,
  className = "",
}: AdminSidebarProps) {
  return (
    <aside
      className={`bg-white flex flex-col w-[272px] h-full p-6 items-start gap-[10px] ${className}`}
    >
      <nav className="flex flex-col gap-6 w-full">
        <NavItem
          active={active === "applications"}
          onClick={() => onChange("applications")}
          icon={SquareIcon}
          label="지원 현황"
        />
        <NavItem
          active={active === "schedule"}
          onClick={() => onChange("schedule")}
          icon={CalendarIcon}
          label="모집 일정 관리"
        />
      </nav>

      <div className="mt-auto pt-10 w-full">
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-4 px-2 py-4 text-[15px] font-semibold text-[#444444] hover:text-[#111111]"
        >
          <LogoutIcon className="w-6 h-6 stroke-current text-[#444444]" />
          <span>나가기</span>
        </button>
      </div>
    </aside>
  );
}
