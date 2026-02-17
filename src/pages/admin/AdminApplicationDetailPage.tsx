import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import ApplyForm from "@/components/ApplyForm/ApplyForm";
import type { Question } from "@/components/ApplyForm/types";
import type { ResultStatus } from "@/components/admin/domain/applications/ApplicationRow";

import ChevronRight from "@/assets/icon/chevron-right-black.svg?react";
import ChipDropdown from "@/components/admin/ui/ChipDropdown";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

type Track = "FRONT" | "BACK" | "PND";

type ApiAnswer = {
  questionId: number;
  part: string;
  no: number;
  question: string;
  responseText: string;
};

type ApiDetailResult = {
  responseId: number;
  name: string;
  track: Track;
  answers: ApiAnswer[];
  fileName?: string | null;
  fileUrl?: string | null;
};

type ApiDetailResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ApiDetailResult;
};

type ApplicantDetailFromState = {
  responseId?: number;
  userId?: number;
  code?: string;
  name?: string;
  phone?: string;
  partLabel?: string;
  status?: ResultStatus;
};

type LocationState = {
  applicant?: ApplicantDetailFromState;
  partLabel?: string;
  from?: string;
};

const TRACK_LABEL: Record<Track, string> = {
  FRONT: "프론트엔드",
  BACK: "백엔드",
  PND: "기획/디자인",
};

const STATUS_LABEL: Record<ResultStatus, string> = {
  pending: "선택",
  pass: "합격",
  fail: "불합격",
};

function getStatusChipClass(status: ResultStatus) {
  switch (status) {
    case "pass":
      return "bg-[#10B981] border border-[#10B981] text-[#1A1A1A]";
    case "fail":
      return "bg-[#FF9A9A] border border-[#FF9A9A] text-[#1A1A1A]";
    default:
      return "bg-[#EBF3FF] border border-[#EBF3FF] text-[#1A1A1A]";
  }
}

function toViewQuestion(a: ApiAnswer): Question {
  return {
    id: a.questionId,
    question: a.question,
    type: "text",
    answer: a.responseText ?? "",
    placeholder: "",
  };
}

function normalizePath(raw?: string | null) {
  const s = (raw ?? "").trim();
  if (!s) return null;

  if (/^https?:\/\//i.test(s)) return s;

  const path = s.startsWith("/") ? s : `/${s}`;

  const alreadyEncoded = /%[0-9A-Fa-f]{2}/.test(path);
  if (alreadyEncoded) return path;

  const encoded = path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");

  return encoded;
}

function buildDownloadCandidates(raw?: string | null) {
  const normalized = normalizePath(raw);
  if (!normalized) return [];

  if (/^https?:\/\//i.test(normalized)) return [normalized];

  const origin = new URL(API_BASE).origin;
  const apiBase = API_BASE.replace(/\/+$/, ""); 

  const isPortfolio = normalized.startsWith("/portfolio/");
  const portfolioPath = isPortfolio ? normalized : normalized; 

  const candidates: string[] = [];

  candidates.push(`${origin}${portfolioPath}`);

  if (isPortfolio) candidates.push(`${origin}/api${portfolioPath}`);
  else candidates.push(`${origin}/api${portfolioPath}`);

  candidates.push(`${apiBase}${portfolioPath}`);
  if (isPortfolio) candidates.push(`${apiBase}/api${portfolioPath}`);

  return Array.from(new Set(candidates));
}

function pickPortfolioPath(detail: ApiDetailResult | null) {
  if (!detail) return null;

  if ((detail.fileUrl ?? "").trim()) return detail.fileUrl!.trim();

  const ans = detail.answers ?? [];

  const q14 = ans.find((a) => a.questionId === 14)?.responseText?.trim();
  if (q14) return q14;

  const anyPortfolio = ans
    .find((a) => (a.responseText ?? "").includes("portfolio/"))
    ?.responseText?.trim();
  if (anyPortfolio) return anyPortfolio;

  const anyUrl = ans
    .find((a) => /^https?:\/\//i.test((a.responseText ?? "").trim()))
    ?.responseText?.trim();

  return anyUrl ?? null;
}

function pickStudentId(detail: ApiDetailResult | null) {
  if (!detail) return "";

  const basics = (detail.answers ?? []).filter((a) => a.part === "BASIC");

  const byId2 = basics.find((a) => a.questionId === 2)?.responseText?.trim();
  if (byId2) return byId2;

  const byQuestion = basics
    .find((a) => (a.question ?? "").includes("학번"))
    ?.responseText?.trim();
  if (byQuestion) return byQuestion;

  const byNo2 = basics.find((a) => a.no === 2)?.responseText?.trim();
  return byNo2 ?? "";
}

async function forceDownloadWithFallback(
  rawOrUrl: string,
  fallbackName?: string
) {
  const candidates = buildDownloadCandidates(rawOrUrl);
  if (candidates.length === 0) throw new Error("다운로드 URL이 비어있어요.");

  let lastErr: any = null;

  for (const url of candidates) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) {
        lastErr = new Error(`HTTP ${res.status}`);
        continue;
      }

      const blob = await res.blob();

      const cd = res.headers.get("content-disposition") ?? "";
      const match =
        cd.match(/filename\*=UTF-8''([^;]+)/i) ||
        cd.match(/filename="?([^"]+)"?/i);

      const nameFromHeader = match?.[1] ? decodeURIComponent(match[1]) : null;

      const nameFromUrl = (() => {
        try {
          const u = new URL(url);
          return u.pathname.split("/").pop() || null;
        } catch {
          return url.split("/").pop() || null;
        }
      })();

      const fileName =
        (nameFromHeader && nameFromHeader.trim()) ||
        (fallbackName && fallbackName.trim()) ||
        (nameFromUrl && nameFromUrl.trim()) ||
        "download";

      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objUrl);

      return; 
    } catch (e) {
      lastErr = e;
      continue;
    }
  }

  throw new Error(
    `파일 다운로드 경로를 찾지 못했어요. (시도: ${candidates.length}개, 마지막 에러: ${
      lastErr?.message ?? "unknown"
    })`
  );
}

