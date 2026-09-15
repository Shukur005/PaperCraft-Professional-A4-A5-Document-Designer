import React, { useState, useRef, useEffect } from 'react';
import {
  CanvasElement,
  TextCanvasElement,
  TableCanvasElement,
  ShapeCanvasElement,
  ImageCanvasElement,
} from '../../types/document';
import { Copy, Trash2, Lock, Unlock, Edit3 } from 'lucide-react';

interface CanvasElementRendererProps {
  element: CanvasElement;
  isSelected: boolean;
  isEditing?: boolean;
  readOnly?: boolean;
  onSelect: (e: React.MouseEvent, id: string) => void;
  onStartEditing?: (id: string) => void;
  onStopEditing?: () => void;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  canvasScale: number;
}

export const CanvasElementRenderer: React.FC<CanvasElementRendererProps> = ({
  element,
  isSelected,
  isEditing = false,
  readOnly = false,
  onSelect,
  onStartEditing,
  onStopEditing,
  onUpdate,
  onDuplicate,
  onDelete,
  canvasScale,
}) => {
  const [editingTableCell, setEditingTableCell] = useState<{ r: number; c: number } | null>(null);

  // Resize / Drag / Rotate states
  const elementRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus and select all text when entering inline edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current && !readOnly) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing, readOnly]);

  // DRAG TO MOVE
  const handleDragStart = (e: React.MouseEvent) => {
    if (readOnly || element.locked || isEditing || editingTableCell) return;
    e.stopPropagation();
    onSelect(e, element.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialElX = element.x;
    const initialElY = element.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / canvasScale;
      const deltaY = (moveEvent.clientY - startY) / canvasScale;

      onUpdate(element.id, {
        x: Math.round(initialElX + deltaX),
        y: Math.round(initialElY + deltaY),
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // RESIZE HANDLER (8 directions)
  const handleResizeStart = (
    e: React.MouseEvent,
    direction: 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
  ) => {
    if (element.locked) return;
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const initX = element.x;
    const initY = element.y;
    const initW = element.width;
    const initH = element.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - startX) / canvasScale;
      const dy = (moveEvent.clientY - startY) / canvasScale;

      let newX = initX;
      let newY = initY;
      let newW = initW;
      let newH = initH;

      if (direction.includes('e')) newW = Math.max(20, initW + dx);
      if (direction.includes('s')) newH = Math.max(10, initH + dy);
      if (direction.includes('w')) {
        const potentialW = initW - dx;
        if (potentialW > 20) {
          newW = potentialW;
          newX = initX + dx;
        }
      }
      if (direction.includes('n')) {
        const potentialH = initH - dy;
        if (potentialH > 10) {
          newH = potentialH;
          newY = initY + dy;
        }
      }

      onUpdate(element.id, {
        x: Math.round(newX),
        y: Math.round(newY),
        width: Math.round(newW),
        height: Math.round(newH),
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // ROTATION HANDLER
  const handleRotateStart = (e: React.MouseEvent) => {
    if (element.locked) return;
    e.stopPropagation();
    e.preventDefault();

    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const radians = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
      let degrees = Math.round(radians * (180 / Math.PI)) + 90; // Top is 0
      if (degrees < 0) degrees += 360;
      if (degrees >= 360) degrees -= 360;

      // Snap near 0, 90, 180, 270
      if (Math.abs(degrees) < 3 || Math.abs(degrees - 360) < 3) degrees = 0;
      else if (Math.abs(degrees - 90) < 3) degrees = 90;
      else if (Math.abs(degrees - 180) < 3) degrees = 180;
      else if (Math.abs(degrees - 270) < 3) degrees = 270;

      onUpdate(element.id, { rotation: degrees });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // RENDER CONTENT ACCORDING TO TYPE
  const renderElementBody = () => {
    switch (element.type) {
      case 'text': {
        const textEl = element as TextCanvasElement;

        const sharedTextStyle: React.CSSProperties = {
          fontFamily: textEl.fontFamily || 'Plus Jakarta Sans',
          fontSize: `${textEl.fontSize}px`,
          fontWeight: textEl.fontWeight || '400',
          fontStyle: textEl.fontStyle || 'normal',
          textDecoration: textEl.textDecoration || 'none',
          textAlign: textEl.textAlign || 'left',
          color: textEl.color || '#0f172a',
          backgroundColor:
            textEl.backgroundColor && textEl.backgroundColor !== 'transparent'
              ? textEl.backgroundColor
              : 'transparent',
          lineHeight: textEl.lineHeight || 1.3,
          letterSpacing: textEl.letterSpacing ? `${textEl.letterSpacing}px` : 'normal',
          textTransform: textEl.textTransform || 'none',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
          border: 'none',
          outline: 'none',
        };

        if (isEditing) {
          return (
            <textarea
              ref={textareaRef}
              value={textEl.text}
              onChange={(e) => onUpdate(element.id, { text: e.target.value })}
              onBlur={() => onStopEditing?.()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.stopPropagation();
                  onStopEditing?.();
                } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.stopPropagation();
                  onStopEditing?.();
                }
              }}
              className="w-full h-full bg-transparent resize-none overflow-hidden select-text"
              style={{
                ...sharedTextStyle,
                cursor: 'text',
              }}
              placeholder="Type here..."
            />
          );
        }

        return (
          <div
            onDoubleClick={(e) => {
              if (!element.locked) {
                e.stopPropagation();
                onStartEditing?.(element.id);
              }
            }}
            className="w-full h-full select-none"
            style={{
              ...sharedTextStyle,
              cursor: element.locked ? 'default' : 'text',
            }}
          >
            {textEl.text ? (
              textEl.text
            ) : isSelected && !readOnly ? (
              <span className="empty-text-placeholder text-slate-300 italic select-none">
                Empty text
              </span>
            ) : null}
          </div>
        );
      }

      case 'table': {
        const tableEl = element as TableCanvasElement;
        return (
          <div className="w-full h-full overflow-hidden">
            <table
              className="w-full border-collapse"
              style={{
                tableLayout: 'fixed',
                width: '100%',
                borderColor: tableEl.borderColor || '#cbd5e1',
                borderWidth: `${tableEl.borderWidth || 1}px`,
                borderStyle: 'solid',
              }}
            >
              {tableEl.colWidths && (
                <colgroup>
                  {tableEl.colWidths.map((w, idx) => (
                    <col key={idx} style={{ width: `${w}%` }} />
                  ))}
                </colgroup>
              )}
              <tbody>
                {tableEl.data.map((row, rIdx) => {
                  const isHeader = rIdx === 0 && tableEl.headerRow;
                  return (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => {
                        const isEditingThisCell =
                          editingTableCell?.r === rIdx && editingTableCell?.c === cIdx;

                        return (
                          <td
                            key={cIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!element.locked) {
                                setEditingTableCell({ r: rIdx, c: cIdx });
                              }
                            }}
                            className="transition-colors cursor-text"
                            style={{
                              borderColor: tableEl.borderColor || '#cbd5e1',
                              borderWidth: `${tableEl.borderWidth || 1}px`,
                              borderStyle: 'solid',
                              padding: `${tableEl.cellPadding || 6}px`,
                              backgroundColor: isHeader
                                ? tableEl.headerBg || '#1e293b'
                                : cell.bg || 'transparent',
                              color: isHeader
                                ? tableEl.headerColor || '#ffffff'
                                : cell.color || '#1e293b',
                              fontWeight: isHeader || cell.bold ? '700' : '400',
                              fontStyle: cell.italic ? 'italic' : 'normal',
                              textAlign: cell.align || (isHeader ? 'center' : 'left'),
                              fontSize: '11px',
                              lineHeight: 1.35,
                              fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
                              letterSpacing: 'normal',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'normal',
                              verticalAlign: 'middle',
                            }}
                          >
                            {isEditingThisCell ? (
                              <input
                                autoFocus
                                value={cell.text}
                                onChange={(e) => {
                                  const newData = tableEl.data.map((r, ri) =>
                                    ri === rIdx
                                      ? r.map((c, ci) =>
                                          ci === cIdx ? { ...c, text: e.target.value } : c
                                        )
                                      : r
                                  );
                                  onUpdate(element.id, { data: newData });
                                }}
                                onBlur={() => setEditingTableCell(null)}
                                onKeyDown={(e) => e.key === 'Enter' && setEditingTableCell(null)}
                                className="w-full bg-white/90 text-slate-900 border border-blue-500 rounded-xs px-1 py-0.5 text-[11px] outline-none"
                              />
                            ) : (
                              cell.text || ' '
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }

      case 'shape': {
        const shapeEl = element as ShapeCanvasElement;
        if (shapeEl.shapeType === 'divider' || shapeEl.shapeType === 'line') {
          return (
            <div
              className="w-full"
              style={{
                height: `${shapeEl.height}px`,
                borderTop: `${shapeEl.strokeWidth}px ${shapeEl.strokeStyle} ${shapeEl.strokeColor}`,
              }}
            />
          );
        }

        if (shapeEl.shapeType === 'arrow') {
          return (
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
              style={{ display: 'block' }}
            >
              <line
                x1="0"
                y1="10"
                x2="85"
                y2="10"
                stroke={shapeEl.strokeColor}
                strokeWidth={shapeEl.strokeWidth}
                strokeDasharray={shapeEl.strokeStyle === 'dashed' ? '4 2' : 'none'}
              />
              <polygon
                points="85,2 100,10 85,18"
                fill={shapeEl.fillColor || shapeEl.strokeColor}
              />
            </svg>
          );
        }

        if (shapeEl.shapeType === 'circle') {
          return (
            <div
              className="w-full h-full rounded-full"
              style={{
                backgroundColor: shapeEl.fillColor,
                border: `${shapeEl.strokeWidth}px ${shapeEl.strokeStyle} ${shapeEl.strokeColor}`,
              }}
            />
          );
        }

        // Rectangle / Rounded rectangle
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: shapeEl.fillColor,
              border: `${shapeEl.strokeWidth}px ${shapeEl.strokeStyle} ${shapeEl.strokeColor}`,
              borderRadius: `${shapeEl.cornerRadius || 0}px`,
            }}
          />
        );
      }

      case 'image': {
        const imgEl = element as ImageCanvasElement;
        return (
          <img
            src={imgEl.src}
            alt={imgEl.alt || 'Document graphic'}
            className="w-full h-full pointer-events-none select-none block"
            style={{
              objectFit: imgEl.objectFit || 'contain',
              borderRadius: `${imgEl.borderRadius || 0}px`,
            }}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      ref={elementRef}
      id={`canvas-el-${element.id}`}
      onClick={(e) => {
        if (readOnly) return;
        e.stopPropagation();
        onSelect(e, element.id);
      }}
      onDoubleClick={(e) => {
        if (!readOnly && !element.locked && element.type === 'text') {
          e.stopPropagation();
          onStartEditing?.(element.id);
        }
      }}
      onMouseDown={handleDragStart}
      className={`absolute ${
        readOnly || element.locked ? 'cursor-default' : isEditing ? 'cursor-text' : 'cursor-move'
      }`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        transform: `rotate(${element.rotation || 0}deg)`,
        transformOrigin: 'center center',
        zIndex: element.zIndex || 1,
        opacity: element.opacity ?? 1,
      }}
    >
      {/* Visual Content */}
      <div className="w-full h-full relative">{renderElementBody()}</div>

      {/* Selection Handles & Mini Toolbar (Hidden during print or readOnly) */}
      {isSelected && !readOnly && (
        <div
          className={`selection-box absolute -inset-1 pointer-events-none ${
            isEditing
              ? 'border-2 border-blue-500 border-dashed rounded-xs'
              : 'border-2 border-blue-500'
          }`}
        >
          {/* Quick Action Floating Bar above element (only when NOT editing) */}
          {!isEditing && (
            <div className="absolute -top-9 left-0 flex items-center gap-1 bg-slate-900 text-white rounded-lg px-2 py-1 shadow-lg pointer-events-auto z-50 text-[11px]">
              {element.type === 'text' && !element.locked && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartEditing?.(element.id);
                  }}
                  className="px-1.5 py-0.5 rounded-sm hover:bg-blue-600 text-blue-300 hover:text-white flex items-center gap-1 text-[11px] font-medium"
                  title="Edit text (Enter or Double-click)"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(element.id, { locked: !element.locked });
                }}
                className="p-1 hover:text-amber-400"
                title={element.locked ? 'Unlock' : 'Lock'}
              >
                {element.locked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(element.id);
                }}
                className="p-1 hover:text-blue-300"
                title="Duplicate (Ctrl+D)"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(element.id);
                }}
                className="p-1 hover:text-red-400"
                title="Delete (Del)"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </button>
              {element.rotation !== 0 && (
                <span className="font-mono text-[9px] text-slate-400 ml-1">
                  {element.rotation}°
                </span>
              )}
            </div>
          )}

          {!element.locked && !isEditing && (
            <>
              {/* Top Rotation Handle */}
              <div
                onMouseDown={handleRotateStart}
                className="rotation-handle absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-blue-600 shadow-sm cursor-grab active:cursor-grabbing flex items-center justify-center pointer-events-auto"
                title="Rotate element"
              >
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              </div>
              <div className="absolute -top-6 left-1/2 w-px h-6 bg-blue-500 pointer-events-none" />

              {/* 8 Corner & Edge Resize Handles */}
              <div
                onMouseDown={(e) => handleResizeStart(e, 'nw')}
                className="resize-handle absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-xs cursor-nwse-resize pointer-events-auto"
              />
              <div
                onMouseDown={(e) => handleResizeStart(e, 'n')}
                className="resize-handle absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-xs cursor-ns-resize pointer-events-auto"
              />
              <div
                onMouseDown={(e) => handleResizeStart(e, 'ne')}
                className="resize-handle absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-xs cursor-nesw-resize pointer-events-auto"
              />
              <div
                onMouseDown={(e) => handleResizeStart(e, 'e')}
                className="resize-handle absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-xs cursor-ew-resize pointer-events-auto"
              />
              <div
                onMouseDown={(e) => handleResizeStart(e, 'se')}
                className="resize-handle absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-xs cursor-nwse-resize pointer-events-auto"
              />
              <div
                onMouseDown={(e) => handleResizeStart(e, 's')}
                className="resize-handle absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-xs cursor-ns-resize pointer-events-auto"
              />
              <div
                onMouseDown={(e) => handleResizeStart(e, 'sw')}
                className="resize-handle absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-xs cursor-nesw-resize pointer-events-auto"
              />
              <div
                onMouseDown={(e) => handleResizeStart(e, 'w')}
                className="resize-handle absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-600 rounded-xs cursor-ew-resize pointer-events-auto"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
