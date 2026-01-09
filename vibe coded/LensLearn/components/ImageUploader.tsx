import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, X, RefreshCw } from 'lucide-react';
import { FileUploadHandler } from '../types';

interface ImageUploaderProps {
  onImageSelect: FileUploadHandler;
  isAnalyzing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isAnalyzing }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // File Input Handler (for Upload button)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
    event.target.value = '';
  };

  // Start Camera Logic
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Prefer back camera on mobile
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Unable to access camera. Please allow camera permissions or use the 'Upload Image' option.");
    }
  };

  // Stop Camera Logic
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  // Ensure camera stops if component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Attach stream to video element when camera opens
  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen]);

  // Capture Photo Logic
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Match canvas size to video resolution
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        // Flip horizontally if using front camera (optional, usually mirroring is for user benefit but 'environment' is back camera)
        // context.scale(-1, 1); 
        // context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });
            onImageSelect(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  // --- CAMERA VIEW ---
  if (isCameraOpen) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-fade-in">
        {/* Close Button */}
        <button 
          onClick={stopCamera}
          className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 backdrop-blur-md z-10"
        >
          <X size={24} />
        </button>

        {/* Video Feed */}
        <div className="w-full h-full relative flex items-center justify-center bg-black">
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover sm:object-contain"
          />
        </div>

        {/* Capture Controls Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-8 pb-10 flex justify-center items-center bg-gradient-to-t from-black/80 to-transparent">
          <button 
            onClick={capturePhoto}
            className="w-20 h-20 bg-white rounded-full border-4 border-slate-300 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 bg-white rounded-full border-2 border-slate-900"></div>
          </button>
        </div>

        {/* Hidden Canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  // --- DEFAULT VIEW ---
  return (
    <div className="w-full animate-fade-in">
      <div className={`
          relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all duration-300
          flex flex-col items-center justify-center gap-6 overflow-hidden
          ${isAnalyzing 
            ? 'border-slate-300 bg-slate-50 cursor-wait opacity-60' 
            : 'border-indigo-200 bg-white shadow-sm hover:border-indigo-300 hover:shadow-md'
          }
        `}
      >
        {/* Decorative Background Icon */}
        {!isAnalyzing && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-50 pointer-events-none">
              <Camera size={200} strokeWidth={1} />
           </div>
        )}

        <div className="space-y-2 relative z-10">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            {isAnalyzing ? 'Analyzing Object...' : 'What do you want to learn about?'}
          </h3>
          {!isAnalyzing && (
            <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium">
              Take a photo or upload an image to start.
            </p>
          )}
        </div>

        {!isAnalyzing ? (
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center relative z-10 mt-2">
            
            {/* Take Photo Button (Triggers custom camera) */}
            <button
              onClick={startCamera}
              className="flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border border-indigo-200 bg-indigo-50/80 text-indigo-800 hover:bg-indigo-100 hover:scale-[1.02] active:scale-95 transition-all group backdrop-blur-sm"
            >
              <div className="bg-white p-2.5 rounded-full shadow-sm text-indigo-600 group-hover:text-indigo-700">
                <Camera size={24} />
              </div>
              <div className="text-left">
                <span className="block font-bold text-sm">Take Photo</span>
                <span className="block text-[10px] opacity-70 font-medium uppercase tracking-wider">Use Camera</span>
              </div>
            </button>

            {/* Gallery Action (Standard File Input) */}
            <label className="flex-1 cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl border border-slate-200 bg-white/80 text-slate-700 hover:border-indigo-200 hover:bg-slate-50 hover:scale-[1.02] active:scale-95 transition-all group backdrop-blur-sm h-full">
                <div className="bg-slate-100 p-2.5 rounded-full text-slate-600 group-hover:text-indigo-600 group-hover:bg-white shadow-sm transition-colors">
                  <ImageIcon size={24} />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm">Upload Image</span>
                  <span className="block text-[10px] opacity-70 font-medium uppercase tracking-wider">From Gallery</span>
                </div>
              </div>
            </label>
          </div>
        ) : (
          <div className="py-6 relative z-10 flex flex-col items-center">
             <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
             <p className="text-sm text-slate-500 font-medium animate-pulse">Identify scientific concepts...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;