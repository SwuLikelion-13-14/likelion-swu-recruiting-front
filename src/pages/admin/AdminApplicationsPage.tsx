import { useMemo, useState } from "react";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import Label from "@/components/admin/ui/Label";

import ApplicationsSummaryBar, {
  type ResultFilter,
} from "@/components/admin/domain/applications/ApplicationsSummaryBar";
import ApplicationsTableHeader from "@/components/admin/domain/applications/ApplicationsTableHeader";
import ApplicationsEmptyState from "@/components/admin/domain/applications/ApplicationsEmptyState";
import ApplicationRow, {
  type ResultStatus,
} from "@/components/admin/domain/applications/ApplicationRow";

type AdminNavKey = "applications" | "schedule";
type Part = "frontend" | "backend" | "design";

type Applicant = {
  code: string;
  name: string;
  phone: string;
  part: string;
  status: ResultStatus;
};

export default function AdminApplicationsPage() {
  const [active, setActive] = useState<AdminNavKey>("applications");
  const [part, setPart] = useState<Part>("frontend");
  const [filter, setFilter] = useState<ResultFilter>("all");

  const [items, setItems] = useState<Applicant[]>([
    {
      code: "0123",
      name: "김민지",
      phone: "01012345678",
      part: "프론트엔드",
      status: "pending",
    },
    {
      code: "0011",
      name: "이원희",
      phone: "01087654321",
      part: "프론트엔드",
      status: "pending",
    },
  ]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((it) => it.status === filter);
  }, [items, filter]);

  const onChangeStatus = (code: string, status: ResultStatus) => {
    setItems((prev) =>
      prev.map((it) => (it.code === code ? { ...it, status } : it))
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <AdminHeader subtitle="멋쟁이 사자처럼 대학 서울여대 14기" />

      <div className="flex flex-1 min-h-0">
        <AdminSidebar
          active={active}
          onChange={setActive}
          onLogout={() => alert("logout")}
          className="border-r border-[#EDEDED]"
        />

        <main className="flex-1 min-h-0 bg-[#F7F7F7]">
          {/* 🔹 파트 라벨 영역 */}
          <div className="pl-[40px] pt-6">
            <div className="flex items-center gap-6">
              <button type="button" onClick={() => setPart("frontend")}>
                <Label variant={part === "frontend" ? "active" : "inactive"}>
                  프론트엔드
                </Label>
              </button>

              <button type="button" onClick={() => setPart("backend")}>
                <Label variant={part === "backend" ? "active" : "inactive"}>
                  백엔드
                </Label>
              </button>

              <button type="button" onClick={() => setPart("design")}>
                <Label variant={part === "design" ? "active" : "inactive"}>
                  기획/디자인
                </Label>
              </button>
            </div>
          </div>

          <div className="pl-[60px] pr-10 pt-8">
            {/* 지원자 수 / 필터 */}
            <ApplicationsSummaryBar
              total={filtered.length}
              filter={filter}
              onChangeFilter={setFilter}
            />

            {/* 테이블 헤더 */}
            <ApplicationsTableHeader className="mt-6" />

            {/* Row 영역 */}
            <div className="mt-4">
              {filtered.length === 0 ? (
                <ApplicationsEmptyState />
              ) : (
                filtered.map((a) => (
                  <ApplicationRow
                    key={a.code}
                    code={a.code}
                    name={a.name}
                    phone={a.phone}
                    part={a.part}
                    status={a.status}
                    onChangeStatus={(s) => onChangeStatus(a.code, s)}
                    onOpen={() => alert(`${a.name} 상세 보기`)}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
