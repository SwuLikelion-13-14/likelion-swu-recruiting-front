import ChevronRight from "@/assets/icon/chevron-right-gray.svg";
import ChipDropdown from "@/components/admin/ui/ChipDropdown";

export type ResultStatus = "pending" | "pass" | "fail";

const statusLabel: Record<ResultStatus, string> = {
  pending: "선택",
  pass: "합격",
  fail: "불합격",
};

function getStatusChipClass(status: ResultStatus) {
  switch (status) {
    case "pass":
      return "bg-[#10B981] text-[#1A1A1A]";
    case "fail":
      return "bg-[#FF9A9A] text-[#1A1A1A]";
    default:
      return "bg-[#EBF3FF] text-[#1A1A1A]";
  }
}

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
  const options: ResultStatus[] = ["pending", "pass", "fail"];

  return (
    <div className="mt-4">
      <div className="w-[741px] h-[54px] rounded-[8px] bg-white grid grid-cols-[150px_120px_126px_213px_105px_27px] items-center text-[14px] font-normal text-[#1A1A1A]">
        <div className="pl-3">{code}</div>
        <div>{name}</div>
        <div>{phone}</div>
        <div>{part}</div>

        <div className="flex justify-start">
          <ChipDropdown<ResultStatus>
            value={status}
            options={options}
            labelMap={statusLabel}
            onChange={onChangeStatus}
            chipClass={getStatusChipClass}
            panelAlignClass="right-0"
            panelWidthClass="w-[200px]"
          />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen?.();
          }}
          className="flex items-center justify-center"
          aria-label="상세 보기"
        >
          <img
            src={ChevronRight}
            alt=""
            aria-hidden="true"
            className="w-[24px] h-[24px] pointer-events-none"
          />
        </button>
      </div>
    </div>
  );
}
