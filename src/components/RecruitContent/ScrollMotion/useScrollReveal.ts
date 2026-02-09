import { useEffect, useRef } from 'react';
import { useAnimation, useInView } from 'framer-motion';

type Options = {
  amount?: number;       // 뷰포트에 얼마나 들어오면 트리거할지 
  resetOnLeave?: boolean; // 화면 밖으로 나가면 hidden으로 되돌릴지
};

export function useScrollReveal(options: Options = {}) {
  const { amount = 0.3, resetOnLeave = true } = options;

  const ref = useRef<HTMLElement | null>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { amount });

  // 스크롤 방향 감지
  const dirRef = useRef<'down' | 'up'>('down');
  const lastYRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    lastYRef.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      dirRef.current = y >= lastYRef.current ? 'down' : 'up';
      lastYRef.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (inView) {
      // 아래로 스크롤 중일 때만 재생 (초기 진입은 down으로 간주)
      if (dirRef.current === 'down') controls.start('show');
    } else {
      if (resetOnLeave) controls.start('hidden');
    }
  }, [inView, resetOnLeave, controls]);

  return { ref, controls };
}
