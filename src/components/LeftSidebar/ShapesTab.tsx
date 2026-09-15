import React from 'react';
import { Square, Circle, Minus, ArrowRight, RectangleHorizontal } from 'lucide-react';
import { ShapeCanvasElement, ShapeType } from '../../types/document';

interface ShapesTabProps {
  onAddShapeElement: (element: Partial<ShapeCanvasElement>) => void;
}

export const ShapesTab: React.FC<ShapesTabProps> = ({ onAddShapeElement }) => {
  const shapesList: {
    type: ShapeType;
    label: string;
    icon: React.ReactNode;
    defaultProps: Partial<ShapeCanvasElement>;
  }[] = [
    {
      type: 'divider',
      label: 'Divider Line',
      icon: <Minus className="w-5 h-5 text-blue-600" />,
      defaultProps: {
        width: 600,
        height: 2,
        fillColor: '#0284c7',
        strokeColor: '#0284c7',
        strokeWidth: 2,
        strokeStyle: 'solid',
      },
    },
    {
      type: 'rectangle',
      label: 'Rectangle / Card',
      icon: <Square className="w-5 h-5 text-slate-700" />,
      defaultProps: {
        width: 250,
        height: 120,
        fillColor: '#f8fafc',
        strokeColor: '#cbd5e1',
        strokeWidth: 1,
        strokeStyle: 'solid',
        cornerRadius: 0,
      },
    },
    {
      type: 'rounded-rectangle',
      label: 'Rounded Badge',
      icon: <RectangleHorizontal className="w-5 h-5 text-emerald-600" />,
      defaultProps: {
        width: 200,
        height: 80,
        fillColor: '#ecfdf5',
        strokeColor: '#6ee7b7',
        strokeWidth: 1.5,
        strokeStyle: 'solid',
        cornerRadius: 12,
      },
    },
    {
      type: 'circle',
      label: 'Circle / Seal Base',
      icon: <Circle className="w-5 h-5 text-amber-600" />,
      defaultProps: {
        width: 100,
        height: 100,
        fillColor: '#fffbeb',
        strokeColor: '#f59e0b',
        strokeWidth: 2,
        strokeStyle: 'solid',
      },
    },
    {
      type: 'arrow',
      label: 'Directional Arrow',
      icon: <ArrowRight className="w-5 h-5 text-indigo-600" />,
      defaultProps: {
        width: 180,
        height: 28,
        fillColor: '#6366f1',
        strokeColor: '#4f46e5',
        strokeWidth: 2,
        strokeStyle: 'solid',
      },
    },
    {
      type: 'line',
      label: 'Dashed Separator',
      icon: <Minus className="w-5 h-5 text-slate-400 stroke-dasharray-2" />,
      defaultProps: {
        width: 600,
        height: 2,
        fillColor: '#94a3b8',
        strokeColor: '#94a3b8',
        strokeWidth: 1.5,
        strokeStyle: 'dashed',
      },
    },
  ];

  return (
    <div className="p-3 space-y-3">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
          Shapes & Dividers
        </h3>
        <p className="text-[11px] text-slate-500">
          Insert decorative boxes, banners, or divider rules:
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {shapesList.map((s) => (
          <button
            key={s.type + s.label}
            onClick={() =>
              onAddShapeElement({
                shapeType: s.type,
                ...s.defaultProps,
              })
            }
            className="p-3 bg-white border border-slate-200 hover:border-blue-400 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-xs group text-center"
          >
            <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-blue-50 transition-colors">
              {s.icon}
            </div>
            <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">
              {s.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
