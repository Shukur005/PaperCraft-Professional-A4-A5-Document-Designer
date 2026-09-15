import React, { useState } from 'react';
import { Table, Plus, Pill, Receipt, FileSpreadsheet } from 'lucide-react';
import { TableCanvasElement, TableCell } from '../../types/document';

interface TablesTabProps {
  onAddTableElement: (element: Partial<TableCanvasElement>) => void;
}

export const TablesTab: React.FC<TablesTabProps> = ({ onAddTableElement }) => {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(3);

  const createCustomTable = () => {
    const colWidths = Array(cols).fill(Math.floor(100 / cols));
    // adjust rounding
    const sum = colWidths.reduce((a, b) => a + b, 0);
    if (sum !== 100) colWidths[0] += 100 - sum;

    const data: TableCell[][] = [];
    for (let r = 0; r < rows; r++) {
      const rowCells: TableCell[] = [];
      for (let c = 0; c < cols; c++) {
        rowCells.push({
          text: r === 0 ? `Header ${c + 1}` : `Cell ${r},${c + 1}`,
          bold: r === 0,
          align: 'left',
        });
      }
      data.push(rowCells);
    }

    onAddTableElement({
      rows,
      cols,
      data,
      colWidths,
      headerRow: true,
      headerBg: '#1e293b',
      headerColor: '#ffffff',
      borderColor: '#cbd5e1',
      borderWidth: 1,
      cellPadding: 8,
      width: 550,
      height: rows * 36,
    });
  };

  const addMedicalPrescriptionTable = () => {
    const data: TableCell[][] = [
      [
        { text: '#', bold: true, align: 'center' },
        { text: 'Medicine / Prescription Details', bold: true, align: 'left' },
        { text: 'Dosage & Frequency', bold: true, align: 'left' },
        { text: 'Duration', bold: true, align: 'center' },
      ],
      [
        { text: '1', align: 'center' },
        { text: 'Tab. Amoxicillin 500mg', align: 'left' },
        { text: '1 - 0 - 1 (After meals)', align: 'left' },
        { text: '5 Days', align: 'center' },
      ],
      [
        { text: '2', align: 'center' },
        { text: 'Tab. Paracetamol 650mg', align: 'left' },
        { text: 'SOS (When needed for fever)', align: 'left' },
        { text: '3 Days', align: 'center' },
      ],
      [
        { text: '3', align: 'center' },
        { text: 'Syrup Cough Relief 10ml', align: 'left' },
        { text: 'Before sleeping at night', align: 'left' },
        { text: '7 Days', align: 'center' },
      ],
    ];

    onAddTableElement({
      rows: 4,
      cols: 4,
      colWidths: [10, 45, 25, 20],
      data,
      headerRow: true,
      headerBg: '#0284c7',
      headerColor: '#ffffff',
      borderColor: '#cbd5e1',
      borderWidth: 1,
      cellPadding: 8,
      width: 600,
      height: 160,
    });
  };

  const addInvoiceTable = () => {
    const data: TableCell[][] = [
      [
        { text: '#', bold: true, align: 'center' },
        { text: 'Item & Description', bold: true, align: 'left' },
        { text: 'Qty', bold: true, align: 'center' },
        { text: 'Rate ($)', bold: true, align: 'right' },
        { text: 'Amount ($)', bold: true, align: 'right' },
      ],
      [
        { text: '1', align: 'center' },
        { text: 'Consultation & Diagnostics', align: 'left' },
        { text: '1', align: 'center' },
        { text: '150.00', align: 'right' },
        { text: '150.00', align: 'right' },
      ],
      [
        { text: '2', align: 'center' },
        { text: 'Laboratory Blood Chemistry Panel', align: 'left' },
        { text: '1', align: 'center' },
        { text: '95.00', align: 'right' },
        { text: '95.00', align: 'right' },
      ],
      [
        { text: '3', align: 'center' },
        { text: 'Sterile Surgical Pack', align: 'left' },
        { text: '2', align: 'center' },
        { text: '40.00', align: 'right' },
        { text: '80.00', align: 'right' },
      ],
    ];

    onAddTableElement({
      rows: 4,
      cols: 5,
      colWidths: [8, 48, 14, 15, 15],
      data,
      headerRow: true,
      headerBg: '#0f172a',
      headerColor: '#ffffff',
      borderColor: '#cbd5e1',
      borderWidth: 1,
      cellPadding: 8,
      width: 620,
      height: 160,
    });
  };

  return (
    <div className="p-3 space-y-4">
      {/* Custom Grid Creator */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Insert Custom Table
        </h3>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Rows</label>
              <input
                type="number"
                min={1}
                max={20}
                value={rows}
                onChange={(e) => setRows(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Columns</label>
              <input
                type="number"
                min={1}
                max={10}
                value={cols}
                onChange={(e) => setCols(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
              />
            </div>
          </div>

          <button
            onClick={createCustomTable}
            className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Insert {rows} × {cols} Table</span>
          </button>
        </div>
      </div>

      {/* Ready-made Table Presets */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Document Table Presets
        </h3>
        <div className="space-y-2">
          <button
            onClick={addMedicalPrescriptionTable}
            className="w-full p-2.5 bg-white border border-slate-200 hover:border-blue-400 rounded-xl text-left transition-all hover:shadow-2xs group flex items-start gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                Medical Rx Table
              </div>
              <div className="text-[11px] text-slate-400">
                Medicine, Dosage, Frequency & Duration
              </div>
            </div>
          </button>

          <button
            onClick={addInvoiceTable}
            className="w-full p-2.5 bg-white border border-slate-200 hover:border-blue-400 rounded-xl text-left transition-all hover:shadow-2xs group flex items-start gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                Invoice Breakdown Table
              </div>
              <div className="text-[11px] text-slate-400">
                Item description, Qty, Rate & Total
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              onAddTableElement({
                rows: 3,
                cols: 2,
                colWidths: [40, 60],
                data: [
                  [{ text: 'Parameter', bold: true }, { text: 'Clinical Findings', bold: true }],
                  [{ text: 'Blood Pressure' }, { text: '120/80 mmHg (Normal)' }],
                  [{ text: 'Pulse Rate' }, { text: '74 bpm (Regular)' }],
                ],
                headerRow: true,
                headerBg: '#0f766e',
                headerColor: '#ffffff',
                borderColor: '#99f6e4',
                borderWidth: 1,
                cellPadding: 6,
                width: 450,
                height: 110,
              });
            }}
            className="w-full p-2.5 bg-white border border-slate-200 hover:border-blue-400 rounded-xl text-left transition-all hover:shadow-2xs group flex items-start gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                Vitals / Report Findings Table
              </div>
              <div className="text-[11px] text-slate-400">
                2-column patient parameters & test values
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
