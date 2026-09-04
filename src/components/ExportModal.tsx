import React from 'react';
import { BundeslandData, WhiteSpotCluster, GroundRegistrySite, OverpassPoi, Language, MetricUnit } from '../types';
import { exportFullExcelWorkbook, exportGeoJson, generatePdfReport } from '../utils/exportUtils';
import { 
  Download, 
  X, 
  FileSpreadsheet, 
  FileText, 
  Map, 
  CheckCircle2, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bundeslaender: BundeslandData[];
  whiteSpots: WhiteSpotCluster[];
  groundRegistry: GroundRegistrySite[];
  overpassPois: OverpassPoi[];
  lang: Language;
  unit: MetricUnit;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  bundeslaender,
  whiteSpots,
  groundRegistry,
  overpassPois,
  lang,
  unit,
}) => {
  if (!isOpen) return null;

  const handleExportExcel = () => {
    exportFullExcelWorkbook(bundeslaender, whiteSpots, groundRegistry, overpassPois, unit);
    onClose();
  };

  const handleExportGeoJson = () => {
    exportGeoJson(whiteSpots, groundRegistry);
    onClose();
  };

  const handleExportPdf = () => {
    generatePdfReport(bundeslaender, whiteSpots, lang);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-purple-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-slate-800 relative">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-purple-100">
          <div>
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">
              DATENEXPORT & REPORTING
            </span>
            <h3 className="font-extrabold text-base text-purple-950 mt-1.5">
              {lang === 'de' ? 'Marktberichte & Rohdaten exportieren' : 'Export Market Reports & Raw Data'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Options Cards */}
        <div className="space-y-3 text-xs">
          
          {/* Excel Workbook */}
          <button
            onClick={handleExportExcel}
            className="w-full p-4 bg-purple-50/40 hover:bg-purple-50 border border-purple-200 hover:border-purple-400 rounded-xl flex items-start space-x-3.5 text-left transition-all group cursor-pointer"
          >
            <div className="p-2.5 bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-700 shrink-0 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 group-hover:text-purple-700 flex items-center space-x-1.5">
                <span>Excel-Arbeitsmappe (.XLSX)</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold">4 Sheets</span>
              </div>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">
                {lang === 'de'
                  ? 'Vollständige Datensätze: 16 Bundesländer-Bilanzen, alle 30+ White-Spot-Korridore, Ground Registry und geerntete OSM POIs.'
                  : 'Complete dataset: 16 Federal states balance, all 30+ opportunity clusters, ground registry, and OSM POIs.'}
              </p>
            </div>
          </button>

          {/* Executive PDF Report */}
          <button
            onClick={handleExportPdf}
            className="w-full p-4 bg-purple-50/40 hover:bg-purple-50 border border-purple-200 hover:border-purple-400 rounded-xl flex items-start space-x-3.5 text-left transition-all group cursor-pointer"
          >
            <div className="p-2.5 bg-rose-100 border border-rose-200 rounded-xl text-rose-700 shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 group-hover:text-purple-700 flex items-center space-x-1.5">
                <span>Executive Management Report (.PDF)</span>
                <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[9px] font-mono font-bold">DIN A4 Quer</span>
              </div>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">
                {lang === 'de'
                  ? 'Druckreifer PDF-Strategiebericht mit Bundesländer-Tabellen, Defizit-Risikoindizes und Top-White-Spot Prioritäten.'
                  : 'Print-ready executive summary with state balances, deficit risks, and prioritized opportunity matrices.'}
              </p>
            </div>
          </button>

          {/* GeoJSON GIS Layer */}
          <button
            onClick={handleExportGeoJson}
            className="w-full p-4 bg-purple-50/40 hover:bg-purple-50 border border-purple-200 hover:border-purple-400 rounded-xl flex items-start space-x-3.5 text-left transition-all group cursor-pointer"
          >
            <div className="p-2.5 bg-purple-100 border border-purple-200 rounded-xl text-purple-700 shrink-0 group-hover:scale-105 transition-transform">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 group-hover:text-purple-700 flex items-center space-x-1.5">
                <span>GIS Geodaten (.GEOJSON)</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-mono font-bold">QGIS / ArcGIS</span>
              </div>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">
                {lang === 'de'
                  ? 'Kompatibel mit QGIS, ArcGIS und Mapbox für räumliche Gebietsplanung und Vertriebsgebiets-Zuschnitte.'
                  : 'Compatible with QGIS, ArcGIS, and Mapbox for spatial planning and sales territory zoning.'}
              </p>
            </div>
          </button>

        </div>

        <div className="pt-2 border-t border-purple-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            {lang === 'de' ? 'Schließen' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
