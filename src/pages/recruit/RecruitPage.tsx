import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Layout/Header/Header';
import Footer from '../../components/Layout/Footer/Footer';
import mainBg from '../../assets/img/main_img.png';

import RecruitTrackSection from '../../components/RecruitContent/RecruitTrackSection';
import RecruitKeywordSection from '../../components/RecruitContent/RecruitKeywordSection';
import RecruitScheduleSection from '../../components/RecruitContent/RecruitScheduleSection';
import RecruitBanner from '../../components/ActivityContent/RecruitBanner';


export default function RecruitPage() {
    const navigate = useNavigate();
  // 배너 상태 여부
    const isRecruiting = true;

  // 배경 이미지 조절은 여기서만
  const BG_ZOOM = 1;
  const BG_POS_Y = 50;

  const goApply = () => navigate('/apply');

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gray-black text-gray-white font-pretendard">
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

      {/* Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 bg-gradient-to-b from-gray-black to-gray-black/50" />

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
          pt-[240px] pb-[120px]
          flex flex-col items-center
          gap-[352px]
        "
      >
        <RecruitTrackSection />
        <RecruitKeywordSection />
        <RecruitScheduleSection />
      </main>

       {/* Banner + Footer */}
            <div className="relative z-20 mt-[180px] mb-[120px]">
                <RecruitBanner
                  isRecruiting={isRecruiting}
                  onApplyClick={goApply}
                /> 
            </div>
            {/* Footer */}
              <Footer />

    </div>
  );
}
