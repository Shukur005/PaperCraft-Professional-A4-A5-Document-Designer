import React from 'react';
import { Type, AlignLeft, AlignCenter, AlignRight, Building2, Stethoscope, ShoppingBag, PenLine } from 'lucide-react';
import { TextCanvasElement } from '../../types/document';

interface TextTabProps {
  onAddTextElement: (element: Partial<TextCanvasElement>) => void;
  onAddHeaderPreset: (type: 'hospital' | 'business' | 'shop', align: 'left' | 'center' | 'right') => void;
}

export const TextTab: React.FC<TextTabProps> = ({
  onAddTextElement,
  onAddHeaderPreset,
}) => {
  return (
    <div className="p-3 space-y-4">
      {/* Quick Text Add Buttons */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Add Text Box
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={() =>
              onAddTextElement({
                text: 'DOCUMENT TITLE',
                fontSize: 26,
                fontWeight: '700',
                fontFamily: 'Montserrat',
                color: '#0f172a',
                letterSpacing: 1,
                width: 400,
                height: 40,
              })
            }
            className="w-full py-2.5 px-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-colors flex items-center justify-between group"
          >
            <span className="font-bold text-base text-slate-800 tracking-tight group-hover:text-blue-700">
              Add a Heading
            </span>
            <span className="text-[10px] text-slate-400 font-mono">26px Bold</span>
          </button>

          <button
            onClick={() =>
              onAddTextElement({
                text: 'Department / Section Subtitle',
                fontSize: 16,
                fontWeight: '600',
                fontFamily: 'Plus Jakarta Sans',
                color: '#334155',
                width: 350,
                height: 30,
              })
            }
            className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-colors flex items-center justify-between group"
          >
            <span className="font-semibold text-sm text-slate-700 group-hover:text-blue-700">
              Add a Subheading
            </span>
            <span className="text-[10px] text-slate-400 font-mono">16px Semi</span>
          </button>

          <button
            onClick={() =>
              onAddTextElement({
                text: 'Enter your body text, notes, report descriptions, or terms and conditions here. Double-click to edit content directly.',
                fontSize: 12,
                fontWeight: '400',
                fontFamily: 'Plus Jakarta Sans',
                color: '#475569',
                width: 450,
                height: 70,
                lineHeight: 1.6,
              })
            }
            className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-colors flex items-center justify-between group"
          >
            <span className="text-xs text-slate-600 group-hover:text-blue-700">
              Add Body Paragraph Text
            </span>
            <span className="text-[10px] text-slate-400 font-mono">12px Regular</span>
          </button>
        </div>
      </div>

      {/* Stylized Text Elements */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Specialty Text Blocks
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() =>
              onAddTextElement({
                text: '℞',
                fontSize: 42,
                fontFamily: 'Playfair Display',
                fontWeight: '700',
                fontStyle: 'italic',
                color: '#0369a1',
                width: 70,
                height: 50,
              })
            }
            className="p-2 bg-white border border-slate-200 hover:border-blue-300 rounded-lg text-left transition-colors"
          >
            <div className="font-serif italic text-xl text-blue-700 font-bold">℞ Symbol</div>
            <div className="text-[10px] text-slate-400">Medical Prescription</div>
          </button>

          <button
            onClick={() =>
              onAddTextElement({
                text: 'Dr. Evelyn Montgomery',
                fontSize: 36,
                fontFamily: 'Great Vibes',
                fontWeight: '400',
                color: '#1e293b',
                width: 300,
                height: 50,
              })
            }
            className="p-2 bg-white border border-slate-200 hover:border-blue-300 rounded-lg text-left transition-colors"
          >
            <div className="font-serif text-lg text-slate-800" style={{ fontFamily: 'Great Vibes' }}>
              Signature Script
            </div>
            <div className="text-[10px] text-slate-400">Cursive Signoff</div>
          </button>

          <button
            onClick={() =>
              onAddTextElement({
                text: '_____________________________\nDoctor\'s Signature & Seal\nReg. No: ____________________',
                fontSize: 11,
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: '600',
                textAlign: 'center',
                color: '#334155',
                width: 240,
                height: 60,
                lineHeight: 1.5,
              })
            }
            className="p-2 bg-white border border-slate-200 hover:border-blue-300 rounded-lg text-left transition-colors"
          >
            <div className="flex items-center gap-1 font-semibold text-xs text-slate-800">
              <PenLine className="w-3.5 h-3.5 text-blue-600" />
              Sign Block
            </div>
            <div className="text-[10px] text-slate-400">Doctor / Seal line</div>
          </button>

          <button
            onClick={() =>
              onAddTextElement({
                text: 'INV-2026-001 | DATE: 15/09/2026',
                fontSize: 11,
                fontFamily: 'Roboto Mono',
                fontWeight: '600',
                color: '#0f172a',
                backgroundColor: '#f8fafc',
                width: 250,
                height: 25,
              })
            }
            className="p-2 bg-white border border-slate-200 hover:border-blue-300 rounded-lg text-left transition-colors"
          >
            <div className="font-mono text-xs font-bold text-slate-800">INV-2026-001</div>
            <div className="text-[10px] text-slate-400">Monospace Ref / Bill</div>
          </button>
        </div>
      </div>

      {/* One-Click Header & Letterhead Generator */}
      <div className="pt-2 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Letterhead Header Layouts
          </h3>
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <p className="text-[11px] text-slate-500 mb-2">
          Insert standard organization headers with aligned contact details:
        </p>

        {/* Preset categories */}
        <div className="space-y-2">
          {/* Hospital Header */}
          <div className="p-2.5 bg-sky-50/50 border border-sky-200 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
              <Stethoscope className="w-4 h-4 text-sky-600" />
              <span>Hospital / Clinic Header</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => onAddHeaderPreset('hospital', 'left')}
                className="py-1.5 px-2 bg-white hover:bg-sky-100 border border-sky-200 rounded-lg text-[11px] font-semibold text-sky-800 flex items-center justify-center gap-1 transition-colors"
                title="Logo left, details left"
              >
                <AlignLeft className="w-3 h-3" /> Left
              </button>
              <button
                onClick={() => onAddHeaderPreset('hospital', 'center')}
                className="py-1.5 px-2 bg-white hover:bg-sky-100 border border-sky-200 rounded-lg text-[11px] font-semibold text-sky-800 flex items-center justify-center gap-1 transition-colors"
                title="Centered title and address"
              >
                <AlignCenter className="w-3 h-3" /> Center
              </button>
              <button
                onClick={() => onAddHeaderPreset('hospital', 'right')}
                className="py-1.5 px-2 bg-white hover:bg-sky-100 border border-sky-200 rounded-lg text-[11px] font-semibold text-sky-800 flex items-center justify-center gap-1 transition-colors"
                title="Split: Title left, contacts right"
              >
                <AlignRight className="w-3 h-3" /> Split
              </button>
            </div>
          </div>

          {/* Business Header */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Building2 className="w-4 h-4 text-slate-600" />
              <span>Corporate Company Header</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => onAddHeaderPreset('business', 'left')}
                className="py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
              >
                <AlignLeft className="w-3 h-3" /> Left
              </button>
              <button
                onClick={() => onAddHeaderPreset('business', 'center')}
                className="py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
              >
                <AlignCenter className="w-3 h-3" /> Center
              </button>
              <button
                onClick={() => onAddHeaderPreset('business', 'right')}
                className="py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
              >
                <AlignRight className="w-3 h-3" /> Split
              </button>
            </div>
          </div>

          {/* Shop Header */}
          <div className="p-2.5 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <span>Shop & Retail Store Header</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => onAddHeaderPreset('shop', 'left')}
                className="py-1.5 px-2 bg-white hover:bg-amber-100 border border-amber-200 rounded-lg text-[11px] font-semibold text-amber-800 flex items-center justify-center gap-1 transition-colors"
              >
                <AlignLeft className="w-3 h-3" /> Left
              </button>
              <button
                onClick={() => onAddHeaderPreset('shop', 'center')}
                className="py-1.5 px-2 bg-white hover:bg-amber-100 border border-amber-200 rounded-lg text-[11px] font-semibold text-amber-800 flex items-center justify-center gap-1 transition-colors"
              >
                <AlignCenter className="w-3 h-3" /> Center
              </button>
              <button
                onClick={() => onAddHeaderPreset('shop', 'right')}
                className="py-1.5 px-2 bg-white hover:bg-amber-100 border border-amber-200 rounded-lg text-[11px] font-semibold text-amber-800 flex items-center justify-center gap-1 transition-colors"
              >
                <AlignRight className="w-3 h-3" /> Split
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
