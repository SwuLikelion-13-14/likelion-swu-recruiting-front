import { Header } from './components/Header';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-black text-gray-white font-pretendard">
      <Header />

      <main className="pt-24 pb-24 px-6 max-w-4xl mx-auto space-y-10">
        {/* 타이틀 */}
        <section className="space-y-2">
          <h1 className="text-bold-32">토큰 적용 테스트</h1>
          <p className="text-regular-16 text-gray-60">
            컬러 / 알파 / 그라데이션 / 폰트 / 타이포 토큰이 제대로 먹는지 확인하는 화면입니다.
          </p>
        </section>

        {/* 컬러 토큰 테스트 */}
        <section className="space-y-4">
          <h2 className="text-semibold-20">Color Tokens</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="rounded-xl p-4 bg-primary-60 text-gray-white">
              <p className="text-semibold-16">bg-primary-60</p>
              <p className="text-regular-12 opacity-90"># Primary 60</p>
            </div>

            <div className="rounded-xl p-4 bg-primary-30 text-gray-100">
              <p className="text-semibold-16">bg-primary-30</p>
              <p className="text-regular-12 opacity-90"># Primary 30</p>
            </div>

            <div className="rounded-xl p-4 bg-secondary-60 text-gray-white">
              <p className="text-semibold-16">bg-secondary-60</p>
              <p className="text-regular-12 opacity-90"># Secondary 60</p>
            </div>

            <div className="rounded-xl p-4 bg-system-red-50 text-gray-white">
              <p className="text-semibold-16">bg-system-red-50</p>
              <p className="text-regular-12 opacity-90"># System Red 50</p>
            </div>

            <div className="rounded-xl p-4 bg-system-yellow-60 text-gray-100">
              <p className="text-semibold-16">bg-system-yellow-60</p>
              <p className="text-regular-12 opacity-90"># System Yellow 60</p>
            </div>

            <div className="rounded-xl p-4 bg-system-blue-50 text-gray-white">
              <p className="text-semibold-16">bg-system-blue-50</p>
              <p className="text-regular-12 opacity-90"># System Blue 50</p>
            </div>
          </div>

          {/* 알파 테스트 */}
          <div className="rounded-2xl p-5 bg-gray-95 space-y-3">
            <p className="text-semibold-18">Alpha Test</p>
            <div className="flex flex-wrap gap-3">
              <div className="w-24 h-12 rounded-lg bg-secondary-60/100" />
              <div className="w-24 h-12 rounded-lg bg-secondary-60/75" />
              <div className="w-24 h-12 rounded-lg bg-secondary-60/50" />
              <div className="w-24 h-12 rounded-lg bg-secondary-60/25" />
              <div className="w-24 h-12 rounded-lg bg-secondary-60/10" />
            </div>
            <p className="text-regular-12 text-gray-50">
              왼쪽부터 /100, /75, /50, /25, /10
            </p>
          </div>
        </section>

        {/* 타이포 토큰 테스트 */}
        <section className="space-y-4">
          <h2 className="text-semibold-20">Typography Tokens</h2>

          <div className="rounded-2xl p-6 bg-gray-95 space-y-3">
            <p className="text-light-16 text-gray-white">text-light-16 (Light)</p>
            <p className="text-regular-16 text-gray-white">text-regular-16 (Regular)</p>
            <p className="text-medium-22 text-gray-white">text-medium-22 (Medium)</p>
            <p className="text-semibold-24 text-gray-white">text-semibold-24 (Semi/Bold)</p>
            <p className="text-bold-32 text-gray-white">text-bold-32 (Bold)</p>
          </div>
        </section>

        {/* 그라데이션 토큰 테스트 */}
        <section className="space-y-4">
          <h2 className="text-semibold-20">Gradient Tokens</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden">
              <div className="h-28 bg-gradient-header" />
              <div className="p-4 bg-gray-95">
                <p className="text-semibold-16">bg-gradient-header</p>
                <p className="text-regular-12 text-gray-50">Header Background Gradient</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden">
              <div className="h-28 bg-gradient-button-fill-radial" />
              <div className="p-4 bg-gray-95">
                <p className="text-semibold-16">bg-gradient-button-fill-radial</p>
                <p className="text-regular-12 text-gray-50">Button Radial Gradient</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
