import { Link, useLocation } from 'react-router-dom';
import { Type, Home, Video, QrCode, Palette, Image as ImageIcon, ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
  closeMobileSidebar: () => void;
}

const Sidebar = ({ isCollapsed, toggleSidebar, isMobileOpen, closeMobileSidebar }: SidebarProps) => {
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
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <div 
        className={`bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 transition-all duration-300 ease-in-out z-50 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}
          w-64
        `}
      >
        <div className={`h-[70px] border-b border-slate-100 flex items-center transition-all duration-300 
          ${isCollapsed ? 'md:justify-center md:px-2' : 'md:px-6'}
          px-6 justify-between
        `}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
              <Logo className="text-white w-5 h-5" />
            </div>
            <span className={`font-semibold text-slate-800 text-lg whitespace-nowrap transition-all duration-300 
              ${isCollapsed ? 'md:w-0 md:opacity-0' : 'md:w-auto md:opacity-100'}
            `}>
              Utility Hub
            </span>
          </div>

          {/* Mobile Close Button */}
          <button 
            onClick={closeMobileSidebar}
            className="md:hidden text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-x-hidden overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => closeMobileSidebar()}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group 
                  ${active 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } 
                  ${isCollapsed ? 'md:justify-center md:px-2' : ''}
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={18} className={`flex-shrink-0 transition-colors ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 
                  ${isCollapsed ? 'md:w-0 md:opacity-0' : 'md:w-auto md:opacity-100 ml-3'}
                  ml-3
                `}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 flex flex-col gap-4 hidden md:flex">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          </button>
          {!isCollapsed && (
            <div className="text-xs text-slate-400 text-center transition-opacity duration-300">
              v1.0.0
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
