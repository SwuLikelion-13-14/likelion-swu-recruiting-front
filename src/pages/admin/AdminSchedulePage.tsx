import { useEffect, useMemo, useRef, useState } from "react";

import CalendarIcon from "@/assets/icon/admin_calendar.svg?react";
import ScheduleDateTimePopup, { type DateTimeValue } from "@/components/admin/domain/schedule/ScheduleDateTimePopup";

type FieldKey = "docDeadline" | "docResult" | "finalResult";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatValue(v: DateTimeValue) {
  return `${v.y}.${pad2(v.m)}.${pad2(v.d)} ${v.hh}:${v.mm}`;
}

function parseOrNow(str: string): DateTimeValue {
  const m = str.match(/^(\d{4})\.(\d{2})\.(\d{2})\s(\d{2}):(\d{2})$/);
  const now = new Date();
  if (!m) {
    return {
      y: now.getFullYear(),
      m: now.getMonth() + 1,
      d: now.getDate(),
      hh: pad2(now.getHours()),
      mm: pad2(now.getMinutes()),
    };
  }
  return {
    y: Number(m[1]),
    m: Number(m[2]),
    d: Number(m[3]),
    hh: m[4],
    mm: m[5],
  };
}

function clampMonth(y: number, m: number) {
  if (m < 1) return { y: y - 1, m: 12 };
  if (m > 12) return { y: y + 1, m: 1 };
  return { y, m };
}

const TITLE_STYLE: React.CSSProperties = {
  color: "var(--text-black, #1A1A1A)",
  fontFeatureSettings: "'liga' off, 'clig' off",
  fontSize: 24,
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "normal",
  textTransform: "uppercase",
};

const LABEL_20: React.CSSProperties = {
  color: "var(--text-black, #1A1A1A)",
  fontFamily: "var(--Fonts-Pretendard, Pretendard)",
  fontSize: "var(--Size-20, 20px)" as any,
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "120%",
  letterSpacing: "var(--Letter-spacing--1, -1px)" as any,
};

const DATE_TEXT_14: React.CSSProperties = {
  color: "var(--text-black, #1A1A1A)",
  fontFeatureSettings: "'liga' off, 'clig' off",
  fontSize: 14,
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
  textTransform: "uppercase",
};

const DATE_BLOCK_STYLE: React.CSSProperties = {
  display: "inline-flex",
  padding: "8px 16px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 10,
  borderRadius: 8,
  background: "#FFF",
};

const UPLOAD_BTN_STYLE: React.CSSProperties = {
  display: "inline-flex",
  height: 43,
  minWidth: 99,
  padding: "12px 16px",
  justifyContent: "center",
  alignItems: "center",
  gap: 10,
  borderRadius: 12,
  border: "1px solid rgba(255, 255, 255, 0.20)",
  background: "rgba(0, 0, 0, 0.75)",
  color: "#F5F5F5",
  fontFamily: "var(--Fonts-Pretendard, Pretendard)",
  fontSize: "var(--Size-16, 16px)" as any,
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "120%",
  letterSpacing: "var(--Letter-spacing-0, 0)" as any,
};

