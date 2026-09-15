import React from 'react';
import { PageBorderConfig } from '../../types/document';
import { ColorPickerPopover } from '../Common/ColorPickerPopover';
import { Square, Check, Sliders } from 'lucide-react';

interface BordersTabProps {
  borderConfig: PageBorderConfig;
  onChangeBorder: (config: PageBorderConfig) => void;
}

export const BordersTab: React.FC<BordersTabProps> = ({
  borderConfig,
  onChangeBorder,
}) => {
  const styles: { id: PageBorderConfig['style']; label: string; previewClass: string }[] = [
    { id: 'single', label: 'Single Solid', previewClass: 'border-solid border-2' },
    { id: 'double', label: 'Double Line', previewClass: 'border-double border-4' },
    { id: 'dashed', label: 'Dashed', previewClass: 'border-dashed border-2' },
    { id: 'dotted', label: 'Dotted', previewClass: 'border-dotted border-2' },
    { id: 'groove', label: 'Groove / 3D', previewClass: 'border-groove border-4' },
    { id: 'ornate', label: 'Certificate Dual', previewClass: 'border-solid border-4 ring-2 ring-offset-2' },
  ];

  return (
    <div className="p-3 space-y-4">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div>
          <div className="text-xs font-bold text-slate-800">Page Border</div>
          <div className="text-[11px] text-slate-500">
            Printable border framing the document
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={borderConfig.enabled}
            onChange={(e) =>
              onChangeBorder({
                ...borderConfig,
                enabled: e.target.checked,
              })
            }
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {borderConfig.enabled && (
        <div className="space-y-3 animate-in fade-in duration-150">
          {/* Style Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Border Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onChangeBorder({ ...borderConfig, style: s.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    borderConfig.style === s.id
                      ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600 font-bold'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`h-4 w-full mb-1.5 rounded-xs border-slate-700 ${s.previewClass}`}
                  />
                  <span className="text-xs text-slate-700">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color & Width */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-white border border-slate-200 rounded-xl">
            <div>
              <ColorPickerPopover
                label="Border Color"
                color={borderConfig.color}
                onChange={(color) => onChangeBorder({ ...borderConfig, color })}
                allowTransparent={false}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Thickness ({borderConfig.width}px)
              </label>
              <input
                type="range"
                min={1}
                max={12}
                value={borderConfig.width}
                onChange={(e) =>
                  onChangeBorder({ ...borderConfig, width: parseInt(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Distance from Edge & Corner Radius */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Distance from Page Edge</span>
                <span className="font-mono text-blue-600">{borderConfig.margin} mm</span>
              </div>
              <input
                type="range"
                min={2}
                max={25}
                value={borderConfig.margin}
                onChange={(e) =>
                  onChangeBorder({ ...borderConfig, margin: parseInt(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Rounded Corners</span>
                <span className="font-mono text-blue-600">{borderConfig.rounded} px</span>
              </div>
              <input
                type="range"
                min={0}
                max={24}
                value={borderConfig.rounded}
                onChange={(e) =>
                  onChangeBorder({ ...borderConfig, rounded: parseInt(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Edge Controls (Top, Bottom, Left, Right) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Border Edges
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['top', 'bottom', 'left', 'right'] as const).map((edge) => (
                <button
                  key={edge}
                  onClick={() =>
                    onChangeBorder({
                      ...borderConfig,
                      [edge]: !borderConfig[edge],
                    })
                  }
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg border capitalize transition-colors flex items-center justify-center gap-1 ${
                    borderConfig[edge]
                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                  }`}
                >
                  {borderConfig[edge] && <Check className="w-3 h-3" />}
                  {edge}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
