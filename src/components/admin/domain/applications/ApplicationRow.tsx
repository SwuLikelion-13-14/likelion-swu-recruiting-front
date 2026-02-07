// src/components/admin/domain/applications/ApplicationRow.tsx
import ChevronDown from "@/assets/icon/chevron_down.svg";
import ChevronRight from "@/assets/icon/chevron_right.svg";

export type ResultStatus = "pending" | "pass" | "fail";

const statusLabel: Record<ResultStatus, string> = {
  pending: "선택",
  pass: "합격",
  fail: "불합격",
};

interface ApplicationRowProps {
  code: string;
  name: string;
  phone: string;
  part: string;
  status: ResultStatus;
  onChangeStatus: (v: ResultStatus) => void;
  onOpen?: () => void;
}

export default function ApplicationRow({
  code,
  name,
  phone,
  part,
  status,
  onChangeStatus,
  onOpen,
}: ApplicationRowProps) {
  return (
    <div className="mt-4">
      <div
        className={[
          // ✅ SVG: 741x54, rx=8
          "w-[741px] h-[54px] rounded-[8px] bg-white",

          // ✅ SVG 컬럼 폭 그대로
          "grid grid-cols-[150px_120px_126px_213px_105px_27px] items-center",

          // ✅ SVG 텍스트 스펙
          "text-[14px] font-normal text-[#1A1A1A] font-['Inter'] leading-normal",
        ].join(" ")}
      >
        {/* padding은 SVG가 거의 12px 느낌이라 px-3로 맞춤 */}
        <div className="pl-3">{code}</div>
        <div>{name}</div>
        <div>{phone}</div>
        <div>{part}</div>

        {/* ✅ 상태 칩 영역 (609~714) */}
        <div className="relative flex items-center justify-start">
          <select
            value={status}
            onChange={(e) => onChangeStatus(e.target.value as ResultStatus)}
            className={[
              "appearance-none outline-none border-0",
              "h-[24px] w-[52px] rounded-full bg-[#EBF3FF]",
              "px-[12px] pr-[22px]", // 텍스트+아이콘 공간
              "text-[14px] font-normal text-[#1A1A1A] font-['Inter']",
            ].join(" ")}
          >
            <option value="pending">{statusLabel.pending}</option>
            <option value="pass">{statusLabel.pass}</option>
            <option value="fail">{statusLabel.fail}</option>
          </select>

          <img
            src={ChevronDown}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-[6px] top-1/2 -translate-y-1/2 w-[12px] h-[12px]"
          />
        </div>

        {/* ✅ 우측 화살표 영역 (714~741) */}
        <button
          type="button"
          onClick={onOpen}
          className="flex items-center justify-center"
          aria-label="상세 보기"
        >
          <img
            src={ChevronRight}
            alt=""
            aria-hidden="true"
            className="w-[16px] h-[16px]"
          />
        </button>
      </div>
    </div>
  );
}
