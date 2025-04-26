declare module 'jspdf-autotable' {
    import { jsPDF } from 'jspdf';
  
    interface AutoTableOptions {
      head?: string[][];
      body?: string[][];
      foot?: string[][];
      startY?: number;
      margin?: number|{top?: number, right?: number, bottom?: number, left?: number};
      tableWidth?: 'auto'|'wrap'|number;
      showHead?: 'everyPage'|'firstPage'|'lastPage'|'never';
      showFoot?: 'everyPage'|'firstPage'|'lastPage'|'never';
      tableLineColor?: number|number[];
      tableLineWidth?: number;
      styles?: {
        cellPadding?: number;
        fontSize?: number;
        font?: string;
        fontStyle?: string;
        lineColor?: number|number[];
        lineWidth?: number;
        textColor?: number|number[];
        fillColor?: number|number[];
        halign?: 'left'|'center'|'right';
        valign?: 'top'|'middle'|'bottom';
      };
      columnStyles?: {
        [key: string]: {
          cellWidth?: 'auto'|'wrap'|number;
          minCellWidth?: number;
          halign?: 'left'|'center'|'right';
          valign?: 'top'|'middle'|'bottom';
        };
      };
      didParseCell?: (data: any) => void;
      didDrawCell?: (data: any) => void;
      willDrawCell?: (data: any) => void;
    }
  
    export default function autoTable(doc: jsPDF, options: AutoTableOptions): jsPDF;
    export default function autoTable(doc: jsPDF, columns: string[], rows: string[][], options?: AutoTableOptions): jsPDF;
  }