import { DocumentDesign, PaperSize, PaperOrientation } from '../types/document';
import { TEMPLATES } from '../data/templates';

const STORAGE_KEY = 'paper_designer_saved_documents_v2';
const LAST_ACTIVE_ID_KEY = 'paper_designer_last_active_id_v2';

export function getAllSavedDesigns(): DocumentDesign[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First time initialization: seed with the ABC hospital letterhead as default template
      const defaultDoc = TEMPLATES[0].design;
      localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultDoc]));
      return [defaultDoc];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error loading saved designs:', err);
    return [TEMPLATES[0].design];
  }
}

export const getSavedDesigns = getAllSavedDesigns;

export function saveDesignToStorage(design: DocumentDesign): void {
  try {
    const current = getAllSavedDesigns();
    const updatedDesign = { ...design, updatedAt: Date.now() };
    const index = current.findIndex((d) => d.id === design.id);
    let nextList: DocumentDesign[];
    if (index >= 0) {
      nextList = [...current];
      nextList[index] = updatedDesign;
    } else {
      nextList = [updatedDesign, ...current];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    localStorage.setItem(LAST_ACTIVE_ID_KEY, design.id);
  } catch (err) {
    console.error('Failed to save design to localStorage:', err);
  }
}

export const saveDesign = saveDesignToStorage;

export function deleteDesignFromStorage(id: string): DocumentDesign[] {
  try {
    const current = getAllSavedDesigns();
    const filtered = current.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Failed to delete design from localStorage:', err);
    return [];
  }
}

export const deleteDesign = deleteDesignFromStorage;

export function duplicateDesignInStorage(idOrDesign: string | DocumentDesign): DocumentDesign | null {
  let target: DocumentDesign | undefined;
  if (typeof idOrDesign === 'string') {
    target = getAllSavedDesigns().find((d) => d.id === idOrDesign);
  } else {
    target = idOrDesign;
  }

  if (!target) return null;

  const newId = 'doc_' + Math.random().toString(36).substring(2, 9);
  const copy: DocumentDesign = {
    ...target,
    id: newId,
    name: `${target.name} (Copy)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  saveDesignToStorage(copy);
  return copy;
}

export const duplicateDesign = duplicateDesignInStorage;

export function getLastActiveDesignId(): string | null {
  return localStorage.getItem(LAST_ACTIVE_ID_KEY);
}

export function setLastActiveDesignId(id: string): void {
  localStorage.setItem(LAST_ACTIVE_ID_KEY, id);
}

export function loadCurrentDesign(): DocumentDesign | null {
  const designs = getAllSavedDesigns();
  const lastId = getLastActiveDesignId();
  if (lastId) {
    const found = designs.find((d) => d.id === lastId);
    if (found) return found;
  }
  return designs.length > 0 ? designs[0] : null;
}

export function createNewBlankDesign(
  name = 'Untitled Document',
  paperSize: PaperSize = 'A4',
  orientation: PaperOrientation = 'portrait'
): DocumentDesign {
  const newDesign: DocumentDesign = {
    id: 'doc_' + Math.random().toString(36).substring(2, 9),
    name,
    paperSize,
    orientation,
    backgroundColor: '#ffffff',
    margins: { top: 10, bottom: 10, left: 10, right: 10 },
    pageBorder: {
      enabled: false,
      style: 'single',
      width: 1,
      color: '#cbd5e1',
      margin: 10,
      rounded: 0,
      top: true,
      bottom: true,
      left: true,
      right: true,
    },
    watermark: {
      enabled: false,
      type: 'text',
      text: 'DRAFT',
      fontSize: 54,
      fontFamily: 'Montserrat',
      color: '#94a3b8',
      opacity: 0.1,
      rotation: -45,
      position: 'center',
      x: 100,
      y: 350,
      width: 400,
      height: 120,
      isBehind: true,
    },
    elements: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  saveDesignToStorage(newDesign);
  return newDesign;
}

export function exportDesignToJson(design: DocumentDesign): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(design, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const safeName = design.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  downloadAnchor.setAttribute('download', `${safeName}_paper_design.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importDesignFromJson(file: File): Promise<DocumentDesign> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (!parsed.paperSize || !parsed.elements) {
          throw new Error('Invalid Paper Designer JSON file schema');
        }
        const importedDoc: DocumentDesign = {
          ...parsed,
          id: 'doc_' + Math.random().toString(36).substring(2, 9),
          name: parsed.name ? `${parsed.name} (Imported)` : 'Imported Document',
          updatedAt: Date.now(),
        };
        saveDesignToStorage(importedDoc);
        resolve(importedDoc);
      } catch (err: any) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
