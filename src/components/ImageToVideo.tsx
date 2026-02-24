import React, { useState, useRef, useEffect } from 'react';
import { Upload, Video, Download, X, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ImageToVideo() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setVideoUrl(null);
      setError(null);
      setProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setVideoUrl(null);
      setError(null);
      setProgress(0);
    }
  };

  const convertToVideo = async () => {
    if (!image || !canvasRef.current) return;

    setIsConverting(true);
    setProgress(0);
    setError(null);
    setVideoUrl(null);
    chunksRef.current = [];

    const img = new Image();
    img.src = URL.createObjectURL(image);
    
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = canvasRef.current;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setError('Could not get canvas context.');
      setIsConverting(false);
      return;
    }

    // Draw initial frame
    ctx.drawImage(img, 0, 0);

    // Setup MediaRecorder
    const stream = canvas.captureStream(30); // 30 FPS
    
    // Try to use MP4 mime type if available, otherwise fallback
    const mimeTypes = [
      'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
      'video/mp4',
      'video/webm; codecs=vp9',
      'video/webm'
    ];
    
    let selectedMimeType = '';
    for (const type of mimeTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        selectedMimeType = type;
        break;
      }
    }

    if (!selectedMimeType) {
      setError('Your browser does not support video recording.');
      setIsConverting(false);
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 5000000 // 5 Mbps for good quality
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: selectedMimeType });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setIsConverting(false);
        setProgress(100);
      };

      mediaRecorder.start();

      // Animation loop to keep the stream active (even if static)
      let startTime = Date.now();
      const duration = 5000; // 5 seconds

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const p = Math.min(elapsed / duration, 1);
        
        setProgress(Math.round(p * 100));
        
        // Redraw to keep stream fresh (some browsers need this)
        ctx.drawImage(img, 0, 0);

        if (elapsed < duration) {
          requestAnimationFrame(animate);
        } else {
          mediaRecorder.stop();
        }
      };

      animate();

    } catch (err) {
      console.error(err);
      setError('Failed to start recording: ' + (err as Error).message);
      setIsConverting(false);
    }
  };

  const downloadVideo = () => {
    if (videoUrl && image) {
      const a = document.createElement('a');
      a.href = videoUrl;
      // Use original name but change extension to .mp4
      const name = image.name.substring(0, image.name.lastIndexOf('.')) || image.name;
      a.download = `${name}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">
          Image to Video Converter
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Convert any image to a 5-second MP4 video
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 space-y-8 shadow-sm">
        
        {/* Upload Area */}
        {!imagePreview ? (
          <div 
            className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-200">
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-1">
              Click to upload or drag and drop
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Supports JPG, PNG, WEBP, GIF (static)
            </p>
            <input 
              id="file-input" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preview Area */}
            <div className="relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 aspect-video flex items-center justify-center group">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-w-full max-h-full object-contain shadow-sm"
              />
              
              {!isConverting && !videoUrl && (
                <button 
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                    setVideoUrl(null);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X size={20} />
                </button>
              )}

              {/* Canvas (Hidden) */}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-4">
              {error && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {!videoUrl ? (
                <button
                  onClick={convertToVideo}
                  disabled={isConverting}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all
                    ${isConverting 
                      ? 'bg-zinc-400 dark:bg-zinc-700 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm hover:shadow-md active:scale-95'
                    }`}
                >
                  {isConverting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Converting... {progress}%
                    </>
                  ) : (
                    <>
                      <Video size={20} />
                      Convert to Video
                    </>
                  )}
                </button>
              ) : (
                <div className="flex flex-col items-center gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg text-sm font-medium">
                    <Video size={16} />
                    Conversion Complete!
                  </div>
                  
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={downloadVideo}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg font-medium shadow-sm transition-all hover:shadow-md active:scale-95"
                    >
                      <Download size={20} />
                      Download .mp4
                    </button>
                    
                    <button
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                        setVideoUrl(null);
                      }}
                      className="flex-1 sm:flex-none px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium transition-colors"
                    >
                      Convert Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
