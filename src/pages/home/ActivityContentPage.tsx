import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Header } from '../../components/Layout/Header/Header';
import Footer from '../../components/Layout/Footer/Footer';
import mainBg from '../../assets/img/main_img.png';
import ActivityCards from '../../components/ActivityCards';
import HackathonCards from '../../components/HackathonCards';
import SessionCurriculum from '../../components/SessionCurriculum';
import CompletionFeeCards from '../../components/CompletionFeeCards';
import RecruitBanner from '../../components/RecruitBanner';

type ScrollDir = 'down' | 'up';

function useDownOnlyReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  const lastYRef = useRef(0);
  const dirRef = useRef<ScrollDir>('down');

  const [visible, setVisible] = useState(false);
  const [play, setPlay] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;

    const sync = () => setReduceMotion(mq.matches);
    sync();

    if (mq.addEventListener) mq.addEventListener('change', sync);
    else mq.addListener(sync);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', sync);
      else mq.removeListener(sync);
    };
  }, []);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      dirRef.current = y > lastYRef.current ? 'down' : 'up';
      lastYRef.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduceMotion) {
      setVisible(true);
      setPlay(false);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (entry.isIntersecting) {
          setVisible(true);
          setPlay(dirRef.current === 'down');
        } else {
          setVisible(false);
          setPlay(false);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduceMotion]);

  return { ref, visible, play, reduceMotion };
}

function Reveal({
  children,
  delayMs = 0,
  y = 24,
  className = '',
}: {
  children: ReactNode;
  delayMs?: number;
  y?: number;
  className?: string;
}) {
  const { ref, visible, play, reduceMotion } = useDownOnlyReveal<HTMLDivElement>();
  const shown = reduceMotion ? true : visible;

  return (
    <div
      ref={ref}
      className={['will-change-transform', className].join(' ')}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0px)' : `translateY(${y}px)`,
        transition: play ? 'opacity 700ms ease-out, transform 700ms ease-out' : 'none',
        transitionDelay: play ? `${delayMs}ms` : '0ms',
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="w-full flex flex-col items-center gap-[6px]">
      <h2 className="text-[48px] font-bold leading-[62.4px] [color:var(--text-primary,#FF7710)]">
        {title}
      </h2>
      <p className="text-[28px] font-medium leading-[33.6px] text-white/90">
        {subtitle}
      </p>
    </div>
  );
}

export default function ActivityContentPage() {
  const isRecruiting = true;

  // 배경 이미지 조절은 여기서만
  const BG_ZOOM = 1.5;
  const BG_POS_Y = 62;

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gray-black text-gray-white font-pretendard">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${mainBg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${BG_ZOOM * 500}% auto`,
          backgroundPosition: `50% ${BG_POS_Y}%`,
        }}
      />

      {/* Overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black to-black/50" />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-[300]">
        <Header />
      </div>

      {/* Page Content */}
      <main
        className="
          relative z-20
          mx-auto w-full max-w-[1140px]
          px-[20px] min-[1180px]:px-0
          pt-[280px] pb-[160px]
          flex flex-col gap-[220px] min-[1180px]:gap-[352px]
        "
      >
        <section className="flex flex-col gap-[86px]">
          <Reveal>
            <SectionHeader
              title="Activity"
              subtitle="서울여대 멋쟁이사자처럼의 주요 활동을 소개합니다"
            />
          </Reveal>
          <ActivityCards enableHover enableReveal waveReveal waveStepMs={140} />
        </section>

        <section className="flex flex-col gap-[86px]">
          <Reveal>
            <SectionHeader
              title="LIKELION Hackathon"
              subtitle="멋쟁이사자처럼 대학에서 주최하는 해커톤에도 참여하게 됩니다"
            />
          </Reveal>
          <HackathonCards />
        </section>

        <section className="flex flex-col gap-[86px]">
          <Reveal>
            <SectionHeader
              title="Session Curriculum"
              subtitle="트랙 별 정기 세션 커리큘럼"
            />
          </Reveal>
          <Reveal delayMs={120}>
            <SessionCurriculum />
          </Reveal>
        </section>

        <section className="flex flex-col gap-[86px]">
          <Reveal>
            <SectionHeader
              title="Completion conditions"
              subtitle="아기사자 수료 조건 및 회비"
            />
          </Reveal>
          <Reveal delayMs={120}>
            <CompletionFeeCards />
          </Reveal>
        </section>
      </main>

      {/* Banner + Footer */}
      <div className="relative z-20 mb-[120px]">
        <Reveal>
          <RecruitBanner
            isRecruiting={isRecruiting}
            onApplyClick={() => {
              // window.open('...', '_blank');
            }}
          />
        </Reveal>

        
      </div>
      {/* Footer */}
        <Footer />
    </div>
  );
}
