import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { SAMPLE_LOGOS } from '../../data/sampleLogos';
import { ImageCanvasElement } from '../../types/document';

interface ImagesTabProps {
  onAddImageElement: (element: Partial<ImageCanvasElement>) => void;
}

export const ImagesTab: React.FC<ImagesTabProps> = ({ onAddImageElement }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setUploadError(null);
    if (!file.type.match(/image\/(png|jpeg|jpg|svg\+xml|webp)/)) {
      setUploadError('Please upload a valid image (PNG, JPG, or SVG).');
      return;
    }

    // Read as Data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Measure natural dimensions to preserve aspect ratio
        const img = new Image();
        img.onload = () => {
          let width = 120;
          let height = 120;
          if (img.width && img.height) {
            const aspect = img.width / img.height;
            if (aspect >= 1) {
              width = 140;
              height = Math.round(140 / aspect);
            } else {
              height = 140;
              width = Math.round(140 * aspect);
            }
          }

          onAddImageElement({
            src: result,
            width,
            height,
            objectFit: 'contain',
            borderRadius: 0,
          });
        };
        img.src = result;
      }
    };
    reader.onerror = () => setUploadError('Failed to read image file.');
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="p-3 space-y-4">
      {/* Upload Box with Drag and Drop */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Upload Logo or Image
        </h3>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
          className="hidden"
        />

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/70 scale-102'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/30'
          }`}
        >
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-700">
            Click or drag & drop image
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            PNG, JPG, JPEG, or SVG (Up to 10MB)
          </p>
        </div>

        {uploadError && (
          <div className="flex items-center gap-1.5 mt-2 p-2 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Preset Vector Logos */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Stock Emblems & Logos
          </h3>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <p className="text-[11px] text-slate-500 mb-2.5">
          High-resolution vector logos for instant letterhead placement:
        </p>

        <div className="grid grid-cols-2 gap-2">
          {SAMPLE_LOGOS.map((logo) => (
            <button
              key={logo.id}
              onClick={() =>
                onAddImageElement({
                  src: logo.svgDataUri,
                  width: 80,
                  height: 80,
                  objectFit: 'contain',
                  borderRadius: 0,
                })
              }
              className="p-2.5 bg-white border border-slate-200 hover:border-blue-400 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-sm group text-center"
            >
              <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img src={logo.svgDataUri} alt={logo.name} className="max-w-full max-h-full" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 group-hover:text-blue-600 line-clamp-1">
                {logo.name}
              </span>
              <span className="text-[9px] font-medium text-slate-400 uppercase">
                {logo.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
