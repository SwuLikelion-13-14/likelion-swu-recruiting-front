import type { ReactNode } from "react";

type MenuCardVariant = "white" | "cream" | "yellow";

interface MenuCardProps {
  children: ReactNode;
  variant?: MenuCardVariant;
  className?: string;
  onClick?: () => void;
}

export default function MenuCard({
  children,
  variant = "white",
  className = "",
  onClick,
}: MenuCardProps) {
  
  const base =
  "flex flex-col w-[200px] items-start gap-[10px] rounded-none px-5 py-4 font-inter text-base font-normal text-[#1A1A1A]";

  const variants: Record<MenuCardVariant, string> = {
    white: "bg-[#FFFFFF]",
    cream: "bg-[#FFF4E6]",
    yellow: "bg-[#FFD58F]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      <span className="block text-left">{children}</span>
    </button>
  );
}