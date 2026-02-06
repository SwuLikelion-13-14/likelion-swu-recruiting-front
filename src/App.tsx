import { Header } from './components/Header';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-3xl font-bold">
      <Header />
      <main className="pt-20 pb-24 px-4">
        <h1 className="text-3xl font-bold text-center">메인 콘텐츠 영역</h1>
        <p className="text-center mt-4">안녕하세요~~~</p>
      </main>
      <Footer />
    </div>
  );
}

export default App
