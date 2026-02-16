import { useEffect, useMemo, useRef } from "react";

export type DateTimeValue = {
  y: number;
  m: number;
  d: number;
  hh: string;
  mm: string;
};

type Props = {
  anchorLeft: number;
  anchorTop: number;
  temp: DateTimeValue;
  viewY: number;
  viewM: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPickDay: (day: number) => void;
  onPickTime: (hh: string, mm: string) => void;
  onCancel: () => void;
  onDone: () => void;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate();
}

function firstDayIndexMonStart(y: number, m: number) {
  const js = new Date(y, m - 1, 1).getDay();
  return (js + 6) % 7;
}

function buildCalendarGrid(y: number, m: number) {
  const first = firstDayIndexMonStart(y, m);
  const total = daysInMonth(y, m);
  const cells: Array<{ day: number | null }> = [];
  for (let i = 0; i < first; i++) cells.push({ day: null });
  for (let d = 1; d <= total; d++) cells.push({ day: d });
  while (cells.length % 7 !== 0) cells.push({ day: null });
  return cells;
}

const TEXT_16_SB: React.CSSProperties = {
  color: "#1A1A1A",
  fontFeatureSettings: "'liga' off, 'clig' off",
  fontSize: 16,
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "normal",
  letterSpacing: "1.28px",
  textTransform: "uppercase",
};

const TEXT_16_M: React.CSSProperties = {
  color: "#1A1A1A",
  fontFeatureSettings: "'liga' off, 'clig' off",
  fontSize: 16,
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "normal",
  textTransform: "lowercase",
};

const TEXT_14_U: React.CSSProperties = {
  color: "#1A1A1A",
  fontFeatureSettings: "'liga' off, 'clig' off",
  fontSize: 14,
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
  textDecorationLine: "underline",
  textTransform: "uppercase",
};

const TEXT_14_CENTER: React.CSSProperties = {
  color: "#1A1A1A",
  textAlign: "center",
  fontFeatureSettings: "'liga' off, 'clig' off",
  fontSize: 14,
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
  textTransform: "uppercase",
};

const BTN_WRAPPER: React.CSSProperties = {
  width: 120,
  height: 48,
  position: "relative",
};

const BTN_INNER_POS: React.CSSProperties = {
  position: "absolute",
  left: 4,
  top: 3,
};

const BTN_BASE: React.CSSProperties = {
  width: 112,
  height: 40,
  borderRadius: 6,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 3,
  border: "none",
  boxShadow: "0 1px 4px rgba(25, 33, 61, 0.08)",
  cursor: "pointer",
};

const BTN_TEXT: React.CSSProperties = {
  fontFeatureSettings: "'liga' off, 'clig' off",
  fontSize: 14,
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "20px",
};

function isEmptyTemp(t: DateTimeValue) {
  return (
    !t?.y ||
    !t?.m ||
    !t?.d ||
    t.hh === "" ||
    t.hh == null ||
    t.mm === "" ||
    t.mm == null
  );
}

function buildMinuteOptions(step: number) {
  const out: string[] = [];
  for (let m = 0; m < 60; m += step) out.push(pad2(m));
  return out;
}

export default function ScheduleDateTimePopup({
  anchorLeft,
  anchorTop,
  temp,
  viewY,
  viewM,
  onPrevMonth,
  onNextMonth,
  onPickDay,
  onPickTime,
  onCancel,
  onDone,
}: Props) {
  const didInit = useRef(false);

  const timeOptions = useMemo(() => {
    const hh = Array.from({ length: 24 }, (_, i) => pad2(i));
    const mm = buildMinuteOptions(1);
    return { hh, mm };
  }, []);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    if (!isEmptyTemp(temp)) return;

    const now = new Date();
    const nowY = now.getFullYear();
    const nowM = now.getMonth() + 1;
    const nowD = now.getDate();
    const nowHh = pad2(now.getHours());

    const minuteStep = 5;
    const roundedMm = pad2(Math.floor(now.getMinutes() / minuteStep) * minuteStep);

    onPickTime(nowHh, roundedMm);

    if (viewY === nowY && viewM === nowM) {
      onPickDay(nowD);
    }
  }, [temp, viewY, viewM, onPickDay, onPickTime]);

  const grid = useMemo(() => buildCalendarGrid(viewY, viewM), [viewY, viewM]);

  const safeMm =
    timeOptions.mm.includes(temp.mm) ? temp.mm : (timeOptions.mm[0] ?? "00");

  const topDateText = `${temp.y}.${pad2(temp.m)}.${pad2(temp.d)}`;
  const topTimeText = `${temp.hh}:${safeMm}`;
  const monthText = `${viewM}월`;

  return (
    <div
      style={{
        position: "absolute",
        left: anchorLeft,
        top: anchorTop,
        width: 296,
        borderRadius: 16,
        background: "#FFFFFF",
        boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
        padding: 25,
        zIndex: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderRadius: 10,
          background: "#D9D9D9",
          marginBottom: 24,
        }}
      >
        <span style={TEXT_16_SB}>{topDateText}</span>
        <span style={TEXT_16_M}>{topTimeText}</span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <span style={TEXT_16_SB}>{monthText}</span>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            onClick={onPrevMonth}
            style={{
              ...TEXT_14_U,
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            이전달
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            style={{
              ...TEXT_14_U,
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            다음달
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 19,
          marginBottom: 6,
        }}
      >
        {["월", "화", "수", "목", "금", "토", "일"].map((w) => (
          <div key={w} style={TEXT_14_CENTER}>
            {w}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 10,
          marginBottom: 26,
        }}
      >
        {grid.map((cell, idx) => {
          const day = cell.day;
          const disabled = day === null;
          const selected =
            !disabled && temp.y === viewY && temp.m === viewM && temp.d === day;

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (day === null) return;
                onPickDay(day);
              }}
              style={{
                height: 16,
                border: "none",
                background: "transparent",
                cursor: disabled ? "default" : "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 17,
                  height: 17,
                  background: selected ? "#D9D9D9" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={TEXT_14_CENTER}>{day ?? ""}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <span style={TEXT_16_M}>시간 설정</span>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <select
            value={temp.hh}
            onChange={(e) => {
              const nextHh = e.target.value;
              const nextMm = timeOptions.mm.includes(temp.mm)
                ? temp.mm
                : (timeOptions.mm[0] ?? "00");
              onPickTime(nextHh, nextMm); // ✅ 시 바꿀 때 분 유지
            }}
            style={{
              ...TEXT_16_M,
              border: "none",
              background: "transparent",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {timeOptions.hh.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>

          <span style={TEXT_16_M}>:</span>

          <select
            value={safeMm}
            onChange={(e) => onPickTime(temp.hh, e.target.value)} 
            style={{
              ...TEXT_16_M,
              border: "none",
              background: "transparent",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {timeOptions.mm.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        <div style={BTN_WRAPPER}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              ...BTN_BASE,
              ...BTN_INNER_POS,
              background: "#F5F5F5",
            }}
          >
            <span style={{ ...BTN_TEXT, color: "#1A1A1A" }}>취소</span>
          </button>
        </div>

        <div style={BTN_WRAPPER}>
          <button
            type="button"
            onClick={onDone}
            style={{
              ...BTN_BASE,
              ...BTN_INNER_POS,
              background: "#FF7710",
            }}
          >
            <span style={{ ...BTN_TEXT, color: "#FFFFFF" }}>완료</span>
          </button>
        </div>
      </div>
    </div>
  );
}
