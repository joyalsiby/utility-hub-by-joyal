import { Link, useLocation } from 'react-router-dom';
import { Type, Home, Video } from 'lucide-react';
import { Logo } from './Logo';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/character-limit', label: 'Character Limit', icon: Type },
    { path: '/image-to-video', label: 'Image to Video', icon: Video },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Logo className="text-white w-5 h-5" />
        </div>
        <span className="font-semibold text-slate-800 text-lg">Utility Hub</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} className={active ? 'text-blue-600' : 'text-slate-400'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="text-xs text-slate-400 text-center">
          v1.0.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
