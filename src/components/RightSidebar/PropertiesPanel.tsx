import React from 'react';
import {
  CanvasElement,
  TextCanvasElement,
  TableCanvasElement,
  ShapeCanvasElement,
  ImageCanvasElement,
  DocumentDesign,
} from '../../types/document';
import { ColorPickerPopover } from '../Common/ColorPickerPopover';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Copy,
  Trash2,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Layers,
  MoveHorizontal,
  MoveVertical,
  Plus,
  Minus,
  CaseUpper,
  CaseLower,
  Settings2,
} from 'lucide-react';

const FONTS_LIST = [
  { label: 'Plus Jakarta Sans (Modern Clean)', value: 'Plus Jakarta Sans' },
  { label: 'Inter (Professional UI)', value: 'Inter' },
  { label: 'Roboto (Standard Crisp)', value: 'Roboto' },
  { label: 'Montserrat (Modern Corporate)', value: 'Montserrat' },
  { label: 'Outfit (Geometric Display)', value: 'Outfit' },
  { label: 'Merriweather (Classic Editorial)', value: 'Merriweather' },
  { label: 'Playfair Display (Luxury Serif)', value: 'Playfair Display' },
  { label: 'Cinzel (Formal Academic & Seal)', value: 'Cinzel' },
  { label: 'Cormorant Garamond (Graceful Serif)', value: 'Cormorant Garamond' },
  { label: 'Roboto Mono (Medical Ref / Code)', value: 'Roboto Mono' },
  { label: 'Great Vibes (Flowing Signature)', value: 'Great Vibes' },
  { label: 'Dancing Script (Handwritten Cursive)', value: 'Dancing Script' },
];

