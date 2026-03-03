import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Label from "@/components/admin/ui/Label";
import ApplicationsSummaryBar, {
  type ResultFilter,
} from "@/components/admin/domain/applications/ApplicationsSummaryBar";
import ApplicationsTableHeader from "@/components/admin/domain/applications/ApplicationsTableHeader";
import ApplicationsEmptyState from "@/components/admin/domain/applications/ApplicationsEmptyState";
import ApplicationRow, {
  type ResultStatus,
} from "@/components/admin/domain/applications/ApplicationRow";

type Part = "frontend" | "backend" | "design";
type ApplyTrack = "PND" | "FRONT" | "BACK";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

const partLabel: Record<Part, string> = {
  frontend: "프론트엔드",
  backend: "백엔드",
  design: "기획/디자인",
};

const partToTrack: Record<Part, ApplyTrack> = {
  design: "PND",
  frontend: "FRONT",
  backend: "BACK",
};

type ApiListItem = {
  responseId: number;
  userId: number;
  userName: string;
  userPhoneNumber: string;
  applyTrack: ApplyTrack;
  finalResult: boolean | number | null;
};

type ApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ApiListItem[];
};

type PatchBody = {
  finalResult: 0 | 1 | null;
};

type PatchResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: null;
};

export type Applicant = {
  responseId: number;
  userId: number;
  code: string;
  name: string;
  phone: string;
  part: Part;
  status: ResultStatus;

  // 상세 페이지에서 추가로 쓰고 싶으면 optional로 유지
  studentId?: string;
  major?: string;
  doubleMajor?: string;
  enrollmentStatus?: string;
  email?: string;
};

function mapFinalResultToStatus(v: ApiListItem["finalResult"]): ResultStatus {
  if (v === null || v === undefined) return "pending";
  if (typeof v === "number") return v === 1 ? "pass" : "fail";
  return v ? "pass" : "fail";
}

function stateFilterFromUI(filter: ResultFilter): number | undefined {
  if (filter === "pass") return 1;
  if (filter === "fail") return 0;
  return undefined; // all / pending 는 stateFilter 안 보냄
}

function statusToFinalResult(status: ResultStatus): 0 | 1 | null {
  if (status === "pending") return null;
  return status === "pass" ? 1 : 0;
}

function isPart(v: string | null): v is Part {
  return v === "frontend" || v === "backend" || v === "design";
}

