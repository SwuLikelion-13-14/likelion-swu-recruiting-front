import type { ReactNode } from "react";
import squareIcon from "@/assets/icon/admin_square.svg";

type MenuButtonVariant = "dark" | "light" | "gray";

interface MenuButtonProps {
  children: ReactNode;
  variant?: MenuButtonVariant;
  className?: string;
  onClick?: () => void;
}

export default function MenuButton({
  children,
  variant = "light",
  className = "",
  onClick,
}: MenuButtonProps) {
  const base =
    "flex w-[224px] items-center gap-[10px] rounded-xl px-4 py-3 font-inter text-base font-normal";

  const variants: Record<MenuButtonVariant, string> = {
    dark: "bg-[#2B2B2B] text-[#F5F5F5]",
    light: "bg-[#FFFFFF] text-[#424242]",
    gray: "bg-[#757575] text-[#F5F5F5]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {/* 아이콘 */}
      <img
        src={squareIcon}
        alt=""
        className="shrink-0 w-4 h-4"
        aria-hidden
      />

      <span className="leading-none">{children}</span>
    </button>
  );
}
