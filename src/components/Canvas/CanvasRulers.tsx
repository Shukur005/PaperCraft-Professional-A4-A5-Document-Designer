import React from 'react';

interface CanvasRulersProps {
  widthMm: number;
  heightMm: number;
  scale: number;
  widthPx: number;
  heightPx: number;
}

export const CanvasRulers: React.FC<CanvasRulersProps> = ({
  widthMm,
  heightMm,
  scale,
  widthPx,
  heightPx,
}) => {
  // Generate mm ticks every 10mm (1cm) with minor ticks every 5mm
  const horizontalTicks: { mm: number; isMajor: boolean; posPx: number }[] = [];
  for (let mm = 0; mm <= widthMm; mm += 5) {
    horizontalTicks.push({
      mm,
      isMajor: mm % 10 === 0,
      posPx: (mm / widthMm) * widthPx,
    });
  }

  const verticalTicks: { mm: number; isMajor: boolean; posPx: number }[] = [];
  for (let mm = 0; mm <= heightMm; mm += 5) {
    verticalTicks.push({
      mm,
      isMajor: mm % 10 === 0,
      posPx: (mm / heightMm) * heightPx,
    });
  }

  return (
    <>
      {/* Top Horizontal Ruler */}
      <div
        className="canvas-ruler absolute -top-5 left-0 h-5 bg-slate-100 border-b border-slate-300 pointer-events-none select-none text-[9px] text-slate-400 font-mono flex items-end overflow-hidden"
        style={{ width: `${widthPx}px` }}
      >
        {horizontalTicks.map((tick) => (
          <div
            key={`h-${tick.mm}`}
            className="absolute bottom-0 border-l border-slate-400 flex flex-col justify-end"
            style={{
              left: `${tick.posPx}px`,
              height: tick.isMajor ? '12px' : '6px',
            }}
          >
            {tick.isMajor && tick.mm > 0 && (
              <span className="pl-1 -mb-0.5 text-[8px] leading-none text-slate-500">
                {tick.mm / 10}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Left Vertical Ruler */}
      <div
        className="canvas-ruler absolute top-0 -left-5 w-5 bg-slate-100 border-r border-slate-300 pointer-events-none select-none text-[9px] text-slate-400 font-mono flex flex-col items-end overflow-hidden"
        style={{ height: `${heightPx}px` }}
      >
        {verticalTicks.map((tick) => (
          <div
            key={`v-${tick.mm}`}
            className="absolute right-0 border-t border-slate-400 flex items-start justify-end"
            style={{
              top: `${tick.posPx}px`,
              width: tick.isMajor ? '12px' : '6px',
            }}
          >
            {tick.isMajor && tick.mm > 0 && (
              <span className="pr-1 -mt-2 text-[8px] leading-none text-slate-500">
                {tick.mm / 10}
              </span>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
