import React, { useState, useMemo } from 'react';
import { 
  WhiteSpotCluster, 
  FluidSector, 
  Language, 
  MetricUnit 
} from '../types';
import { FLUID_SECTORS } from '../data/fluidSpecs';
import { convertTonnes, formatUnitLabel, formatNumber, formatCurrency } from '../utils/exportUtils';
import { 
  Target, 
  Filter, 
  Search, 
  TrendingUp, 
  AlertCircle, 
  Building2, 
  Truck, 
  ChevronRight, 
  CheckCircle2, 
  Sliders, 
  Plus, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  Award,
  Layers,
  Compass
} from 'lucide-react';

interface WhiteSpotsOptimizerProps {
  whiteSpots: WhiteSpotCluster[];
  lang: Language;
  unit: MetricUnit;
  onSelectCluster?: (ws: WhiteSpotCluster) => void;
}

export const WhiteSpotsOptimizer: React.FC<WhiteSpotsOptimizerProps> = ({
  whiteSpots,
  lang,
  unit,
  onSelectCluster,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');
  const [activeClusterId, setActiveClusterId] = useState<string>(whiteSpots[0]?.id || '');

  // Custom Calculator Modal / Section
  const [showCustomCalc, setShowCustomCalc] = useState(false);
  const [calcFleetTrucks, setCalcFleetTrucks] = useState(250);
  const [calcCncMachines, setCalcCncMachines] = useState(80);
  const [calcWindTurbines, setCalcWindTurbines] = useState(35);
  const [calcAgriHectares, setCalcAgriHectares] = useState(12000);

  // Filtered List
  const filteredClusters = useMemo(() => {
    return whiteSpots.filter((ws) => {
      if (selectedPriority !== 'ALL' && ws.priority !== selectedPriority) return false;
      if (selectedSector !== 'ALL' && ws.primarySector !== selectedSector && !ws.secondarySectors.includes(selectedSector as FluidSector)) return false;
      if (selectedChannel !== 'ALL' && !ws.recommendedChannelType.includes(selectedChannel)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ws.name.toLowerCase().includes(q) ||
          ws.bundeslandName.toLowerCase().includes(q) ||
          ws.keyIndustrialAnchors.some((a) => a.toLowerCase().includes(q)) ||
          ws.requiredSpecs.some((s) => s.toLowerCase().includes(q)) ||
          ws.plzCoverage.some((p) => p.includes(q))
        );
      }
      return true;
    });
  }, [whiteSpots, selectedPriority, selectedSector, selectedChannel, searchQuery]);

  // Active Selected Cluster
  const activeCluster = useMemo(() => {
    return whiteSpots.find((w) => w.id === activeClusterId) || filteredClusters[0] || whiteSpots[0];
  }, [whiteSpots, activeClusterId, filteredClusters]);

  // Custom Calculated Potential
  const customCalculation = useMemo(() => {
    const truckVolume = calcFleetTrucks * 0.18; // ~180 L per truck/yr => 0.16 t
    const cncVolume = calcCncMachines * 0.85; // ~850 L per machine/yr (MWF/Hydraulic) => 0.75 t
    const windVolume = calcWindTurbines * 1.2; // ~1200 L gear oil/grease => 1.05 t
    const agriVolume = (calcAgriHectares / 100) * 0.45; // ~45 L / 100 ha

    const totalEstTonnes = Math.round(truckVolume + cncVolume + windVolume + agriVolume);
    const totalEstValueEur = totalEstTonnes * 4200; // avg €4.20/kg
    const calcScore = Math.min(99, Math.round(50 + (totalEstTonnes / 100) * 5));

    return {
      totalEstTonnes,
      totalEstValueEur,
      calcScore,
    };
  }, [calcFleetTrucks, calcCncMachines, calcWindTurbines, calcAgriHectares]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-slate-800">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-purple-200 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <div className="bg-purple-600 p-1.5 rounded-lg text-white shadow-sm shadow-purple-500/20">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black text-purple-950 tracking-tight uppercase">
              {lang === 'de'
                ? 'MASTER 30+ WHITE-SPOT INDUSTRIE- & LOGISTIK-KORRIDORE'
                : 'MASTER 30+ WHITE-SPOT INDUSTRIAL & LOGISTICS CORRIDORS'}
            </h2>
          </div>
          <p className="text-[11px] text-purple-700 mt-1 font-mono">
            {lang === 'de'
              ? 'Identifikation unterversorgter regionaler Nachfrage-Cluster, Großverbraucher und optimierte Vertriebsstrategien'
              : 'Identification of unfulfilled fluid demand clusters, major industrial anchors, and optimized route-to-market channels'}
          </p>
        </div>

        {/* Action Button: Custom Calculator */}
        <button
          onClick={() => setShowCustomCalc(!showCustomCalc)}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl font-mono text-xs transition-all shadow-sm shadow-purple-500/20 cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>{lang === 'de' ? 'OPPORTUNITY ESTIMATOR' : 'OPPORTUNITY ESTIMATOR'}</span>
        </button>
      </div>

      {/* Custom Corridor Calculator Drawer (Optional Toggle) */}
      {showCustomCalc && (
        <div className="bg-white border border-purple-300 rounded-2xl p-5 shadow-lg space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100">
            <div className="flex items-center space-x-2">
              <span className="status-badge bg-purple-100 text-purple-900 border border-purple-200 font-bold text-[10px]">
                WHAT-IF ESTIMATOR
              </span>
              <span className="font-black text-xs uppercase font-mono text-purple-950">
                {lang === 'de' ? 'INDIVIDUELLER BEDARFS- & CHANCEN-RECHNER' : 'CUSTOM OPPORTUNITY ESTIMATOR'}
              </span>
            </div>
            <button
              onClick={() => setShowCustomCalc(false)}
              className="text-xs text-purple-700 hover:text-purple-950 font-mono font-bold cursor-pointer"
            >
              [✕] {lang === 'de' ? 'SCHLIESSEN' : 'CLOSE'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200/80 space-y-1.5">
              <label className="text-slate-600 font-mono text-[10px] uppercase block font-semibold">Lkw-Flotte (Euro VI-e):</label>
              <input
                type="number"
                value={calcFleetTrucks}
                onChange={(e) => setCalcFleetTrucks(Number(e.target.value))}
                className="w-full bg-white border border-purple-200 rounded-lg p-1.5 text-purple-950 font-mono font-bold text-xs focus:outline-none focus:border-purple-600"
              />
              <span className="text-[9px] text-slate-500 font-mono">180 L HDEO / Lkw / Jahr</span>
            </div>

            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200/80 space-y-1.5">
              <label className="text-slate-600 font-mono text-[10px] uppercase block font-semibold">CNC & Stanzmaschinen:</label>
              <input
                type="number"
                value={calcCncMachines}
                onChange={(e) => setCalcCncMachines(Number(e.target.value))}
                className="w-full bg-white border border-purple-200 rounded-lg p-1.5 text-purple-950 font-mono font-bold text-xs focus:outline-none focus:border-purple-600"
              />
              <span className="text-[9px] text-slate-500 font-mono">850 L KSS/HLP / Spindel / Jahr</span>
            </div>

            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200/80 space-y-1.5">
              <label className="text-slate-600 font-mono text-[10px] uppercase block font-semibold">Windkraftanlagen (Turbinen):</label>
              <input
                type="number"
                value={calcWindTurbines}
                onChange={(e) => setCalcWindTurbines(Number(e.target.value))}
                className="w-full bg-white border border-purple-200 rounded-lg p-1.5 text-purple-950 font-mono font-bold text-xs focus:outline-none focus:border-purple-600"
              />
              <span className="text-[9px] text-slate-500 font-mono">1.200 L PAO Getriebeöl</span>
            </div>

            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200/80 space-y-1.5">
              <label className="text-slate-600 font-mono text-[10px] uppercase block font-semibold">Agrarfläche (Hektar):</label>
              <input
                type="number"
                value={calcAgriHectares}
                onChange={(e) => setCalcAgriHectares(Number(e.target.value))}
                className="w-full bg-white border border-purple-200 rounded-lg p-1.5 text-purple-950 font-mono font-bold text-xs focus:outline-none focus:border-purple-600"
              />
              <span className="text-[9px] text-slate-500 font-mono">UTTO / Bio-Hydraulikbedarf</span>
            </div>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block font-semibold">{lang === 'de' ? 'BERECHNETER BEDARF' : 'ESTIMATED DEMAND'}</span>
                <span className="text-purple-900 font-black font-mono text-sm">
                  {formatNumber(convertTonnes(customCalculation.totalEstTonnes, unit))} {formatUnitLabel(unit, lang)}
                </span>
              </div>
              <div className="h-6 w-px bg-purple-200" />
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block font-semibold">{lang === 'de' ? 'MARKTWERT' : 'MARKET VALUE'}</span>
                <span className="text-emerald-700 font-black font-mono text-sm">
                  {formatCurrency(customCalculation.totalEstValueEur)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-purple-950 font-semibold uppercase">{lang === 'de' ? 'CHANCEN-INDEX' : 'INDEX'}:</span>
              <span className="px-3 py-1 bg-purple-600 text-white rounded-lg font-mono font-bold text-xs shadow-xs">
                {customCalculation.calcScore} / 100
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-purple-200 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'de' ? 'Korridor, Anker, PLZ oder Freigabe...' : 'Corridor, anchor, PLZ, OEM spec...'}
            className="w-full pl-9 pr-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl text-slate-900 placeholder-purple-400 font-mono text-xs focus:outline-none focus:border-purple-600 focus:bg-white transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Priority */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="py-2 px-3 bg-purple-50/50 border border-purple-200 rounded-xl text-purple-950 font-mono text-xs focus:outline-none focus:border-purple-600 cursor-pointer"
          >
            <option value="ALL">{lang === 'de' ? 'Alle Prioritäten' : 'All Priorities'}</option>
            <option value="CRITICAL">CRITICAL (Top Potenzial)</option>
            <option value="HIGH">HIGH (Hohes Potenzial)</option>
            <option value="MEDIUM">MEDIUM (Solide)</option>
          </select>

          {/* Sector */}
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="py-2 px-3 bg-purple-50/50 border border-purple-200 rounded-xl text-purple-950 font-mono text-xs focus:outline-none focus:border-purple-600 cursor-pointer"
          >
            <option value="ALL">{lang === 'de' ? 'Alle Sektoren' : 'All Sectors'}</option>
            {FLUID_SECTORS.map((s) => (
              <option key={s.id} value={s.id}>
                {lang === 'de' ? s.nameDe : s.nameEn}
              </option>
            ))}
          </select>

          {/* Channel */}
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="py-2 px-3 bg-purple-50/50 border border-purple-200 rounded-xl text-purple-950 font-mono text-xs focus:outline-none focus:border-purple-600 cursor-pointer"
          >
            <option value="ALL">{lang === 'de' ? 'Alle Vertriebskanäle' : 'All Channels'}</option>
            <option value="Agrar-Genossenschaft">Agrar-Genossenschaft (BayWa/RWZ)</option>
            <option value="Mineralöl-Großhandel">Mineralöl-Großhandel (Hoyer/AVIA)</option>
            <option value="Technischer Fachgroßhandel">Technischer Fachgroßhandel</option>
            <option value="Direktvertrieb">Direktvertrieb OEM/Key-Account</option>
            <option value="Marine">Marine Bunker Service</option>
          </select>
        </div>
      </div>

      {/* Main Two-Column Layout: Left List & Right Detail Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Side: Ranked Clusters List (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-purple-200 rounded-2xl p-4 shadow-sm space-y-3 max-h-[750px] overflow-y-auto scrollbar-thin">
          <div className="flex items-center justify-between pb-2.5 border-b border-purple-100">
            <span className="font-black text-xs font-mono text-purple-950 uppercase">
              {lang === 'de' ? `KORRIDORE GEFUNDEN (${filteredClusters.length})` : `CLUSTERS FOUND (${filteredClusters.length})`}
            </span>
            <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-bold uppercase">RANKED BY OPPORTUNITY</span>
          </div>

          <div className="space-y-2.5">
            {filteredClusters.map((ws) => {
              const isSelected = ws.id === activeCluster.id;
              const prioBorder =
                ws.priority === 'CRITICAL'
                  ? 'border-l-4 border-rose-500'
                  : ws.priority === 'HIGH'
                  ? 'border-l-4 border-purple-600'
                  : 'border-l-4 border-cyan-500';

              const prioColor =
                ws.priority === 'CRITICAL'
                  ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
                  : ws.priority === 'HIGH'
                  ? 'bg-purple-100 text-purple-900 border-purple-200 font-bold'
                  : 'bg-cyan-50 text-cyan-800 border-cyan-200 font-bold';

              return (
                <div
                  key={ws.id}
                  onClick={() => {
                    setActiveClusterId(ws.id);
                    if (onSelectCluster) onSelectCluster(ws);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${prioBorder} ${
                    isSelected
                      ? 'bg-purple-100/90 border-purple-300 shadow-sm'
                      : 'bg-white border-purple-200/80 hover:bg-purple-50/50 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-1.5 mb-1">
                        <span className={`status-badge ${prioColor}`}>
                          {ws.priority}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{ws.bundeslandName}</span>
                      </div>
                      <h4 className="font-bold text-xs text-purple-950 leading-snug line-clamp-2">
                        {ws.name}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex flex-col items-center justify-center">
                        <span className="text-[8px] font-mono text-purple-600 leading-none font-bold">SCORE</span>
                        <span className="font-mono font-black text-purple-950 text-xs">{ws.opportunityScore}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-purple-100 text-[10px] font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Bedarfslücke:</span>
                      <span className="text-slate-800 font-bold">
                        {formatNumber(convertTonnes(ws.unmetDemandTonnes, unit))} {formatUnitLabel(unit, lang)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[9px] uppercase">Marktwert:</span>
                      <span className="text-emerald-700 font-bold">
                        {formatCurrency(ws.estimatedMarketValueEur)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Deep Dive Playbook & Anchors (7 Cols) */}
        {activeCluster && (
          <div className="lg:col-span-7 bg-white border border-purple-200 rounded-2xl p-5 shadow-sm space-y-4">
            
            {/* Top Bar of Cluster */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-3 border-b border-purple-100">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="status-badge bg-purple-100 text-purple-900 border border-purple-200 font-bold">
                    {activeCluster.bundeslandName}
                  </span>
                  <span className="status-badge bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                    {activeCluster.priority} PRIORITY
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 font-medium">Radius: {activeCluster.radiusKm} km</span>
                </div>
                <h3 className="text-base font-black text-purple-950 leading-tight uppercase">
                  {activeCluster.name}
                </h3>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center space-x-3 shrink-0">
                <div className="text-right">
                  <div className="text-[9px] font-mono text-slate-500 uppercase font-bold">{lang === 'de' ? 'CHANCEN-SCORE' : 'OPP SCORE'}</div>
                  <div className="text-purple-950 font-black font-mono text-xl">{activeCluster.opportunityScore} / 100</div>
                </div>
                <Award className="w-5 h-5 text-purple-600" />
              </div>
            </div>

            {/* Metric KPI Cards with border-l-4 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-purple-50/50 rounded-xl border-l-4 border-rose-500 border-t border-r border-b border-purple-200">
                <div className="text-[9px] font-mono text-slate-500 uppercase mb-0.5 font-bold">{lang === 'de' ? 'UNERFÜLLTES VOLUMEN' : 'UNMET VOLUME'}</div>
                <div className="text-rose-600 font-black font-mono text-sm">
                  {formatNumber(convertTonnes(activeCluster.unmetDemandTonnes, unit))} {formatUnitLabel(unit, lang)}
                </div>
              </div>

              <div className="p-3.5 bg-purple-50/50 rounded-xl border-l-4 border-emerald-500 border-t border-r border-b border-purple-200">
                <div className="text-[9px] font-mono text-slate-500 uppercase mb-0.5 font-bold">{lang === 'de' ? 'ADRESSIERBARER WERT' : 'MARKET VALUE'}</div>
                <div className="text-emerald-700 font-black font-mono text-sm">
                  {formatCurrency(activeCluster.estimatedMarketValueEur)}
                </div>
              </div>

              <div className="p-3.5 bg-purple-50/50 rounded-xl border-l-4 border-cyan-500 border-t border-r border-b border-purple-200">
                <div className="text-[9px] font-mono text-slate-500 uppercase mb-0.5 font-bold">{lang === 'de' ? 'ZIEL-SEKTOR' : 'PRIMARY SECTOR'}</div>
                <div className="text-cyan-900 font-bold font-mono text-xs truncate">
                  {FLUID_SECTORS.find((s) => s.id === activeCluster.primarySector)?.nameDe.split(' ')[0] || activeCluster.primarySector}
                </div>
              </div>
            </div>

            {/* Strategic Entry Playbook */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-1.5 text-purple-900 font-bold font-mono text-xs uppercase">
                <Flame className="w-3.5 h-3.5 text-purple-600" />
                <span>{lang === 'de' ? 'STRATEGISCHES PENETRATIONS-PLAYBOOK' : 'STRATEGIC ENTRY PLAYBOOK'}</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-sans">
                {lang === 'de' ? activeCluster.strategicRecommendationDe : activeCluster.strategicRecommendationEn}
              </p>
            </div>

            {/* Recommended Channel & Underserved Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-purple-50/40 rounded-xl border border-purple-200 space-y-1">
                <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">
                  {lang === 'de' ? 'EMPFOHLENER PARTNER-TYP' : 'RECOMMENDED CHANNEL PARTNER'}
                </span>
                <div className="font-bold text-purple-950 flex items-center space-x-1.5 font-mono">
                  <Truck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>{activeCluster.recommendedChannelType}</span>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50/40 rounded-xl border border-purple-200 space-y-1">
                <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">
                  {lang === 'de' ? 'UNTERVERSORGTE ZIELGRUPPE' : 'UNDERSERVED TARGET CUSTOMERS'}
                </span>
                <p className="text-slate-800 text-[11px] leading-snug">
                  {activeCluster.underservedAudience}
                </p>
              </div>
            </div>

            {/* Industrial Key Anchors & PLZs */}
            <div className="space-y-3 pt-2 border-t border-purple-100">
              <div>
                <span className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">
                  {lang === 'de' ? 'INDUSTRIELLE SCHLÜSSEL-ANKER (OEMS & GROSSKUNDEN)' : 'KEY INDUSTRIAL ANCHORS'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeCluster.keyIndustrialAnchors.map((anchor, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-purple-200 rounded-lg text-slate-900 text-xs flex items-center space-x-1 font-mono shadow-xs">
                      <Building2 className="w-3 h-3 text-purple-600" />
                      <span>{anchor}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[9px] font-mono text-slate-500 block mb-1 uppercase font-bold">
                  {lang === 'de' ? 'GEFORDERTE OEM & DIN FREIGABEN' : 'REQUIRED FLUID SPECIFICATIONS'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeCluster.requiredSpecs.map((spec, i) => (
                    <span key={i} className="status-badge bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-bold">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 font-mono text-[9px] uppercase block font-bold">
                    {lang === 'de' ? 'Etablierter Wettbewerb:' : 'Incumbent Competitors:'}
                  </span>
                  <span className="text-slate-800 font-semibold">{activeCluster.incumbentCompetitors.join(', ')}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-mono text-[9px] uppercase block font-bold">
                    {lang === 'de' ? 'Postleitzahlen (PLZ):' : 'Postal Codes (PLZ):'}
                  </span>
                  <span className="font-mono text-purple-900 font-bold">{activeCluster.plzCoverage.join(', ')}</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
