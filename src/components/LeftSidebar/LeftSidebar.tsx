import React from 'react';
import {
  LayoutTemplate,
  Type,
  Image as ImageIcon,
  Table as TableIcon,
  Shapes,
  Square,
  Stamp,
  Sliders,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { TemplatesTab } from './TemplatesTab';
import { TextTab } from './TextTab';
import { ImagesTab } from './ImagesTab';
import { TablesTab } from './TablesTab';
import { ShapesTab } from './ShapesTab';
import { BordersTab } from './BordersTab';
import { WatermarkTab } from './WatermarkTab';
import { PageSetupTab } from './PageSetupTab';
import {
  DocumentDesign,
  TextCanvasElement,
  ImageCanvasElement,
  TableCanvasElement,
  ShapeCanvasElement,
  PageBorderConfig,
  WatermarkConfig,
  PaperSize,
  PaperOrientation,
  DocumentMargins,
} from '../../types/document';

export type LeftTabId =
  | 'templates'
  | 'text'
  | 'images'
  | 'tables'
  | 'shapes'
  | 'borders'
  | 'watermark'
  | 'setup';

interface LeftSidebarProps {
  activeTab: LeftTabId;
  setActiveTab: (tab: LeftTabId) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  currentDesign: DocumentDesign;
  onSelectTemplate: (design: DocumentDesign) => void;
  onAddTextElement: (element: Partial<TextCanvasElement>) => void;
  onAddHeaderPreset: (type: 'hospital' | 'business' | 'shop', align: 'left' | 'center' | 'right') => void;
  onAddImageElement: (element: Partial<ImageCanvasElement>) => void;
  onAddTableElement: (element: Partial<TableCanvasElement>) => void;
  onAddShapeElement: (element: Partial<ShapeCanvasElement>) => void;
  onChangeBorder: (border: PageBorderConfig) => void;
  onChangeWatermark: (watermark: WatermarkConfig) => void;
  onChangePaperFormat: (size: PaperSize, orientation: PaperOrientation) => void;
  onChangeBackgroundColor: (color: string) => void;
  onChangeMargins: (margins: DocumentMargins) => void;
  showRulers: boolean;
  onToggleRulers: () => void;
  showGuides: boolean;
  onToggleGuides: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  currentDesign,
  onSelectTemplate,
  onAddTextElement,
  onAddHeaderPreset,
  onAddImageElement,
  onAddTableElement,
  onAddShapeElement,
  onChangeBorder,
  onChangeWatermark,
  onChangePaperFormat,
  onChangeBackgroundColor,
  onChangeMargins,
  showRulers,
  onToggleRulers,
  showGuides,
  onToggleGuides,
}) => {
  const tabs: { id: LeftTabId; label: string; icon: React.ReactNode }[] = [
    { id: 'templates', label: 'Templates', icon: <LayoutTemplate className="w-5 h-5" /> },
    { id: 'text', label: 'Text', icon: <Type className="w-5 h-5" /> },
    { id: 'images', label: 'Images', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 'tables', label: 'Tables', icon: <TableIcon className="w-5 h-5" /> },
    { id: 'shapes', label: 'Shapes', icon: <Shapes className="w-5 h-5" /> },
    { id: 'borders', label: 'Borders', icon: <Square className="w-5 h-5" /> },
    { id: 'watermark', label: 'Watermark', icon: <Stamp className="w-5 h-5" /> },
    { id: 'setup', label: 'Page Setup', icon: <Sliders className="w-5 h-5" /> },
  ];

  return (
    <aside id="left-sidebar" className="flex h-full bg-white border-r border-slate-200 z-20 shrink-0 select-none">
      {/* Primary Vertical Rail (Canva Style) */}
      <div className="w-18 bg-slate-900 flex flex-col items-center py-2.5 gap-1 shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id && !isCollapsed;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (activeTab === tab.id && !isCollapsed) {
                  setIsCollapsed(true);
                } else {
                  setActiveTab(tab.id);
                  setIsCollapsed(false);
                }
              }}
              className={`w-15 h-13 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={tab.label}
            >
              {tab.icon}
              <span className="text-[10px] font-semibold tracking-tight leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slide-out Options Panel */}
      {!isCollapsed && (
        <div className="w-72 sm:w-80 h-full overflow-y-auto bg-slate-50/70 border-r border-slate-200 relative flex flex-col">
          {/* Header */}
          <div className="px-3.5 py-3 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
              title="Collapse sidebar panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Active Tab Component */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'templates' && (
              <TemplatesTab
                currentDesignId={currentDesign.id}
                onSelectTemplate={onSelectTemplate}
              />
            )}
            {activeTab === 'text' && (
              <TextTab
                onAddTextElement={onAddTextElement}
                onAddHeaderPreset={onAddHeaderPreset}
              />
            )}
            {activeTab === 'images' && (
              <ImagesTab onAddImageElement={onAddImageElement} />
            )}
            {activeTab === 'tables' && (
              <TablesTab onAddTableElement={onAddTableElement} />
            )}
            {activeTab === 'shapes' && (
              <ShapesTab onAddShapeElement={onAddShapeElement} />
            )}
            {activeTab === 'borders' && (
              <BordersTab
                borderConfig={currentDesign.pageBorder}
                onChangeBorder={onChangeBorder}
              />
            )}
            {activeTab === 'watermark' && (
              <WatermarkTab
                watermarkConfig={currentDesign.watermark}
                onChangeWatermark={onChangeWatermark}
              />
            )}
            {activeTab === 'setup' && (
              <PageSetupTab
                paperSize={currentDesign.paperSize}
                orientation={currentDesign.orientation}
                onChangePaperFormat={onChangePaperFormat}
                backgroundColor={currentDesign.backgroundColor}
                onChangeBackgroundColor={onChangeBackgroundColor}
                margins={currentDesign.margins}
                onChangeMargins={onChangeMargins}
                showRulers={showRulers}
                onToggleRulers={onToggleRulers}
                showGuides={showGuides}
                onToggleGuides={onToggleGuides}
              />
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
