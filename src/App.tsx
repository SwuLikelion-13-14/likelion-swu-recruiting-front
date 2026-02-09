import { Header } from './components/Header';
import { Footer } from './components/Footer';
import ActivityContentPage from './pages/home/ActivityContentPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-black text-gray-white font-pretendard">
      <Header />
      <ActivityContentPage />
      <Footer />
    </div>
  );
}

export default App;
