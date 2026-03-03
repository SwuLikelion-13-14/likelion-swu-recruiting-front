import ChipDropdown from "@/components/admin/ui/ChipDropdown";

export type ResultStatus = "pending" | "pass" | "fail";
export type ResultFilter = "all" | ResultStatus;

const filterLabel: Record<ResultFilter, string> = {
  all: "전체",
  pending: "선택",
  pass: "합격",
  fail: "불합격",
};

function getFilterChipClass(filter: ResultFilter) {
  switch (filter) {
    case "pass":
      return "bg-[#10B981] text-[#1A1A1A]";
    case "fail":
      return "bg-[#FF9A9A] text-[#1A1A1A]";
    case "pending":
      return "bg-[#EBF3FF] text-[#1A1A1A]";
    case "all":
    default:
      return "bg-[#D1D1D1] text-[#1A1A1A]";
  }
}

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
  const options: ResultFilter[] = ["all", "pending", "pass", "fail"];

  return (
    <div className="flex items-center justify-between w-[741px]">
      <div className="flex items-center gap-2">
        <span className="text-[16px] font-normal text-[#1A1A1A]">지원자 수</span>
        <span className="text-[16px] font-semibold text-[#FF7710]">
          {String(total).padStart(2, "0")}
        </span>
        <span className="text-[16px] font-normal text-[#1A1A1A]">명</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[14px] font-normal text-[#1A1A1A]">
          선발결과 보기
        </span>

        <ChipDropdown<ResultFilter>
          value={filter}
          options={options}
          labelMap={filterLabel}
          onChange={onChangeFilter}
          chipClass={getFilterChipClass}
          panelAlignClass="right-0"
          panelWidthClass="w-[200px]"
        />
      </div>
    </div>
  );
}