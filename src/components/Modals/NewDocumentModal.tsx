import React from 'react';
import { PaperSize, PaperOrientation, DocumentDesign } from '../../types/document';
import { TEMPLATES } from '../../data/templates';
import { X, FilePlus, Sparkles, FileText } from 'lucide-react';

interface NewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBlank: (paperSize: PaperSize, orientation: PaperOrientation) => void;
  onSelectTemplate: (template: DocumentDesign) => void;
}

export const NewDocumentModal: React.FC<NewDocumentModalProps> = ({
  isOpen,
  onClose,
  onCreateBlank,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  const blankOptions: {
    title: string;
    size: PaperSize;
    orientation: PaperOrientation;
    dims: string;
  }[] = [
    { title: 'Blank A4 Portrait', size: 'A4', orientation: 'portrait', dims: '210 × 297 mm' },
    { title: 'Blank A4 Landscape', size: 'A4', orientation: 'landscape', dims: '297 × 210 mm' },
    { title: 'Blank A5 Portrait', size: 'A5', orientation: 'portrait', dims: '148 × 210 mm' },
    { title: 'Blank A5 Landscape', size: 'A5', orientation: 'landscape', dims: '210 × 148 mm' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FilePlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Create New Document</h2>
              <p className="text-[11px] text-slate-400">
                Start from scratch with a blank page or pick a pre-designed layout
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Blank Paper Formats */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Start with Blank Paper
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {blankOptions.map((opt) => (
                <button
                  key={opt.title}
                  onClick={() => {
                    onCreateBlank(opt.size, opt.orientation);
                    onClose();
                  }}
                  className="p-3 bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-xl flex flex-col items-center text-center transition-all group"
                >
                  <div className="w-10 h-13 mb-2 rounded bg-slate-100 border border-slate-300 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-300 transition-colors">
                    <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                    {opt.size} {opt.orientation}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{opt.dims}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Ready-to-use Templates */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Or Start with a Professional Template
              </h3>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TEMPLATES.filter((t) => t.category !== 'blank').map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectTemplate(t.design);
                    onClose();
                  }}
                  className="p-3 bg-white border border-slate-200 hover:border-blue-500 hover:shadow-xs rounded-xl flex items-start gap-3 text-left transition-all group"
                >
                  <div className="w-10 h-13 rounded bg-blue-50 border border-blue-200 text-blue-600 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold">{t.design.paperSize}</span>
                    <span className="text-[8px] text-blue-400">{t.design.orientation.slice(0, 4)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 block truncate">
                      {t.title}
                    </span>
                    <span className="text-[11px] text-slate-400 block line-clamp-1 mt-0.5">
                      {t.description}
                    </span>
                    <span className="inline-block mt-1.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-bold uppercase">
                      {t.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
