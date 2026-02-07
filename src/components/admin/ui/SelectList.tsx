import { useEffect, useMemo, useRef, useState } from "react";

type SelectValue = string;

interface SelectOption<T extends SelectValue = SelectValue> {
    label: string;
    value: T;
  }
  
  interface SelectListProps<T extends SelectValue = SelectValue> {
    options: SelectOption<T>[];
    value: T | "";
    onChange: (value: T) => void;
    placeholder?: string; 
    className?: string;
    widthClassName?: string; 
  }
  
  export default function SelectList<T extends SelectValue = SelectValue>({
    options,
    value,
    onChange,
    placeholder = "선택",
    className = "",
    widthClassName = "w-[240px]",
  }: SelectListProps<T>) {
    const [open, setOpen] = useState(false);
    const boxRef = useRef<HTMLDivElement | null>(null);
  
    useEffect(() => {
      const onDocMouseDown = (e: MouseEvent) => {
        if (!boxRef.current) return;
        if (!boxRef.current.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", onDocMouseDown);
      return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, []);
  
    const selectedLabel = useMemo(() => {
      if (!value) return placeholder;
      return options.find((o) => o.value === value)?.label ?? placeholder;
    }, [value, options, placeholder]);
  
    const container =
    "flex flex-col items-start w-[200px] rounded-xl border border-[#CFCFCF] bg-white overflow-hidden";
    
    const rowBase =
    "flex flex-col items-start self-stretch px-5 py-4 text-base font-normal text-[#1A1A1A]";
  
    const divider = "border-t border-[#D9D9D9]";
  
    return (
      <div ref={boxRef} className="relative inline-block">
        {/* 닫혀있는 경우 */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center justify-between ${container}`}
        >
          <span className={rowBase}>{selectedLabel}</span>
          <span className="pr-6 text-[#666666] select-none">{open ? "▲" : "▼"}</span>
        </button>
  
        {/* 열려있는 경우 */}
        {open && (
          <div className={`absolute left-0 top-full mt-3 ${container}`}>
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={[
                    rowBase,
                    idx !== 0 ? divider : "",
                    isSelected ? "bg-[#F4F4F4]" : "bg-white hover:bg-[#F7F7F7]",
                  ].join(" ")}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }