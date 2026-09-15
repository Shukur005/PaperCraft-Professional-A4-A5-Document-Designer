import React, { useState } from 'react';
import { TEMPLATES, TemplateDefinition } from '../../data/templates';
import { DocumentDesign } from '../../types/document';
import { Sparkles, FileText, Check } from 'lucide-react';

interface TemplatesTabProps {
  currentDesignId: string;
  onSelectTemplate: (design: DocumentDesign) => void;
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({
  currentDesignId,
  onSelectTemplate,
}) => {
  const [filter, setFilter] = useState<'all' | 'medical' | 'business' | 'finance' | 'education' | 'blank'>('all');

  const filteredTemplates = TEMPLATES.filter((t) => {
    if (filter === 'all') return true;
    return t.category === filter;
  });

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Document Templates
          </h3>
          <p className="text-[11px] text-slate-500">
            Choose a ready-to-print A4 / A5 layout
          </p>
        </div>
        <Sparkles className="w-4 h-4 text-amber-500" />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1">
        {(['all', 'medical', 'business', 'finance', 'education', 'blank'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-2 py-1 text-[11px] font-semibold rounded-md capitalize transition-colors ${
              filter === cat
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Cards Grid */}
      <div className="space-y-2 pt-1">
        {filteredTemplates.map((template) => {
          const isSelected = template.design.id === currentDesignId;
          const isLandscape = template.design.orientation === 'landscape';

          return (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template.design)}
              className={`group relative p-2.5 rounded-xl border text-left cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                  : 'border-slate-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Mini Preview Thumbnail representation */}
                <div
                  className={`relative shrink-0 rounded-sm bg-slate-50 border border-slate-300 shadow-2xs overflow-hidden flex flex-col items-center justify-center ${
                    isLandscape ? 'w-14 h-10' : 'w-10 h-14'
                  }`}
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-[8px] font-bold text-slate-500 mt-0.5">
                    {template.design.paperSize}
                  </span>
                  {template.design.pageBorder.enabled && (
                    <div className="absolute inset-0.5 border border-blue-400/40 pointer-events-none" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600">
                      {template.title}
                    </h4>
                    {isSelected && (
                      <span className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-medium">
                    <span className="uppercase">{template.design.paperSize}</span>
                    <span>•</span>
                    <span className="capitalize">{template.design.orientation}</span>
                    <span>•</span>
                    <span>{template.design.elements.length} elements</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
