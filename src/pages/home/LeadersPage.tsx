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

// + 끝 슬래시 정규화
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/?$/, '/');

export default function LeadersPage() {
  const BG_ZOOM = 1.5;
  const BG_POS_Y = 50;

  const [title, setTitle] = useState('14th Leaders');
  const [subtitle, setSubtitle] = useState('서울여대 멋쟁이사자처럼의 14기 운영진들을 소개합니다');
  const [tracks, setTracks] = useState<TrackDto[] | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const url = new URL('api/home/leader', API_BASE_URL).toString();

        const res = await fetch(url, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        const data: ApiResponse<HomeLeaderResult> = await res.json();

        if (!alive) return;

        if (res.ok && data?.isSuccess && data?.result) {
          setTitle(data.result.title || title);
          setSubtitle(data.result.subtitle || subtitle);
          setTracks(Array.isArray(data.result.leaders) ? data.result.leaders : []);
        } else {
          setTracks(null);
        }
      } catch {
        if (!alive) return;
        setTracks(null);
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gray-black text-gray-white font-pretendard">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${mainBg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${BG_ZOOM * 100}% auto`,
          backgroundPosition: `50% ${BG_POS_Y}%`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-gray-black to-gray-black/50" />

      <div className="fixed top-0 left-0 right-0 z-[300]">
        <Header />
      </div>

      <main
        className="
          relative z-20
          mx-auto w-full max-w-[1140px]
          px-[20px] min-[1180px]:px-0
          pt-[150px] pb-[120px]
          flex flex-col items-center
          gap-[60px]
        "
      >
        <div className="w-full flex flex-col items-center">
          <h1 className="text-bold-48 text-primary-60 text-center">{title}</h1>
          <p className="text-medium-28 text-gray-white text-center">{subtitle}</p>
        </div>

        <LeadersCardSection tracks={tracks ?? undefined} />
      </main>

      <Footer />
    </div>
  );
}
