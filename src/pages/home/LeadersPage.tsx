import { useEffect, useState } from 'react';
import { Header } from '../../components/Layout/Header/Header';
import Footer from '../../components/Layout/Footer/Footer';
import mainBg from '../../assets/img/main_img.png';
import LeadersCardSection from '../../components/LeadersContent/LeadersCardSection';

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

type LeaderDto = {
  name: string;
  major: string;
  position?: string;
  profile?: string;
};

type TrackDto = {
  track: string;
  leaders: LeaderDto[];
};

type HomeLeaderResult = {
  title: string;
  subtitle: string;
  leaders: TrackDto[];
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/?$/, '/');

async function readJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export default function LeadersPage() {
  const BG_ZOOM = 1;
  const BG_POS_Y = 50;

  // 타이틀/서브타이틀 고정 (API X)
  const title = '14th Leaders';
  const subtitle = '서울여대 멋쟁이사자처럼의 14기 운영진들을 소개합니다';

  // undefined: 스켈레톤 / []: 실패 시 fallback 카드(스켈레톤 아님) / 배열: 실데이터
  const [tracks, setTracks] = useState<TrackDto[] | undefined>(undefined);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        const url = new URL('api/home/leader', API_BASE_URL).toString();

        const res = await fetch(url, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: ac.signal,
        });

        const data = await readJson<ApiResponse<HomeLeaderResult>>(res);

        if (!res.ok || !data?.isSuccess || !data?.result) {
          setTracks([]); // 실패면 fallback 카드로
          return;
        }

        setTracks(Array.isArray(data.result.leaders) ? data.result.leaders : []);
      } catch {
        if (ac.signal.aborted) return;
        setTracks([]); // 실패면 fallback 카드로
      }
    })();

    return () => ac.abort();
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gray-black text-gray-white font-pretendard flex flex-col">
      {/* Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${mainBg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${BG_ZOOM * 100}% auto`,
          backgroundPosition: `50% ${BG_POS_Y}%`,
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-10 bg-gradient-to-b from-gray-black to-gray-black/50" />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-[300]">
        <Header />
      </div>

      {/* main이 남은 높이를 먹어서 footer를 바닥으로 밀어줌 */}
      <main
        className="
          relative z-20
          mx-auto w-full max-w-[1140px]
          px-[20px] min-[1180px]:px-0
          pt-[150px]
          flex-1
          flex flex-col items-center
          gap-[60px]
        "
      >
        <div className="w-full flex flex-col items-center">
          <h1 className="text-bold-48 text-primary-60 text-center">{title}</h1>
          <p className="text-medium-28 text-gray-white text-center">{subtitle}</p>
        </div>

        {/* tracks가 undefined면 스켈레톤, 배열이면 실데이터/빈배열(fallback) */}
        <LeadersCardSection tracks={tracks} />
      </main>

      {/* Footer는 항상 맨 아래 */}
      <div className="relative z-20 mt-auto">
        <Footer />
      </div>
    </div>
  );
}
