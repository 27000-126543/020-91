import { Printer, ClipboardList, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: '贴纸生成', icon: Sparkles },
  { path: '/checklist', label: '今日检查清单', icon: ClipboardList },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white text-xl shadow-md">
              🦷
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">牙科效期贴纸</h1>
              <p className="text-[11px] text-gray-500 leading-tight">Dental Expiry Label Generator</p>
            </div>
          </Link>

          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center gap-1.5 text-sm font-medium"
            title="打印"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">打印</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
