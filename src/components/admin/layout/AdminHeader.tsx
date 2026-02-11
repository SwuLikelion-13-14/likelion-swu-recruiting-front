import logo from "@/assets/icon/logo_orange.svg"; 
interface AdminHeaderProps {
  subtitle?: string; 
}

export default function AdminHeader({
  subtitle = "서울여대 멋쟁이사자처럼 14기",
}: AdminHeaderProps) {
  return (
    <header className="w-full bg-white border-b border-[#EDEDED]">
      <div className="h-[64px] flex items-center gap-3 px-6">
        <img src={logo} alt="LIKELION SWU" className="h-6 w-auto" />
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#BDBDBD]">
            {subtitle}
          </span>
        </div>
      </div>
    </header>
  );
}