function DateField({
  label,
  value,
  onOpen,
  wrapRef,
}: {
  label: string;
  value: string;
  onOpen: () => void;
  wrapRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <section style={{ marginTop: 40 }}>
      <h3 style={{ ...LABEL_20, marginBottom: 16 }}>{label}</h3>

      <div ref={wrapRef} style={{ position: "relative", display: "inline-flex" }}>
        <button
          type="button"
          onClick={onOpen}
          style={{
            ...DATE_BLOCK_STYLE,
            cursor: "pointer",
            border: "none",
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <span style={DATE_TEXT_14}>{value}</span>
            <CalendarIcon className="w-4 h-4 text-[#1A1A1A]" />
          </div>
        </button>
      </div>
    </section>
  );
}

export default function AdminSchedulePage() {
  const [values, setValues] = useState<Record<FieldKey, string>>({
    docDeadline: "2026.03.02 15:00",
    docResult: "2026.03.02 15:00",
    finalResult: "2026.03.02 15:00",
  });

  const [openKey, setOpenKey] = useState<FieldKey | null>(null);
  const [anchor, setAnchor] = useState({ left: 0, top: 0 });

  const [viewY, setViewY] = useState<number>(2026);
  const [viewM, setViewM] = useState<number>(3);
  const [temp, setTemp] = useState<DateTimeValue>(() => parseOrNow(values.docDeadline));

  const pageRef = useRef<HTMLDivElement | null>(null);

  const docDeadlineRef = useRef<HTMLDivElement | null>(null);
  const docResultRef = useRef<HTMLDivElement | null>(null);
  const finalResultRef = useRef<HTMLDivElement | null>(null);

  const wrapperByKey: Record<FieldKey, React.RefObject<HTMLDivElement | null>> = useMemo(
    () => ({
      docDeadline: docDeadlineRef,
      docResult: docResultRef,
      finalResult: finalResultRef,
    }),
    []
  );

  const openPopupFor = (key: FieldKey) => {
    const base = parseOrNow(values[key]);
    setTemp(base);
    setViewY(base.y);
    setViewM(base.m);

    const wrap = wrapperByKey[key].current;
    const page = pageRef.current;

    if (wrap && page) {
      const r = wrap.getBoundingClientRect();
      const p = page.getBoundingClientRect();

      setAnchor({
        left: r.left - p.left + r.width + 16,
        top: r.top - p.top,
      });
    } else {
      setAnchor({ left: 0, top: 0 });
    }

    setOpenKey(key);
  };

  const closePopup = () => setOpenKey(null);

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      if (!openKey) return;

      const page = pageRef.current;
      if (!page) return;

      const t = e.target as Node;
      if (!page.contains(t)) return;

      const wrap = wrapperByKey[openKey].current;
      const popup = page.querySelector(`[data-popup="schedule-datetime"]`);

      const inWrap = wrap ? wrap.contains(t) : false;
      const inPopup = popup ? popup.contains(t) : false;

      if (!inWrap && !inPopup) closePopup();
    };

    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [openKey, wrapperByKey]);

  const onPrevMonth = () => {
    const next = clampMonth(viewY, viewM - 1);
    setViewY(next.y);
    setViewM(next.m);
  };

  const onNextMonth = () => {
    const next = clampMonth(viewY, viewM + 1);
    setViewY(next.y);
    setViewM(next.m);
  };

  const onPickDay = (day: number) => {
    setTemp((p) => ({ ...p, y: viewY, m: viewM, d: day }));
  };

  const onPickTime = (hh: string, mm: string) => {
    setTemp((p) => ({ ...p, hh, mm }));
  };

  const onDone = () => {
    if (!openKey) return;
    setValues((prev) => ({ ...prev, [openKey]: formatValue(temp) }));
    closePopup();
  };

  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onPickImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-w-[980px]">
      <div ref={pageRef} className="pl-[40px] pt-[80px] pb-20" style={{ position: "relative" }}>
        <h1 style={{ ...TITLE_STYLE, marginBottom: 24 }}>일정</h1>

        <DateField
          label="1차 서류 제출 마감 일정"
          value={values.docDeadline}
          onOpen={() => openPopupFor("docDeadline")}
          wrapRef={docDeadlineRef}
        />

        <DateField
          label="1차 서류 합격 발표 일정"
          value={values.docResult}
          onOpen={() => openPopupFor("docResult")}
          wrapRef={docResultRef}
        />

        <section style={{ marginTop: 40, marginBottom: 30 }}>
          <h3 style={{ ...LABEL_20, marginBottom: 16 }}>면접 일정 사진 등록</h3>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              setImageFile(f);
              e.currentTarget.value = "";
            }}
          />

          {!imageFile ? (
            <button type="button" style={UPLOAD_BTN_STYLE} onClick={onPickImage}>
              사진 등록
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span
                style={{
                  color: "var(--text-black, #1A1A1A)",
                  fontSize: 14,
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                }}
              >
                {imageFile.name}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button type="button" onClick={onPickImage} style={UPLOAD_BTN_STYLE}>
                  사진 수정
                </button>

                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  style={{
                    ...UPLOAD_BTN_STYLE,
                    background: "#D1D1D1",
                    border: "none",
                    color: "#1A1A1A",
                  }}
                >
                  사진 삭제
                </button>
              </div>
            </div>
          )}
        </section>

        <DateField
          label="최종 합격 발표 일정"
          value={values.finalResult}
          onOpen={() => openPopupFor("finalResult")}
          wrapRef={finalResultRef}
        />

        {openKey && (
          <div data-popup="schedule-datetime">
            <ScheduleDateTimePopup
              anchorLeft={anchor.left}
              anchorTop={anchor.top}
              temp={temp}
              viewY={viewY}
              viewM={viewM}
              onPrevMonth={onPrevMonth}
              onNextMonth={onNextMonth}
              onPickDay={onPickDay}
              onPickTime={onPickTime}
              onCancel={closePopup}
              onDone={onDone}
            />
          </div>
        )}
      </div>
    </div>
  );
}
