import React, { useState, useEffect, useRef } from 'react';
import {
  DocumentDesign,
  PaperSize,
  PaperOrientation,
} from '../../types/document';
import {
  getSavedDesigns,
  deleteDesign,
  duplicateDesign,
  exportDesignToJson,
  importDesignFromJson,
} from '../../utils/storage';
import {
  X,
  Trash2,
  Copy,
  Download,
  Upload,
  FolderOpen,
  Calendar,
  Layers,
  FileCheck,
} from 'lucide-react';

interface SavedDesignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDesign: (design: DocumentDesign) => void;
  currentDesignId: string;
}

export const SavedDesignsModal: React.FC<SavedDesignsModalProps> = ({
  isOpen,
  onClose,
  onOpenDesign,
  currentDesignId,
}) => {
  const [designs, setDesigns] = useState<DocumentDesign[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const refreshList = () => {
    setDesigns(getSavedDesigns());
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id: string, name: string) => {
    deleteDesign(id);
    refreshList();
  };

  const handleDuplicate = (id: string) => {
    duplicateDesign(id);
    refreshList();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);
    try {
      const imported = await importDesignFromJson(file);
      refreshList();
      onOpenDesign(imported);
      onClose();
    } catch (err: any) {
      setErrorMessage(`Import error: ${err.message || 'Failed to parse file'}`);
    }
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Saved Documents</h2>
              <p className="text-[11px] text-slate-400">
                Browse, reopen, duplicate, or export your designs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={jsonInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => jsonInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              title="Import document from .json file"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="px-5 py-2.5 bg-red-50 border-b border-red-200 text-red-700 text-xs font-medium flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-700 font-bold ml-2">
              ×
            </button>
          </div>
        )}

        {/* Designs List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
          {designs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FolderOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No saved documents yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Save your current project to access it here anytime.
              </p>
            </div>
          ) : (
            designs.map((d) => {
              const isCurrent = d.id === currentDesignId;
              const formattedDate = new Date(d.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={d.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    isCurrent
                      ? 'border-blue-400 bg-blue-50/40 ring-1 ring-blue-300'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-12 rounded-md bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-slate-700 uppercase">
                        {d.paperSize}
                      </span>
                      <span className="text-[8px] text-slate-400 uppercase">
                        {d.orientation.slice(0, 4)}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-800">{d.name}</h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.2 rounded">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          {d.elements.length} elements
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => exportDesignToJson(d)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Export as JSON file"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDuplicate(d.id)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Duplicate project"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(d.id, d.name)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete saved document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        onOpenDesign(d);
                        onClose();
                      }}
                      className="ml-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Open
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
