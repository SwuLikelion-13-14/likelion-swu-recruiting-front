// src/components/admin/ui/ChipDropdown.tsx
import { useEffect, useId, useRef, useState } from "react";
import ChevronDown from "@/assets/icon/chevron-down-black.svg";

type ChipDropdownProps<T extends string> = {
  value: T;
  options: T[];
  labelMap: Record<T, string>;
  onChange: (v: T) => void;

  /** value에 따라 칩 bg/text 결정 */
  chipClass: (v: T) => string;

  /** 드롭다운 패널 폭 (기본 200) */
  panelWidthClass?: string; // e.g. "w-[200px]"

  /** 옵션 row 높이 (기본 50) */
  optionHeightClass?: string; // e.g. "h-[50px]"

  /** 옵션 텍스트 클래스 */
  optionTextClass?: string;

  /** 칩 베이스 클래스 override 가능 */
  chipBaseClass?: string;

  /** 패널 정렬 (기본 right-0) */
  panelAlignClass?: string; // e.g. "right-0" | "left-0"

  /** 버튼 disabled */
  disabled?: boolean;
};

const defaultChipBase =
  "inline-flex items-center justify-center gap-2 py-1 pl-4 pr-3 h-[24px] rounded-[12px] text-[13px] font-normal";

export default function ChipDropdown<T extends string>({
  value,
  options,
  labelMap,
  onChange,
  chipClass,
  panelWidthClass = "w-[200px]",
  optionHeightClass = "h-[50px]",
  optionTextClass = "text-[14px] font-medium text-[#424242]",
  chipBaseClass = defaultChipBase,
  panelAlignClass = "right-0",
  disabled = false,
}: ChipDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          if (disabled) return;
          setOpen((v) => !v);
        }}
        className={`${chipBaseClass} ${chipClass(value)} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
      >
        <span className="leading-[16px]">{labelMap[value]}</span>
        <img
          src={ChevronDown}
          alt=""
          aria-hidden="true"
          className="w-4 h-4 pointer-events-none"
        />
      </button>

      {open && (
        <div
          id={listboxId}
          className={`absolute ${panelAlignClass} mt-2 ${panelWidthClass} flex flex-col rounded-[12px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] overflow-hidden z-50`}
          role="listbox"
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt);
                setOpen(false);
              }}
              className={`${optionHeightClass} px-4 flex items-center ${optionTextClass} hover:bg-[#F7F7F7] transition`}
              role="option"
              aria-selected={value === opt}
            >
              {labelMap[opt]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