export default function AdminApplicationsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [part, setPart] = useState<Part>("frontend");
  const [filter, setFilter] = useState<ResultFilter>("all");

  const [items, setItems] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ✅ URL querystring -> 상태(part) 동기화
  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const p = qs.get("part");
    if (isPart(p)) setPart(p);
  }, [location.search]);

  // ✅ 상태(part) -> URL querystring 동기화
  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    qs.set("part", part);
    navigate(
      { pathname: location.pathname, search: qs.toString() },
      { replace: true }
    );
  }, [part, location.pathname, location.search, navigate]);

  // ✅ 목록 fetch
  useEffect(() => {
    const controller = new AbortController();

    async function fetchList() {
      setLoading(true);
      setErrorMsg(null);

      try {
        const applyTrack = partToTrack[part];
        const stateFilter = stateFilterFromUI(filter);

        const qs = new URLSearchParams();
        qs.set("applyTrack", applyTrack);
        if (stateFilter !== undefined) qs.set("stateFilter", String(stateFilter));

        const url = `${API_BASE}/api/admin/list?${qs.toString()}`;
        console.log("ADMIN LIST URL:", url);

        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const raw = await res.text();

        if (raw.trim().startsWith("<")) {
          console.error("HTML 응답 감지:", raw);
          throw new Error("API 대신 HTML을 받았습니다. URL 또는 서버 설정 확인 필요.");
        }

        const data: ApiResponse = JSON.parse(raw);

        if (!data.isSuccess) throw new Error(data.message ?? "요청 실패");

        const mapped: Applicant[] = data.result.map((r) => {
          const mappedPart: Part =
            r.applyTrack === "FRONT"
              ? "frontend"
              : r.applyTrack === "BACK"
              ? "backend"
              : "design";

          return {
            responseId: r.responseId,
            userId: r.userId,
            code: String(r.responseId),
            name: r.userName,
            phone: r.userPhoneNumber,
            part: mappedPart,
            status: mapFinalResultToStatus(r.finalResult),
          };
        });

        setItems(mapped);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        console.error("ADMIN LIST ERROR:", e);
        setItems([]);
        setErrorMsg(e?.message ?? "목록을 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    }

    fetchList();
    return () => controller.abort();
  }, [part, filter]);

  const byPart = useMemo(
    () => items.filter((it) => it.part === part),
    [items, part]
  );

  const filtered = useMemo(() => {
    if (filter === "all") return byPart;
    // ApplicationsSummaryBar의 filter가 ResultFilter("all" | "pass" | "fail" | "pending") 형태라면
    return byPart.filter((it) => it.status === (filter as ResultStatus));
  }, [byPart, filter]);

  const onChangePart = (next: Part) => {
    setPart(next);
    setFilter("all");
  };

  const handleChangeStatus = async (applicationId: number, next: ResultStatus) => {
    const prevStatus =
      items.find((x) => x.responseId === applicationId)?.status ?? "pending";

    // optimistic update
    setItems((prev) =>
      prev.map((x) => (x.responseId === applicationId ? { ...x, status: next } : x))
    );

    try {
      const url = `${API_BASE}/api/admin/result/${applicationId}`;

      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          finalResult: statusToFinalResult(next),
        } satisfies PatchBody),
      });

      if (!res.ok) {
        const rawErr = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}${rawErr ? ` - ${rawErr}` : ""}`);
      }

      const raw = await res.text();
      if (raw.trim().startsWith("<")) {
        console.error("HTML 응답 감지:", raw);
        throw new Error("API 대신 HTML을 받았습니다. URL 또는 서버 설정 확인 필요.");
      }

      if (raw.trim()) {
        const data: PatchResponse = JSON.parse(raw);
        if (!data.isSuccess) throw new Error(data.message ?? "요청 실패");
      }
    } catch (e: any) {
      console.error("ADMIN RESULT PATCH ERROR:", e);

      // rollback
      setItems((prev) =>
        prev.map((x) =>
          x.responseId === applicationId ? { ...x, status: prevStatus } : x
        )
      );

      alert(
        next === "pending"
          ? "서버에서 '선택' 저장을 지원하지 않는 것 같아요. (null 불가)\n백엔드에서 finalResult를 null로 받을 수 있게 해주세요."
          : e?.message ?? "합/불 상태 변경에 실패했어요."
      );
    }
  };

  return (
    <div className="min-w-[980px]">
      <div className="pl-[40px] pt-6">
        <div className="flex items-center gap-6">
          <button type="button" onClick={() => onChangePart("frontend")}>
            <Label variant={part === "frontend" ? "active" : "inactive"}>
              프론트엔드
            </Label>
          </button>
          <button type="button" onClick={() => onChangePart("backend")}>
            <Label variant={part === "backend" ? "active" : "inactive"}>
              백엔드
            </Label>
          </button>
          <button type="button" onClick={() => onChangePart("design")}>
            <Label variant={part === "design" ? "active" : "inactive"}>
              기획/디자인
            </Label>
          </button>
        </div>
      </div>

      <div className="pl-[60px] pr-10 pt-8 pb-10">
        <ApplicationsSummaryBar
          total={filtered.length}
          filter={filter}
          onChangeFilter={setFilter}
        />

        <ApplicationsTableHeader className="mt-6" />

        <div className="mt-4 space-y-2">
          {loading ? (
            <div className="py-10 text-center text-[13px] text-[#6B6B6B]">
              불러오는 중…
            </div>
          ) : errorMsg ? (
            <div className="py-10 text-center">
              <p className="text-[13px] text-[#6B6B6B]">{errorMsg}</p>
            </div>
          ) : filtered.length === 0 ? (
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
                onChangeStatus={(next) => handleChangeStatus(a.responseId, next)}
                onOpen={() => {
                  const qs = new URLSearchParams(location.search);
                  qs.set("part", part);

                  navigate(`/admin/applications/detail/${a.code}`, {
                    state: {
                      applicant: a,
                      partLabel: partLabel[a.part],
                      from: `/admin/applications?${qs.toString()}`,
                    },
                  });
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}