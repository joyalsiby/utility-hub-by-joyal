/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Type, Video, Search, ArrowRight, QrCode } from 'lucide-react';
import Sidebar from './components/Sidebar';
import CharacterLimitCheck from './components/CharacterLimitCheck';
import ImageToVideo from './components/ImageToVideo';
import QRCodeGenerator from './components/QRCodeGenerator';
import { Logo } from './components/Logo';

const utilities = [
  {
    id: 'character-limit',
    title: 'Character Limit Check',
    description: 'Validate text length with custom limits and visual feedback.',
    path: '/character-limit',
    icon: Type,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'image-to-video',
    title: 'Image to Video',
    description: 'Convert static images into 2-second MP4 videos instantly.',
    path: '/image-to-video',
    icon: Video,
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    description: 'Create customizable QR codes with colors, logos, and high resolution.',
    path: '/qr-generator',
    icon: QrCode,
    color: 'bg-emerald-50 text-emerald-600',
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
          <h1 className="text-3xl font-bold text-slate-900">Utility Hub</h1>
        </div>
        <p className="text-slate-500 max-w-2xl">
          A collection of simple, powerful tools to help with your daily tasks.
          Select a utility below to get started.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search utilities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400"
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
              className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${util.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={24} />
                </div>
                <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
                  <ArrowRight size={20} />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                {util.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {util.description}
              </p>
            </Link>
          );
        })}

        {filteredUtilities.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p>No utilities found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto h-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/character-limit" element={
              <div className="flex justify-center pt-12">
                <CharacterLimitCheck />
              </div>
            } />
            <Route path="/image-to-video" element={
              <div className="flex justify-center pt-12">
                <ImageToVideo />
              </div>
            } />
            <Route path="/qr-generator" element={
              <div className="flex justify-center pt-12">
                <QRCodeGenerator />
              </div>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
}
