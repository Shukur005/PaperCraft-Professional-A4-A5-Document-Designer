import React, { useRef, useState, useEffect, useCallback } from 'react';
import { DocumentDesign, PAPER_SPECS } from '../../types/document';
import { CanvasElementRenderer } from '../Canvas/CanvasElementRenderer';
import { X, Printer, Download, ZoomIn, ZoomOut, Maximize2, Minimize2, Check } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: DocumentDesign;
  onPrint: () => void;
  onDownloadPdf: () => void;
  isPdfExporting: boolean;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  design,
  onPrint,
  onDownloadPdf,
  isPdfExporting,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const specs = PAPER_SPECS[design.paperSize][design.orientation];

  // Calculate optimal zoom to fit page neatly within viewport
  const getFitPageZoom = useCallback(() => {
    if (typeof window === 'undefined') return 0.75;
    const availWidth = Math.max(300, window.innerWidth - 64);
    const availHeight = Math.max(300, window.innerHeight - 150);
    const scaleX = availWidth / specs.widthPx;
    const scaleY = availHeight / specs.heightPx;
    const fit = Math.min(scaleX, scaleY, 0.95);
    return Math.max(0.25, Math.round(fit * 100) / 100);
  }, [specs.widthPx, specs.heightPx]);

  const [zoom, setZoom] = useState<number>(0.75);

  // Initialize and reset zoom to Fit Page whenever modal opens or paper specs change
  useEffect(() => {
    if (isOpen) {
      setZoom(getFitPageZoom());
    }
  }, [isOpen, getFitPageZoom]);

  // Handle keyboard shortcuts (Escape to close, Ctrl+P to print, +/- to zoom)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        onPrint();
        return;
      }
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setZoom((z) => Math.min(2.0, Math.round((z + 0.1) * 10) / 10));
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setZoom((z) => Math.max(0.25, Math.round((z - 0.1) * 10) / 10));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrint]);

  if (!isOpen) return null;

  const borderMarginPx = (design.pageBorder.margin / specs.widthMm) * specs.widthPx;

  // Inches calculation for physical dimension clarity
  const widthInches = (specs.widthMm / 25.4).toFixed(2);
  const heightInches = (specs.heightMm / 25.4).toFixed(2);

  return (
    <div
      ref={containerRef}
      onClick={(e) => {
        if (e.target === containerRef.current) {
          onClose();
        }
      }}
      className="no-print fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-4 select-none animate-in fade-in duration-150 overflow-hidden"
    >
      {/* Top Header Bar */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-2 bg-slate-900/95 text-white px-4 py-2.5 rounded-xl border border-slate-700/80 shadow-2xl shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white">Print & PDF Preview</span>
            <span className="text-[11px] font-semibold text-blue-400 bg-blue-950/70 border border-blue-800/60 px-2 py-0.5 rounded-md">
              {design.paperSize} • {design.orientation}
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden md:inline font-mono">
            {specs.widthMm} × {specs.heightMm} mm ({widthInches}" × {heightInches}")
          </span>
        </div>

        {/* Zoom Controls & Presets */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-800/80 border border-slate-700/60 px-2 py-1 rounded-lg">
          <button
            onClick={() => setZoom((z) => Math.max(0.25, Math.round((z - 0.1) * 10) / 10))}
            className="p-1 hover:bg-slate-700 rounded text-slate-300 transition-colors"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="font-mono text-slate-200 min-w-[42px] text-center font-medium">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={() => setZoom((z) => Math.min(2.0, Math.round((z + 0.1) * 10) / 10))}
            className="p-1 hover:bg-slate-700 rounded text-slate-300 transition-colors"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="h-3.5 w-px bg-slate-700 mx-1" />

          <button
            onClick={() => setZoom(getFitPageZoom())}
            className="px-2 py-0.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-medium transition-colors"
            title="Fit Full Page in View (0)"
          >
            Fit Page
          </button>

          <button
            onClick={() => setZoom(1.0)}
            className="px-1.5 py-0.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-mono transition-colors"
            title="Actual 100% Size"
          >
            100%
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onDownloadPdf}
            disabled={isPdfExporting}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isPdfExporting ? 'Exporting...' : 'PDF'}</span>
          </button>

          <button
            onClick={onPrint}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors text-white"
            title="Print Document (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Print Now</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1"
            title="Close Preview (Escape)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Container with Scaled Paper */}
      {/* Uses flex with child margin: auto to guarantee center alignment when small and full scrollability from (0,0) without clipping when large */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        className="flex-1 w-full overflow-auto p-4 sm:p-6 flex"
      >
        <div
          style={{
            margin: 'auto',
            width: `${specs.widthPx * zoom}px`,
            height: `${specs.heightPx * zoom}px`,
            position: 'relative',
            transition: 'width 0.12s ease, height 0.12s ease',
          }}
        >
          <div
            id="preview-paper-surface"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              width: `${specs.widthPx}px`,
              height: `${specs.heightPx}px`,
              backgroundColor: design.backgroundColor || '#ffffff',
            }}
            className="relative shadow-2xl bg-white overflow-hidden rounded-xs"
          >
            {/* Page Border Layer */}
            {design.pageBorder.enabled && (
              <div
                className="absolute pointer-events-none z-2"
                style={{
                  top: `${borderMarginPx}px`,
                  bottom: `${borderMarginPx}px`,
                  left: `${borderMarginPx}px`,
                  right: `${borderMarginPx}px`,
                  borderTop: design.pageBorder.top
                    ? `${design.pageBorder.width}px ${
                        design.pageBorder.style === 'ornate' ? 'solid' : design.pageBorder.style
                      } ${design.pageBorder.color}`
                    : 'none',
                  borderBottom: design.pageBorder.bottom
                    ? `${design.pageBorder.width}px ${
                        design.pageBorder.style === 'ornate' ? 'solid' : design.pageBorder.style
                      } ${design.pageBorder.color}`
                    : 'none',
                  borderLeft: design.pageBorder.left
                    ? `${design.pageBorder.width}px ${
                        design.pageBorder.style === 'ornate' ? 'solid' : design.pageBorder.style
                      } ${design.pageBorder.color}`
                    : 'none',
                  borderRight: design.pageBorder.right
                    ? `${design.pageBorder.width}px ${
                        design.pageBorder.style === 'ornate' ? 'solid' : design.pageBorder.style
                      } ${design.pageBorder.color}`
                    : 'none',
                  borderRadius: `${design.pageBorder.rounded}px`,
                  boxShadow:
                    design.pageBorder.style === 'ornate'
                      ? `inset 0 0 0 3px #ffffff, inset 0 0 0 5px ${design.pageBorder.color}`
                      : 'none',
                }}
              />
            )}

            {/* Watermark Layer */}
            {design.watermark.enabled && (
              <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none ${
                  design.watermark.isBehind ? 'z-0' : 'z-30'
                }`}
                style={{
                  opacity: design.watermark.opacity,
                  transform: `rotate(${design.watermark.rotation}deg)`,
                }}
              >
                {design.watermark.type === 'text' ? (
                  <span
                    className="font-bold tracking-widest text-center whitespace-pre-wrap leading-tight select-none"
                    style={{
                      fontFamily: design.watermark.fontFamily || 'Montserrat',
                      fontSize: `${design.watermark.fontSize || 54}px`,
                      color: design.watermark.color || '#94a3b8',
                      textTransform: 'uppercase',
                    }}
                  >
                    {design.watermark.text || 'WATERMARK'}
                  </span>
                ) : (
                  design.watermark.imageUrl && (
                    <img
                      src={design.watermark.imageUrl}
                      alt="Watermark"
                      className="max-w-[65%] max-h-[65%] object-contain select-none"
                    />
                  )
                )}
              </div>
            )}

            {/* Clean, Non-Interactive Read-Only Element Rendering */}
            {design.elements.map((element) => (
              <CanvasElementRenderer
                key={element.id}
                element={element}
                isSelected={false}
                readOnly={true}
                onSelect={() => {}}
                onUpdate={() => {}}
                onDuplicate={() => {}}
                onDelete={() => {}}
                canvasScale={zoom}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Bottom Status Bar */}
      <div className="w-full max-w-md flex items-center justify-between bg-slate-900/90 text-slate-400 text-[11px] px-3.5 py-1.5 rounded-full border border-slate-800 shadow-lg shrink-0 mt-2">
        <span>Ready for Standard Inkjet & Laser Printers</span>
        <span className="font-mono text-slate-300">
          {design.elements.length} element{design.elements.length === 1 ? '' : 's'}
        </span>
        <button
          onClick={onClose}
          className="text-slate-300 hover:text-white font-medium hover:underline"
        >
          Exit Preview
        </button>
      </div>
    </div>
  );
};
