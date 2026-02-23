import React, { useState, useEffect } from 'react';
import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import namesPlugin from 'colord/plugins/names';
import { Copy, Check, RefreshCw, Palette, Download } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

extend([mixPlugin, namesPlugin]);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ColorShadesGenerator() {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [step, setStep] = useState(10);
  const [count, setCount] = useState(9); // Total count (odd number preferred for center)
  const [shades, setShades] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    generateShades();
  }, [baseColor, step, count]);

  const generateShades = () => {
    if (!colord(baseColor).isValid()) return;

    const color = colord(baseColor);
    const newShades: string[] = [];
    
    // Calculate how many tints (lighter) and shades (darker) we need
    // If count is 9, we need 4 lighter, 1 base, 4 darker
    const sideCount = Math.floor((count - 1) / 2);
    
    // Generate lighter tints (reversed so lightest is first)
    for (let i = sideCount; i > 0; i--) {
      newShades.push(color.lighten(i * (step / 100)).toHex());
    }

    // Add base color
    newShades.push(color.toHex());

    // Generate darker shades
    for (let i = 1; i <= (count - 1) - sideCount; i++) {
      newShades.push(color.darken(i * (step / 100)).toHex());
    }

    setShades(newShades);
    if (!selectedColor || !newShades.includes(selectedColor)) {
      setSelectedColor(color.toHex());
    }
  };

  const handleCopy = (color: string, index: number) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setSelectedColor(color);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const allColors = shades.join(', ');
    navigator.clipboard.writeText(allColors);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadSVG = () => {
    const width = 100;
    const height = 150;
    const totalWidth = width * shades.length;
    const totalHeight = height + 50; // Space for text

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">`;
    
    // Background
    svgContent += `<rect width="${totalWidth}" height="${totalHeight}" fill="white"/>`;

    shades.forEach((color, index) => {
      const x = index * width;
      
      // Color block
      svgContent += `<rect x="${x}" y="0" width="${width}" height="${height}" fill="${color}"/>`;
      
      // Label below
      svgContent += `<text x="${x + width / 2}" y="${height + 30}" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle" fill="#333333">${color}</text>`;
    });

    svgContent += `</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `palette-${baseColor.replace('#', '')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseColor(e.target.value);
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.startsWith('#')) {
      setBaseColor(val);
    } else {
      setBaseColor(`#${val}`);
    }
  };

  return (
    <div className="w-full max-w-5xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">
          Color Shades Generator
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Generate tints and shades from a single base color
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 space-y-8 shadow-sm">
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          {/* Color Input */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Base Color</label>
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm flex-shrink-0">
                <input
                  type="color"
                  value={colord(baseColor).isValid() ? colord(baseColor).toHex() : '#000000'}
                  onChange={handleColorChange}
                  className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
                />
              </div>
              <input
                type="text"
                value={baseColor}
                onChange={handleHexInput}
                className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono uppercase"
                placeholder="#3B82F6"
              />
            </div>
          </div>

          {/* Step Slider */}
          <div className="space-y-2 lg:col-span-2">
            <div className="flex justify-between">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Darken/Lighten Step</label>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{step}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={step}
              onChange={(e) => setStep(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Count Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Count</label>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{count}</span>
            </div>
            <input
              type="range"
              min="3"
              max="21"
              step="2" // Keep it odd to have a center
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* Shades Display */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row h-auto sm:h-32 rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200/50 dark:divide-zinc-800/50">
            {shades.map((color, index) => {
              const isBase = color.toLowerCase() === colord(baseColor).toHex().toLowerCase();
              const isDark = colord(color).isDark();
              
              return (
                <div
                  key={index}
                  className={`relative group flex-1 flex flex-col items-center justify-center p-2 sm:p-0 transition-all hover:flex-[1.5] cursor-pointer min-h-[6rem] sm:min-h-0 ${isBase ? 'z-10 ring-2 ring-white/50 ring-inset' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleCopy(color, index)}
                >
                  {isBase && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider shadow-sm border border-white/20">
                      Base
                    </div>
                  )}
                  
                  <div className={`flex flex-col items-center gap-1 transition-transform group-hover:scale-110 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    <span className="font-mono text-[10px] sm:text-xs font-medium uppercase tracking-wider">{color}</span>
                    {copiedIndex === index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/75 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap"
                      >
                        Copied!
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center gap-4">
             <button
              onClick={handleCopyAll}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg font-medium shadow-sm transition-all hover:shadow-md active:scale-95 text-sm"
            >
              {copiedAll ? <Check size={18} /> : <Copy size={18} />}
              {copiedAll ? 'Copied All!' : 'Copy All Colors'}
            </button>
            <button
              onClick={handleDownloadSVG}
              className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium shadow-sm transition-all hover:shadow-md active:scale-95 text-sm"
            >
              <Download size={18} />
              Download SVG
            </button>
          </div>
        </div>

        {/* Selected Color Details */}
        {selectedColor && (
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div 
                className="w-32 h-32 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex-shrink-0"
                style={{ backgroundColor: selectedColor }}
              />
              <div className="flex-1 space-y-4 w-full">
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Selected Color Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">HEX</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-zinc-900 dark:text-white font-medium">{colord(selectedColor).toHex()}</span>
                      <button 
                        onClick={() => handleCopy(colord(selectedColor).toHex(), -1)}
                        className="text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">RGB</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-zinc-900 dark:text-white font-medium">{colord(selectedColor).toRgbString()}</span>
                      <button 
                        onClick={() => handleCopy(colord(selectedColor).toRgbString(), -1)}
                        className="text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">HSL</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-zinc-900 dark:text-white font-medium">{colord(selectedColor).toHslString()}</span>
                      <button 
                        onClick={() => handleCopy(colord(selectedColor).toHslString(), -1)}
                        className="text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Name</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-zinc-900 dark:text-white font-medium capitalize">{colord(selectedColor).toName({ closest: true }) || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