interface PropertiesPanelProps {
  selectedElement: CanvasElement | null;
  currentDesign: DocumentDesign;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onAlignElement: (
    id: string,
    alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
  ) => void;
  onSelectElementById: (id: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  currentDesign,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  onAlignElement,
  onSelectElementById,
}) => {
  if (!selectedElement) {
    return (
      <aside id="right-sidebar" className="w-72 bg-white border-l border-slate-200 h-full overflow-y-auto p-4 select-none shrink-0 z-20">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          <Settings2 className="w-4 h-4" />
          <span>Document Overview</span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mb-4 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Paper Format:</span>
            <span className="font-bold text-slate-800">
              {currentDesign.paperSize} ({currentDesign.orientation})
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Border:</span>
            <span className="font-medium text-slate-700">
              {currentDesign.pageBorder.enabled ? `${currentDesign.pageBorder.style} (${currentDesign.pageBorder.width}px)` : 'None'}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Watermark:</span>
            <span className="font-medium text-slate-700">
              {currentDesign.watermark.enabled ? currentDesign.watermark.type : 'Disabled'}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Total Elements:</span>
            <span className="font-bold text-blue-600">{currentDesign.elements.length}</span>
          </div>
        </div>

        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Page Layers ({currentDesign.elements.length})
        </div>

        {currentDesign.elements.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No elements on page yet. Select a tool on the left to add text, tables, or shapes.</p>
        ) : (
          <div className="space-y-1">
            {currentDesign.elements
              .slice()
              .reverse()
              .map((el) => (
                <button
                  key={el.id}
                  onClick={() => onSelectElementById(el.id)}
                  className="w-full px-2.5 py-2 rounded-lg text-left text-xs bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 flex items-center justify-between transition-colors group"
                >
                  <span className="font-semibold text-slate-700 group-hover:text-blue-700 truncate capitalize">
                    {el.type === 'text'
                      ? (el as TextCanvasElement).text.slice(0, 24) || 'Text Box'
                      : el.type}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">
                    {el.type}
                  </span>
                </button>
              ))}
          </div>
        )}
      </aside>
    );
  }

  const isLocked = selectedElement.locked;

  return (
    <aside id="right-sidebar" className="w-72 sm:w-80 bg-white border-l border-slate-200 h-full overflow-y-auto p-3.5 space-y-4 select-none shrink-0 z-20">
      {/* Top Element Action Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
          {selectedElement.type} element
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onUpdateElement(selectedElement.id, { locked: !isLocked })}
            className={`p-1.5 rounded-lg border transition-colors ${
              isLocked
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title={isLocked ? 'Unlock element' : 'Lock element position'}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onDuplicateElement(selectedElement.id)}
            className="p-1.5 rounded-lg bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
            title="Duplicate element (Ctrl+D)"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDeleteElement(selectedElement.id)}
            className="p-1.5 rounded-lg bg-white text-red-600 border border-slate-200 hover:bg-red-50 hover:border-red-200 transition-colors"
            title="Delete element (Del)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* TEXT SPECIFIC CONTROLS */}
      {selectedElement.type === 'text' && (
        <div className="space-y-3.5">
          {/* Text Content Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Text Content
            </label>
            <textarea
              rows={3}
              value={(selectedElement as TextCanvasElement).text}
              onChange={(e) =>
                onUpdateElement(selectedElement.id, { text: e.target.value })
              }
              className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
            />
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Font Family
            </label>
            <select
              value={(selectedElement as TextCanvasElement).fontFamily}
              onChange={(e) =>
                onUpdateElement(selectedElement.id, { fontFamily: e.target.value })
              }
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 font-medium cursor-pointer"
            >
              {FONTS_LIST.map((f) => (
                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size & Weight */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Size (px)</label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateElement(selectedElement.id, {
                      fontSize: Math.max(8, (selectedElement as TextCanvasElement).fontSize - 1),
                    })
                  }
                  className="px-2 py-1.5 border border-r-0 border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-l-lg text-slate-600 font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min={8}
                  max={144}
                  value={(selectedElement as TextCanvasElement).fontSize}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      fontSize: parseInt(e.target.value) || 14,
                    })
                  }
                  className="w-full text-center py-1.5 border-y border-slate-300 text-xs font-bold outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    onUpdateElement(selectedElement.id, {
                      fontSize: Math.min(144, (selectedElement as TextCanvasElement).fontSize + 1),
                    })
                  }
                  className="px-2 py-1.5 border border-l-0 border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-r-lg text-slate-600 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Weight</label>
              <select
                value={(selectedElement as TextCanvasElement).fontWeight}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    fontWeight: e.target.value as any,
                  })
                }
                className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 font-medium cursor-pointer"
              >
                <option value="300">Light (300)</option>
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi Bold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">Extra Bold (800)</option>
              </select>
            </div>
          </div>

          {/* Formatting Buttons (B, I, U, Transform) */}
          <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-xl justify-between">
            <button
              onClick={() => {
                const cur = (selectedElement as TextCanvasElement).fontWeight;
                onUpdateElement(selectedElement.id, {
                  fontWeight: cur === '700' || cur === '800' ? '400' : '700',
                });
              }}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                (selectedElement as TextCanvasElement).fontWeight === '700' ||
                (selectedElement as TextCanvasElement).fontWeight === '800'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const cur = (selectedElement as TextCanvasElement).fontStyle;
                onUpdateElement(selectedElement.id, {
                  fontStyle: cur === 'italic' ? 'normal' : 'italic',
                });
              }}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                (selectedElement as TextCanvasElement).fontStyle === 'italic'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const cur = (selectedElement as TextCanvasElement).textDecoration;
                onUpdateElement(selectedElement.id, {
                  textDecoration: cur === 'underline' ? 'none' : 'underline',
                });
              }}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                (selectedElement as TextCanvasElement).textDecoration === 'underline'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-300 mx-0.5" />

            {/* Alignment */}
            {(['left', 'center', 'right', 'justify'] as const).map((align) => (
              <button
                key={align}
                onClick={() =>
                  onUpdateElement(selectedElement.id, { textAlign: align })
                }
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  (selectedElement as TextCanvasElement).textAlign === align
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={`Align ${align}`}
              >
                {align === 'left' && <AlignLeft className="w-4 h-4" />}
                {align === 'center' && <AlignCenter className="w-4 h-4" />}
                {align === 'right' && <AlignRight className="w-4 h-4" />}
                {align === 'justify' && <AlignJustify className="w-4 h-4" />}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-300 mx-0.5" />

            <button
              onClick={() => {
                const cur = (selectedElement as TextCanvasElement).textTransform;
                onUpdateElement(selectedElement.id, {
                  textTransform: cur === 'uppercase' ? 'none' : 'uppercase',
                });
              }}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                (selectedElement as TextCanvasElement).textTransform === 'uppercase'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Uppercase toggle"
            >
              <CaseUpper className="w-4 h-4" />
            </button>
          </div>

          {/* Colors (Text Color & Background Highlight) */}
          <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <ColorPickerPopover
              label="Text Color"
              color={(selectedElement as TextCanvasElement).color}
              onChange={(color) => onUpdateElement(selectedElement.id, { color })}
              allowTransparent={false}
            />
            <ColorPickerPopover
              label="Highlight Fill"
              color={(selectedElement as TextCanvasElement).backgroundColor}
              onChange={(backgroundColor) =>
                onUpdateElement(selectedElement.id, { backgroundColor })
              }
              allowTransparent={true}
            />
          </div>

          {/* Line Height & Letter Spacing */}
          <div className="space-y-2 p-2.5 bg-white border border-slate-200 rounded-xl">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Line Height</span>
                <span className="font-mono text-blue-600">
                  {(selectedElement as TextCanvasElement).lineHeight || 1.3}
                </span>
              </div>
              <input
                type="range"
                min={0.9}
                max={2.5}
                step={0.1}
                value={(selectedElement as TextCanvasElement).lineHeight || 1.3}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    lineHeight: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Letter Spacing</span>
                <span className="font-mono text-blue-600">
                  {(selectedElement as TextCanvasElement).letterSpacing || 0}px
                </span>
              </div>
              <input
                type="range"
                min={-1}
                max={10}
                step={0.5}
                value={(selectedElement as TextCanvasElement).letterSpacing || 0}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    letterSpacing: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TABLE SPECIFIC CONTROLS */}
      {selectedElement.type === 'table' && (
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Table Structure</span>
              <span className="font-mono text-blue-600">
                {(selectedElement as TableCanvasElement).rows} Rows × {(selectedElement as TableCanvasElement).cols} Cols
              </span>
            </div>

            {/* Row Modifiers */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  const tbl = selectedElement as TableCanvasElement;
                  const newRow = Array(tbl.cols).fill(null).map((_, i) => ({
                    text: `Cell ${tbl.rows + 1},${i + 1}`,
                    align: 'left' as const,
                  }));
                  onUpdateElement(selectedElement.id, {
                    rows: tbl.rows + 1,
                    data: [...tbl.data, newRow],
                    height: tbl.height + 32,
                  });
                }}
                className="py-1.5 px-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" /> Add Row
              </button>

              <button
                onClick={() => {
                  const tbl = selectedElement as TableCanvasElement;
                  if (tbl.rows <= 1) return;
                  onUpdateElement(selectedElement.id, {
                    rows: tbl.rows - 1,
                    data: tbl.data.slice(0, -1),
                    height: Math.max(40, tbl.height - 32),
                  });
                }}
                disabled={(selectedElement as TableCanvasElement).rows <= 1}
                className="py-1.5 px-2 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-lg text-xs font-semibold text-red-600 flex items-center justify-center gap-1 transition-colors disabled:opacity-40"
              >
                <Minus className="w-3.5 h-3.5" /> Delete Row
              </button>
            </div>

            {/* Column Modifiers */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  const tbl = selectedElement as TableCanvasElement;
                  const newCols = tbl.cols + 1;
                  const newData = tbl.data.map((row, r) => [
                    ...row,
                    {
                      text: r === 0 ? `Header ${newCols}` : `Cell ${r + 1},${newCols}`,
                      bold: r === 0 && tbl.headerRow,
                    },
                  ]);
                  const newColWidths = Array(newCols).fill(Math.floor(100 / newCols));
                  onUpdateElement(selectedElement.id, {
                    cols: newCols,
                    data: newData,
                    colWidths: newColWidths,
                  });
                }}
                className="py-1.5 px-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" /> Add Col
              </button>

              <button
                onClick={() => {
                  const tbl = selectedElement as TableCanvasElement;
                  if (tbl.cols <= 1) return;
                  const newCols = tbl.cols - 1;
                  const newData = tbl.data.map((row) => row.slice(0, -1));
                  const newColWidths = Array(newCols).fill(Math.floor(100 / newCols));
                  onUpdateElement(selectedElement.id, {
                    cols: newCols,
                    data: newData,
                    colWidths: newColWidths,
                  });
                }}
                disabled={(selectedElement as TableCanvasElement).cols <= 1}
                className="py-1.5 px-2 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-lg text-xs font-semibold text-red-600 flex items-center justify-center gap-1 transition-colors disabled:opacity-40"
              >
                <Minus className="w-3.5 h-3.5" /> Delete Col
              </button>
            </div>
          </div>

          {/* Table Colors & Header */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
              <span>Show Header Row</span>
              <input
                type="checkbox"
                checked={(selectedElement as TableCanvasElement).headerRow}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, { headerRow: e.target.checked })
                }
                className="w-3.5 h-3.5 rounded text-blue-600"
              />
            </label>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <ColorPickerPopover
                label="Header Fill"
                color={(selectedElement as TableCanvasElement).headerBg}
                onChange={(headerBg) => onUpdateElement(selectedElement.id, { headerBg })}
                allowTransparent={false}
              />
              <ColorPickerPopover
                label="Border Color"
                color={(selectedElement as TableCanvasElement).borderColor}
                onChange={(borderColor) =>
                  onUpdateElement(selectedElement.id, { borderColor })
                }
                allowTransparent={false}
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Cell Padding</span>
                <span className="font-mono text-blue-600">
                  {(selectedElement as TableCanvasElement).cellPadding}px
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={16}
                value={(selectedElement as TableCanvasElement).cellPadding}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    cellPadding: parseInt(e.target.value),
                  })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* SHAPE SPECIFIC CONTROLS */}
      {selectedElement.type === 'shape' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 p-3 bg-white border border-slate-200 rounded-xl">
            <ColorPickerPopover
              label="Fill Color"
              color={(selectedElement as ShapeCanvasElement).fillColor}
              onChange={(fillColor) => onUpdateElement(selectedElement.id, { fillColor })}
              allowTransparent={true}
            />
            <ColorPickerPopover
              label="Border / Line"
              color={(selectedElement as ShapeCanvasElement).strokeColor}
              onChange={(strokeColor) =>
                onUpdateElement(selectedElement.id, { strokeColor })
              }
              allowTransparent={true}
            />
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Stroke Width</span>
                <span className="font-mono text-blue-600">
                  {(selectedElement as ShapeCanvasElement).strokeWidth}px
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={16}
                value={(selectedElement as ShapeCanvasElement).strokeWidth}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    strokeWidth: parseInt(e.target.value),
                  })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Stroke style */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Stroke Style</label>
              <div className="grid grid-cols-3 gap-1">
                {(['solid', 'dashed', 'dotted'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() =>
                      onUpdateElement(selectedElement.id, { strokeStyle: st })
                    }
                    className={`py-1 text-xs font-semibold rounded border capitalize ${
                      (selectedElement as ShapeCanvasElement).strokeStyle === st
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Corner Radius for rounded shapes */}
            {((selectedElement as ShapeCanvasElement).shapeType === 'rounded-rectangle' ||
              (selectedElement as ShapeCanvasElement).shapeType === 'rectangle') && (
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Corner Radius</span>
                  <span className="font-mono text-blue-600">
                    {(selectedElement as ShapeCanvasElement).cornerRadius || 0}px
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={(selectedElement as ShapeCanvasElement).cornerRadius || 0}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      cornerRadius: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* IMAGE SPECIFIC CONTROLS */}
      {selectedElement.type === 'image' && (
        <div className="space-y-3">
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Image Fitting
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['contain', 'cover', 'fill'] as const).map((fit) => (
                  <button
                    key={fit}
                    onClick={() =>
                      onUpdateElement(selectedElement.id, { objectFit: fit })
                    }
                    className={`py-1 text-xs font-semibold rounded border capitalize ${
                      (selectedElement as ImageCanvasElement).objectFit === fit
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Rounded Image Corners</span>
                <span className="font-mono text-blue-600">
                  {(selectedElement as ImageCanvasElement).borderRadius || 0}px
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={(selectedElement as ImageCanvasElement).borderRadius || 0}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    borderRadius: parseInt(e.target.value),
                  })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* COMMON POSITION, ALIGN & ARRANGE SECTION */}
      <div className="pt-2 border-t border-slate-200 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Position & Dimensions
        </label>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-500 text-[11px]">X (px)</span>
            <input
              type="number"
              value={Math.round(selectedElement.x)}
              onChange={(e) =>
                onUpdateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })
              }
              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-md font-mono"
            />
          </div>
          <div>
            <span className="text-slate-500 text-[11px]">Y (px)</span>
            <input
              type="number"
              value={Math.round(selectedElement.y)}
              onChange={(e) =>
                onUpdateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })
              }
              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-md font-mono"
            />
          </div>
          <div>
            <span className="text-slate-500 text-[11px]">Width (px)</span>
            <input
              type="number"
              value={Math.round(selectedElement.width)}
              onChange={(e) =>
                onUpdateElement(selectedElement.id, {
                  width: Math.max(10, parseInt(e.target.value) || 10),
                })
              }
              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-md font-mono"
            />
          </div>
          <div>
            <span className="text-slate-500 text-[11px]">Height (px)</span>
            <input
              type="number"
              value={Math.round(selectedElement.height)}
              onChange={(e) =>
                onUpdateElement(selectedElement.id, {
                  height: Math.max(5, parseInt(e.target.value) || 5),
                })
              }
              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-md font-mono"
            />
          </div>
        </div>

        {/* Page Alignment Shortcuts */}
        <div>
          <span className="block text-[11px] font-semibold text-slate-500 mb-1">
            Align to Page
          </span>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => onAlignElement(selectedElement.id, 'left')}
              className="py-1 px-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-700"
            >
              Align Left
            </button>
            <button
              onClick={() => onAlignElement(selectedElement.id, 'center')}
              className="py-1 px-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-700"
            >
              Center H
            </button>
            <button
              onClick={() => onAlignElement(selectedElement.id, 'right')}
              className="py-1 px-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-700"
            >
              Align Right
            </button>
            <button
              onClick={() => onAlignElement(selectedElement.id, 'top')}
              className="py-1 px-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-700"
            >
              Align Top
            </button>
            <button
              onClick={() => onAlignElement(selectedElement.id, 'middle')}
              className="py-1 px-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-700"
            >
              Center V
            </button>
            <button
              onClick={() => onAlignElement(selectedElement.id, 'bottom')}
              className="py-1 px-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-700"
            >
              Align Bottom
            </button>
          </div>
        </div>

        {/* Layer Depth / Z-Index */}
        <div>
          <span className="block text-[11px] font-semibold text-slate-500 mb-1">
            Layer Order
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onBringForward(selectedElement.id)}
              className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1"
            >
              <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> Bring Forward
            </button>
            <button
              onClick={() => onSendBackward(selectedElement.id)}
              className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1"
            >
              <ArrowDown className="w-3.5 h-3.5 text-blue-600" /> Send Backward
            </button>
            <button
              onClick={() => onBringToFront(selectedElement.id)}
              className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-600 flex items-center justify-center gap-1"
            >
              To Very Front
            </button>
            <button
              onClick={() => onSendToBack(selectedElement.id)}
              className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-600 flex items-center justify-center gap-1"
            >
              To Very Back
            </button>
          </div>
        </div>

        {/* Element Opacity Slider */}
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
            <span>Element Opacity</span>
            <span className="font-mono text-blue-600">
              {Math.round((selectedElement.opacity ?? 1) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={selectedElement.opacity ?? 1}
            onChange={(e) =>
              onUpdateElement(selectedElement.id, {
                opacity: parseFloat(e.target.value),
              })
            }
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>
      </div>
    </aside>
  );
};