export default function AdminApplicationDetailPage() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const { state } = useLocation() as { state: LocationState | null };

  const responseId = useMemo(() => {
    const n = Number(code);
    return Number.isFinite(n) ? n : null;
  }, [code]);

  const applicantFromState = state?.applicant;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [detail, setDetail] = useState<ApiDetailResult | null>(null);

  const [status, setStatus] = useState<ResultStatus>(
    applicantFromState?.status ?? "pending"
  );

  const [consentChecked, setConsentChecked] = useState<boolean>(true);

  const goBackToList = () => {
    const fallback = "/admin/applications";
    const to = state?.from || fallback;
    navigate(to, { replace: true });
  };

  useEffect(() => {
    if (!responseId) {
      setErrorMsg("유효하지 않은 responseId 입니다.");
      return;
    }

    const controller = new AbortController();

    async function fetchDetail() {
      setLoading(true);
      setErrorMsg(null);

      try {
        const url = `${API_BASE}/api/admin/response/${responseId}`;

        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const raw = await res.text();
        if (raw.trim().startsWith("<")) {
          throw new Error("API 대신 HTML을 받았습니다. URL/서버 라우팅 확인 필요.");
        }

        const data: ApiDetailResponse = JSON.parse(raw);
        if (!data?.isSuccess) throw new Error(data?.message ?? "요청 실패");

        setDetail(data.result);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setDetail(null);
        setErrorMsg(e?.message ?? "상세 정보를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
    return () => controller.abort();
  }, [responseId]);

  const breadcrumbPart = useMemo(() => {
    if (detail?.track) return TRACK_LABEL[detail.track];
    if (applicantFromState?.partLabel) return applicantFromState.partLabel;
    if (state?.partLabel) return state.partLabel;
    return "지원자";
  }, [detail?.track, applicantFromState?.partLabel, state?.partLabel]);

  const displayName = detail?.name || applicantFromState?.name || code || "";

  const studentIdFromBasic = useMemo(() => pickStudentId(detail), [detail]);

  const portfolioRaw = useMemo(() => pickPortfolioPath(detail) ?? "", [detail]);

  const portfolioCandidates = useMemo(
    () => buildDownloadCandidates(portfolioRaw),
    [portfolioRaw]
  );

  const requiredQuestions: Question[] = useMemo(() => {
    if (!detail) return [];

    const basics = (detail.answers ?? [])
      .filter((a) => a.part === "BASIC")
      .sort((a, b) => a.no - b.no)
      .map(toViewQuestion);

    if (basics.length === 0) {
      return [
        {
          id: 1,
          question: "이름",
          type: "text",
          answer: detail.name ?? "",
          placeholder: "",
        },
      ];
    }
    return basics;
  }, [detail]);

  const commonQuestions: Question[] = useMemo(() => {
    if (!detail) return [];

    const others = (detail.answers ?? [])
      .filter((a) => a.part !== "BASIC")
      .sort((a, b) => {
        if (a.part === b.part) return a.no - b.no;
        return String(a.part).localeCompare(String(b.part));
      })
      .map(toViewQuestion);
    others.push({
      id: 999999,
      question: `포트폴리오 (${detail.fileName ?? "파일"})`,
      type: "file",
      answer: portfolioRaw, // 표시용
      fileLink: portfolioCandidates[0] ?? "", 
      placeholder: "",
    });

    return others;
  }, [detail, portfolioRaw, portfolioCandidates]);

  const finalCheckQuestions: Question[] = useMemo(
    () => [
      {
        id: 201,
        question: "학번",
        type: "text",
        answer: studentIdFromBasic,
        placeholder: "학번 10자리를 입력해 주세요",
      },
    ],
    [studentIdFromBasic]
  );

  if (!responseId) {
    return (
      <div className="p-6">
        <button onClick={goBackToList}>← 목록으로</button>
        <p className="mt-4">유효하지 않은 지원 응답 ID 입니다.</p>
      </div>
    );
  }

  return (
    <div className="min-w-[1100px] min-h-full">
      <div
        className="sticky top-0 z-40 border-b border-[#EDEDED]"
        style={{
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div className="h-[72px] pr-[60px] flex items-center justify-between">
          <div className="flex items-center pl-[32px]">
            <button
              type="button"
              onClick={goBackToList}
              className="text-[14px] font-[500] text-[#FF7710]"
            >
              ← 목록으로
            </button>

            <div className="h-5 w-[1px] bg-[#D9D9D9] mx-[48px]" />

            <div className="flex items-center">
              <span className="text-[16px] font-[600] text-[#1A1A1A]">
                {breadcrumbPart}
              </span>

              <ChevronRight className="mx-2 w-6 h-6" />

              <span className="text-[16px] font-[500] text-[#1A1A1A]">
                {displayName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-[16px] font-[500] text-[#1A1A1A]">
              합/불합 여부
            </div>

            <ChipDropdown<ResultStatus>
              value={status}
              options={["pending", "pass", "fail"]}
              labelMap={STATUS_LABEL}
              onChange={setStatus}
              chipClass={getStatusChipClass}
              panelWidthClass="w-[200px]"
              optionHeightClass="h-[50px]"
              panelAlignClass="right-0"
            />
          </div>
        </div>
      </div>

      <div className="px-[60px] pb-24 pt-10">
        {loading ? (
          <div className="py-20 text-center text-[13px] text-[#6B6B6B]">
            불러오는 중…
          </div>
        ) : errorMsg ? (
          <div className="py-20 text-center">
            <p className="text-[13px] text-[#6B6B6B]">{errorMsg}</p>
            <div className="mt-4">
              <button
                type="button"
                onClick={goBackToList}
                className="text-[13px] font-[500] text-[#FF7710]"
              >
                목록으로 이동
              </button>
            </div>
          </div>
        ) : (
          <>
            <ApplyForm
              mode="view"
              variant="result"
              title="필수 기본 정보"
              questions={requiredQuestions}
              enableConsent={false}
              enableNotice={false}
              enableActions={false}
              allQuestions={requiredQuestions}
            />

            <div className="mt-16" />

            <ApplyForm
              mode="view"
              variant="result"
              title="서류 공통 질문"
              subtitle="지원서에 작성한 답변 항목입니다"
              questions={commonQuestions}
              enableConsent={false}
              enableNotice={false}
              enableActions={false}
              allQuestions={commonQuestions}
              onFileDownload={async (_urlFromApplyForm, fileName) => {
                try {
                  await forceDownloadWithFallback(
                    portfolioRaw || _urlFromApplyForm,
                    fileName
                  );
                } catch (e: any) {
                  alert(e?.message ?? "파일을 다운로드하지 못했어요.");
                  console.log("download candidates:", portfolioCandidates);
                  console.log("raw:", portfolioRaw);
                }
              }}
            />

            <div className="mt-16" />

            <ApplyForm
              mode="view"
              variant="result"
              title="지원서 최종 제출을 위한 정보 확인"
              subtitle="추후 지원서 열람 및 수정을 위해 필요한 정보를 재확인합니다"
              questions={finalCheckQuestions}
              enableConsent={true}
              enableNotice={false}
              enableActions={false}
              consentChecked={consentChecked}
              onConsentChange={setConsentChecked}
              allQuestions={finalCheckQuestions}
            />
          </>
        )}
      </div>
    </div>
  );
}
