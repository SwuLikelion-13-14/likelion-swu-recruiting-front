import { useEffect, useMemo, useState } from "react";
import mobileBg from "@/assets/img/mobile-bg.png";

type Props = {
  breakpoint?: number;
};

export default function MobileGuardModal({ breakpoint = 768 }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  const url = useMemo(() => window.location.href, []);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const apply = () => setIsMobile(mq.matches);
    apply();

    const handler = () => apply();

    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
    } else {
      mq.addListener(handler);
    }

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", handler);
      } else {
        mq.removeListener(handler);
      }
    };
  }, [breakpoint]);

  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    if (isMobile) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prevBodyOverflow || "";
      document.documentElement.style.overflow = prevHtmlOverflow || "";
    }

    return () => {
      document.body.style.overflow = prevBodyOverflow || "";
      document.documentElement.style.overflow = prevHtmlOverflow || "";
    };
  }, [isMobile]);

  const onCopy = async () => {
    const ua = navigator.userAgent || "";
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(ua);

    if (isMobileDevice && typeof navigator.share === "function") {
      try {
        await navigator.share({ url });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "0";
      ta.style.left = "0";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  };

  if (!isMobile) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        backgroundImage: `url(${mobileBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: 317,
          margin: 24,
          padding: "30px 0",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 20,
          border: "1px solid rgba(255, 255, 255, 0.20)",
          background: "rgba(0, 0, 0, 0.50)",
          boxShadow:
            "-10px -10px 8px 2px rgba(255, 74, 67, 0.20) inset, 2px 2px 8.1px 0 rgba(255, 255, 255, 0.50) inset",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#FF7710",
            fontFamily: "Pretendard",
            fontSize: 22,
            fontWeight: 600,
            lineHeight: "120%",
            letterSpacing: "-1px",
            marginBottom: 22,
          }}
        >
          안내
        </div>

        <div
          style={{
            color: "#F5F5F5",
            fontFamily: "Pretendard",
            fontSize: 16,
            fontWeight: 400,
            lineHeight: "120%",
            letterSpacing: "0",
            padding: "0 18px",
            marginBottom: 40,
          }}
        >
          아직 모바일 환경은 지원되지 않습니다.
          <br />
          PC 환경으로 다시 접속해 주세요.
        </div>

        <button
          type="button"
          onClick={onCopy}
          style={{
            display: "flex",
            width: 119,
            height: 35,
            padding: "11px 63px",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            borderRadius: 200,
            border: "1px solid rgba(255, 255, 255, 0.20)",
            background: "rgba(255, 0, 0, 0.25)",
            boxShadow:
              "-10px -10px 8px 2px rgba(255, 74, 67, 0.20) inset, 2px 2px 8.1px 0 rgba(255, 255, 255, 0.50) inset",
            color: "#DDD",
            fontFamily: "Pretendard",
            fontSize: 16,
            fontWeight: 400,
            lineHeight: "120%",
            letterSpacing: "0",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          링크 복사하기
        </button>
      </div>
    </div>
  );
}
