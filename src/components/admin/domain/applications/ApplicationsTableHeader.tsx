export default function ApplicationsTableHeader({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="w-[741px] grid grid-cols-[150px_120px_126px_213px_105px_27px] items-center text-[14px] font-medium">
        <div className="pl-3 text-[#424242]">코드</div>
        <div className="text-[#424242]">이름</div>
        <div className="text-[#424242]">전화번호</div>
        <div className="text-[#424242]">파트</div>
        <div className="text-[#424242]">합/불합 여부</div>
        <div />
      </div>
    </div>
  );
}