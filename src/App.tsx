/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Type, Video, Search, ArrowRight, QrCode, Palette, Image as ImageIcon, Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import CharacterLimitCheck from './components/CharacterLimitCheck';
import ImageToVideo from './components/ImageToVideo';
import QRCodeGenerator from './components/QRCodeGenerator';
import ColorShadesGenerator from './components/ColorShadesGenerator';
import YouTubeThumbnailDownloader from './components/YouTubeThumbnailDownloader';
import { Logo } from './components/Logo';
import { ThemeProvider } from './context/ThemeContext';

const utilities = [
  {
    id: 'character-limit',
    title: 'Character Limit Check',
    description: 'Validate text length with custom limits and visual feedback.',
    path: '/character-limit',
    icon: Type,
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  },
  {
    id: 'image-to-video',
    title: 'Image to Video',
    description: 'Convert static images into 2-second MP4 videos instantly.',
    path: '/image-to-video',
    icon: Video,
    color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    description: 'Create customizable QR codes with colors, logos, and high resolution.',
    path: '/qr-generator',
    icon: QrCode,
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  },
  {
    id: 'color-shades',
    title: 'Color Shades Generator',
    description: 'Generate tints and shades from a single base color with copy support.',
    path: '/color-shades',
    icon: Palette,
    color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
  },
  {
    id: 'youtube-thumbnail',
    title: 'YouTube Thumbnail Downloader',
    description: 'View and download thumbnails from any YouTube video in multiple qualities.',
    path: '/youtube-thumbnail',
    icon: ImageIcon,
    color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  }
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUtilities = utilities.filter(util => 
    util.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    util.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pt-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Logo className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">Utility Hub</h1>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl text-sm md:text-base">
          A collection of simple, powerful tools to help with your daily tasks.
          Select a utility below to get started.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search utilities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUtilities.map((util) => {
          const Icon = util.icon;
          return (
            <Link 
              key={util.id} 
              to={util.path}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-200 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${util.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={24} />
                </div>
                <div className="text-zinc-300 dark:text-zinc-600 group-hover:text-blue-500 transition-colors">
                  <ArrowRight size={20} />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                {util.title}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                {util.description}
              </p>
            </Link>
          );
        })}

        {filteredUtilities.length === 0 && (
          <div className="col-span-full text-center py-12 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <p>No utilities found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-white transition-colors duration-300">
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 z-40 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Logo className="text-white w-5 h-5" />
            </div>
            <span className="font-semibold text-zinc-800 dark:text-white text-lg">Utility Hub</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          isMobileOpen={isMobileMenuOpen}
          closeMobileSidebar={() => setIsMobileMenuOpen(false)}
        />
        
        <main 
          className={`flex-1 p-4 md:p-8 overflow-y-auto h-screen pt-20 md:pt-8 transition-all duration-300 ${
            isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
          }`}
        >
          <div className="max-w-5xl mx-auto h-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/character-limit" element={
                <div className="flex justify-center pt-4 md:pt-12">
                  <CharacterLimitCheck />
                </div>
              } />
              <Route path="/image-to-video" element={
                <div className="flex justify-center pt-4 md:pt-12">
                  <ImageToVideo />
                </div>
              } />
              <Route path="/qr-generator" element={
                <div className="flex justify-center pt-4 md:pt-12">
                  <QRCodeGenerator />
                </div>
              } />
              <Route path="/color-shades" element={
                <div className="flex justify-center pt-4 md:pt-12">
                  <ColorShadesGenerator />
                </div>
              } />
              <Route path="/youtube-thumbnail" element={
                <div className="flex justify-center pt-4 md:pt-12">
                  <YouTubeThumbnailDownloader />
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
