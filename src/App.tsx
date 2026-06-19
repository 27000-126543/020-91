import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { GeneratorPage } from '@/pages/GeneratorPage';
import { ChecklistPage } from '@/pages/ChecklistPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30">
        <Navbar />
        <main className="pb-16">
          <Routes>
            <Route path="/" element={<GeneratorPage />} />
            <Route path="/checklist" element={<ChecklistPage />} />
          </Routes>
        </main>
        <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-100 bg-white/50 print:hidden">
          🦷 牙科效期贴纸生成工具 · 纯前端离线运行 · 数据保存在本地浏览器中
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
