import { Link, useLocation } from 'react-router-dom';
import { Type, Home, Video, QrCode, Palette, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/character-limit', label: 'Character Limit', icon: Type },
    { path: '/image-to-video', label: 'Image to Video', icon: Video },
    { path: '/qr-generator', label: 'QR Generator', icon: QrCode },
    { path: '/color-shades', label: 'Color Shades', icon: Palette },
    { path: '/youtube-thumbnail', label: 'YT Thumbnails', icon: ImageIcon },
  ];

  return (
    <div 
      className={`bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 transition-all duration-300 z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className={`p-6 border-b border-slate-100 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
          <Logo className="text-white w-5 h-5" />
        </div>
        {!isCollapsed && (
          <span className="font-semibold text-slate-800 text-lg whitespace-nowrap overflow-hidden">Utility Hub</span>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                active 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={18} className={`flex-shrink-0 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 flex flex-col gap-4">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        {!isCollapsed && (
          <div className="text-xs text-slate-400 text-center">
            v1.0.0
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
