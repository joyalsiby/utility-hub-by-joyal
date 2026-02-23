import { Link, useLocation } from 'react-router-dom';
import { Type, Home, Video, QrCode, Palette, Image as ImageIcon, ChevronsLeft, X, Moon, Sun } from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
  closeMobileSidebar: () => void;
}

const Sidebar = ({ isCollapsed, toggleSidebar, isMobileOpen, closeMobileSidebar }: SidebarProps) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

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
        className={`
          fixed left-0 top-0 h-screen z-50 flex flex-col
          bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}
          w-64
        `}
      >
        {/* Header */}
        <div className={`
          h-[70px] flex items-center border-b border-zinc-100 dark:border-zinc-800
          transition-all duration-300
          ${isCollapsed ? 'md:justify-center px-2' : 'px-6 justify-between'}
        `}>
          <div 
            className="flex items-center gap-3 overflow-hidden cursor-pointer"
            onClick={isCollapsed ? toggleSidebar : undefined}
            title={isCollapsed ? "Expand sidebar" : undefined}
          >
            <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
              <Logo className="text-white w-5 h-5" />
            </div>
            <span className={`
              font-semibold text-zinc-800 dark:text-white text-lg whitespace-nowrap
              transition-all duration-300
              ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}
            `}>
              Utility Hub
            </span>
          </div>

          {/* Mobile Close Button */}
          <button 
            onClick={closeMobileSidebar}
            className="md:hidden text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-x-hidden overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => closeMobileSidebar()}
                className={`
                  flex items-center py-3 rounded-lg transition-all duration-200 group relative
                  ${active 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                  } 
                  ${isCollapsed ? 'justify-center px-2' : 'px-4'}
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={18} className={`
                  flex-shrink-0 transition-colors
                  ${active ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500'}
                `} />
                
                <span className={`
                  whitespace-nowrap overflow-hidden transition-all duration-300
                  ${isCollapsed ? 'w-0 opacity-0 ml-0 hidden' : 'w-auto opacity-100 ml-3'}
                `}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`
              flex items-center py-2 rounded-lg transition-colors 
              text-zinc-600 dark:text-zinc-400 
              hover:bg-zinc-50 dark:hover:bg-zinc-800 
              hover:text-zinc-900 dark:hover:text-white
              ${isCollapsed ? 'justify-center px-2' : 'px-4 gap-3'}
            `}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span className={`
              whitespace-nowrap overflow-hidden transition-all duration-300
              ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}
            `}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          <div className="hidden md:block h-px bg-zinc-200 dark:bg-zinc-800 w-full" />

          {/* Collapse Button */}
          <button
            onClick={toggleSidebar}
            className={`
              hidden md:flex items-center justify-center w-full p-2 
              text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 
              hover:bg-zinc-50 dark:hover:bg-zinc-800 
              rounded-lg transition-all duration-300
            `}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronsLeft size={20} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>

          {!isCollapsed && (
            <div className="text-xs text-zinc-400 dark:text-zinc-500 text-center transition-opacity duration-300 hidden md:block">
              v1.0.0
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
