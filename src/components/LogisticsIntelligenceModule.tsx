import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  Waves, 
  Anchor, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Sliders, 
  ShieldAlert, 
  Compass, 
  Gauge, 
  Navigation, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Fuel, 
  Activity, 
  BarChart3, 
  Ship, 
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  AUTOBAHN_CORRIDORS, 
  WATERWAY_CORRIDORS, 
  PORT_TERMINALS_DATA, 
  LOGISTICS_DISRUPTIONS, 
  computeRefinedDemand 
} from '../data/logisticsAndFreight';
import { AutobahnCorridor, WaterwayCorridor, PortTerminalThroughput, Language, MetricUnit } from '../types';
import { formatNumber, formatCurrency } from '../utils/exportUtils';

interface LogisticsIntelligenceModuleProps {
  lang: Language;
  unit: MetricUnit;
  onOpenGisWithFocus?: (type: 'autobahn' | 'waterway' | 'port', id: string) => void;
}

export const LogisticsIntelligenceModule: React.FC<LogisticsIntelligenceModuleProps> = ({
  lang,
  unit,
  onOpenGisWithFocus
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'autobahnen' | 'waterways' | 'ports' | 'forecast_disruptions'>('autobahnen');
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('a2_warschauer_allee');
  const [selectedWaterwayId, setSelectedWaterwayId] = useState<string>('rhine_waterway');
  const [selectedPortId, setSelectedPortId] = useState<string>('port_hamburg');

  // Simulation parameters for refined demand
  const [trafficSurgePercent, setTrafficSurgePercent] = useState<number>(6); // +6% heavy freight
  const [riverDroughtSeverity, setRiverDroughtSeverity] = useState<number>(14); // -14% river draft constraint
  const [portGrowthPercent, setPortGrowthPercent] = useState<number>(4); // +4% seaport growth

  // Baseline figures for Germany
  const baselineHdeoTotalTonnes = 184500; // German HDEO Transport demand
  const baselineMarineTotalTonnes = 32800; // German Marine & Inland Waterway demand

  const refinedForecast = useMemo(() => {
    return computeRefinedDemand(
      baselineHdeoTotalTonnes,
      baselineMarineTotalTonnes,
      trafficSurgePercent,
      riverDroughtSeverity,
      portGrowthPercent
    );
  }, [trafficSurgePercent, riverDroughtSeverity, portGrowthPercent]);

  // Selected item instances
  const selectedCorridor = useMemo(() => {
    return AUTOBAHN_CORRIDORS.find((c) => c.id === selectedCorridorId) || AUTOBAHN_CORRIDORS[0];
  }, [selectedCorridorId]);

  const selectedWaterway = useMemo(() => {
    return WATERWAY_CORRIDORS.find((w) => w.id === selectedWaterwayId) || WATERWAY_CORRIDORS[0];
  }, [selectedWaterwayId]);

  const selectedPort = useMemo(() => {
    return PORT_TERMINALS_DATA.find((p) => p.id === selectedPortId) || PORT_TERMINALS_DATA[0];
  }, [selectedPortId]);

  // Aggregate stats
  const totalDailyTrucks = useMemo(() => {
    return AUTOBAHN_CORRIDORS.reduce((acc, c) => acc + c.totalTrucksDaily, 0);
  }, []);

  const totalHdeoHighwayConsumption = useMemo(() => {
    return AUTOBAHN_CORRIDORS.reduce((acc, c) => acc + c.totalHdeoConsumptionTonnesYear, 0);
  }, []);

  const totalPortTeu = useMemo(() => {
    return PORT_TERMINALS_DATA.reduce((acc, p) => acc + p.annualTeuMillion, 0);
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-purple-200/80 p-5 rounded-2xl shadow-sm shadow-purple-500/5">
        <div>
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-xl bg-purple-100 text-purple-700 shadow-sm">
              <Activity className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2.5">
                {lang === 'de' ? 'Logistik & Fracht-Telemetrie' : 'Logistics & Freight Telemetry'}
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-bold">
                  LIVE CORRIDORS
                </span>
              </h1>
              <p className="text-xs text-purple-900/60 font-medium mt-0.5">
                {lang === 'de'
                  ? 'Autobahnen (A1-A9), Pegelstände Rhein/Elbe/Donau & Container-Häfen zur präzisen HDEO- & Marine-Bedarfsprognose'
                  : 'Autobahn traffic (A1-A9), Rhine/Elbe/Danube water levels & major seaports for refined HDEO & marine lubricant forecasting'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Telemetry KPI Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
          <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3">
            <div className="text-[10px] text-purple-700 uppercase font-semibold">{lang === 'de' ? 'LKW-Verkehr/Tag' : 'Daily Trucks'}</div>
            <div className="text-slate-900 font-black text-sm">{formatNumber(totalDailyTrucks)} LKW</div>
          </div>
          <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3">
            <div className="text-[10px] text-purple-700 uppercase font-semibold">{lang === 'de' ? 'HDEO Transit-Bedarf' : 'HDEO Transit'}</div>
            <div className="text-purple-700 font-black text-sm">{formatNumber(totalHdeoHighwayConsumption)} t/a</div>
          </div>
          <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3 col-span-2 sm:col-span-1">
            <div className="text-[10px] text-purple-700 uppercase font-semibold">{lang === 'de' ? 'Container-Durchsatz' : 'Seaport TEU'}</div>
            <div className="text-emerald-700 font-black text-sm">{totalPortTeu.toFixed(2)}M TEU/a</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-purple-200/60 pb-3">
        <button
          onClick={() => setActiveSubTab('autobahnen')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
            activeSubTab === 'autobahnen'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20'
              : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{lang === 'de' ? '1. Autobahn-Korridore (A1 - A9)' : '1. Autobahn Corridors (A1 - A9)'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('waterways')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
            activeSubTab === 'waterways'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20'
              : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Waves className="w-4 h-4" />
          <span>{lang === 'de' ? '2. Binnenwasserstraßen & Pegelstände' : '2. Inland Waterways & Gauges'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ports')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
            activeSubTab === 'ports'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20'
              : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Anchor className="w-4 h-4" />
          <span>{lang === 'de' ? '3. Seehäfen & Trimoderale Hubs' : '3. Seaports & Trimodal Hubs'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('forecast_disruptions')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
            activeSubTab === 'forecast_disruptions'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20'
              : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>{lang === 'de' ? '4. Bedarfsprognose & Störungs-Engine' : '4. Demand Forecast & Disruptions'}</span>
        </button>
      </div>

      {/* Sub-Tab 1: Autobahnen */}
      {activeSubTab === 'autobahnen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Corridor Selector Cards */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs text-purple-900 uppercase font-bold flex items-center justify-between">
              <span>{lang === 'de' ? 'Zentrale Schwerlast-Korridore' : 'Heavy Freight Corridors'}</span>
              <span className="text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-bold">6 {lang === 'de' ? 'Achsen' : 'Axes'}</span>
            </div>

            <div className="space-y-2.5">
              {AUTOBAHN_CORRIDORS.map((c) => {
                const isSelected = c.id === selectedCorridorId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCorridorId(c.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-purple-600 shadow-md shadow-purple-600/15 ring-2 ring-purple-600/20'
                        : 'bg-white border-purple-200 hover:border-purple-300 hover:bg-purple-50/40 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-9 h-7 rounded-lg flex items-center justify-center font-black font-mono text-xs bg-indigo-600 text-white shadow-sm">
                          {c.code}
                        </span>
                        <span className="font-bold text-sm text-slate-900 tracking-tight">{c.name}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.disruptionRiskRating === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        c.disruptionRiskRating === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {c.disruptionRiskRating} RISK
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 mb-2.5 bg-purple-50/50 p-2.5 rounded-xl">
                      <div>
                        <span className="text-slate-500 text-[9.5px] block uppercase font-medium">Länge</span>
                        <span className="font-bold text-slate-900 font-mono">{c.totalLengthKm} km</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[9.5px] block uppercase font-medium">LKW/Tag</span>
                        <span className="text-purple-700 font-bold font-mono">{formatNumber(c.totalTrucksDaily)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[9.5px] block uppercase font-medium">HDEO t/a</span>
                        <span className="text-indigo-700 font-bold font-mono">{formatNumber(c.totalHdeoConsumptionTonnesYear)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-purple-100">
                      <span className="text-slate-500 text-[10.5px]">Stau-Index:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-purple-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${c.overallCongestionIndex > 80 ? 'bg-rose-500' : c.overallCongestionIndex > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${c.overallCongestionIndex}%` }}
                          />
                        </div>
                        <span className="text-slate-900 font-bold font-mono">{c.overallCongestionIndex}/100</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Inspection Drawer */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-purple-200/80 rounded-2xl p-5 space-y-5 shadow-sm">
              <div className="flex items-start justify-between border-b border-purple-100 pb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="w-10 h-7 rounded-lg flex items-center justify-center font-black font-mono text-sm bg-indigo-600 text-white shadow-sm">
                      {selectedCorridor.code}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 uppercase">{selectedCorridor.name}</h2>
                  </div>
                  <p className="text-xs text-slate-500">{lang === 'de' ? selectedCorridor.descriptionDe : selectedCorridor.descriptionEn}</p>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-medium">{lang === 'de' ? 'Verzögerung' : 'Avg Delay'}</div>
                  <div className="text-rose-600 font-black text-sm font-mono">+{selectedCorridor.estimatedTransitDelayHours}h / Tour</div>
                </div>
              </div>

              {/* Connected States & Choke Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-3.5 space-y-2">
                  <span className="text-[10.5px] text-purple-900 uppercase font-bold flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-purple-600" />
                    {lang === 'de' ? 'Verbundenene Bundesländer' : 'Connected States'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCorridor.connectedStates.map((st) => (
                      <span key={st} className="px-2.5 py-0.5 rounded-lg bg-white text-purple-900 font-bold font-mono text-xs border border-purple-200 shadow-sm">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-3.5 space-y-2">
                  <span className="text-[10.5px] text-rose-900 uppercase font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    {lang === 'de' ? 'Kritische Flaschenhälse (Choke Points)' : 'Key Choke Points'}
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1">
                    {selectedCorridor.keyChokePoints.slice(0, 3).map((cp, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span className="font-medium text-[11px]">{cp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Segment Breakdown Table */}
              <div className="space-y-2">
                <div className="text-xs text-purple-900 uppercase font-bold flex items-center justify-between">
                  <span>{lang === 'de' ? 'Streckenabschnitte & HDEO-Verbrauch' : 'Corridor Segments & HDEO Burn'}</span>
                  <span className="text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-bold">{selectedCorridor.segments.length} {lang === 'de' ? 'Abschnitte' : 'Segments'}</span>
                </div>

                <div className="space-y-2">
                  {selectedCorridor.segments.map((seg) => (
                    <div key={seg.id} className="bg-white border border-purple-200 rounded-xl p-3.5 space-y-2 hover:border-purple-300 transition-colors shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-slate-900 flex items-center space-x-2">
                          <span>{seg.name}</span>
                          <span className="text-slate-500 font-mono font-normal">({seg.lengthKm} km)</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          seg.status === 'DISRUPTED' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                          seg.status === 'CONGESTED' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {seg.status} (+{seg.delayMinutes} min)
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-[10.5px] text-slate-600 border-t border-purple-100 pt-2 font-mono">
                        <div>
                          <span className="text-slate-400 text-[9px] block uppercase font-sans font-medium">LKW/TAG</span>
                          <span className="font-bold text-slate-900">{formatNumber(seg.trucksPerDay)}</span> ({seg.truckSharePercent}%)
                        </div>
                        <div>
                          <span className="text-slate-400 text-[9px] block uppercase font-sans font-medium">GESCHW.</span>
                          <span className="font-bold text-slate-900">{seg.avgSpeedKmh} km/h</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[9px] block uppercase font-sans font-medium">HDEO/MONAT</span>
                          <span className="text-purple-700 font-bold">{formatNumber(seg.hdeoConsumptionLitrePerMonth)} L</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[9px] block uppercase font-sans font-medium">STAU-INDEX</span>
                          <span className="text-amber-700 font-bold">{seg.congestionIndex}/100</span>
                        </div>
                      </div>

                      {seg.activeDisruptions.length > 0 && (
                        <div className="text-[10.5px] text-amber-900 flex items-center gap-1.5 bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{seg.activeDisruptions.join(' • ')}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Waterways & Gauges */}
      {activeSubTab === 'waterways' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Waterway Corridors */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs text-purple-900 uppercase font-bold">
              {lang === 'de' ? 'Binnenwasserstraßen-Netz' : 'Inland Waterway Network'}
            </div>

            <div className="space-y-2.5">
              {WATERWAY_CORRIDORS.map((w) => {
                const isSelected = w.id === selectedWaterwayId;
                return (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWaterwayId(w.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-purple-600 shadow-md shadow-purple-600/15 ring-2 ring-purple-600/20'
                        : 'bg-white border-purple-200 hover:border-purple-300 hover:bg-purple-50/40 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Waves className="w-4 h-4 text-purple-600" />
                        <span className="font-bold text-sm text-slate-900 tracking-tight">{w.name}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        w.status === 'SEVERELY_CONSTRAINED' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        w.status === 'RESTRICTED_DRAFT' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {w.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 mb-2 bg-purple-50/50 p-2.5 rounded-xl font-mono">
                      <div>
                        <span className="text-slate-400 text-[9px] block uppercase font-sans font-medium">Fracht/Jahr</span>
                        <span className="font-bold text-slate-900">{w.annualCargoMillionTonnes}M t</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[9px] block uppercase font-sans font-medium">Grundöl-Anteil</span>
                        <span className="text-purple-700 font-bold">{w.bulkBaseOilSharePercent}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[9px] block uppercase font-sans font-medium">Marine Bunker</span>
                        <span className="text-indigo-700 font-bold">{formatNumber(w.marineLubeBunkeringTonnesYear)} t</span>
                      </div>
                    </div>

                    <div className="text-[10.5px] text-rose-900 bg-rose-50 p-2 rounded-xl border border-rose-200 flex items-center justify-between">
                      <span className="font-medium">{lang === 'de' ? 'Verlagerung auf Straße/Schiene:' : 'Road/Rail Modal Shift:'}</span>
                      <span className="font-bold font-mono text-rose-700">+{formatNumber(w.modalShiftToRoadRailTonnesMonth)} t/Monat</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Pegel Gauge Stations Telemetry */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-purple-200/80 rounded-2xl p-5 space-y-5 shadow-sm">
              <div className="flex items-start justify-between border-b border-purple-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Waves className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-bold text-slate-900 uppercase">{selectedWaterway.name}</h2>
                  </div>
                  <p className="text-xs text-slate-500">{lang === 'de' ? selectedWaterway.descriptionDe : selectedWaterway.descriptionEn}</p>
                </div>
              </div>

              {/* Gauge Stations Grid */}
              <div className="space-y-3">
                <div className="text-xs text-purple-900 uppercase font-bold flex items-center justify-between">
                  <span>{lang === 'de' ? 'Offizielle Pegel-Messstellen (Wasserstraßen- und Schifffahrtsverwaltung)' : 'WSV Gauge Stations'}</span>
                  <span className="text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-bold">{selectedWaterway.gaugeStations.length} {lang === 'de' ? 'Pegel' : 'Gauges'}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedWaterway.gaugeStations.map((gauge) => {
                    const isAlert = gauge.status === 'LOW_WATER_ALERT' || gauge.status === 'SEVERELY_RESTRICTED';
                    return (
                      <div key={gauge.id} className={`bg-purple-50/40 border rounded-2xl p-4 space-y-3 ${
                        isAlert ? 'border-purple-300 ring-1 ring-purple-400/20' : 'border-purple-200'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-xs text-slate-900 block">{gauge.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">Stand: {gauge.lastUpdated}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            gauge.status === 'SEVERELY_RESTRICTED' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                            gauge.status === 'LOW_WATER_ALERT' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {gauge.status}
                          </span>
                        </div>

                        {/* Level comparison & loading capacity */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-xl border border-purple-100 font-mono">
                          <div>
                            <span className="text-slate-400 text-[9px] block uppercase font-sans font-medium">Aktueller Pegel</span>
                            <span className={`text-base font-black ${gauge.currentLevelCm < gauge.criticalLowThresholdCm ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {gauge.currentLevelCm} cm
                            </span>
                            <span className="text-[9.5px] text-slate-500 block">MW: {gauge.meanLevelCm} cm</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[9px] block uppercase font-sans font-medium">Abladetiefe / Last</span>
                            <span className="text-base font-black text-purple-700">{gauge.bargeMaxLoadPercent}%</span>
                            <span className="text-[9.5px] text-slate-500 block">Kritisch: &lt;{gauge.criticalLowThresholdCm} cm</span>
                          </div>
                        </div>

                        {/* Surcharge alert */}
                        {gauge.lowWaterSurchargeActive ? (
                          <div className="text-[10.5px] bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-xl flex items-center justify-between">
                            <span className="flex items-center gap-1 font-medium">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              KWZ-Zuschlag aktiv:
                            </span>
                            <span className="font-bold text-rose-700 font-mono">+{formatCurrency(gauge.lowWaterSurchargeEurPerTonne)} / t</span>
                          </div>
                        ) : (
                          <div className="text-[10.5px] bg-emerald-50 text-emerald-800 p-2 rounded-xl flex items-center gap-1.5 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Kein Kleinwasserzuschlag (Reguläre Frachtrate)</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Ports */}
      {activeSubTab === 'ports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Port Terminals List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs text-purple-900 uppercase font-bold">
              {lang === 'de' ? 'Seehäfen & Binnenhafen-Zentren' : 'Major Ports & Terminals'}
            </div>

            <div className="space-y-2.5">
              {PORT_TERMINALS_DATA.map((p) => {
                const isSelected = p.id === selectedPortId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPortId(p.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-purple-600 shadow-md shadow-purple-600/15 ring-2 ring-purple-600/20'
                        : 'bg-white border-purple-200 hover:border-purple-300 hover:bg-purple-50/40 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Anchor className="w-4 h-4 text-purple-600" />
                        <span className="font-bold text-sm text-slate-900 tracking-tight">{p.name}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        {p.type === 'MARITIME_SEAPORT' ? 'SEEHAFEN' : 'BINNENHAFEN'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 mb-2 bg-purple-50/50 p-2.5 rounded-xl font-mono">
                      <div>
                        <span className="text-slate-400 text-[9px] block uppercase font-sans font-medium">TEU / Jahr</span>
                        <span className="text-purple-700 font-bold">{p.annualTeuMillion}M TEU</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[9px] block uppercase font-sans font-medium">Fracht t/a</span>
                        <span className="font-bold text-slate-900">{p.annualCargoMillionTonnes}M t</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[9px] block uppercase font-sans font-medium">Marine Lube</span>
                        <span className="text-indigo-700 font-bold">{formatNumber(p.marineCylinderOilDemandTonnesYear + p.marineSystemOilDemandTonnesYear)} t</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Port Throughput & Bunkering Demand */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-purple-200/80 rounded-2xl p-5 space-y-5 shadow-sm">
              <div className="flex items-start justify-between border-b border-purple-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Anchor className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-bold text-slate-900 uppercase">{selectedPort.name}</h2>
                  </div>
                  <p className="text-xs text-slate-500">{selectedPort.city} • {selectedPort.type === 'MARITIME_SEAPORT' ? 'Tiefsee-Containerterminal' : 'Trimodaler Binnenhafen-Knoten'}</p>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-medium">Schiffsanläufe</div>
                  <div className="text-purple-700 font-black text-sm font-mono">{formatNumber(selectedPort.commercialVesselCallsYear)} / Jahr</div>
                </div>
              </div>

              {/* Bunkering & Lubricant Demand Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-4 space-y-2">
                  <span className="text-[10.5px] text-purple-900 uppercase font-bold flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-purple-600" />
                    {lang === 'de' ? 'Marine Zylinderöl-Bedarf (2-Takt)' : 'Marine Cylinder Oil (2-Stroke)'}
                  </span>
                  <div className="text-xl font-black font-mono text-purple-900">
                    {formatNumber(selectedPort.marineCylinderOilDemandTonnesYear)} <span className="text-xs text-slate-500 font-normal font-sans">t/Jahr</span>
                  </div>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed">BN 40 / BN 70 Low-Saps Bunkerqualitäten für Hochseeschiffe.</p>
                </div>

                <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-4 space-y-2">
                  <span className="text-[10.5px] text-purple-900 uppercase font-bold flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-indigo-600" />
                    {lang === 'de' ? 'System- & Trunk-Piston-Öle (4-Takt)' : 'System & Trunk Piston Oils'}
                  </span>
                  <div className="text-xl font-black font-mono text-indigo-900">
                    {formatNumber(selectedPort.marineSystemOilDemandTonnesYear)} <span className="text-xs text-slate-500 font-normal font-sans">t/Jahr</span>
                  </div>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed">Für Hilfsdiesel, Binnenschiffe, Schlepper und Baggerflotten.</p>
                </div>
              </div>

              {/* Key Commodities & Bunkering Partners */}
              <div className="space-y-3">
                <div className="bg-white border border-purple-100 rounded-xl p-3.5 space-y-2">
                  <span className="text-[10.5px] text-purple-900 uppercase font-bold">
                    {lang === 'de' ? 'Aktive Bunkerdienstleister & Schmierstoff-Tankläger' : 'Active Bunkering Suppliers & Tank Farms'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPort.bunkerSuppliers.map((supp, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 font-medium text-xs border border-purple-200">
                        {supp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-purple-100 rounded-xl p-3.5 space-y-2">
                  <span className="text-[10.5px] text-purple-900 uppercase font-bold">
                    {lang === 'de' ? 'Wasserstraßen-Anbindung' : 'Connected Waterways'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPort.connectedWaterways.map((ww, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 font-medium text-xs border border-indigo-200">
                        {ww}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Refined Demand Forecast & Disruptions */}
      {activeSubTab === 'forecast_disruptions' && (
        <div className="space-y-6">
          {/* Refined Demand Simulator Controls */}
          <div className="bg-white border border-purple-200/80 rounded-2xl p-5 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm uppercase text-slate-900 tracking-wide">
                  {lang === 'de' ? 'Echtzeit-Sensitivitätsmodell für Schmierstoff-Bedarf' : 'Real-Time Logistics Demand Refinement Engine'}
                </h3>
              </div>
              <span className="text-[10.5px] text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full font-bold">
                {lang === 'de' ? 'Verknüpft Verkehrsfluss, Niedrigwasser & Hafenumschlag' : 'Coupled Traffic, Drought & Port Model'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Slider 1: Traffic Surge */}
              <div className="space-y-2 bg-purple-50/40 p-4 rounded-xl border border-purple-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-800 font-semibold flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-purple-600" />
                    LKW-Transit Dichte (A1-A9)
                  </span>
                  <span className="text-purple-700 font-black font-mono">+{trafficSurgePercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={trafficSurgePercent}
                  onChange={(e) => setTrafficSurgePercent(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <p className="text-[10.5px] text-slate-500">Erhöhte Lkw-Laufleistung treibt Flotten-HDEO-Verbrauch.</p>
              </div>

              {/* Slider 2: River Drought Severity */}
              <div className="space-y-2 bg-purple-50/40 p-4 rounded-xl border border-purple-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-800 font-semibold flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-indigo-600" />
                    Pegel-Einschränkung (Rhein/Elbe)
                  </span>
                  <span className="text-rose-600 font-black font-mono">-{riverDroughtSeverity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={riverDroughtSeverity}
                  onChange={(e) => setRiverDroughtSeverity(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <p className="text-[10.5px] text-slate-500">Verlagert Schiffs-Tonnage auf Diesel-Lkw (+HDEO-Bedarf!).</p>
              </div>

              {/* Slider 3: Port Growth */}
              <div className="space-y-2 bg-purple-50/40 p-4 rounded-xl border border-purple-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-800 font-semibold flex items-center gap-1.5">
                    <Anchor className="w-3.5 h-3.5 text-emerald-600" />
                    Container-Umschlag (HH/HB/WHV)
                  </span>
                  <span className="text-emerald-700 font-black font-mono">+{portGrowthPercent}%</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="20"
                  value={portGrowthPercent}
                  onChange={(e) => setPortGrowthPercent(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <p className="text-[10.5px] text-slate-500">Direkter Treiber für Marine Cylinder & System Oils.</p>
              </div>
            </div>

            {/* Dynamic Forecast Outcome Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border-t border-purple-100 pt-4">
              <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3.5">
                <span className="text-[10.5px] text-purple-900 uppercase font-semibold block">Refinierter HDEO Bedarf (DE)</span>
                <div className="text-lg font-black font-mono text-purple-900 flex items-baseline gap-1.5 mt-0.5">
                  {formatNumber(refinedForecast.refinedHdeoTonnesYear)} t/a
                  <span className="text-xs text-emerald-600 font-bold">+{refinedForecast.hdeoDeltaPercent}%</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Basis: {formatNumber(refinedForecast.baselineHdeoTonnesYear)} t/a
                </span>
              </div>

              <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3.5">
                <span className="text-[10.5px] text-purple-900 uppercase font-semibold block">Refinierter Marine Bedarf (DE)</span>
                <div className="text-lg font-black font-mono text-indigo-900 flex items-baseline gap-1.5 mt-0.5">
                  {formatNumber(refinedForecast.refinedMarineTonnesYear)} t/a
                  <span className={`text-xs font-bold ${refinedForecast.marineDeltaPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {refinedForecast.marineDeltaPercent >= 0 ? '+' : ''}{refinedForecast.marineDeltaPercent}%
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Basis: {formatNumber(refinedForecast.baselineMarineTonnesYear)} t/a
                </span>
              </div>

              <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3.5">
                <span className="text-[10.5px] text-purple-900 uppercase font-semibold block">Straße-Modal-Shift Effekt</span>
                <div className="text-lg font-black font-mono text-rose-600 mt-0.5">
                  +{formatNumber(refinedForecast.roadModalShiftImpactTonnes)} t/a
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Zusätzlicher Lkw-Flottenbedarf
                </span>
              </div>

              <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3.5">
                <span className="text-[10.5px] text-purple-900 uppercase font-semibold block">Überwachte Engpässe</span>
                <div className="text-lg font-black font-mono text-slate-900 mt-0.5">
                  {refinedForecast.criticalChokePointCount} <span className="text-xs text-slate-500 font-normal font-sans">Knoten</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Autobahn, Binnenwasser, Seehafen
                </span>
              </div>
            </div>
          </div>

          {/* Active Logistics Disruption Alerts */}
          <div className="space-y-3">
            <div className="text-xs text-purple-900 uppercase font-bold flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-900">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                {lang === 'de' ? 'Aktive Lieferketten-Störungen & Notfall-Protokolle' : 'Active Supply Chain Disruptions & Mitigation'}
              </span>
              <span className="text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full font-bold">{LOGISTICS_DISRUPTIONS.length} ALERTS</span>
            </div>

            <div className="space-y-3">
              {LOGISTICS_DISRUPTIONS.map((alert) => (
                <div
                  key={alert.id}
                  className={`bg-white border rounded-2xl p-5 space-y-3 shadow-sm ${
                    alert.severity === 'CRITICAL' ? 'border-rose-300 ring-1 ring-rose-400/20' : 'border-purple-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        alert.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {alert.severity}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{lang === 'de' ? alert.titleDe : alert.titleEn}</h4>
                    </div>

                    <div className="flex items-center space-x-3 text-xs font-mono">
                      <span className="text-slate-600">Verzögerung: <strong className="text-rose-600">+{alert.estimatedDelayDays} Tage</strong></span>
                      <span className="text-slate-600">Frachtaufschlag: <strong className="text-purple-700">+{alert.freightCostSurchargePercent}%</strong></span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {lang === 'de' ? alert.impactDescriptionDe : alert.impactDescriptionEn}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-purple-100">
                    <div className="text-xs space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Betroffene Produkte:</span>
                      <div className="flex flex-wrap gap-1">
                        {alert.affectedLubeProducts.map((prod, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 font-mono text-[10px] border border-purple-100 font-medium">
                            {prod}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs space-y-1 bg-purple-50 p-3 rounded-xl border border-purple-100">
                      <span className="text-[10.5px] text-purple-900 uppercase font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                        Empfohlene Mitigation / Maßnahme:
                      </span>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        {lang === 'de' ? alert.mitigationRecommendationDe : alert.mitigationRecommendationEn}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
