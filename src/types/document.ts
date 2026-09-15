export type PaperSize = 'A4' | 'A5';
export type PaperOrientation = 'portrait' | 'landscape';

export interface PaperDimensions {
  widthMm: number;
  heightMm: number;
  widthPx: number; // At 96 DPI: 1mm ≈ 3.7795px
  heightPx: number;
}

export const PAPER_SPECS: Record<PaperSize, { portrait: PaperDimensions; landscape: PaperDimensions }> = {
  A4: {
    portrait: { widthMm: 210, heightMm: 297, widthPx: 794, heightPx: 1123 },
    landscape: { widthMm: 297, heightMm: 210, widthPx: 1123, heightPx: 794 },
  },
  A5: {
    portrait: { widthMm: 148, heightMm: 210, widthPx: 559, heightPx: 794 },
    landscape: { widthMm: 210, heightMm: 148, widthPx: 794, heightPx: 559 },
  },
};

export type ElementType = 'text' | 'image' | 'table' | 'shape';

export interface BaseCanvasElement {
  id: string;
  type: ElementType;
  x: number; // in base px (relative to paper specs)
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees
  zIndex: number;
  locked: boolean;
  opacity: number;
}

export interface TextCanvasElement extends BaseCanvasElement {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number; // in px
  fontWeight: '300' | '400' | '500' | '600' | '700' | '800';
  fontStyle: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  color: string;
  backgroundColor?: string; // transparent or hex
  letterSpacing?: number; // px
  lineHeight?: number; // ratio, e.g. 1.3
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface TableCell {
  text: string;
  bold?: boolean;
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
  bg?: string;
  color?: string;
}

export interface TableCanvasElement extends BaseCanvasElement {
  type: 'table';
  rows: number;
  cols: number;
  data: TableCell[][];
  headerRow: boolean;
  headerBg: string;
  headerColor: string;
  borderColor: string;
  borderWidth: number;
  cellPadding: number;
  colWidths: number[]; // relative percentages summing to 100
}

export type ShapeType = 'rectangle' | 'circle' | 'line' | 'arrow' | 'rounded-rectangle' | 'divider';

export interface ShapeCanvasElement extends BaseCanvasElement {
  type: 'shape';
  shapeType: ShapeType;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  cornerRadius?: number;
}

export interface ImageCanvasElement extends BaseCanvasElement {
  type: 'image';
  src: string;
  alt?: string;
  objectFit: 'contain' | 'cover' | 'fill';
  borderRadius?: number;
}

export type CanvasElement =
  | TextCanvasElement
  | TableCanvasElement
  | ShapeCanvasElement
  | ImageCanvasElement;

export interface PageBorderConfig {
  enabled: boolean;
  style: 'single' | 'double' | 'dashed' | 'dotted' | 'groove' | 'ornate';
  width: number; // px
  color: string;
  margin: number; // distance in mm from paper edge
  rounded: number; // px
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

export interface WatermarkConfig {
  enabled: boolean;
  type: 'text' | 'image';
  text: string;
  imageUrl?: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  opacity: number; // 0.05 to 0.5
  rotation: number;
  position: 'center' | 'custom' | 'diagonal';
  x: number;
  y: number;
  width: number;
  height: number;
  isBehind: boolean;
}

export interface DocumentMargins {
  top: number; // in mm
  bottom: number;
  left: number;
  right: number;
}

export interface DocumentDesign {
  id: string;
  name: string;
  paperSize: PaperSize;
  orientation: PaperOrientation;
  backgroundColor: string;
  margins: DocumentMargins;
  pageBorder: PageBorderConfig;
  watermark: WatermarkConfig;
  elements: CanvasElement[];
  createdAt: number;
  updatedAt: number;
}
