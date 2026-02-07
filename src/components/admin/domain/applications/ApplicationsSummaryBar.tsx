// src/components/admin/domain/applications/ApplicationsSummaryBar.tsx
import ChevronDown from "@/assets/icon/chevron_down.svg?react";

export type ResultFilter = "all" | "pass" | "fail" | "pending";

const filterLabel: Record<ResultFilter, string> = {
  all: "전체",
  pass: "합격",
  fail: "불합격",
  pending: "미정",
};

interface ApplicationsSummaryBarProps {
  total: number;
  filter: ResultFilter;
  onChangeFilter: (v: ResultFilter) => void;
}

export default function ApplicationsSummaryBar({
  total,
  filter,
  onChangeFilter,
}: ApplicationsSummaryBarProps) {
  return (
    <div className="flex items-center justify-between">
      {/* 지원자 수 */}
      <div className="flex items-center gap-2">
        <span className="text-[16px] font-normal text-[#1A1A1A]">
          지원자 수
        </span>
        <span className="text-[16px] font-semibold text-[#FF7710]">
          {String(total).padStart(2, "0")}
        </span>
        <span className="text-[16px] font-normal text-[#1A1A1A]">
          명
        </span>
      </div>

      {/* 선발결과 보기 */}
      <div className="flex items-center gap-4">
        <span className="text-[16px] font-normal text-[#1A1A1A]">
          선발결과 보기
        </span>

        <div className="relative">
          <select
            value={filter}
            onChange={(e) => onChangeFilter(e.target.value as ResultFilter)}
            className="appearance-none h-[40px] rounded-full bg-[#E9E9E9] px-5 pr-10 text-[14px] font-medium text-[#1A1A1A] outline-none"
          >
            <option value="all">{filterLabel.all}</option>
            <option value="pass">{filterLabel.pass}</option>
            <option value="fail">{filterLabel.fail}</option>
            <option value="pending">{filterLabel.pending}</option>
          </select>

          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 stroke-current text-[#1A1A1A]" />
        </div>
      </div>
    </div>
  );
}
