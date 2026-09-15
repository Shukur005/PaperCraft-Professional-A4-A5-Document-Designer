import React, { useRef } from 'react';
import { WatermarkConfig } from '../../types/document';
import { ColorPickerPopover } from '../Common/ColorPickerPopover';
import { Stamp, Upload, RotateCw, Layers } from 'lucide-react';
import { SAMPLE_LOGOS } from '../../data/sampleLogos';

interface WatermarkTabProps {
  watermarkConfig: WatermarkConfig;
  onChangeWatermark: (config: WatermarkConfig) => void;
}

const PRESET_WATERMARK_WORDS = [
  'CONFIDENTIAL',
  'ORIGINAL',
  'HOSPITAL COPY',
  'DRAFT',
  'PAID',
  'SAMPLE',
  'VERIFIED',
  'OFFICIAL',
];

export const WatermarkTab: React.FC<WatermarkTabProps> = ({
  watermarkConfig,
  onChangeWatermark,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        if (src) {
          onChangeWatermark({
            ...watermarkConfig,
            type: 'image',
            imageUrl: src,
            enabled: true,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-3 space-y-4">
      {/* Enable Toggle */}
      <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Stamp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Watermark</div>
            <div className="text-[11px] text-slate-500">
              Faint security emblem or text
            </div>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={watermarkConfig.enabled}
            onChange={(e) =>
              onChangeWatermark({
                ...watermarkConfig,
                enabled: e.target.checked,
              })
            }
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {watermarkConfig.enabled && (
        <div className="space-y-3 animate-in fade-in duration-150">
          {/* Watermark Type Selector */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => onChangeWatermark({ ...watermarkConfig, type: 'text' })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                watermarkConfig.type === 'text'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Text Watermark
            </button>
            <button
              onClick={() => onChangeWatermark({ ...watermarkConfig, type: 'image' })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                watermarkConfig.type === 'image'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Logo / Image
            </button>
          </div>

          {/* Text Watermark Controls */}
          {watermarkConfig.type === 'text' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={watermarkConfig.text}
                  onChange={(e) =>
                    onChangeWatermark({ ...watermarkConfig, text: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 font-bold tracking-wider uppercase"
                />
              </div>

              {/* Quick Text Presets */}
              <div className="flex flex-wrap gap-1">
                {PRESET_WATERMARK_WORDS.map((word) => (
                  <button
                    key={word}
                    onClick={() => onChangeWatermark({ ...watermarkConfig, text: word })}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded border transition-colors ${
                      watermarkConfig.text === word
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <ColorPickerPopover
                  label="Text Color"
                  color={watermarkConfig.color}
                  onChange={(color) => onChangeWatermark({ ...watermarkConfig, color })}
                  allowTransparent={false}
                />
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>Font Size</span>
                    <span className="font-mono text-blue-600">{watermarkConfig.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={24}
                    max={120}
                    value={watermarkConfig.fontSize}
                    onChange={(e) =>
                      onChangeWatermark({
                        ...watermarkConfig,
                        fontSize: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Image Watermark Controls */}
          {watermarkConfig.type === 'image' && (
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-2">
                {watermarkConfig.imageUrl ? (
                  <div className="relative w-20 h-20 mx-auto border border-slate-200 rounded-lg p-1 flex items-center justify-center bg-slate-50">
                    <img
                      src={watermarkConfig.imageUrl}
                      alt="Watermark emblem"
                      className="max-w-full max-h-full opacity-60 object-contain"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No image chosen</p>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo Image</span>
                </button>
              </div>

              {/* Or Pick from stock logos */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">
                  Or use stock emblem:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {SAMPLE_LOGOS.slice(0, 3).map((logo) => (
                    <button
                      key={logo.id}
                      onClick={() =>
                        onChangeWatermark({
                          ...watermarkConfig,
                          type: 'image',
                          imageUrl: logo.svgDataUri,
                        })
                      }
                      className="p-1.5 bg-white border border-slate-200 hover:border-blue-400 rounded-lg flex items-center justify-center"
                    >
                      <img src={logo.svgDataUri} alt={logo.name} className="w-8 h-8 object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Common Watermark Sliders: Opacity, Rotation */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Opacity</span>
                <span className="font-mono text-blue-600">
                  {Math.round(watermarkConfig.opacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.03}
                max={0.4}
                step={0.01}
                value={watermarkConfig.opacity}
                onChange={(e) =>
                  onChangeWatermark({
                    ...watermarkConfig,
                    opacity: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Angle / Rotation</span>
                <span className="font-mono text-blue-600">{watermarkConfig.rotation}°</span>
              </div>
              <input
                type="range"
                min={-90}
                max={90}
                value={watermarkConfig.rotation}
                onChange={(e) =>
                  onChangeWatermark({
                    ...watermarkConfig,
                    rotation: parseInt(e.target.value),
                  })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Behind Content Layer Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer pt-1 border-t border-slate-100">
              <input
                type="checkbox"
                checked={watermarkConfig.isBehind}
                onChange={(e) =>
                  onChangeWatermark({
                    ...watermarkConfig,
                    isBehind: e.target.checked,
                  })
                }
                className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-700 font-medium flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Place behind all text and tables
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
