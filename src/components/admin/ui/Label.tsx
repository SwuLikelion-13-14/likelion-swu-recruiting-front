import type { ReactNode } from "react";

type LabelVariant = "active" | "inactive";

interface LabelProps {
  children: ReactNode;
  variant?: LabelVariant;
  className?: string;
}

export default function Label({
  children,
  variant = "inactive",
  className = "",
}: LabelProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-[14px] font-semibold leading-none";

  const variants: Record<LabelVariant, string> = {
    active: "bg-[#242424] text-[#F5F5F5]",
    inactive: "bg-[#D1D1D1] text-[#424242]",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
