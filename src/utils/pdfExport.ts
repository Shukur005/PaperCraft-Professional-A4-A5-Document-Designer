import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { DocumentDesign, PAPER_SPECS, PaperSize, PaperOrientation } from '../types/document';

export async function exportDocumentToPdf(
  paperElementOrId: HTMLElement | string,
  designOrName: DocumentDesign | string,
  maybePaperSize?: PaperSize,
  maybeOrientation?: PaperOrientation,
  onProgress?: (status: string) => void
): Promise<void> {
  let element: HTMLElement | null = null;
  if (typeof paperElementOrId === 'string') {
    element = document.getElementById(paperElementOrId);
  } else {
    element = paperElementOrId;
  }

  if (!element) {
    throw new Error('Printable paper element not found');
  }

  let paperSize: PaperSize = 'A4';
  let orientation: PaperOrientation = 'portrait';
  let docName = 'document';
  let bgColor = '#ffffff';

  if (typeof designOrName === 'string') {
    docName = designOrName;
    paperSize = maybePaperSize || 'A4';
    orientation = maybeOrientation || 'portrait';
  } else {
    docName = designOrName.name;
    paperSize = designOrName.paperSize;
    orientation = designOrName.orientation;
    bgColor = designOrName.backgroundColor || '#ffffff';
  }

  const specs = PAPER_SPECS[paperSize][orientation];

  // Reference to any canvas scaler ancestor so we can temporarily disable transform during capture
  const scaler = (element.closest('#printable-paper-scaler') ||
    (element.parentElement?.style.transform ? element.parentElement : null)) as HTMLElement | null;

  const originalScalerTransform = scaler ? scaler.style.transform : '';
  const originalScalerTransition = scaler ? scaler.style.transition : '';

  // Deselect any selection handles before snapshot
  const selectionBoxes = element.querySelectorAll<HTMLElement>(
    '.selection-box, .resize-handle, .rotation-handle, .mini-toolbar, .guideline'
  );

  try {
    if (onProgress) onProgress('Loading fonts & layout...');

    // Await all web fonts (Google fonts, local fonts) to be 100% loaded and ready
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Temporarily reset CSS transform scale on parent in live DOM so getBoundingClientRect()
    // and html2canvas character measurement are 100% true-to-size (prevents text compression and overlapping)
    if (scaler) {
      scaler.style.transition = 'none';
      scaler.style.transform = 'none';
    }

    selectionBoxes.forEach((el) => {
      el.style.display = 'none';
    });

    if (onProgress) onProgress('Rendering high-resolution vector canvas...');

    // Use html2canvas-pro with exact document dimensions and scale: 2 for 300 DPI crisp print
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: bgColor,
      logging: false,
      width: specs.widthPx,
      height: specs.heightPx,
      windowWidth: specs.widthPx,
      windowHeight: specs.heightPx,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone: (clonedDoc, clonedEl) => {
        // 1. In the cloned virtual DOM, eliminate any parent CSS transforms
        let current: HTMLElement | null = clonedEl;
        while (current && current !== clonedDoc.body) {
          current.style.transform = 'none';
          current.style.webkitTransform = 'none';
          current.style.zoom = '1';
          current = current.parentElement;
        }

        // 2. Lock cloned paper strictly to target dimensions starting from (0, 0)
        clonedEl.style.position = 'fixed';
        clonedEl.style.top = '0px';
        clonedEl.style.left = '0px';
        clonedEl.style.margin = '0px';
        clonedEl.style.transform = 'none';
        clonedEl.style.width = `${specs.widthPx}px`;
        clonedEl.style.height = `${specs.heightPx}px`;

        // 3. Hide all editor handles, guidelines, placeholders, and toolbar elements
        const handles = clonedEl.querySelectorAll<HTMLElement>(
          '.selection-box, .resize-handle, .rotation-handle, .guideline, .mini-toolbar, .no-print, .empty-text-placeholder'
        );
        handles.forEach((el) => {
          el.style.display = 'none';
        });

        // 4. Color safeguard for converting any modern OKLCH/OKLAB color strings to hex/rgb
        try {
          const tempCanvas = clonedDoc.createElement('canvas');
          const ctx = tempCanvas.getContext('2d');
          if (ctx) {
            const allElements = clonedEl.querySelectorAll<HTMLElement>('*');
            allElements.forEach((el) => {
              if (el.style) {
                (['color', 'backgroundColor', 'borderColor'] as const).forEach((prop) => {
                  const val = el.style[prop];
                  if (
                    val &&
                    typeof val === 'string' &&
                    (val.includes('oklch') || val.includes('oklab') || val.includes('lch'))
                  ) {
                    ctx.fillStyle = '#000000';
                    try {
                      ctx.fillStyle = val;
                      el.style[prop] = ctx.fillStyle;
                    } catch {
                      // ignore
                    }
                  }
                });
              }
            });
          }
        } catch {
          // ignore
        }
      },
    });

    if (onProgress) onProgress('Compiling PDF with exact paper dimensions...');

    const pdfOrientation = orientation === 'landscape' ? 'l' : 'p';

    // Create jsPDF with exact mm format: 'a4' or 'a5'
    const pdf = new jsPDF({
      orientation: pdfOrientation,
      unit: 'mm',
      format: [specs.widthMm, specs.heightMm],
      compress: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    pdf.addImage(imgData, 'JPEG', 0, 0, specs.widthMm, specs.heightMm);

    const safeName = (docName || 'document').toLowerCase().replace(/[^a-z0-9]/g, '_');
    pdf.save(`${safeName}_${paperSize.toLowerCase()}.pdf`);

    if (onProgress) onProgress('Done');
  } catch (error) {
    console.error('Failed to export PDF:', error);
    throw error;
  } finally {
    // Always restore live DOM transform and selection handles
    if (scaler) {
      scaler.style.transform = originalScalerTransform;
      scaler.style.transition = originalScalerTransition;
    }
    selectionBoxes.forEach((el) => {
      el.style.display = '';
    });
  }
}

export function printDocument(
  elementId = 'printable-paper',
  paperSize: PaperSize = 'A4',
  orientation: PaperOrientation = 'portrait'
): void {
  // Inject dynamic @page rule so print preview defaults to exact size and orientation
  const styleId = 'dynamic-print-page-style';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }
  styleEl.innerHTML = `
    @media print {
      @page {
        size: ${paperSize.toLowerCase()} ${orientation.toLowerCase()};
        margin: 0mm;
      }
    }
  `;

  // Short delay to apply style then trigger print dialog
  setTimeout(() => {
    window.print();
  }, 80);
}

export const triggerPrintDialog = printDocument;
