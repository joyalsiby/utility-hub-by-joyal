import React, { useState } from 'react';
import { Search, Download, ExternalLink, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function YouTubeThumbnailDownloader() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const extractVideoId = (input: string) => {
    // Handle standard URL, short URL, and embed URL
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = input.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUrl(input);
    setError('');
    
    if (!input) {
      setVideoId(null);
      return;
    }

    const id = extractVideoId(input);
    if (id) {
      setVideoId(id);
    } else {
      setVideoId(null);
      // Don't show error immediately while typing, maybe on blur or if it looks like a full url but invalid
    }
  };

  const handleDownload = async (imageUrl: string, quality: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `youtube-thumbnail-${quality}-${videoId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback for CORS issues
      window.open(imageUrl, '_blank');
    }
  };

  const thumbnails = videoId ? [
    { label: 'Max Resolution (HD)', quality: 'maxresdefault', width: 1280, height: 720 },
    { label: 'Standard (SD)', quality: 'sddefault', width: 640, height: 480 },
    { label: 'High Quality', quality: 'hqdefault', width: 480, height: 360 },
    { label: 'Medium Quality', quality: 'mqdefault', width: 320, height: 180 },
  ] : [];

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
          YouTube Thumbnail Downloader
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          View and download thumbnails from any YouTube video in multiple qualities
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl p-6 sm:p-8 space-y-8">
        {/* Input Section */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Video URL</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={url}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          {url && !videoId && (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm mt-2">
              <AlertCircle size={16} />
              <span>Invalid YouTube URL</span>
            </div>
          )}
        </div>

        {/* Thumbnails Grid */}
        {videoId ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {thumbnails.map((thumb) => {
              const imageUrl = `https://img.youtube.com/vi/${videoId}/${thumb.quality}.jpg`;
              
              return (
                <div key={thumb.quality} className="space-y-3 group">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900 dark:text-white text-sm">{thumb.label}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{thumb.width}x{thumb.height}</span>
                  </div>
                  
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm group-hover:shadow-md transition-all">
                    <img
                      src={imageUrl}
                      alt={thumb.label}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Hide if image doesn't exist (some videos don't have maxres)
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                           target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-sm">Not Available</div>';
                        }
                      }}
                    />
                    
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                         <button
                          onClick={() => handleDownload(imageUrl, thumb.quality)}
                          className="p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg shadow-lg hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors transform translate-y-2 group-hover:translate-y-0 duration-200"
                          title="Download"
                        >
                          <Download size={20} />
                        </button>
                        <a
                          href={imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg shadow-lg hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors transform translate-y-2 group-hover:translate-y-0 duration-200 delay-75"
                          title="Open in New Tab"
                        >
                          <ExternalLink size={20} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full inline-flex mb-4">
              <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Enter a YouTube URL to view thumbnails</p>
          </div>
        )}
      </div>
    </div>
  );
}
