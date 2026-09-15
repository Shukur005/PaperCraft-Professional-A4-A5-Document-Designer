import React, { useState } from 'react';

interface ColorPickerPopoverProps {
  label?: string;
  color?: string;
  onChange: (color: string) => void;
  allowTransparent?: boolean;
}

const PRESET_PALETTES = [
  // Neutrals & Grayscale
  '#000000', '#1e293b', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#f1f5f9', '#ffffff',
  // Medical & Corporate Blues
  '#0369a1', '#0284c7', '#38bdf8', '#0f766e', '#14b8a6', '#2dd4bf', '#1e3a8a', '#3b82f6',
  // Warm, Retail & Luxury
  '#ca8a04', '#eab308', '#fef08a', '#c2410c', '#ea580c', '#fb923c', '#831843', '#be185d',
  // Greens & Dark Slate
  '#15803d', '#22c55e', '#86efac', '#b91c1c', '#ef4444', '#fca5a5', '#312e81', '#6366f1'
];

export const ColorPickerPopover: React.FC<ColorPickerPopoverProps> = ({
  label,
  color,
  onChange,
  allowTransparent = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const safeColor = color || (allowTransparent ? 'transparent' : '#000000');
  const isTransparent = safeColor === 'transparent' || safeColor === '';
  const displayLabel = isTransparent ? 'None' : safeColor.toUpperCase();
  const hexValue = !isTransparent && safeColor.startsWith('#') && safeColor.length === 7 ? safeColor : '#000000';

  return (
    <div className="relative inline-block text-left">
      {label && <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2.5 py-1.5 border border-slate-200 rounded-lg hover:border-slate-300 bg-white shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <div
            className="w-5 h-5 rounded-md border border-slate-300 shadow-inner flex items-center justify-center text-[10px]"
            style={{
              backgroundColor: isTransparent ? '#ffffff' : safeColor,
              backgroundImage:
                isTransparent
                  ? 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)'
                  : 'none',
              backgroundSize: '6px 6px',
            }}
          />
          <span className="text-xs font-mono text-slate-700">
            {displayLabel}
          </span>
        </button>

        <input
          type="color"
          value={hexValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 p-0 border-0 rounded cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          title="Custom Color"
        />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-56 p-3 bg-white border border-slate-200 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="text-xs font-semibold text-slate-500 mb-2">Preset Colors</div>
            <div className="grid grid-cols-8 gap-1.5 mb-3">
              {PRESET_PALETTES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    onChange(preset);
                    setIsOpen(false);
                  }}
                  className={`w-5 h-5 rounded-md border transition-transform hover:scale-115 ${
                    !isTransparent && safeColor.toLowerCase() === preset.toLowerCase()
                      ? 'ring-2 ring-blue-500 ring-offset-1 border-white'
                      : 'border-slate-200'
                  }`}
                  style={{ backgroundColor: preset }}
                  title={preset}
                />
              ))}
            </div>

            {allowTransparent && (
              <button
                type="button"
                onClick={() => {
                  onChange('transparent');
                  setIsOpen(false);
                }}
                className={`w-full py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                  isTransparent
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                No Color (Transparent)
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
