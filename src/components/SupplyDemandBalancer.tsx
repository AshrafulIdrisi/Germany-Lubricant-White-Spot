import React, { useState, useMemo } from 'react';
import { 
  BundeslandData, 
  FluidSector, 
  Language, 
  MetricUnit, 
  MarketSimulationState 
} from '../types';
import { FLUID_SECTORS } from '../data/fluidSpecs';
import { convertTonnes, formatUnitLabel, formatNumber, formatCurrency } from '../utils/exportUtils';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { 
  Scale, 
  Sliders, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  ShieldAlert, 
  Activity, 
  Truck, 
  Factory, 
  Wind, 
  Leaf 
} from 'lucide-react';

interface SupplyDemandBalancerProps {
  bundeslaender: BundeslandData[];
  lang: Language;
  unit: MetricUnit;
  onSelectState?: (stateId: string) => void;
}

export const SupplyDemandBalancer: React.FC<SupplyDemandBalancerProps> = ({
  bundeslaender,
  lang,
  unit,
  onSelectState,
}) => {
  // Scenario Levers State
  const [simulation, setSimulation] = useState<MarketSimulationState>({
    windCapacityGrowthPercent: 0,
    automotiveIceDeclinePercent: 0,
    machineToolingSurgePercent: 0,
    hdeoTransportGrowthPercent: 0,
    bioLubeMandatePercent: 0,
    selectedStateFilter: 'ALL',
    selectedSectorFilter: 'ALL',
    searchQuery: '',
  });

  const [selectedStateId, setSelectedStateId] = useState<string>('baden_wuerttemberg');

  // Reset Simulation Levers
  const handleResetSimulation = () => {
    setSimulation({
      windCapacityGrowthPercent: 0,
      automotiveIceDeclinePercent: 0,
      machineToolingSurgePercent: 0,
      hdeoTransportGrowthPercent: 0,
      bioLubeMandatePercent: 0,
      selectedStateFilter: 'ALL',
      selectedSectorFilter: 'ALL',
      searchQuery: '',
    });
  };

  // Recalculate State Data under Simulation
  const simulatedStates = useMemo(() => {
    return bundeslaender.map((state) => {
      const pcmoFactor = 1 - simulation.automotiveIceDeclinePercent / 100;
      const hdeoFactor = 1 + simulation.hdeoTransportGrowthPercent / 100;
      const mwfFactor = 1 + simulation.machineToolingSurgePercent / 100;
      const windFactor = 1 + simulation.windCapacityGrowthPercent / 100;
      const agriFactor = 1 + (simulation.bioLubeMandatePercent * 0.5) / 100;

      const simPcmo = Math.round(state.demandTonnes.automotive_pcmo * pcmoFactor);
      const simHdeo = Math.round(state.demandTonnes.transport_hdeo * hdeoFactor);
      const simMwf = Math.round(state.demandTonnes.industrial_metalworking * mwfFactor);
      const simWind = Math.round(state.demandTonnes.wind_renewable * windFactor);
      const simChem = state.demandTonnes.chemical_process;
      const simMarine = state.demandTonnes.marine_inland;
      const simAgri = Math.round(state.demandTonnes.agri_forestry * agriFactor);

      const totalSimDemand = simPcmo + simHdeo + simMwf + simWind + simChem + simMarine + simAgri;
      const netBalance = state.localProductionCapacityTonnes - totalSimDemand;
      const isDeficit = netBalance < 0;

      return {
        ...state,
        simulatedDemandTonnes: {
          automotive_pcmo: simPcmo,
          transport_hdeo: simHdeo,
          industrial_metalworking: simMwf,
          wind_renewable: simWind,
          chemical_process: simChem,
          marine_inland: simMarine,
          agri_forestry: simAgri,
        },
        totalSimDemand,
        netBalance,
        isDeficit,
      };
    });
  }, [bundeslaender, simulation]);

  // Overall Germany Totals
  const totalGermanDemand = useMemo(() => {
    return simulatedStates.reduce((acc, s) => acc + s.totalSimDemand, 0);
  }, [simulatedStates]);

  const totalGermanCapacity = useMemo(() => {
    return simulatedStates.reduce((acc, s) => acc + s.localProductionCapacityTonnes, 0);
  }, [simulatedStates]);

  const deficitStatesCount = useMemo(() => {
    return simulatedStates.filter((s) => s.isDeficit).length;
  }, [simulatedStates]);

  // Selected State Detail
  const activeState = useMemo(() => {
    return simulatedStates.find((s) => s.id === selectedStateId) || simulatedStates[0];
  }, [simulatedStates, selectedStateId]);

  // Chart Data: Top 10 States Comparison
  const barChartData = useMemo(() => {
    return simulatedStates.map((s) => ({
      name: s.code,
      fullName: s.nameDe,
      demand: convertTonnes(s.totalSimDemand, unit),
      capacity: convertTonnes(s.localProductionCapacityTonnes, unit),
      net: convertTonnes(s.netBalance, unit),
    }));
  }, [simulatedStates, unit]);

  // Sector Pie Chart Data for Germany
  const sectorPieData = useMemo(() => {
    const totals: Record<FluidSector, number> = {
      automotive_pcmo: 0,
      transport_hdeo: 0,
      industrial_metalworking: 0,
      wind_renewable: 0,
      chemical_process: 0,
      marine_inland: 0,
      agri_forestry: 0,
    };

    simulatedStates.forEach((s) => {
      totals.automotive_pcmo += s.simulatedDemandTonnes.automotive_pcmo;
      totals.transport_hdeo += s.simulatedDemandTonnes.transport_hdeo;
      totals.industrial_metalworking += s.simulatedDemandTonnes.industrial_metalworking;
      totals.wind_renewable += s.simulatedDemandTonnes.wind_renewable;
      totals.chemical_process += s.simulatedDemandTonnes.chemical_process;
      totals.marine_inland += s.simulatedDemandTonnes.marine_inland;
      totals.agri_forestry += s.simulatedDemandTonnes.agri_forestry;
    });

    return FLUID_SECTORS.map((sec) => ({
      id: sec.id,
      name: lang === 'de' ? sec.nameDe.split(' ')[0] : sec.nameEn.split(' ')[0],
      fullName: lang === 'de' ? sec.nameDe : sec.nameEn,
      value: convertTonnes(totals[sec.id], unit),
      color: sec.color,
    }));
  }, [simulatedStates, unit, lang]);

  // Selected State Radar Data
  const stateRadarData = useMemo(() => {
    if (!activeState) return [];
    return FLUID_SECTORS.map((sec) => ({
      subject: lang === 'de' ? sec.nameDe.split(' ')[0] : sec.nameEn.split(' ')[0],
      demand: convertTonnes(activeState.simulatedDemandTonnes[sec.id], unit),
      fullMark: 50000,
    }));
  }, [activeState, unit, lang]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-slate-800">
      
      {/* Top Banner & Technical KPI Stat Row */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-purple-200 p-5 rounded-2xl shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <div className="bg-purple-600 p-1.5 rounded-lg text-white shadow-sm shadow-purple-500/20">
                <Scale className="w-4 h-4" />
              </div>
              <h2 className="text-base font-black text-purple-950 tracking-tight uppercase">
                {lang === 'de'
                  ? '16 BUNDESLÄNDER SCHMIERSTOFF-BEDARFS- & VERSORGUNGSBILANZ'
                  : '16 FEDERAL STATES LUBRICANT SUPPLY-DEMAND BALANCER'}
              </h2>
            </div>
            <p className="text-[11px] text-purple-700 mt-1 font-mono">
              {lang === 'de'
                ? 'Echtzeit-Simulation von Defiziten, Raffinerie-Kapazitäten und überregionalen Logistik-Korridoren'
                : 'Real-time simulation of state deficits, refinery blending capacity, and inter-state logistics corridors'}
            </p>
          </div>
          <span className="status-badge bg-purple-100 text-purple-900 border border-purple-200 self-start md:self-auto font-bold text-[10px]">
            REF: DIN-51524 / ISO-VG
          </span>
        </div>

        {/* High-Contrast Technical KPI Row with border-l-4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 border-l-4 border-purple-600 border-t border-r border-b border-purple-200 rounded-xl shadow-xs flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">
              {lang === 'de' ? 'Gesamtbedarf DE (t/J)' : 'Total Market Demand'}
            </span>
            <div className="text-2xl font-black text-purple-950 font-mono mt-1">
              {formatNumber(convertTonnes(totalGermanDemand, unit))}
            </div>
            <div className="flex items-center justify-between text-[10px] mt-1 font-mono">
              <span className="text-purple-700 font-bold">{formatUnitLabel(unit, lang)}</span>
              <span className="text-slate-500">{lang === 'de' ? '16 Länder Summe' : '16 States Total'}</span>
            </div>
          </div>

          <div className="bg-white p-4 border-l-4 border-cyan-600 border-t border-r border-b border-purple-200 rounded-xl shadow-xs flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">
              {lang === 'de' ? 'Blending & Raffinerie Kapazität' : 'Refinery / Blending Cap'}
            </span>
            <div className="text-2xl font-black text-cyan-900 font-mono mt-1">
              {formatNumber(convertTonnes(totalGermanCapacity, unit))}
            </div>
            <div className="flex items-center justify-between text-[10px] mt-1 font-mono">
              <span className="text-cyan-700 font-bold">{formatUnitLabel(unit, lang)}</span>
              <span className="text-emerald-700 font-bold">14 Blending Hubs</span>
            </div>
          </div>

          <div className="bg-white p-4 border-l-4 border-rose-500 border-t border-r border-b border-purple-200 rounded-xl shadow-xs flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">
              {lang === 'de' ? 'Bundesländer im Defizit' : 'Deficit States'}
            </span>
            <div className="text-2xl font-black text-rose-600 font-mono mt-1">
              {deficitStatesCount} <span className="text-sm font-normal text-slate-400">/ 16</span>
            </div>
            <div className="flex items-center justify-between text-[10px] mt-1 font-mono">
              <span className="text-rose-600 font-bold">Netto-Unterversorgung</span>
              <span className="status-badge bg-rose-50 text-rose-700 border border-rose-200 font-bold">CRITICAL</span>
            </div>
          </div>

          <div className="bg-white p-4 border-l-4 border-emerald-600 border-t border-r border-b border-purple-200 rounded-xl shadow-xs flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">
              {lang === 'de' ? 'Bio-Lube & H1 Quote' : 'Bio-Lube / H1 Share'}
            </span>
            <div className="text-2xl font-black text-emerald-800 font-mono mt-1">
              {(12.4 + simulation.bioLubeMandatePercent * 0.4).toFixed(1)}%
            </div>
            <div className="flex items-center justify-between text-[10px] mt-1 font-mono">
              <span className="text-emerald-700 font-bold">RAL-UZ 178 / NSF-H1</span>
              <span className="text-slate-500">Target: 20% by 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Levers (What-If Simulator) */}
      <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-100">
          <div className="flex items-center space-x-2">
            <div className="bg-purple-100 p-1.5 rounded-lg text-purple-700">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <span className="font-black text-xs uppercase font-mono text-purple-950 tracking-wider">
              {lang === 'de' ? 'MARKT-SZENARIEN SIMULATOR (WHAT-IF LEVERS)' : 'MARKET SCENARIO SIMULATOR'}
            </span>
          </div>
          <button
            onClick={handleResetSimulation}
            className="flex items-center space-x-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-xs font-mono text-purple-800 rounded-lg border border-purple-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{lang === 'de' ? 'RESET LEVERS' : 'RESET LEVERS'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          
          {/* Wind Expansion */}
          <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-200/80 space-y-2">
            <div className="flex justify-between items-center text-slate-800 font-medium">
              <span className="flex items-center space-x-1.5 font-mono text-[11px]">
                <Wind className="w-3.5 h-3.5 text-cyan-600" />
                <span>Windkraft Zubau</span>
              </span>
              <span className="font-mono text-cyan-700 font-bold">+{simulation.windCapacityGrowthPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={simulation.windCapacityGrowthPercent}
              onChange={(e) => setSimulation({ ...simulation, windCapacityGrowthPercent: Number(e.target.value) })}
              className="w-full accent-cyan-600 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 font-mono">ISO VG 320/460 PAO Synthetic</div>
          </div>

          {/* Automotive ICE Fleet Transition */}
          <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-200/80 space-y-2">
            <div className="flex justify-between items-center text-slate-800 font-medium">
              <span className="flex items-center space-x-1.5 font-mono text-[11px]">
                <Activity className="w-3.5 h-3.5 text-rose-600" />
                <span>Verbrenner Wandel</span>
              </span>
              <span className="font-mono text-rose-600 font-bold">-{simulation.automotiveIceDeclinePercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="5"
              value={simulation.automotiveIceDeclinePercent}
              onChange={(e) => setSimulation({ ...simulation, automotiveIceDeclinePercent: Number(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 font-mono">EV Shift / PCMO Volume</div>
          </div>

          {/* Machine Tooling Surge */}
          <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-200/80 space-y-2">
            <div className="flex justify-between items-center text-slate-800 font-medium">
              <span className="flex items-center space-x-1.5 font-mono text-[11px]">
                <Factory className="w-3.5 h-3.5 text-emerald-600" />
                <span>Maschinenbau</span>
              </span>
              <span className="font-mono text-emerald-700 font-bold">+{simulation.machineToolingSurgePercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="5"
              value={simulation.machineToolingSurgePercent}
              onChange={(e) => setSimulation({ ...simulation, machineToolingSurgePercent: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 font-mono">MWF & HLP/HVLP Fluids</div>
          </div>

          {/* HDEO Transport Growth */}
          <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-200/80 space-y-2">
            <div className="flex justify-between items-center text-slate-800 font-medium">
              <span className="flex items-center space-x-1.5 font-mono text-[11px]">
                <Truck className="w-3.5 h-3.5 text-purple-600" />
                <span>Schwerlast Transit</span>
              </span>
              <span className="font-mono text-purple-800 font-bold">+{simulation.hdeoTransportGrowthPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={simulation.hdeoTransportGrowthPercent}
              onChange={(e) => setSimulation({ ...simulation, hdeoTransportGrowthPercent: Number(e.target.value) })}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 font-mono">Autobahn Fleet Demand</div>
          </div>

          {/* Bio-Lube Mandate */}
          <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-200/80 space-y-2">
            <div className="flex justify-between items-center text-slate-800 font-medium">
              <span className="flex items-center space-x-1.5 font-mono text-[11px]">
                <Leaf className="w-3.5 h-3.5 text-lime-600" />
                <span>Bio-Lube Quote</span>
              </span>
              <span className="font-mono text-lime-700 font-bold">+{simulation.bioLubeMandatePercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={simulation.bioLubeMandatePercent}
              onChange={(e) => setSimulation({ ...simulation, bioLubeMandatePercent: Number(e.target.value) })}
              className="w-full accent-lime-600 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 font-mono">HEES / HEPG Ester Fluids</div>
          </div>

        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: State Demand vs Capacity (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-purple-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-purple-950 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>{lang === 'de' ? 'Bedarf vs. Lokale Produktionskapazität nach Bundesland' : 'Demand vs. Local Production by State'}</span>
            </h3>
            <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
              {formatUnitLabel(unit, lang)}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e9d5ff', borderRadius: '12px', fontSize: '12px', color: '#1e1b4b', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(val: number) => [`${formatNumber(val)} ${formatUnitLabel(unit, lang)}`]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="demand" name={lang === 'de' ? 'Bedarf' : 'Demand'} fill="#9333ea" radius={[4, 4, 0, 0]} />
                <Bar dataKey="capacity" name={lang === 'de' ? 'Produktion' : 'Capacity'} fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: German Sector Fluid Breakdown (1 Col) */}
        <div className="bg-white border border-purple-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-purple-950">
              {lang === 'de' ? 'Sektor-Bedarfsanteile DE' : 'German Fluid Sector Mix'}
            </h3>
            <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded border border-purple-200 font-bold">7 Sektoren</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sectorPieData.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e9d5ff', borderRadius: '12px', fontSize: '11px', color: '#1e1b4b', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(val: number) => [`${formatNumber(val)} ${formatUnitLabel(unit, lang)}`]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono pt-2 border-t border-purple-100">
            {sectorPieData.slice(0, 4).map((sec) => (
              <div key={sec.id} className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sec.color }} />
                <span className="text-slate-700 truncate">{sec.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Main 16 Bundesländer Interactive Master Table */}
      <div className="bg-white border border-purple-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-purple-50/50 border-b border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="status-badge bg-purple-100 text-purple-900 border border-purple-300 font-bold text-[10px]">
                16 STATES DATA GRID
              </span>
              <h3 className="font-black text-xs uppercase tracking-tight text-purple-950">
                {lang === 'de' ? '16 Bundesländer Detail-Matrix & Netto-Bilanzen' : '16 Federal States Detailed Supply-Demand Matrix'}
              </h3>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              {lang === 'de' ? 'Klicken Sie auf ein Bundesland für Sektor-Profile und Transport-Korridore' : 'Click a state row to inspect specific fluid demands & logistics arteries'}
            </p>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{lang === 'de' ? 'Überschuss' : 'Surplus'}</span>
            </span>
            <span className="flex items-center space-x-1 text-rose-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{lang === 'de' ? 'Defizit' : 'Deficit'}</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-purple-50 text-purple-900 font-mono text-[10px] uppercase border-b border-purple-200">
              <tr>
                <th className="py-2.5 px-3.5">Code</th>
                <th className="py-2.5 px-3.5">{lang === 'de' ? 'Bundesland' : 'Federal State'}</th>
                <th className="py-2.5 px-3 text-right">PCMO</th>
                <th className="py-2.5 px-3 text-right">HDEO</th>
                <th className="py-2.5 px-3 text-right">{lang === 'de' ? 'Industrie' : 'Industrial'}</th>
                <th className="py-2.5 px-3 text-right">Wind</th>
                <th className="py-2.5 px-3 text-right">{lang === 'de' ? 'Gesamtbedarf' : 'Total Demand'}</th>
                <th className="py-2.5 px-3 text-right">{lang === 'de' ? 'Produktion' : 'Capacity'}</th>
                <th className="py-2.5 px-3.5 text-right">{lang === 'de' ? 'Netto-Bilanz' : 'Net Balance'}</th>
                <th className="py-2.5 px-3 text-center">{lang === 'de' ? 'Risiko' : 'Risk'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 font-mono text-[11px]">
              {simulatedStates.map((st) => {
                const isSelected = st.id === selectedStateId;
                const net = st.netBalance;
                return (
                  <tr
                    key={st.id}
                    onClick={() => {
                      setSelectedStateId(st.id);
                      if (onSelectState) onSelectState(st.id);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-purple-100/90 text-purple-950 font-bold border-l-4 border-purple-600'
                        : 'hover:bg-purple-50/60 text-slate-700'
                    }`}
                  >
                    <td className="py-2.5 px-3.5 font-bold text-purple-700">{st.code}</td>
                    <td className="py-2.5 px-3.5 font-sans font-semibold text-slate-900 flex items-center space-x-1.5">
                      <span>{st.nameDe}</span>
                      {isSelected && <span className="status-badge bg-purple-600 text-white text-[8px] font-bold">ACTIVE</span>}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      {formatNumber(convertTonnes(st.simulatedDemandTonnes.automotive_pcmo, unit))}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      {formatNumber(convertTonnes(st.simulatedDemandTonnes.transport_hdeo, unit))}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      {formatNumber(convertTonnes(st.simulatedDemandTonnes.industrial_metalworking, unit))}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      {formatNumber(convertTonnes(st.simulatedDemandTonnes.wind_renewable, unit))}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-purple-950">
                      {formatNumber(convertTonnes(st.totalSimDemand, unit))}
                    </td>
                    <td className="py-2.5 px-3 text-right text-cyan-700 font-semibold">
                      {formatNumber(convertTonnes(st.localProductionCapacityTonnes, unit))}
                    </td>
                    <td className={`py-2.5 px-3.5 text-right font-bold ${net >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {net >= 0 ? '+' : ''}{formatNumber(convertTonnes(net, unit))}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`status-badge inline-block ${
                          st.deficitRiskScore > 60
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 font-bold'
                            : st.deficitRiskScore > 35
                            ? 'bg-purple-100 text-purple-800 border border-purple-200 font-bold'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                        }`}
                      >
                        {st.deficitRiskScore}/100
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected State Drilldown & Logistics Corridor Section */}
      {activeState && (
        <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-purple-100 gap-2">
            <div>
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase bg-purple-100 text-purple-900 border border-purple-200">
                {lang === 'de' ? 'BUNDESLAND DEEP DIVE' : 'STATE DEEP DIVE'}
              </span>
              <h3 className="text-base font-extrabold text-purple-950 mt-1">
                {activeState.nameDe} ({activeState.code}) – {lang === 'de' ? 'Hauptstadt' : 'Capital'}: {activeState.capital}
              </h3>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="text-slate-500">
                {lang === 'de' ? 'Einwohner' : 'Population'}: <strong className="text-purple-950">{formatNumber(activeState.population)}</strong>
              </span>
              <span className="text-slate-500">
                BIP: <strong className="text-purple-950">{activeState.gdpBillionEur} Mrd. €</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Sector Demand Radar */}
            <div className="bg-purple-50/40 p-4 rounded-xl border border-purple-200 flex flex-col justify-between">
              <div className="text-xs font-bold text-purple-950 mb-2">
                {lang === 'de' ? 'Sektorale Nachfrageverteilung' : 'Sector Demand Profile'}
              </div>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={stateRadarData}>
                    <PolarGrid stroke="#e9d5ff" />
                    <PolarAngleAxis dataKey="subject" stroke="#6b21a8" fontSize={9} />
                    <Radar name={activeState.nameDe} dataKey="demand" stroke="#9333ea" fill="#a855f7" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Active Refineries & Key Plants */}
            <div className="bg-purple-50/40 p-4 rounded-xl border border-purple-200 space-y-2">
              <div className="text-xs font-bold text-purple-950 flex items-center space-x-1.5">
                <Factory className="w-3.5 h-3.5 text-purple-600" />
                <span>{lang === 'de' ? 'Raffinerien & Blending-Werke vor Ort' : 'Local Refineries & Plants'}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activeState.activeRefineriesBlendingPlants.map((plant, i) => (
                  <li key={i} className="p-2.5 bg-white rounded-lg border border-purple-200 flex items-center space-x-2 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                    <span className="font-medium text-[11px] text-purple-950">{plant}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Logistics Corridors & Transport Arteries */}
            <div className="bg-purple-50/40 p-4 rounded-xl border border-purple-200 space-y-2">
              <div className="text-xs font-bold text-purple-950 flex items-center space-x-1.5">
                <Truck className="w-3.5 h-3.5 text-purple-600" />
                <span>{lang === 'de' ? 'Wichtigste Logistik-Korridore' : 'Key Logistics Arteries'}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activeState.keyLogisticsCorridors.map((corr, i) => (
                  <li key={i} className="p-2.5 bg-white rounded-lg border border-purple-200 flex items-center space-x-2 shadow-xs">
                    <ArrowRight className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span className="font-mono text-[11px] text-purple-900 font-semibold">{corr}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-purple-200 text-[11px] text-slate-600">
                <span className="font-semibold text-purple-950">{lang === 'de' ? 'Primäre Vertriebspartner' : 'Primary Channels'}:</span>{' '}
                {activeState.primaryChannelPartners.join(', ')}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
