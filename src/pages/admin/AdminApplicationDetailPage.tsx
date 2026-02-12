import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import ApplyForm from "@/components/ApplyForm/ApplyForm";
import type { Question } from "@/components/ApplyForm/types";
import type { ResultStatus } from "@/components/admin/domain/applications/ApplicationRow";

import ChevronRight from "@/assets/icon/chevron-right-black.svg?react";
import ChipDropdown from "@/components/admin/ui/ChipDropdown";

type ApplicantDetail = {
  code: string;
  name: string;
  phone: string;
  part?: string;
  partLabel?: string;
  status?: ResultStatus;

  studentId?: string;
  major?: string;
  doubleMajor?: string;
  schoolStatus?: string;
  email?: string;

  answers?: Record<number, string>;
  portfolio?: string;

  confirmStudentId?: string;
  confirmPassword?: string;

  consentChecked?: boolean;
};

type LocationState = {
  applicant?: ApplicantDetail;
  partLabel?: string;
};

const PART_LABEL: Record<string, string> = {
  frontend: "프론트엔드",
  backend: "백엔드",
  design: "기획/디자인",
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

export default function AdminApplicationDetailPage() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const { state } = useLocation() as { state: LocationState | null };

  const applicantFromState = state?.applicant;

  const applicant: ApplicantDetail | null = useMemo(() => {
    if (applicantFromState) return applicantFromState;
    if (!code) return null;

    return {
      code,
      name: "",
      phone: "",
      partLabel: state?.partLabel ?? "",
      status: "pending",
      consentChecked: true,
      answers: {},
    };
  }, [applicantFromState, code, state?.partLabel]);

  const [status, setStatus] = useState<ResultStatus>(
    applicant?.status ?? "pending"
  );
  const [consentChecked, setConsentChecked] = useState<boolean>(
    applicant?.consentChecked ?? true
  );

  useEffect(() => {
    if (!applicant) return;
    setStatus(applicant.status ?? "pending");
    setConsentChecked(applicant.consentChecked ?? true);
  }, [applicant]);

  if (!applicant) {
    return (
      <div className="p-6">
        <button onClick={() => navigate(-1)}>← 뒤로</button>
        <p className="mt-4">지원자 데이터가 없어요.</p>
      </div>
    );
  }

  const breadcrumbPart =
    applicant.partLabel ??
    PART_LABEL[applicant.part ?? ""] ??
    applicant.part ??
    state?.partLabel ??
    "프론트엔드";

  const requiredQuestions: Question[] = useMemo(
    () => [
      { id: 1, question: "이름", type: "text", answer: applicant.name ?? "", placeholder: "" },
      { id: 2, question: "학번", type: "text", answer: applicant.studentId ?? "", placeholder: "22학번" },
      { id: 3, question: "본 전공", type: "text", answer: applicant.major ?? "", placeholder: "소프트웨어융합학과" },
      {
        id: 4,
        question: "복수 전공",
        type: "text",
        answer: applicant.doubleMajor ?? "",
        placeholder: "디지털미디어학과 (없다면 작성하지 않아도 됩니다.)",
      },
      {
        id: 5,
        question: "재학 상태",
        type: "text",
        answer: applicant.schoolStatus ?? "",
        placeholder: "X학년 X학기 재학, 휴학 또는 졸업 유예",
      },
      { id: 6, question: "전화번호", type: "text", answer: applicant.phone ?? "", placeholder: "010-1234-5678" },
      { id: 7, question: "메일 주소", type: "text", answer: applicant.email ?? "", placeholder: "example@gmail.com" },
    ],
    [applicant]
  );

  const commonQuestions: Question[] = useMemo(
    () => [
      {
        id: 101,
        question:
          "1. 다양한 IT 동아리 중에서 멋쟁이 사자처럼 대학 14기를 선택하고 지원하시게 된 이유를 작성해주세요. · · · · · (500자 이내)",
        type: "text",
        answer: applicant.answers?.[101] ?? "",
        placeholder: "내용을 입력해주세요",
      },
      {
        id: 102,
        question: "2. 해당 파트와 관련된 경험을 작성해주세요. · · · · · (600자 이내)",
        type: "text",
        answer: applicant.answers?.[102] ?? "",
        placeholder: "내용을 입력해주세요",
      },
      {
        id: 103,
        question: "3. 해당 파트에서 이루고자하는 목표를 작성해주세요. · · · · · (500자 이내)",
        type: "text",
        answer: applicant.answers?.[103] ?? "",
        placeholder: "내용을 입력해주세요",
      },
      {
        id: 104,
        question:
          "4. 팀 프로젝트 경험과 프로젝트에서 맡은 역할을 설명해주세요. 팀 프로젝트를 통해 무엇을 얻었는지, 프로젝트를 진행 도중에 어떤 문제를 만났으며 어떻게 해결했는지 알려주세요. 팀 프로젝트 경험이 없다면 개인 프로젝트로 무언가 개발했거나 학습한 경험을 알려주세요. · · · · · (1000자 이내)",
        type: "text",
        answer: applicant.answers?.[104] ?? "",
        placeholder: "내용을 입력해주세요",
      },
      {
        id: 105,
        question:
          "5. 본인의 기술적 역량을 향상시키기 위해 학습한 경험을 설명해주세요. 해당 경험과 그 과정에서의 느낀점을 구체적으로 작성해주세요. · · · · · (700자 이내)",
        type: "text",
        answer: applicant.answers?.[105] ?? "",
        placeholder: "내용을 입력해주세요",
      },
      {
        id: 106,
        question:
          "6. 멋쟁이사자처럼 대학은 최소 1회 모임 & 10시간 이상의 시간 투자를 권장합니다. 활동 기간 동안 얼마나 열정적으로, 매주 얼만큼의 시간을 할애하실 수 있는지 작성해주세요. · · · · · (500자 이내)",
        type: "text",
        answer: applicant.answers?.[106] ?? "",
        placeholder: "내용을 입력해주세요",
      },
      {
        id: 107,
        question: "7. 포트폴리오 또는 깃허브 링크를 제출해주세요.",
        type: "file",
        answer: applicant.portfolio ?? "",
        placeholder: "링크를 첨부하거나 파일을 업로드 해주세요",
      },
    ],
    [applicant]
  );

  const finalCheckQuestions: Question[] = useMemo(
    () => [
      { id: 201, question: "학번", type: "text", answer: applicant.confirmStudentId ?? "", placeholder: "학번 10자리를 입력해 주세요" },
      { id: 202, question: "본인 확인용 비밀번호", type: "text", answer: applicant.confirmPassword ?? "", placeholder: "숫자 4자리를 입력해 주세요" },
    ],
    [applicant]
  );

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
              onClick={() => navigate(-1)}
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
                {applicant.name || applicant.code}
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
        <ApplyForm mode="view" variant="result" title="필수 기본 정보" questions={requiredQuestions} enableConsent={false} enableNotice={false} enableActions={false} allQuestions={requiredQuestions} />

        <div className="mt-16" />

        <ApplyForm
          mode="view"
          variant="result"
          title="서류 공통 질문"
          subtitle="모든 지원자에게 공통으로 적용되는 필수 답변 항목입니다"
          questions={commonQuestions}
          enableConsent={false}
          enableNotice={false}
          enableActions={false}
          allQuestions={commonQuestions}
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
      </div>
    </div>
  );
}
