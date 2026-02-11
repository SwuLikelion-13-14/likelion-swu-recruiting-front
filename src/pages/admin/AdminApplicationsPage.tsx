// src/pages/admin/AdminApplicationsPage.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Label from "@/components/admin/ui/Label";
import ApplicationsSummaryBar, { type ResultFilter } from "@/components/admin/domain/applications/ApplicationsSummaryBar";
import ApplicationsTableHeader from "@/components/admin/domain/applications/ApplicationsTableHeader";
import ApplicationsEmptyState from "@/components/admin/domain/applications/ApplicationsEmptyState";
import ApplicationRow, { type ResultStatus } from "@/components/admin/domain/applications/ApplicationRow";

type Part = "frontend" | "backend" | "design";

const partLabel: Record<Part, string> = {
  frontend: "프론트엔드",
  backend: "백엔드",
  design: "기획/디자인",
};

export type Applicant = {
  code: string;
  name: string;
  phone: string;
  part: Part;
  status: ResultStatus;
  studentId: string;
  major: string;
  doubleMajor?: string;
  enrollmentStatus: string;
  email: string;
};

export default function AdminApplicationsPage() {
  const navigate = useNavigate();

  const [part, setPart] = useState<Part>("frontend");
  const [filter, setFilter] = useState<ResultFilter>("all");

  const [items, setItems] = useState<Applicant[]>([
    {
      code: "0123",
      name: "김민지",
      phone: "01012345678",
      part: "frontend",
      status: "pending",
      studentId: "22학번",
      major: "소프트웨어융합학과",
      doubleMajor: "디지털미디어학과",
      enrollmentStatus: "재학",
      email: "minji@example.com",
    },
    {
      code: "0011",
      name: "이원희",
      phone: "01087654321",
      part: "frontend",
      status: "pending",
      studentId: "22학번",
      major: "소프트웨어융합학과",
      doubleMajor: "",
      enrollmentStatus: "재학",
      email: "wonhee@example.com",
    },
    {
      code: "0210",
      name: "박서연",
      phone: "01022223333",
      part: "backend",
      status: "pending",
      studentId: "21학번",
      major: "소프트웨어융합학과",
      doubleMajor: "경영학과",
      enrollmentStatus: "재학",
      email: "seoyeon@example.com",
    },
    {
      code: "0451",
      name: "정유진",
      phone: "01099990000",
      part: "design",
      status: "pending",
      studentId: "23학번",
      major: "소프트웨어융합학과",
      doubleMajor: "",
      enrollmentStatus: "휴학",
      email: "yujin@example.com",
    },
  ]);

  const byPart = useMemo(() => items.filter((it) => it.part === part), [items, part]);

  const filtered = useMemo(() => {
    if (filter === "all") return byPart;
    return byPart.filter((it) => it.status === filter);
  }, [byPart, filter]);

  const onChangeStatus = (code: string, status: ResultStatus) => {
    setItems((prev) => prev.map((it) => (it.code === code ? { ...it, status } : it)));
  };

  const onChangePart = (next: Part) => {
    setPart(next);
    setFilter("all");
  };

  return (
    <div className="min-w-[980px]">
      <div className="pl-[40px] pt-6">
        <div className="flex items-center gap-6">
          <button type="button" onClick={() => onChangePart("frontend")}>
            <Label variant={part === "frontend" ? "active" : "inactive"}>프론트엔드</Label>
          </button>
          <button type="button" onClick={() => onChangePart("backend")}>
            <Label variant={part === "backend" ? "active" : "inactive"}>백엔드</Label>
          </button>
          <button type="button" onClick={() => onChangePart("design")}>
            <Label variant={part === "design" ? "active" : "inactive"}>기획/디자인</Label>
          </button>
        </div>
      </div>

      <div className="pl-[60px] pr-10 pt-8 pb-10">
        <ApplicationsSummaryBar total={filtered.length} filter={filter} onChangeFilter={setFilter} />
        <ApplicationsTableHeader className="mt-6" />

        <div className="mt-4 space-y-2">
          {filtered.length === 0 ? (
            <ApplicationsEmptyState />
          ) : (
            filtered.map((a) => (
              <ApplicationRow
                key={a.code}
                code={a.code}
                name={a.name}
                phone={a.phone}
                part={partLabel[a.part]}
                status={a.status}
                onChangeStatus={(s) => onChangeStatus(a.code, s)}
                onOpen={() =>
                  navigate(`/admin/applications/detail/${a.code}`, {
                    state: { applicant: a, partLabel: partLabel[a.part] },
                  })
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
