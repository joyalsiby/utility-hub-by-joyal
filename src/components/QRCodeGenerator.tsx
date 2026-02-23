import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, QrCode, Settings, RefreshCw, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isTransparent, setIsTransparent] = useState(false);
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [includeImage, setIncludeImage] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    // Clone the SVG and set the dimensions to the selected size
    // This ensures the image is drawn at the correct resolution and fills the canvas
    const svgClone = svg.cloneNode(true) as SVGElement;
    svgClone.setAttribute('width', size.toString());
    svgClone.setAttribute('height', size.toString());

    const svgData = new XMLSerializer().serializeToString(svgClone);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      if (ctx) {
        if (!isTransparent) {
          ctx.fillStyle = bgColor; // Ensure background is filled
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Ensure transparent
        }
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        
        const downloadLink = document.createElement('a');
        downloadLink.download = `qrcode-${Date.now()}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
        setIncludeImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
          QR Code Generator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Create custom QR codes with colors, logos, and high resolution
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-6">
            
            {/* Content Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <QrCode size={16} className="text-blue-600 dark:text-blue-400" />
                Content
              </label>
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-24 p-3 pr-10 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all resize-none text-sm"
                  placeholder="Enter URL or text..."
                />
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                  title="Copy content"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-700 w-full" />

            {/* Customization Options */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Settings size={16} className="text-blue-600 dark:text-blue-400" />
                Customization
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Colors */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Foreground Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="flex-1 px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded focus:outline-none focus:border-blue-500 uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Background Color</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Transparent</span>
                      <button
                        onClick={() => setIsTransparent(!isTransparent)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          isTransparent ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                        }`}
                        title={isTransparent ? "Disable transparency" : "Enable transparency"}
                      >
                        <span
                          className={`${
                            isTransparent ? 'translate-x-5' : 'translate-x-1'
                          } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 transition-opacity ${isTransparent ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      disabled={isTransparent}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      disabled={isTransparent}
                      className="flex-1 px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded focus:outline-none focus:border-blue-500 uppercase"
                    />
                  </div>
                </div>

                {/* Size Slider */}
                <div className="space-y-2 sm:col-span-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Size (px)</label>
                    <span className="text-xs text-slate-400">{size}px</span>
                  </div>
                  <input
                    type="range"
                    min="128"
                    max="1024"
                    step="32"
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Error Correction Level */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Error Correction</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </div>

                {/* Logo Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Center Logo (Optional)</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center text-slate-600 dark:text-slate-300 truncate">
                      {includeImage ? 'Change Logo' : 'Upload Logo'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    {includeImage && (
                      <button
                        onClick={() => {
                          setIncludeImage(false);
                          setImageSrc('');
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove logo"
                      >
                        <RefreshCw size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center gap-6 min-h-[300px]">
              <div 
                ref={qrRef}
                className={`p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 ${isTransparent ? 'bg-[url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==")]' : ''}`}
                style={{ backgroundColor: isTransparent ? 'transparent' : bgColor }}
              >
                <QRCodeSVG
                  value={text}
                  size={200} // Fixed preview size, actual download uses 'size' state
                  fgColor={fgColor}
                  bgColor={isTransparent ? 'transparent' : bgColor}
                  level={level}
                  imageSettings={includeImage && imageSrc ? {
                    src: imageSrc,
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true,
                  } : undefined}
                />
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Preview</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Actual download size: {size}x{size}px
                </p>
              </div>

              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg font-medium shadow-sm transition-all hover:shadow-md active:scale-95 text-sm"
              >
                <Download size={18} />
                Download PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
