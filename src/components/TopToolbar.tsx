import React, { useState } from 'react';
import {
  FileText,
  Save,
  FolderOpen,
  Plus,
  Undo2,
  Redo2,
  Eye,
  Printer,
  Download,
  Check,
  ChevronDown,
} from 'lucide-react';
import { PaperSize, PaperOrientation, PAPER_SPECS } from '../types/document';

interface TopToolbarProps {
  documentName: string;
  onRename: (name: string) => void;
  paperSize: PaperSize;
  orientation: PaperOrientation;
  onChangePaperFormat: (size: PaperSize, orientation: PaperOrientation) => void;
  onSave: () => void;
  onOpenSavedModal: () => void;
  onOpenNewModal: () => void;
  onPreview: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isSaving: boolean;
  isPdfExporting: boolean;
  lastSavedTime: number | null;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  documentName,
  onRename,
  paperSize,
  orientation,
  onChangePaperFormat,
  onSave,
  onOpenSavedModal,
  onOpenNewModal,
  onPreview,
  onPrint,
  onDownloadPdf,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isSaving,
  isPdfExporting,
  lastSavedTime,
}) => {
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(documentName);

  const handleTitleSubmit = () => {
    setEditingTitle(false);
    if (tempTitle.trim()) {
      onRename(tempTitle.trim());
    } else {
      setTempTitle(documentName);
    }
  };

  const currentSpecs = PAPER_SPECS[paperSize][orientation];

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-3 shadow-xs shrink-0 select-none z-30">
      {/* Brand & Document Name */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <FileText className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="font-bold text-slate-800 text-sm tracking-tight hidden md:inline">
            Paper Designer
          </span>
        </div>

        <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* Title Editor */}
        <div className="relative max-w-[200px] lg:max-w-[280px]">
          {editingTitle ? (
            <input
              type="text"
              autoFocus
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className="px-2 py-1 text-sm font-semibold text-slate-800 bg-blue-50/50 border border-blue-400 rounded-md outline-none w-full"
            />
          ) : (
            <button
              onClick={() => {
                setTempTitle(documentName);
                setEditingTitle(true);
              }}
              title="Click to rename document"
              className="px-2 py-1 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-md truncate block text-left transition-colors"
            >
              {documentName || 'Untitled Document'}
            </button>
          )}
        </div>

        {/* Paper Size Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-md border border-slate-200 transition-colors"
            title="Change paper size and orientation"
          >
            <span>
              {paperSize} {orientation === 'portrait' ? 'Portrait' : 'Landscape'}
            </span>
            <span className="text-slate-400 text-[11px]">
              ({currentSpecs.widthMm}×{currentSpecs.heightMm}mm)
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
          </button>

          {isSizeDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsSizeDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Paper Formats
                </div>

                <button
                  onClick={() => {
                    onChangePaperFormat('A4', 'portrait');
                    setIsSizeDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                    paperSize === 'A4' && orientation === 'portrait'
                      ? 'bg-blue-50/70 text-blue-700 font-bold'
                      : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-medium">A4 Portrait</div>
                    <div className="text-[11px] text-slate-400">210 × 297 mm (Standard Document)</div>
                  </div>
                  {paperSize === 'A4' && orientation === 'portrait' && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>

                <button
                  onClick={() => {
                    onChangePaperFormat('A4', 'landscape');
                    setIsSizeDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                    paperSize === 'A4' && orientation === 'landscape'
                      ? 'bg-blue-50/70 text-blue-700 font-bold'
                      : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-medium">A4 Landscape</div>
                    <div className="text-[11px] text-slate-400">297 × 210 mm (Certificates, Schedules)</div>
                  </div>
                  {paperSize === 'A4' && orientation === 'landscape' && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={() => {
                    onChangePaperFormat('A5', 'portrait');
                    setIsSizeDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                    paperSize === 'A5' && orientation === 'portrait'
                      ? 'bg-blue-50/70 text-blue-700 font-bold'
                      : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-medium">A5 Portrait</div>
                    <div className="text-[11px] text-slate-400">148 × 210 mm (Prescriptions, Receipts)</div>
                  </div>
                  {paperSize === 'A5' && orientation === 'portrait' && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>

                <button
                  onClick={() => {
                    onChangePaperFormat('A5', 'landscape');
                    setIsSizeDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                    paperSize === 'A5' && orientation === 'landscape'
                      ? 'bg-blue-50/70 text-blue-700 font-bold'
                      : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-medium">A5 Landscape</div>
                    <div className="text-[11px] text-slate-400">210 × 148 mm (Badges, Vouchers)</div>
                  </div>
                  {paperSize === 'A5' && orientation === 'landscape' && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center File Actions & Undo/Redo */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenNewModal}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          title="Create New Blank Document or Template"
        >
          <Plus className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">New</span>
        </button>

        <button
          onClick={onOpenSavedModal}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          title="Open Saved Designs"
        >
          <FolderOpen className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Saved</span>
        </button>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50"
          title="Save to local browser storage"
        >
          <Save className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Save</span>
          {lastSavedTime && (
            <span className="text-[10px] text-emerald-600 font-normal hidden lg:inline">
              (Saved)
            </span>
          )}
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* Right Primary Output Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPreview}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-lg shadow-2xs transition-colors"
          title="Preview Document as Printed"
        >
          <Eye className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        <button
          onClick={onDownloadPdf}
          disabled={isPdfExporting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors disabled:opacity-50"
          title="Export as Printable PDF"
        >
          <Download className="w-3.5 h-3.5 text-slate-700" />
          <span className="hidden md:inline">
            {isPdfExporting ? 'Exporting...' : 'Download PDF'}
          </span>
          <span className="md:hidden">PDF</span>
        </button>

        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          title="Print Document directly (A4 / A5)"
        >
          <Printer className="w-4 h-4 stroke-[2.2]" />
          <span>Print</span>
        </button>
      </div>
    </header>
  );
};
