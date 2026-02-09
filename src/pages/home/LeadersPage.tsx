import { Header } from '../../components/Layout/Header/Header';
import Footer from '../../components/Layout/Footer/Footer';
import mainBg from '../../assets/img/main_img.png';
import LeadersCardSection from '../../components/LeadersContent/LeadersCardSection';

export default function LeadersPage() {
  // 배경 이미지 조절은 여기서만
  const BG_ZOOM = 1.5;
  const BG_POS_Y = 50;

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gray-black text-gray-white font-pretendard">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${mainBg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${BG_ZOOM * 100}% auto`,
          backgroundPosition: `50% ${BG_POS_Y}%`,
        }}
      />

      {/* Overlay (Figma: black -> black 50%) */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-gray-black to-gray-black/50" />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-[300]">
        <Header />
      </div>

      {/* Content */}
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
          <h1 className="text-bold-48 text-primary-60 text-center">14th Leaders</h1>
          <p className="text-medium-28 text-gray-white text-center">
            서울여대 멋쟁이사자처럼의 14기 운영진들을 소개합니다
          </p>
        </div>

        <LeadersCardSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
