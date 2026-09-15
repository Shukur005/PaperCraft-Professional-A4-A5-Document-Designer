import React from 'react';
import { PaperSize, PaperOrientation, DocumentMargins, PAPER_SPECS } from '../../types/document';
import { ColorPickerPopover } from '../Common/ColorPickerPopover';
import { FileText, AlertTriangle, Eye, Grid } from 'lucide-react';

interface PageSetupTabProps {
  paperSize: PaperSize;
  orientation: PaperOrientation;
  onChangePaperFormat: (size: PaperSize, orientation: PaperOrientation) => void;
  backgroundColor: string;
  onChangeBackgroundColor: (color: string) => void;
  margins: DocumentMargins;
  onChangeMargins: (margins: DocumentMargins) => void;
  showRulers: boolean;
  onToggleRulers: () => void;
  showGuides: boolean;
  onToggleGuides: () => void;
}

export const PageSetupTab: React.FC<PageSetupTabProps> = ({
  paperSize,
  orientation,
  onChangePaperFormat,
  backgroundColor,
  onChangeBackgroundColor,
  margins,
  onChangeMargins,
  showRulers,
  onToggleRulers,
  showGuides,
  onToggleGuides,
}) => {
  const specs = PAPER_SPECS[paperSize][orientation];

  const applyPresetMargin = (mm: number) => {
    onChangeMargins({
      top: mm,
      bottom: mm,
      left: mm,
      right: mm,
    });
  };

  return (
    <div className="p-3 space-y-4">
      {/* Paper Format Selector */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Paper Specifications
        </h3>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onChangePaperFormat('A4', 'portrait')}
            className={`p-2 rounded-xl border text-left transition-all ${
              paperSize === 'A4' && orientation === 'portrait'
                ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="text-xs font-bold text-slate-800">A4 Portrait</div>
            <div className="text-[10px] text-slate-400">210 × 297 mm</div>
          </button>

          <button
            onClick={() => onChangePaperFormat('A4', 'landscape')}
            className={`p-2 rounded-xl border text-left transition-all ${
              paperSize === 'A4' && orientation === 'landscape'
                ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="text-xs font-bold text-slate-800">A4 Landscape</div>
            <div className="text-[10px] text-slate-400">297 × 210 mm</div>
          </button>

          <button
            onClick={() => onChangePaperFormat('A5', 'portrait')}
            className={`p-2 rounded-xl border text-left transition-all ${
              paperSize === 'A5' && orientation === 'portrait'
                ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="text-xs font-bold text-slate-800">A5 Portrait</div>
            <div className="text-[10px] text-slate-400">148 × 210 mm</div>
          </button>

          <button
            onClick={() => onChangePaperFormat('A5', 'landscape')}
            className={`p-2 rounded-xl border text-left transition-all ${
              paperSize === 'A5' && orientation === 'landscape'
                ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="text-xs font-bold text-slate-800">A5 Landscape</div>
            <div className="text-[10px] text-slate-400">210 × 148 mm</div>
          </button>
        </div>
      </div>

      {/* Paper Color */}
      <div className="p-3 bg-white border border-slate-200 rounded-xl">
        <ColorPickerPopover
          label="Paper Background Color"
          color={backgroundColor}
          onChange={onChangeBackgroundColor}
          allowTransparent={false}
        />
      </div>

      {/* Margins */}
      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Print Safety Margins
          </label>
          <span className="text-xs font-mono font-bold text-blue-600">
            {margins.top} mm
          </span>
        </div>

        {/* Quick margin presets */}
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => applyPresetMargin(0)}
            className={`py-1 text-xs font-semibold rounded border ${
              margins.top === 0
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            None (0mm)
          </button>
          <button
            onClick={() => applyPresetMargin(10)}
            className={`py-1 text-xs font-semibold rounded border ${
              margins.top === 10
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            Normal (10mm)
          </button>
          <button
            onClick={() => applyPresetMargin(15)}
            className={`py-1 text-xs font-semibold rounded border ${
              margins.top === 15
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            Wide (15mm)
          </button>
        </div>

        <div className="pt-1">
          <input
            type="range"
            min={0}
            max={30}
            value={margins.top}
            onChange={(e) => applyPresetMargin(parseInt(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Printer hardware limitation callout */}
        <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-snug flex items-start gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Printer note:</strong> Most physical inkjet and laser printers have a 4–5 mm non-printable margin on edges. Keep key text within the safe margin guide.
          </span>
        </div>
      </div>

      {/* Workspace Display Aids */}
      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
          Editor Guides & Rulers
        </label>

        <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            Millimeter Rulers
          </span>
          <input
            type="checkbox"
            checked={showRulers}
            onChange={onToggleRulers}
            className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
          />
        </label>

        <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer">
          <span className="flex items-center gap-1.5">
            <Grid className="w-3.5 h-3.5 text-slate-400" />
            Print Margin Safe Boundary
          </span>
          <input
            type="checkbox"
            checked={showGuides}
            onChange={onToggleGuides}
            className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
          />
        </label>
      </div>
    </div>
  );
};
