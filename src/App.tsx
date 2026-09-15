import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  DocumentDesign,
  CanvasElement,
  PaperSize,
  PaperOrientation,
  DocumentMargins,
  PageBorderConfig,
  WatermarkConfig,
  TextCanvasElement,
  ImageCanvasElement,
  TableCanvasElement,
  ShapeCanvasElement,
} from './types/document';
import { STARTER_TEMPLATES } from './data/templates';
import { SAMPLE_LOGOS } from './data/sampleLogos';
import {
  saveDesign,
  loadCurrentDesign,
  createNewBlankDesign,
} from './utils/storage';
import { printDocument, exportDocumentToPdf } from './utils/pdfExport';
import { TopToolbar } from './components/TopToolbar';
import { LeftSidebar, LeftTabId } from './components/LeftSidebar/LeftSidebar';
import { PaperCanvas } from './components/Canvas/PaperCanvas';
import { PropertiesPanel } from './components/RightSidebar/PropertiesPanel';
import { PreviewModal } from './components/Modals/PreviewModal';
import { SavedDesignsModal } from './components/Modals/SavedDesignsModal';
import { NewDocumentModal } from './components/Modals/NewDocumentModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Initialize from storage or default to first template (Hospital Letterhead)
  const [design, setDesign] = useState<DocumentDesign>(() => {
    const saved = loadCurrentDesign();
    return saved || STARTER_TEMPLATES[0];
  });

  // Undo / Redo stacks
  const [history, setHistory] = useState<DocumentDesign[]>([]);
  const [redoStack, setRedoStack] = useState<DocumentDesign[]>([]);

  // Selection & UI State
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [activeLeftTab, setActiveLeftTab] = useState<LeftTabId>('templates');
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [showRulers, setShowRulers] = useState(true);
  const [showGuides, setShowGuides] = useState(true);

  // Modals & Status
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const paperRef = useRef<HTMLDivElement>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleSelectElement = useCallback((id: string | null) => {
    setSelectedElementId(id);
    setEditingElementId(null);
  }, []);

  const handleStartEditing = useCallback((id: string) => {
    setSelectedElementId(id);
    setEditingElementId(id);
  }, []);

  const handleStopEditing = useCallback(() => {
    setEditingElementId(null);
  }, []);

  // Helper to commit state with undo history recording
  const updateDesign = useCallback(
    (newDesign: DocumentDesign | ((prev: DocumentDesign) => DocumentDesign), recordHistory = true) => {
      setDesign((prev) => {
        const next = typeof newDesign === 'function' ? newDesign(prev) : newDesign;
        if (recordHistory) {
          setHistory((hist) => [...hist.slice(-25), prev]);
          setRedoStack([]);
        }
        return next;
      });
    },
    []
  );

  // Auto-save to localStorage periodically or on change
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveDesign(design);
    }, 800);
    return () => clearTimeout(timeout);
  }, [design]);

  // UNDO / REDO
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((hist) => hist.slice(0, -1));
    setRedoStack((redo) => [design, ...redo]);
    setDesign(previous);
    showToast('Undo performed', 'info');
  }, [history, design]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setRedoStack((redo) => redo.slice(1));
    setHistory((hist) => [...hist, design]);
    setDesign(next);
    showToast('Redo performed', 'info');
  }, [redoStack, design]);

  // GLOBAL KEYBOARD SHORTCUTS & CLIPBOARD ACTIONS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInput =
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      // If typing inside an active input or textarea
      if (isInput) {
        if (e.key === 'Escape') {
          e.preventDefault();
          (document.activeElement as HTMLElement)?.blur();
          setEditingElementId(null);
        }
        return;
      }

      // Enter key on selected text element -> start direct editing on canvas
      if (e.key === 'Enter' && selectedElementId) {
        const el = design.elements.find((item) => item.id === selectedElementId);
        if (el && el.type === 'text' && !el.locked) {
          e.preventDefault();
          setEditingElementId(selectedElementId);
          return;
        }
      }

      // Ctrl+A / Cmd+A on selected text element -> start editing & select all
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && selectedElementId) {
        const el = design.elements.find((item) => item.id === selectedElementId);
        if (el && el.type === 'text' && !el.locked) {
          e.preventDefault();
          setEditingElementId(selectedElementId);
          return;
        }
      }

      // Ctrl+C / Cmd+C on selected text element -> copy its text
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c' && selectedElementId) {
        const el = design.elements.find((item) => item.id === selectedElementId);
        if (el && el.type === 'text') {
          navigator.clipboard?.writeText?.((el as TextCanvasElement).text).then(() => {
            showToast('Copied text to clipboard', 'info');
          }).catch(() => {});
        }
      }

      // Ctrl+V / Cmd+V on selected text element -> paste into that exact text box
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v' && selectedElementId) {
        const el = design.elements.find((item) => item.id === selectedElementId);
        if (el && el.type === 'text' && !el.locked) {
          e.preventDefault();
          navigator.clipboard?.readText?.().then((pastedText) => {
            if (pastedText !== undefined && pastedText !== null) {
              handleUpdateElement(selectedElementId, { text: pastedText });
              showToast('Pasted text into selected element', 'info');
            }
          }).catch(() => {});
          return;
        }
      }

      // Undo: Ctrl+Z / Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Save: Ctrl+S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveDesign(design);
        showToast('Document saved successfully!');
        return;
      }

      // Print: Ctrl+P
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        printDocument('printable-paper');
        return;
      }

      // Duplicate: Ctrl+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        if (selectedElementId) {
          e.preventDefault();
          handleDuplicateElement(selectedElementId);
          return;
        }
      }

      // Delete: Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId) {
          e.preventDefault();
          handleDeleteElement(selectedElementId);
          return;
        }
      }

      // Escape: Exit edit mode or Deselect
      if (e.key === 'Escape') {
        if (editingElementId) {
          setEditingElementId(null);
        } else {
          setSelectedElementId(null);
        }
        return;
      }

      // Nudge with arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && selectedElementId) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
        const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;

        handleUpdateElement(selectedElementId, {
          x: (design.elements.find((el) => el.id === selectedElementId)?.x || 0) + dx,
          y: (design.elements.find((el) => el.id === selectedElementId)?.y || 0) + dy,
        });
      }
    };

    // Native paste event listener for rich cross-app paste compatibility
    const handlePaste = (e: ClipboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInput =
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        (document.activeElement as HTMLElement)?.isContentEditable;
      if (isInput) return;

      if (selectedElementId) {
        const el = design.elements.find((item) => item.id === selectedElementId);
        if (el && el.type === 'text' && !el.locked) {
          const text = e.clipboardData?.getData('text/plain');
          if (text !== undefined && text !== null) {
            e.preventDefault();
            handleUpdateElement(selectedElementId, { text });
            showToast('Pasted text into selected element', 'info');
          }
        }
      }
    };

    // Native copy event listener
    const handleCopy = (e: ClipboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInput =
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        (document.activeElement as HTMLElement)?.isContentEditable;
      if (isInput) return;

      if (selectedElementId) {
        const el = design.elements.find((item) => item.id === selectedElementId);
        if (el && el.type === 'text') {
          e.preventDefault();
          e.clipboardData?.setData('text/plain', (el as TextCanvasElement).text);
          showToast('Copied text to clipboard', 'info');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('paste', handlePaste);
    window.addEventListener('copy', handleCopy);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('copy', handleCopy);
    };
  }, [design, selectedElementId, editingElementId, handleUndo, handleRedo]);

  // ELEMENT ACTIONS
  const handleAddTextElement = (partial: Partial<TextCanvasElement>) => {
    const newElement: TextCanvasElement = {
      id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'text',
      x: 80,
      y: 120,
      width: partial.width || 320,
      height: partial.height || 45,
      rotation: 0,
      zIndex: design.elements.length + 1,
      opacity: 1,
      locked: false,
      text: partial.text || 'Heading text',
      fontFamily: partial.fontFamily || 'Plus Jakarta Sans',
      fontSize: partial.fontSize || 20,
      fontWeight: partial.fontWeight || '700',
      fontStyle: partial.fontStyle || 'normal',
      textAlign: partial.textAlign || 'left',
      color: partial.color || '#0f172a',
      lineHeight: 1.3,
      ...partial,
    };

    updateDesign((prev) => ({
      ...prev,
      elements: [...prev.elements, newElement],
    }));
    setSelectedElementId(newElement.id);
  };

  const handleAddHeaderPreset = (type: 'hospital' | 'business' | 'shop', align: 'left' | 'center' | 'right') => {
    const startY = 30;
    const pageWidth = 794; // A4 standard width

    if (type === 'hospital') {
      const logoEl: ImageCanvasElement = {
        id: `logo-${Date.now()}`,
        type: 'image',
        x: align === 'center' ? pageWidth / 2 - 35 : 40,
        y: startY,
        width: 70,
        height: 70,
        rotation: 0,
        zIndex: design.elements.length + 1,
        opacity: 1,
        locked: false,
        src: SAMPLE_LOGOS[0].svgDataUri,
        objectFit: 'contain',
      };

      const hospitalNameEl: TextCanvasElement = {
        id: `hname-${Date.now()}`,
        type: 'text',
        x: align === 'center' ? 40 : 125,
        y: align === 'center' ? startY + 75 : startY + 5,
        width: align === 'center' ? pageWidth - 80 : 500,
        height: 40,
        rotation: 0,
        zIndex: design.elements.length + 2,
        opacity: 1,
        locked: false,
        text: 'ST. JUDE MEMORIAL HOSPITAL & RESEARCH INSTITUTE',
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 18,
        fontWeight: '800',
        fontStyle: 'normal',
        textAlign: align,
        color: '#0284c7',
        textTransform: 'uppercase',
        letterSpacing: 1,
      };

      const deptEl: TextCanvasElement = {
        id: `hdept-${Date.now()}`,
        type: 'text',
        x: align === 'center' ? 40 : 125,
        y: align === 'center' ? startY + 115 : startY + 45,
        width: align === 'center' ? pageWidth - 80 : 500,
        height: 35,
        rotation: 0,
        zIndex: design.elements.length + 3,
        opacity: 1,
        locked: false,
        text: 'Department of Clinical Cardiology & Preventive Medicine\n100 Health Boulevard, Metropolis • Emergency: (800) 555-0199 • clinic@stjudehospital.org',
        fontFamily: 'Inter',
        fontSize: 10,
        fontWeight: '400',
        fontStyle: 'normal',
        textAlign: align,
        color: '#64748b',
        lineHeight: 1.4,
      };

      const dividerEl: ShapeCanvasElement = {
        id: `hdiv-${Date.now()}`,
        type: 'shape',
        shapeType: 'divider',
        x: 40,
        y: align === 'center' ? startY + 160 : startY + 95,
        width: pageWidth - 80,
        height: 3,
        rotation: 0,
        zIndex: design.elements.length + 4,
        opacity: 1,
        locked: false,
        fillColor: '#0284c7',
        strokeColor: '#0284c7',
        strokeWidth: 2,
        strokeStyle: 'solid',
      };

      updateDesign((prev) => ({
        ...prev,
        elements: [...prev.elements, logoEl, hospitalNameEl, deptEl, dividerEl],
      }));
      showToast('Hospital Header inserted!');
    } else if (type === 'business') {
      const bizNameEl: TextCanvasElement = {
        id: `biz-${Date.now()}`,
        type: 'text',
        x: 40,
        y: startY,
        width: 450,
        height: 40,
        rotation: 0,
        zIndex: design.elements.length + 1,
        opacity: 1,
        locked: false,
        text: 'APEX GLOBAL STRATEGIES LTD.',
        fontFamily: 'Montserrat',
        fontSize: 20,
        fontWeight: '800',
        fontStyle: 'normal',
        textAlign: 'left',
        color: '#0f172a',
        letterSpacing: 2,
      };

      const subBiz: TextCanvasElement = {
        id: `bizsub-${Date.now()}`,
        type: 'text',
        x: 40,
        y: startY + 38,
        width: 450,
        height: 25,
        rotation: 0,
        zIndex: design.elements.length + 2,
        opacity: 1,
        locked: false,
        text: 'Corporate Advisory, Mergers & Financial Intelligence',
        fontFamily: 'Inter',
        fontSize: 11,
        fontWeight: '500',
        fontStyle: 'normal',
        textAlign: 'left',
        color: '#0284c7',
      };

      const rightContact: TextCanvasElement = {
        id: `bizcont-${Date.now()}`,
        type: 'text',
        x: pageWidth - 260,
        y: startY + 5,
        width: 220,
        height: 55,
        rotation: 0,
        zIndex: design.elements.length + 3,
        opacity: 1,
        locked: false,
        text: 'Suite 4200, Financial Tower\nNew York, NY 10005\n+1 (212) 555-0140\ncontact@apexstrategy.com',
        fontFamily: 'Inter',
        fontSize: 10,
        fontWeight: '400',
        fontStyle: 'normal',
        textAlign: 'right',
        color: '#64748b',
        lineHeight: 1.35,
      };

      const divider: ShapeCanvasElement = {
        id: `bizdiv-${Date.now()}`,
        type: 'shape',
        shapeType: 'divider',
        x: 40,
        y: startY + 75,
        width: pageWidth - 80,
        height: 2,
        rotation: 0,
        zIndex: design.elements.length + 4,
        opacity: 1,
        locked: false,
        fillColor: '#cbd5e1',
        strokeColor: '#cbd5e1',
        strokeWidth: 1.5,
        strokeStyle: 'solid',
      };

      updateDesign((prev) => ({
        ...prev,
        elements: [...prev.elements, bizNameEl, subBiz, rightContact, divider],
      }));
      showToast('Corporate Header inserted!');
    } else {
      const shopNameEl: TextCanvasElement = {
        id: `shop-${Date.now()}`,
        type: 'text',
        x: 40,
        y: startY,
        width: pageWidth - 80,
        height: 40,
        rotation: 0,
        zIndex: design.elements.length + 1,
        opacity: 1,
        locked: false,
        text: 'LUMEN BOUTIQUE & APOTHECARY',
        fontFamily: 'Playfair Display',
        fontSize: 22,
        fontWeight: '700',
        fontStyle: 'normal',
        textAlign: 'center',
        color: '#1e293b',
        letterSpacing: 3,
      };

      const shopSub: TextCanvasElement = {
        id: `shopsub-${Date.now()}`,
        type: 'text',
        x: 40,
        y: startY + 42,
        width: pageWidth - 80,
        height: 25,
        rotation: 0,
        zIndex: design.elements.length + 2,
        opacity: 1,
        locked: false,
        text: 'Organic Herbal Remedies, Artisanal Teas & Wellness Goods • 44 Mercer St, Soho • Est. 2018',
        fontFamily: 'Inter',
        fontSize: 10.5,
        fontWeight: '400',
        fontStyle: 'normal',
        textAlign: 'center',
        color: '#64748b',
      };

      const divider: ShapeCanvasElement = {
        id: `shopdiv-${Date.now()}`,
        type: 'shape',
        shapeType: 'divider',
        x: 80,
        y: startY + 75,
        width: pageWidth - 160,
        height: 2,
        rotation: 0,
        zIndex: design.elements.length + 3,
        opacity: 1,
        locked: false,
        fillColor: '#94a3b8',
        strokeColor: '#94a3b8',
        strokeWidth: 1,
        strokeStyle: 'solid',
      };

      updateDesign((prev) => ({
        ...prev,
        elements: [...prev.elements, shopNameEl, shopSub, divider],
      }));
      showToast('Retail / Shop Header inserted!');
    }
  };

  const handleAddImageElement = (partial: Partial<ImageCanvasElement>) => {
    const newElement: ImageCanvasElement = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'image',
      x: 100,
      y: 100,
      width: partial.width || 120,
      height: partial.height || 120,
      rotation: 0,
      zIndex: design.elements.length + 1,
      opacity: 1,
      locked: false,
      src: partial.src || SAMPLE_LOGOS[0].svgDataUri,
      objectFit: partial.objectFit || 'contain',
      borderRadius: partial.borderRadius || 0,
    };

    updateDesign((prev) => ({
      ...prev,
      elements: [...prev.elements, newElement],
    }));
    setSelectedElementId(newElement.id);
    showToast('Image added to page');
  };

  const handleAddTableElement = (partial: Partial<TableCanvasElement>) => {
    const newElement: TableCanvasElement = {
      id: `tbl-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'table',
      x: 60,
      y: 180,
      width: partial.width || 550,
      height: partial.height || 140,
      rotation: 0,
      zIndex: design.elements.length + 1,
      opacity: 1,
      locked: false,
      rows: partial.rows || 3,
      cols: partial.cols || 3,
      data: partial.data || [
        [{ text: 'Header 1', bold: true }, { text: 'Header 2', bold: true }, { text: 'Header 3', bold: true }],
        [{ text: 'Row 1, Cell 1' }, { text: 'Row 1, Cell 2' }, { text: 'Row 1, Cell 3' }],
        [{ text: 'Row 2, Cell 1' }, { text: 'Row 2, Cell 2' }, { text: 'Row 2, Cell 3' }],
      ],
      headerRow: partial.headerRow ?? true,
      headerBg: partial.headerBg || '#1e293b',
      headerColor: partial.headerColor || '#ffffff',
      borderColor: partial.borderColor || '#cbd5e1',
      borderWidth: partial.borderWidth ?? 1,
      cellPadding: partial.cellPadding ?? 6,
      colWidths: partial.colWidths || [33, 33, 34],
    };

    updateDesign((prev) => ({
      ...prev,
      elements: [...prev.elements, newElement],
    }));
    setSelectedElementId(newElement.id);
    showToast('Table inserted');
  };

  const handleAddShapeElement = (partial: Partial<ShapeCanvasElement>) => {
    const newElement: ShapeCanvasElement = {
      id: `shp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'shape',
      shapeType: partial.shapeType || 'rectangle',
      x: 80,
      y: 160,
      width: partial.width || 200,
      height: partial.height || 100,
      rotation: 0,
      zIndex: design.elements.length + 1,
      opacity: 1,
      locked: false,
      fillColor: partial.fillColor || '#f8fafc',
      strokeColor: partial.strokeColor || '#64748b',
      strokeWidth: partial.strokeWidth ?? 1,
      strokeStyle: partial.strokeStyle || 'solid',
      cornerRadius: partial.cornerRadius ?? 0,
      ...partial,
    };

    updateDesign((prev) => ({
      ...prev,
      elements: [...prev.elements, newElement],
    }));
    setSelectedElementId(newElement.id);
  };

  const handleUpdateElement = (id: string, updates: Partial<CanvasElement>) => {
    updateDesign((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? ({ ...el, ...updates } as CanvasElement) : el)),
    }));
  };

  const handleDuplicateElement = (id: string) => {
    const target = design.elements.find((el) => el.id === id);
    if (!target) return;

    const duplicated: CanvasElement = {
      ...target,
      id: `${target.type}-${Date.now()}`,
      x: target.x + 20,
      y: target.y + 20,
      zIndex: design.elements.length + 1,
      locked: false,
    };

    updateDesign((prev) => ({
      ...prev,
      elements: [...prev.elements, duplicated],
    }));
    setSelectedElementId(duplicated.id);
    showToast('Element duplicated');
  };

  const handleDeleteElement = (id: string) => {
    updateDesign((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
    }));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
    showToast('Element removed', 'info');
  };

  // LAYER DEPTH (Bring forward, Send backward, etc.)
  const handleBringForward = (id: string) => {
    updateDesign((prev) => {
      const idx = prev.elements.findIndex((el) => el.id === id);
      if (idx < 0 || idx >= prev.elements.length - 1) return prev;
      const copy = [...prev.elements];
      const temp = copy[idx];
      copy[idx] = copy[idx + 1];
      copy[idx + 1] = temp;
      return { ...prev, elements: copy };
    });
  };

  const handleSendBackward = (id: string) => {
    updateDesign((prev) => {
      const idx = prev.elements.findIndex((el) => el.id === id);
      if (idx <= 0) return prev;
      const copy = [...prev.elements];
      const temp = copy[idx];
      copy[idx] = copy[idx - 1];
      copy[idx - 1] = temp;
      return { ...prev, elements: copy };
    });
  };

  const handleBringToFront = (id: string) => {
    updateDesign((prev) => {
      const target = prev.elements.find((el) => el.id === id);
      if (!target) return prev;
      return {
        ...prev,
        elements: [...prev.elements.filter((el) => el.id !== id), target],
      };
    });
  };

  const handleSendToBack = (id: string) => {
    updateDesign((prev) => {
      const target = prev.elements.find((el) => el.id === id);
      if (!target) return prev;
      return {
        ...prev,
        elements: [target, ...prev.elements.filter((el) => el.id !== id)],
      };
    });
  };

  // PAGE ALIGNMENT
  const handleAlignElement = (
    id: string,
    alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
  ) => {
    const target = design.elements.find((el) => el.id === id);
    if (!target) return;

    // Approximate paper width based on orientation
    const pageW = design.orientation === 'portrait' ? 794 : 1123;
    const pageH = design.orientation === 'portrait' ? 1123 : 794;

    let newX = target.x;
    let newY = target.y;

    if (alignment === 'left') newX = 40;
    if (alignment === 'center') newX = Math.round((pageW - target.width) / 2);
    if (alignment === 'right') newX = pageW - target.width - 40;
    if (alignment === 'top') newY = 40;
    if (alignment === 'middle') newY = Math.round((pageH - target.height) / 2);
    if (alignment === 'bottom') newY = pageH - target.height - 40;

    handleUpdateElement(id, { x: newX, y: newY });
  };

  // PRINT & PDF EXPORT
  const handlePrint = () => {
    setSelectedElementId(null);
    setEditingElementId(null);
    printDocument('printable-paper', design.paperSize, design.orientation);
  };

  const handleDownloadPdf = async () => {
    setSelectedElementId(null);
    setEditingElementId(null);
    setIsPdfExporting(true);
    try {
      await exportDocumentToPdf(
        'printable-paper',
        design.name || 'paper-document',
        design.paperSize,
        design.orientation
      );
      showToast('PDF downloaded successfully!');
    } catch (err: any) {
      showToast(`PDF Export failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsPdfExporting(false);
    }
  };

  const selectedElement = design.elements.find((el) => el.id === selectedElementId) || null;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 font-sans">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Application Toolbar */}
      <TopToolbar
        documentName={design.name}
        onRename={(name) => updateDesign((prev) => ({ ...prev, name }), false)}
        paperSize={design.paperSize}
        orientation={design.orientation}
        onChangePaperFormat={(size, orientation) =>
          updateDesign((prev) => ({ ...prev, paperSize: size, orientation }))
        }
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={() => {
          saveDesign(design);
          showToast('Document saved successfully!');
        }}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        onPreview={() => {
          setSelectedElementId(null);
          setEditingElementId(null);
          setIsPreviewOpen(true);
        }}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenNewModal={() => setIsNewDocModalOpen(true)}
        isSaving={false}
        isPdfExporting={isPdfExporting}
        lastSavedTime={design.updatedAt}
      />

      {/* Main Workspace Area (Left Sidebar + Canvas + Right Properties Panel) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar (Canva Rail + Tools) */}
        <LeftSidebar
          activeTab={activeLeftTab}
          setActiveTab={setActiveLeftTab}
          isCollapsed={isLeftCollapsed}
          setIsCollapsed={setIsLeftCollapsed}
          currentDesign={design}
          onSelectTemplate={(template) => {
            updateDesign({
              ...template,
              id: `doc-${Date.now()}`,
              name: `${template.name} (Copy)`,
            });
            setSelectedElementId(null);
            showToast(`Loaded template: ${template.name}`);
          }}
          onAddTextElement={handleAddTextElement}
          onAddHeaderPreset={handleAddHeaderPreset}
          onAddImageElement={handleAddImageElement}
          onAddTableElement={handleAddTableElement}
          onAddShapeElement={handleAddShapeElement}
          onChangeBorder={(pageBorder: PageBorderConfig) =>
            updateDesign((prev) => ({ ...prev, pageBorder }))
          }
          onChangeWatermark={(watermark: WatermarkConfig) =>
            updateDesign((prev) => ({ ...prev, watermark }))
          }
          onChangePaperFormat={(paperSize: PaperSize, orientation: PaperOrientation) =>
            updateDesign((prev) => ({ ...prev, paperSize, orientation }))
          }
          onChangeBackgroundColor={(backgroundColor: string) =>
            updateDesign((prev) => ({ ...prev, backgroundColor }))
          }
          onChangeMargins={(margins: DocumentMargins) =>
            updateDesign((prev) => ({ ...prev, margins }))
          }
          showRulers={showRulers}
          onToggleRulers={() => setShowRulers(!showRulers)}
          showGuides={showGuides}
          onToggleGuides={() => setShowGuides(!showGuides)}
        />

        {/* Center Paper Canvas */}
        <PaperCanvas
          design={design}
          selectedElementId={selectedElementId}
          editingElementId={editingElementId}
          onSelectElement={handleSelectElement}
          onStartEditing={handleStartEditing}
          onStopEditing={handleStopEditing}
          onUpdateElement={handleUpdateElement}
          onDuplicateElement={handleDuplicateElement}
          onDeleteElement={handleDeleteElement}
          showRulers={showRulers}
          showGuides={showGuides}
          paperRef={paperRef}
        />

        {/* Right Sidebar Properties Panel */}
        <PropertiesPanel
          selectedElement={selectedElement}
          currentDesign={design}
          onUpdateElement={handleUpdateElement}
          onDuplicateElement={handleDuplicateElement}
          onDeleteElement={handleDeleteElement}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          onBringToFront={handleBringToFront}
          onSendToBack={handleSendToBack}
          onAlignElement={handleAlignElement}
          onSelectElementById={(id) => setSelectedElementId(id)}
        />
      </div>

      {/* Full Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        design={design}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        isPdfExporting={isPdfExporting}
      />

      {/* Saved Documents Browser Modal */}
      <SavedDesignsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onOpenDesign={(loaded) => {
          updateDesign(loaded);
          setSelectedElementId(null);
          showToast(`Opened: ${loaded.name}`);
        }}
        currentDesignId={design.id}
      />

      {/* New Document / Template Selector Modal */}
      <NewDocumentModal
        isOpen={isNewDocModalOpen}
        onClose={() => setIsNewDocModalOpen(false)}
        onCreateBlank={(size, orientation) => {
          const blank = createNewBlankDesign('Untitled Document', size, orientation);
          updateDesign(blank);
          setSelectedElementId(null);
          showToast(`Created blank ${size} ${orientation}`);
        }}
        onSelectTemplate={(template) => {
          updateDesign({
            ...template,
            id: `doc-${Date.now()}`,
            name: `${template.name} (Copy)`,
          });
          setSelectedElementId(null);
          showToast(`Loaded template: ${template.name}`);
        }}
      />
    </div>
  );
}
