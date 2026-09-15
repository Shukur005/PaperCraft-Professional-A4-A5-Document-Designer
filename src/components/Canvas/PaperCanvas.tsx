import React, { useRef, useEffect, useState, forwardRef } from 'react';
import {
  DocumentDesign,
  PAPER_SPECS,
  CanvasElement,
} from '../../types/document';
import { CanvasElementRenderer } from './CanvasElementRenderer';
import { CanvasRulers } from './CanvasRulers';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

interface PaperCanvasProps {
  design: DocumentDesign;
  selectedElementId: string | null;
  editingElementId?: string | null;
  onSelectElement: (id: string | null) => void;
  onStartEditing?: (id: string) => void;
  onStopEditing?: () => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  showRulers: boolean;
  showGuides: boolean;
  paperRef: React.RefObject<HTMLDivElement | null>;
}

export const PaperCanvas: React.FC<PaperCanvasProps> = ({
  design,
  selectedElementId,
  editingElementId = null,
  onSelectElement,
  onStartEditing,
  onStopEditing,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  showRulers,
  showGuides,
  paperRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomScale, setZoomScale] = useState<number>(0.85);
  const [autoFitScale, setAutoFitScale] = useState<number>(0.85);

  const specs = PAPER_SPECS[design.paperSize][design.orientation];

  // Auto calculate fit scale when window or workspace size changes
  useEffect(() => {
    const calculateFit = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const padding = 60; // Breathing space around paper
      const availableW = clientWidth - padding;
      const availableH = clientHeight - padding;

      if (availableW <= 0 || availableH <= 0) return;

      const scaleW = availableW / specs.widthPx;
      const scaleH = availableH / specs.heightPx;
      const fit = Math.min(scaleW, scaleH, 1.2);
      const roundedFit = Math.max(0.25, Math.round(fit * 100) / 100);

      setAutoFitScale(roundedFit);
      setZoomScale(roundedFit);
    };

    calculateFit();
    const observer = new ResizeObserver(calculateFit);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [design.paperSize, design.orientation, specs.widthPx, specs.heightPx]);

  const handleContainerClick = (e: React.MouseEvent) => {
    // Clicked outside any element deselects
    if (e.target === containerRef.current || (e.target as HTMLElement).id === 'printable-paper') {
      onSelectElement(null);
      onStopEditing?.();
    }
  };

  // Convert mm margin to px
  const borderMarginPx = (design.pageBorder.margin / specs.widthMm) * specs.widthPx;

  // Margin guide distance in px
  const safeMarginPx = (design.margins.top / specs.widthMm) * specs.widthPx;

  return (
    <div
      id="workspace-container"
      ref={containerRef}
      onClick={handleContainerClick}
      className="relative flex-1 h-full overflow-auto bg-slate-200/90 flex p-8 select-none"
      style={{
        backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Paper Wrapper with Scaled Dimensions */}
      <div
        id="printable-paper-wrapper"
        style={{
          margin: 'auto',
          width: `${specs.widthPx * zoomScale}px`,
          height: `${specs.heightPx * zoomScale}px`,
          position: 'relative',
          transition: 'width 0.1s ease, height 0.1s ease',
        }}
      >
        <div
          id="printable-paper-scaler"
          className="paper-scaler"
          style={{
            transform: `scale(${zoomScale})`,
            transformOrigin: 'top left',
            width: `${specs.widthPx}px`,
            height: `${specs.heightPx}px`,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {/* Optional Millimeter Rulers */}
          {showRulers && (
            <CanvasRulers
              widthMm={specs.widthMm}
              heightMm={specs.heightMm}
              scale={zoomScale}
              widthPx={specs.widthPx}
              heightPx={specs.heightPx}
            />
          )}

          {/* Actual Printable Page Canvas */}
          <div
            id="printable-paper"
            ref={paperRef}
            className="relative bg-white shadow-2xl overflow-hidden"
            style={{
              width: `${specs.widthPx}px`,
              height: `${specs.heightPx}px`,
              backgroundColor: design.backgroundColor || '#ffffff',
            }}
          >
            {/* Safe Margin Guide Line (dashed red/blue indicator, hidden on print) */}
            {showGuides && safeMarginPx > 0 && (
              <div
                className="canvas-guide absolute border border-dashed border-blue-400/40 pointer-events-none z-1"
                style={{
                  top: `${safeMarginPx}px`,
                  bottom: `${safeMarginPx}px`,
                  left: `${safeMarginPx}px`,
                  right: `${safeMarginPx}px`,
                }}
              />
            )}

            {/* Document Page Border Layer */}
            {design.pageBorder.enabled && (
              <div
                className="page-border-frame absolute pointer-events-none z-2"
                style={{
                  top: `${borderMarginPx}px`,
                  bottom: `${borderMarginPx}px`,
                  left: `${borderMarginPx}px`,
                  right: `${borderMarginPx}px`,
                  borderTop: design.pageBorder.top
                    ? `${design.pageBorder.width}px ${design.pageBorder.style === 'ornate' ? 'solid' : design.pageBorder.style} ${design.pageBorder.color}`
                    : 'none',
                  borderBottom: design.pageBorder.bottom
                    ? `${design.pageBorder.width}px ${design.pageBorder.style === 'ornate' ? 'solid' : design.pageBorder.style} ${design.pageBorder.color}`
                    : 'none',
                  borderLeft: design.pageBorder.left
                    ? `${design.pageBorder.width}px ${design.pageBorder.style === 'ornate' ? 'solid' : design.pageBorder.style} ${design.pageBorder.color}`
                    : 'none',
                  borderRight: design.pageBorder.right
                    ? `${design.pageBorder.width}px ${design.pageBorder.style === 'ornate' ? 'solid' : design.pageBorder.style} ${design.pageBorder.color}`
                    : 'none',
                  borderRadius: `${design.pageBorder.rounded}px`,
                  boxShadow:
                    design.pageBorder.style === 'ornate'
                      ? `inset 0 0 0 3px #ffffff, inset 0 0 0 5px ${design.pageBorder.color}`
                      : 'none',
                }}
              />
            )}

            {/* Document Watermark Layer (Text or Image) */}
            {design.watermark.enabled && (
              <div
                className={`watermark-layer absolute inset-0 flex items-center justify-center pointer-events-none select-none ${
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

            {/* Canvas Elements Sorted by Z-Index */}
            {design.elements.map((element) => (
              <CanvasElementRenderer
                key={element.id}
                element={element}
                isSelected={element.id === selectedElementId}
                isEditing={element.id === editingElementId}
                onSelect={(e, id) => onSelectElement(id)}
                onStartEditing={onStartEditing}
                onStopEditing={onStopEditing}
                onUpdate={onUpdateElement}
                onDuplicate={onDuplicateElement}
                onDelete={onDeleteElement}
                canvasScale={zoomScale}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Bottom Zoom & View Controls */}
      <div
        id="canvas-controls"
        className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl px-2.5 py-1.5 shadow-lg flex items-center gap-2 z-30 select-none text-xs text-slate-700"
      >
        <button
          onClick={() => setZoomScale((prev) => Math.max(0.3, prev - 0.1))}
          className="p-1 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="font-mono text-[11px] font-semibold min-w-[42px] text-center">
          {Math.round(zoomScale * 100)}%
        </span>

        <button
          onClick={() => setZoomScale((prev) => Math.min(2.0, prev + 0.1))}
          className="p-1 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="h-3.5 w-px bg-slate-200 mx-0.5" />

        <button
          onClick={() => setZoomScale(autoFitScale)}
          className="px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1"
          title="Fit paper to workspace screen"
        >
          <Maximize2 className="w-3 h-3" />
          <span>Fit</span>
        </button>

        <button
          onClick={() => setZoomScale(1.0)}
          className="px-1.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          title="100% True-size view"
        >
          100%
        </button>
      </div>
    </div>
  );
};
