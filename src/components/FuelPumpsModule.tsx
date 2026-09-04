import React, { useState, useMemo } from 'react';
import { 
  Fuel, 
  Target, 
  Activity, 
  TrendingUp, 
  Truck, 
  Zap, 
  DollarSign, 
  SlidersHorizontal, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Clock, 
  Droplets, 
  Leaf, 
  Search, 
  ArrowUpRight, 
  Layers, 
  Building2, 
  Flame,
  Info,
  ExternalLink,
  Percent,
  Compass
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ComposedChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { 
  GERMAN_FUEL_MACRO_METRICS, 
  MTSK_PRICING_BENCHMARKS, 
  HOURLY_PRICE_CYCLE_DATA, 
  REPRESENTATIVE_FUEL_STATIONS, 
  FUEL_WHITE_SPOT_CLUSTERS 
} from '../data/fuelPumpsData';
import { FuelStationRecord, FuelWhiteSpotCluster, Language, MetricUnit } from '../types';

interface FuelPumpsModuleProps {
  lang: Language;
  unit: MetricUnit;
  onSelectCluster?: (ws: FuelWhiteSpotCluster) => void;
}

export const FuelPumpsModule: React.FC<FuelPumpsModuleProps> = ({ lang, unit, onSelectCluster }) => {
  const [activeSubView, setActiveSubView] = useState<'white_spots' | 'infrastructure' | 'pricing' | 'calculator'>('white_spots');
  const [selectedGapType, setSelectedGapType] = useState<string>('ALL');
  const [selectedCorridor, setSelectedCorridor] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWhiteSpot, setSelectedWhiteSpot] = useState<FuelWhiteSpotCluster>(FUEL_WHITE_SPOT_CLUSTERS[0]);
  const [selectedStation, setSelectedStation] = useState<FuelStationRecord | null>(null);

  // ROI Calculator Parameters
  const [simDailyThroughputM3, setSimDailyThroughputM3] = useState<number>(45); // m3 per day = 45,000 Litres
  const [simHvo100SharePercent, setSimHvo100SharePercent] = useState<number>(30); // 30% HVO100
  const [simFuelMarginCent, setSimFuelMarginCent] = useState<number>(7.5); // cent per litre
  const [simHvo100MarginCent, setSimHvo100MarginCent] = useState<number>(11.5); // cent per litre
  const [simLubeTopupRate, setSimLubeTopupRate] = useState<number>(1.8); // 1.8 Litres top-up oil sold per 1,000L fuel
  const [simLubeMarginEur, setSimLubeMarginEur] = useState<number>(7.20); // € margin per 1L top-up bottle
  const [simCapexEur, setSimCapexEur] = useState<number>(1250000); // 1.25M € installation

  // Filtered White Spots
  const filteredWhiteSpots = useMemo(() => {
    return FUEL_WHITE_SPOT_CLUSTERS.filter((ws) => {
      if (selectedGapType !== 'ALL' && ws.gapType !== selectedGapType) return false;
      if (selectedCorridor !== 'ALL' && !ws.corridor.includes(selectedCorridor)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ws.name.toLowerCase().includes(q) ||
          ws.corridor.toLowerCase().includes(q) ||
          ws.bundeslandName.toLowerCase().includes(q) ||
          ws.strategicJustificationDe.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedGapType, selectedCorridor, searchQuery]);

  // Filtered Stations
  const filteredStations = useMemo(() => {
    return REPRESENTATIVE_FUEL_STATIONS.filter((st) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          st.name.toLowerCase().includes(q) ||
          st.brand.toLowerCase().includes(q) ||
          st.city.toLowerCase().includes(q) ||
          st.corridorHighway.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery]);

  // Total Unserved Daily Potential
  const totalUnservedVolumeM3 = useMemo(() => {
    return FUEL_WHITE_SPOT_CLUSTERS.reduce((acc, ws) => acc + ws.dailyUnservedVolumePotentialM3, 0);
  }, []);

  const totalUnservedRevenueEur = useMemo(() => {
    return FUEL_WHITE_SPOT_CLUSTERS.reduce((acc, ws) => acc + ws.annualRevenuePotentialEur, 0);
  }, []);

  // ROI Calculator Calculations
  const calculatedMetrics = useMemo(() => {
    const dailyLitres = simDailyThroughputM3 * 1000;
    const dailyHvoLitres = dailyLitres * (simHvo100SharePercent / 100);
    const dailyDieselLitres = dailyLitres - dailyHvoLitres;

    // Fuel Gross Margin
    const dailyDieselMarginEur = dailyDieselLitres * (simFuelMarginCent / 100);
    const dailyHvoMarginEur = dailyHvoLitres * (simHvo100MarginCent / 100);
    const annualFuelMarginEur = (dailyDieselMarginEur + dailyHvoMarginEur) * 365;

    // Lubricant Cross-Selling
    const dailyLubeLitres = (dailyLitres / 1000) * simLubeTopupRate;
    const annualLubeMarginEur = dailyLubeLitres * simLubeMarginEur * 365;

    // Total Gross Margin
    const annualGrossProfitEur = annualFuelMarginEur + annualLubeMarginEur;
    
    // Operating OPEX (Electricity, maintenance, terminal fees, insurance ~ 35%)
    const annualOpexEur = annualGrossProfitEur * 0.32;
    const annualNetOperatingProfitEur = annualGrossProfitEur - annualOpexEur;

    // Payback Period (years)
    const paybackYears = simCapexEur > 0 ? (simCapexEur / Math.max(1, annualNetOperatingProfitEur)) : 0;
    const roi5YearPercent = simCapexEur > 0 ? (((annualNetOperatingProfitEur * 5) - simCapexEur) / simCapexEur) * 100 : 0;

    // Annual CO2 Reduction by HVO100 (approx 2.68 kg CO2/L saved at 90% abatement)
    const annualCo2SavedTonnes = (dailyHvoLitres * 365 * 2.68 * 0.90) / 1000;

    return {
      dailyLitres,
      dailyDieselLitres,
      dailyHvoLitres,
      annualFuelMarginEur,
      annualLubeMarginEur,
      annualGrossProfitEur,
      annualOpexEur,
      annualNetOperatingProfitEur,
      paybackYears: paybackYears.toFixed(1),
      roi5YearPercent: Math.round(roi5YearPercent),
      annualCo2SavedTonnes: Math.round(annualCo2SavedTonnes),
    };
  }, [
    simDailyThroughputM3,
    simHvo100SharePercent,
    simFuelMarginCent,
    simHvo100MarginCent,
    simLubeTopupRate,
    simLubeMarginEur,
    simCapexEur,
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Mission Banner */}
      <div className="bg-white border border-purple-200 rounded-3xl p-6 lg:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full text-xs font-mono text-purple-900 font-semibold">
              <Fuel className="w-3.5 h-3.5 text-purple-600" />
              <span>{lang === 'de' ? 'KRAFTSTOFF- & ZAPFSÄULEN-INTELLIGENCE' : 'FUEL PUMP & DISPENSER INTELLIGENCE'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight uppercase">
              {lang === 'de' 
                ? 'Kraftstoff-White-Spots & Zapfsäulen-Infrastruktur' 
                : 'Fuel White-Spots & Dispenser Infrastructure'}
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              {lang === 'de'
                ? 'Strategische Analyse der 14.210 deutschen Tankstellen, Hochleistungs-Zapfsäulen (130-150 L/min), HVO100-Transformationslücken, AdBlue-Abgabe sowie unversorgter Schwerlast-Korridore (A1-A20).'
                : 'Strategic mapping of 14,210 German fuel stations, high-flow LKW dispensers (130-150 L/min), HVO100 transition gaps, bulk AdBlue nozzles, and unserved heavy freight corridors (A1-A20).'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveSubView('white_spots')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeSubView === 'white_spots'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>{lang === 'de' ? '10+ KRAFTSTOFF WHITE-SPOTS' : '10+ FUEL WHITE-SPOTS'}</span>
            </button>
            <button
              onClick={() => setActiveSubView('infrastructure')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeSubView === 'infrastructure'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === 'de' ? 'ZAPFSÄULEN & NETZWERK' : 'DISPENSERS & NETWORKS'}</span>
            </button>
            <button
              onClick={() => setActiveSubView('pricing')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeSubView === 'pricing'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>{lang === 'de' ? 'MTS-K PREIS-RADAR' : 'MTS-K PRICE RADAR'}</span>
            </button>
            <button
              onClick={() => setActiveSubView('calculator')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeSubView === 'calculator'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{lang === 'de' ? 'ROI- & TANK-RECHNER' : 'ROI CALCULATOR'}</span>
            </button>
          </div>
        </div>

        {/* Macro Telemetry KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-purple-100 text-xs">
          <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
            <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
              {lang === 'de' ? 'Tankstellen Deutschland' : 'German Fuel Stations'}
            </span>
            <div className="text-base font-black text-purple-950 font-mono mt-0.5">
              {GERMAN_FUEL_MACRO_METRICS.totalFuelStationsDe.toLocaleString()}
            </div>
            <span className="text-[9px] text-purple-700 font-mono">395 Autobahn / 410 Autohöfe</span>
          </div>

          <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
            <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
              {lang === 'de' ? 'Lkw High-Flow Säulen' : 'LKW High-Flow Pumps'}
            </span>
            <div className="text-base font-black text-purple-950 font-mono mt-0.5">
              {GERMAN_FUEL_MACRO_METRICS.lkwHighFlowPumpSharePercent}%
            </div>
            <span className="text-[9px] text-emerald-700 font-mono">130-150 L/min Durchfluss</span>
          </div>

          <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
            <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
              {lang === 'de' ? 'HVO100 Zapfsäulen' : 'HVO100 Dispenser Share'}
            </span>
            <div className="text-base font-black text-amber-700 font-mono mt-0.5">
              {GERMAN_FUEL_MACRO_METRICS.hvo100AdoptionRatePercent}%
            </div>
            <span className="text-[9px] text-amber-800 font-mono font-bold">Akuter White-Spot Bedarf</span>
          </div>

          <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
            <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
              {lang === 'de' ? 'AdBlue Zapfsäulen (Lkw)' : 'AdBlue Bulk Pumps'}
            </span>
            <div className="text-base font-black text-purple-950 font-mono mt-0.5">
              {GERMAN_FUEL_MACRO_METRICS.adblueBulkPumpSharePercent}%
            </div>
            <span className="text-[9px] text-slate-600 font-mono">Rest nutzt 10L Kanister</span>
          </div>

          <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
            <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
              {lang === 'de' ? 'Autobahn-Aufschlag' : 'Motorway Surcharge'}
            </span>
            <div className="text-base font-black text-rose-700 font-mono mt-0.5">
              +{GERMAN_FUEL_MACRO_METRICS.avgHighwaySurchargeCentPerLitre} ct/L
            </div>
            <span className="text-[9px] text-emerald-700 font-mono">Autohof spart 25 ct/L</span>
          </div>

          <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
            <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
              {lang === 'de' ? 'Unversorgtes Potenzial' : 'Unserved Gap Volume'}
            </span>
            <div className="text-base font-black text-purple-950 font-mono mt-0.5">
              {totalUnservedVolumeM3} m³/Tag
            </div>
            <span className="text-[9px] text-purple-700 font-mono">€{(totalUnservedRevenueEur / 1000000).toFixed(1)}M / Jahr</span>
          </div>
        </div>
      </div>

      {/* SUBVIEW 1: FUEL WHITE SPOTS & CORRIDOR DEFICITS */}
      {activeSubView === 'white_spots' && (
        <div className="space-y-6">
          
          {/* Filter & Control Bar */}
          <div className="bg-white border border-purple-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-500 font-semibold uppercase">
                {lang === 'de' ? 'Versorgungslücke:' : 'Deficit Type:'}
              </span>
              <button
                onClick={() => setSelectedGapType('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  selectedGapType === 'ALL' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                }`}
              >
                {lang === 'de' ? 'ALLE LÜCKEN (10)' : 'ALL GAPS (10)'}
              </button>
              <button
                onClick={() => setSelectedGapType('HVO100_DEFICIT')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  selectedGapType === 'HVO100_DEFICIT' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                🌱 HVO100 Klimadiesel
              </button>
              <button
                onClick={() => setSelectedGapType('LKW_HIGHSPEED_DEFICIT')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  selectedGapType === 'LKW_HIGHSPEED_DEFICIT' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                }`}
              >
                🚚 Lkw 150L/min High-Flow
              </button>
              <button
                onClick={() => setSelectedGapType('ADBLUE_BULK_DEFICIT')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  selectedGapType === 'ADBLUE_BULK_DEFICIT' ? 'bg-cyan-600 text-white' : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
                }`}
              >
                💧 AdBlue Zapfsäulen
              </button>
              <button
                onClick={() => setSelectedGapType('BIO_LNG_DEFICIT')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  selectedGapType === 'BIO_LNG_DEFICIT' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                }`}
              >
                ❄️ Bio-LNG Kältegas
              </button>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-purple-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'de' ? 'Korridor, Ort, A14, A20...' : 'Corridor, city, A14, A20...'}
                className="w-full pl-9 pr-3 py-1.5 bg-purple-50/50 border border-purple-200 rounded-xl text-xs text-slate-900 placeholder-purple-400 font-mono focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          {/* Master Detail Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* White Spot Cards List (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-purple-950 font-bold px-1">
                <span>{lang === 'de' ? 'IDENTIFIZIERTE KRAFTSTOFF-LÜCKEN' : 'IDENTIFIED FUEL DEFICIT CORRIDORS'}</span>
                <span className="text-purple-600">{filteredWhiteSpots.length} Standorte</span>
              </div>

              <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredWhiteSpots.map((ws) => {
                  const isSelected = selectedWhiteSpot.id === ws.id;
                  return (
                    <div
                      key={ws.id}
                      onClick={() => setSelectedWhiteSpot(ws)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-purple-50/90 border-purple-600 shadow-md ring-1 ring-purple-600'
                          : 'bg-white border-purple-200 hover:border-purple-300 hover:bg-purple-50/30 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-200/80 text-purple-900">
                              {ws.corridor}
                            </span>
                            <span
                              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                                ws.deficitSeverity === 'CRITICAL'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {ws.deficitSeverity === 'CRITICAL' ? 'AKUT DEFICIT' : 'HOCH POTENZIAL'}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-slate-900 mt-1.5 leading-snug">
                            {ws.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {ws.bundeslandName} • {ws.nearestAlternativeDistanceKm} km bis zur nächsten Alternative
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-purple-100 text-[10px] font-mono">
                        <div>
                          <span className="text-slate-500 uppercase block text-[8px]">Unversorgt:</span>
                          <span className="font-bold text-purple-950">{ws.dailyUnservedVolumePotentialM3} m³/Tag</span>
                        </div>
                        <div>
                          <span className="text-slate-500 uppercase block text-[8px]">Umsatz-Potenzial:</span>
                          <span className="font-bold text-emerald-700">€{(ws.annualRevenuePotentialEur / 1000000).toFixed(1)}M/a</span>
                        </div>
                        <div>
                          <span className="text-slate-500 uppercase block text-[8px]">Amortisation:</span>
                          <span className="font-bold text-purple-700">{ws.paybackYears} Jahre</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* White Spot Deep-Dive Dossier (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white border border-purple-200 rounded-3xl p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="status-badge bg-purple-600 text-white font-mono font-bold text-xs">
                        {selectedWhiteSpot.corridor}
                      </span>
                      <span className="text-xs font-mono text-purple-800 font-bold">
                        {selectedWhiteSpot.bundeslandName}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-purple-950 mt-1 uppercase">
                      {selectedWhiteSpot.name}
                    </h2>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-right font-mono">
                      <span className="text-[9px] text-slate-500 uppercase block font-semibold">Investitions-CapEx</span>
                      <span className="text-base font-black text-purple-950">€{(selectedWhiteSpot.estimatedCapexEur / 1000000).toFixed(2)}M</span>
                    </span>
                  </div>
                </div>

                {/* Justification & Commercial Background */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-black uppercase text-purple-950 flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{lang === 'de' ? 'STRATEGISCHE BEDARFS-BEGRÜNDUNG' : 'STRATEGIC DEFICIT JUSTIFICATION'}</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-purple-50/40 p-4 rounded-2xl border border-purple-100">
                    {lang === 'de' ? selectedWhiteSpot.strategicJustificationDe : selectedWhiteSpot.strategicJustificationEn}
                  </p>
                </div>

                {/* Industrial Anchor Zones & Target Fleets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-4 bg-purple-50/30 rounded-2xl border border-purple-100 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">
                      {lang === 'de' ? 'Anker-Gewerbegebiete & Frachtkunden' : 'Industrial Anchors & Freight Customers'}
                    </span>
                    <ul className="space-y-1 text-slate-800">
                      {selectedWhiteSpot.industrialAnchorZones.map((anchor, i) => (
                        <li key={i} className="flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{anchor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-50/30 rounded-2xl border border-purple-100 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">
                      {lang === 'de' ? 'Empfohlenes Zapfsäulen-Setup' : 'Recommended Dispenser Setup'}
                    </span>
                    <p className="text-slate-800 leading-snug">
                      {selectedWhiteSpot.recommendedDispenserSetup}
                    </p>
                    <div className="pt-2 flex items-center space-x-2 text-[10px]">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                        {selectedWhiteSpot.targetedFleetCount} LKWs / Tag
                      </span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold">
                        HVO100 Ready
                      </span>
                    </div>
                  </div>
                </div>

                {/* Corridor Deficit Breakdown Chart */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-black uppercase text-purple-950">
                    {lang === 'de' ? 'VOLUMEN- & AMORTISATIONS-VERGLEICH (TOP KORRIDORE)' : 'VOLUME & PAYBACK COMPARISON (TOP CORRIDORS)'}
                  </h4>
                  <div className="h-56 bg-purple-50/20 p-2 rounded-2xl border border-purple-100">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={FUEL_WHITE_SPOT_CLUSTERS.map(c => ({
                          name: c.corridor.split(' ')[0],
                          volumeM3: c.dailyUnservedVolumePotentialM3,
                          payback: c.paybackYears,
                          capexM: +(c.estimatedCapexEur / 1000000).toFixed(2),
                        }))}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" vertical={false} />
                        <XAxis dataKey="name" stroke="#6b21a8" fontSize={10} fontStyle="bold" />
                        <YAxis yAxisId="left" stroke="#6b21a8" fontSize={10} />
                        <YAxis yAxisId="right" orientation="right" stroke="#15803d" fontSize={10} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#ffffff', borderColor: '#d8b4fe', borderRadius: '12px', fontSize: '11px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Bar yAxisId="left" dataKey="volumeM3" name={lang === 'de' ? 'Unversorgtes Volumen (m³/Tag)' : 'Unserved Volume (m³/day)'} fill="#9333ea" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="payback" name={lang === 'de' ? 'Amortisation (Jahre)' : 'Payback (Years)'} stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBVIEW 2: FUEL PUMP INFRASTRUCTURE & NETWORK DIRECTORY */}
      {activeSubView === 'infrastructure' && (
        <div className="space-y-6">
          
          {/* Dispenser Tech Specs & Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-white border border-purple-200 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-purple-900">
                <Truck className="w-4 h-4 text-purple-600" />
                <h4 className="font-black uppercase text-sm">Lkw High-Speed Säule (130-150 L/min)</h4>
              </div>
              <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                Zwei-Seiten Master/Satellite-Betankung für Lkw-Tanks (bis 1.200 Liter). Reduziert Tankzeiten von 28 Minuten auf unter 8 Minuten.
              </p>
              <div className="pt-2 border-t border-purple-100 flex items-center justify-between font-bold text-[10px]">
                <span className="text-purple-700">Verbreitung: 28.6%</span>
                <span className="text-emerald-700">Flotten-Pflicht</span>
              </div>
            </div>

            <div className="bg-white border border-purple-200 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-emerald-900">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <h4 className="font-black uppercase text-sm">HVO100 Klimadiesel (DIN EN 15940)</h4>
              </div>
              <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                100% Paraffinischer Kraftstoff aus Altspeiseölen. Ermöglicht 90% Scope-1 CO2-Einsparung bei voller OEM-Freigabe für Euro-6 LKWs.
              </p>
              <div className="pt-2 border-t border-purple-100 flex items-center justify-between font-bold text-[10px]">
                <span className="text-amber-700">Verbreitung: 8.4%</span>
                <span className="text-emerald-700">+11.4 ct/L Marge</span>
              </div>
            </div>

            <div className="bg-white border border-purple-200 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-cyan-900">
                <Droplets className="w-4 h-4 text-cyan-600" />
                <h4 className="font-black uppercase text-sm">Bulk AdBlue Lkw-Dispenser</h4>
              </div>
              <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                Integrierte 40L/min AdBlue-Zapfsäule direkt an der Diesel-Insel. Beheizte Leitungen und 10-15m³ Unterflurtanks für Winterbetrieb.
              </p>
              <div className="pt-2 border-t border-purple-100 flex items-center justify-between font-bold text-[10px]">
                <span className="text-purple-700">Verbreitung: 34.2%</span>
                <span className="text-emerald-700">+22.9 ct/L Marge</span>
              </div>
            </div>
          </div>

          {/* Representative Fuel Stations Directory Table */}
          <div className="bg-white border border-purple-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 bg-purple-50/50 border-b border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Fuel className="w-4 h-4 text-purple-600" />
                <h3 className="font-black text-xs uppercase text-purple-950 font-mono">
                  {lang === 'de' ? 'REPRÄSENTATIVE KRAFTSTOFF- & AUTOHOF-STATIONEN' : 'REPRESENTATIVE FUEL STATIONS & AUTOHÖFE'}
                </h3>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-purple-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'de' ? 'Station, Marke, A7, A9...' : 'Station, brand, A7, A9...'}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs text-slate-900 placeholder-purple-400 font-mono focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs">
                <thead className="bg-purple-50/80 text-purple-950 font-mono text-[10px] uppercase border-b border-purple-200">
                  <tr>
                    <th className="py-3 px-4">{lang === 'de' ? 'Station & Betreiber' : 'Station & Operator'}</th>
                    <th className="py-3 px-3.5">{lang === 'de' ? 'Korridor' : 'Corridor'}</th>
                    <th className="py-3 px-3.5">{lang === 'de' ? 'Typ' : 'Type'}</th>
                    <th className="py-3 px-3.5 text-right">{lang === 'de' ? 'Durchsatz (m³/Tag)' : 'Throughput (m³/day)'}</th>
                    <th className="py-3 px-3.5 text-center">HVO100</th>
                    <th className="py-3 px-3.5 text-center">Lkw High-Flow</th>
                    <th className="py-3 px-3.5 text-center">AdBlue Bulk</th>
                    <th className="py-3 px-3.5 text-right">{lang === 'de' ? 'Diesel Preis' : 'Diesel Price'}</th>
                    <th className="py-3 px-3.5 text-right">{lang === 'de' ? 'HVO100 Preis' : 'HVO100 Price'}</th>
                    <th className="py-3 px-3.5 text-right">{lang === 'de' ? 'Lkw-Parkplätze' : 'Truck Parking'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100 font-mono text-[11px]">
                  {filteredStations.map((st) => (
                    <tr key={st.id} className="hover:bg-purple-50/60 transition-colors">
                      <td className="py-3 px-4 font-sans">
                        <div className="font-bold text-slate-900">{st.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{st.city} ({st.bundeslandName}) • {st.brand}</div>
                      </td>
                      <td className="py-3 px-3.5 font-bold text-purple-900">{st.corridorHighway}</td>
                      <td className="py-3 px-3.5">
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-800 rounded border border-purple-200 text-[10px]">
                          {st.stationType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right font-bold text-slate-900">{st.dailyThroughputM3} m³</td>
                      <td className="py-3 px-3.5 text-center">
                        {st.hvo100Available ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[9px]">JA / ONLINE</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[9px]">NEIN (LÜCKE)</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        {st.lkwHighSpeedDieselAvailable ? (
                          <span className="text-emerald-700 font-bold">130 L/min ✓</span>
                        ) : (
                          <span className="text-slate-400">40 L/min</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        {st.adblueBulkAvailable ? (
                          <span className="text-cyan-700 font-bold">Säule ✓</span>
                        ) : (
                          <span className="text-amber-700">Kanister</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-right font-bold text-slate-900">€{st.pricePerLitreDiesel.toFixed(3)}</td>
                      <td className="py-3 px-3.5 text-right font-bold text-emerald-800">
                        {st.pricePerLitreHvo100 > 0 ? `€${st.pricePerLitreHvo100.toFixed(3)}` : '-'}
                      </td>
                      <td className="py-3 px-3.5 text-right font-bold text-purple-900">{st.truckParkingSpots}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUBVIEW 3: MTS-K PRICING RADAR & HIGHWAY SPREADS */}
      {activeSubView === 'pricing' && (
        <div className="space-y-6">
          
          {/* Price Benchmark Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MTSK_PRICING_BENCHMARKS.map((pb) => (
              <div key={pb.fuelType} className="bg-white border border-purple-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Markttransparenzstelle (MTS-K)</span>
                    <h4 className="font-black text-sm text-purple-950">{pb.label}</h4>
                  </div>
                  <span className="status-badge bg-purple-100 text-purple-900 border border-purple-200 font-mono font-bold text-xs">
                    €{pb.nationalAvgPriceEur.toFixed(3)} / L
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-purple-100 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Autobahn-Raststätte:</span>
                    <span className="font-bold text-rose-700">€{pb.autobahnAvgPriceEur.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Autohof (Abfahrt):</span>
                    <span className="font-bold text-emerald-700">€{pb.autohofAvgPriceEur.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stadt / Freie Tankstelle:</span>
                    <span className="font-bold text-slate-800">€{pb.cityOffHighwayAvgPriceEur.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-purple-100/60">
                    <span className="text-purple-700 font-bold">Tankstellen-Marge:</span>
                    <span className="font-black text-purple-900">{pb.stationGrossMarginCentPerLitre} ct / L</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Diurnal Hourly Price Fluctuation Curve */}
          <div className="bg-white border border-purple-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-black text-sm uppercase text-purple-950 font-mono flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>{lang === 'de' ? '24-STUNDEN PREIS- & VERKEHRSVERLAUF (DIURNALE PREISKURVE)' : '24-HOUR DIURNAL PRICE & TRAFFIC CYCLE'}</span>
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  {lang === 'de' 
                    ? 'Typischer Preisverlauf in Deutschland: Tiefpreis-Fenster zwischen 18:00 und 22:00 Uhr (-16 ct/L vs. Morgenspitze um 06:00 Uhr).'
                    : 'Typical German price cycle: Valley window between 18:00 and 22:00 (-16 ct/L vs. 06:00 morning peak).'}
                </p>
              </div>
              <span className="status-badge bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold text-xs">
                Tages-Schwankung: 14.5 ct/L
              </span>
            </div>

            <div className="h-72 bg-purple-50/20 p-3 rounded-2xl border border-purple-100">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={HOURLY_PRICE_CYCLE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" vertical={false} />
                  <XAxis dataKey="hour" stroke="#6b21a8" fontSize={11} fontStyle="bold" />
                  <YAxis yAxisId="price" domain={[1.50, 1.90]} stroke="#6b21a8" fontSize={11} />
                  <YAxis yAxisId="traffic" orientation="right" stroke="#9333ea" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#d8b4fe', borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area yAxisId="traffic" type="monotone" dataKey="trafficVolume" name={lang === 'de' ? 'Verkehrsaufkommen (%)' : 'Traffic Volume (%)'} fill="#f3e8ff" stroke="#d8b4fe" />
                  <Line yAxisId="price" type="monotone" dataKey="priceDiesel" name="Diesel (€/L)" stroke="#9333ea" strokeWidth={3} dot={{ r: 4 }} />
                  <Line yAxisId="price" type="monotone" dataKey="priceE10" name="Super E10 (€/L)" stroke="#059669" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* SUBVIEW 4: FUEL STATION GREENFIELD & RETROFIT ROI CALCULATOR */}
      {activeSubView === 'calculator' && (
        <div className="space-y-6">
          
          <div className="bg-white border border-purple-200 rounded-3xl p-6 lg:p-8 shadow-xs space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full text-xs font-mono text-purple-900 font-semibold">
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
                <span>{lang === 'de' ? 'INVESTITIONS- & TRANSFORMATIONSSIMULATOR' : 'GREENFIELD & RETROFIT ROI SIMULATOR'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-purple-950 uppercase tracking-tight">
                {lang === 'de' ? 'Wirtschaftlichkeits-Rechner für White-Spot Tankstellen' : 'Fuel Station White Spot ROI & Margin Calculator'}
              </h2>
              <p className="text-xs text-slate-600 max-w-3xl">
                {lang === 'de'
                  ? 'Kalkulieren Sie die Amortisation neuer Hochleistungs-Zapfsäulen (HVO100, High-Flow Diesel, AdBlue) inklusive Schmierstoff-Cross-Selling und CO2-Einsparungen.'
                  : 'Simulate financial payback for deploying high-speed dispensers (HVO100, High-Flow Diesel, AdBlue) including lubricant cross-selling and carbon abatement.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-purple-100">
              
              {/* Sliders Input Panel (6 Cols) */}
              <div className="lg:col-span-6 space-y-5 font-mono text-xs">
                
                <div className="space-y-2 bg-purple-50/40 p-4 rounded-2xl border border-purple-100">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700">{lang === 'de' ? 'Täglicher Gesamtdurchsatz:' : 'Daily Fuel Throughput:'}</span>
                    <span className="text-purple-950 font-black">{simDailyThroughputM3} m³/Tag ({simDailyThroughputM3 * 1000} Liter)</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="100"
                    step="5"
                    value={simDailyThroughputM3}
                    onChange={(e) => setSimDailyThroughputM3(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>15 m³ (Kleiner Cardlock)</span>
                    <span>50 m³ (Autohof)</span>
                    <span>100 m³ (Mega-Hub)</span>
                  </div>
                </div>

                <div className="space-y-2 bg-purple-50/40 p-4 rounded-2xl border border-purple-100">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700">{lang === 'de' ? 'HVO100 / Klimadiesel Anteil:' : 'HVO100 Renewable Diesel Share:'}</span>
                    <span className="text-emerald-700 font-black">{simHvo100SharePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    value={simHvo100SharePercent}
                    onChange={(e) => setSimHvo100SharePercent(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>0% (Nur B7)</span>
                    <span>30% (ESG Standard)</span>
                    <span>80% (Green Fleet Hub)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5 bg-purple-50/40 p-3 rounded-2xl border border-purple-100">
                    <span className="text-slate-700 font-bold block text-[10px]">Diesel Marge (ct/L):</span>
                    <input
                      type="number"
                      step="0.5"
                      value={simFuelMarginCent}
                      onChange={(e) => setSimFuelMarginCent(Number(e.target.value))}
                      className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1 font-mono font-bold text-purple-950 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5 bg-purple-50/40 p-3 rounded-2xl border border-purple-100">
                    <span className="text-slate-700 font-bold block text-[10px]">HVO100 Marge (ct/L):</span>
                    <input
                      type="number"
                      step="0.5"
                      value={simHvo100MarginCent}
                      onChange={(e) => setSimHvo100MarginCent(Number(e.target.value))}
                      className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1 font-mono font-bold text-emerald-800 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5 bg-purple-50/40 p-3 rounded-2xl border border-purple-100">
                    <span className="text-slate-700 font-bold block text-[10px]">Öl Cross-Sell (L / 1000L Fuel):</span>
                    <input
                      type="number"
                      step="0.2"
                      value={simLubeTopupRate}
                      onChange={(e) => setSimLubeTopupRate(Number(e.target.value))}
                      className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1 font-mono font-bold text-purple-950 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5 bg-purple-50/40 p-3 rounded-2xl border border-purple-100">
                    <span className="text-slate-700 font-bold block text-[10px]">Investition CapEx (€):</span>
                    <input
                      type="number"
                      step="50000"
                      value={simCapexEur}
                      onChange={(e) => setSimCapexEur(Number(e.target.value))}
                      className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1 font-mono font-bold text-purple-950 text-xs"
                    />
                  </div>
                </div>

              </div>

              {/* Calculated Outputs & Financial Dashboard (6 Cols) */}
              <div className="lg:col-span-6 space-y-4">
                
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-4 bg-purple-600 text-white rounded-2xl shadow-sm">
                    <span className="text-[10px] text-purple-200 uppercase block font-bold">
                      {lang === 'de' ? 'Amortisationszeit (Payback)' : 'Payback Period'}
                    </span>
                    <div className="text-2xl font-black mt-1">
                      {calculatedMetrics.paybackYears} {lang === 'de' ? 'Jahre' : 'Years'}
                    </div>
                    <span className="text-[9px] text-purple-200 font-medium">
                      5-Jahres ROI: +{calculatedMetrics.roi5YearPercent}%
                    </span>
                  </div>

                  <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-sm">
                    <span className="text-[10px] text-emerald-200 uppercase block font-bold">
                      {lang === 'de' ? 'Jährlicher Reingewinn (EBITDA)' : 'Annual Net Operating Profit'}
                    </span>
                    <div className="text-2xl font-black mt-1">
                      €{(calculatedMetrics.annualNetOperatingProfitEur / 1000).toFixed(0)}k
                    </div>
                    <span className="text-[9px] text-emerald-200 font-medium">
                      {calculatedMetrics.annualCo2SavedTonnes} t CO2 vermieden / a
                    </span>
                  </div>
                </div>

                {/* Financial Waterfall Breakdown */}
                <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-4 space-y-2.5 font-mono text-xs">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">
                    {lang === 'de' ? 'Ertragsstruktur (Jährlich)' : 'Annual Revenue Breakdown'}
                  </span>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-600">Kraftstoff-Deckungsbeitrag (B7 + HVO):</span>
                    <span className="font-bold text-purple-950">€{Math.round(calculatedMetrics.annualFuelMarginEur).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">Schmierstoff-Zusatzertrag (1L / Kanister):</span>
                    <span className="font-bold text-emerald-700">+€{Math.round(calculatedMetrics.annualLubeMarginEur).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between pt-1 border-t border-purple-200">
                    <span className="font-bold text-purple-900">Rohertrag Gesamt:</span>
                    <span className="font-black text-purple-950">€{Math.round(calculatedMetrics.annualGrossProfitEur).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-rose-700">
                    <span>Betriebsaufwand (OPEX ~32%):</span>
                    <span>-€{Math.round(calculatedMetrics.annualOpexEur).toLocaleString()}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
