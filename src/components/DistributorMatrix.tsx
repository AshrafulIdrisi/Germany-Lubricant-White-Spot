import React, { useState, useMemo } from 'react';
import { 
  ChannelDistributor, 
  FluidSector, 
  Language, 
  MetricUnit 
} from '../types';
import { CHANNEL_DISTRIBUTORS, MAJOR_LUBRICANT_BRANDS } from '../data/brandsAndDistributors';
import { FLUID_SECTORS } from '../data/fluidSpecs';
import { convertTonnes, formatUnitLabel, formatNumber } from '../utils/exportUtils';
import { 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  Truck, 
  Building2, 
  Layers, 
  Clock, 
  Award, 
  Leaf, 
  Search, 
  AlertTriangle, 
  ArrowRight, 
  Check, 
  X,
  Sparkles,
  BarChart3,
  PieChart as PieIcon,
  Warehouse,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Activity,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Cell 
} from 'recharts';

interface DistributorMatrixProps {
  lang: Language;
  unit: MetricUnit;
}

export const DistributorMatrix: React.FC<DistributorMatrixProps> = ({
  lang,
  unit,
}) => {
  const [activeViewTab, setActiveViewTab] = useState<'overall' | 'benchmark' | 'directory' | 'brands'>('overall');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'COOPERATIVE_AGRI' | 'INDEPENDENT_WHOLESALER'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([
    'baywa_ag',
    'hoyer_gruppe',
  ]);

  // Lead-time & Tank Storage Simulation State
  const [simDailyDemandLitre, setSimDailyDemandLitre] = useState(1500); // 1,500 L / day
  const [simSafetyBufferDays, setSimSafetyBufferDays] = useState(7); // 7 days safety buffer

  // Aggregated Wholesale Infrastructure KPIs
  const totalDepots = useMemo(() => CHANNEL_DISTRIBUTORS.reduce((acc, d) => acc + d.activeDepotsCount, 0), []);
  const totalTrucks = useMemo(() => CHANNEL_DISTRIBUTORS.reduce((acc, d) => acc + d.fleetTrucks, 0), []);
  const totalTankStorageTonnes = useMemo(() => CHANNEL_DISTRIBUTORS.reduce((acc, d) => acc + d.tankStorageTotalTonnes, 0), []);
  const totalLubricantVolumeTonnes = useMemo(() => CHANNEL_DISTRIBUTORS.reduce((acc, d) => acc + d.annualThroughputTonnes, 0), []);
  const avgLeadTimeHours = useMemo(() => (CHANNEL_DISTRIBUTORS.reduce((acc, d) => acc + d.averageLeadTimeHours, 0) / CHANNEL_DISTRIBUTORS.length).toFixed(1), []);
  const avgEsgScore = useMemo(() => Math.round(CHANNEL_DISTRIBUTORS.reduce((acc, d) => acc + d.esgBioComplianceScore, 0) / CHANNEL_DISTRIBUTORS.length), []);

  // Filter Distributors
  const filteredDistributors = useMemo(() => {
    return CHANNEL_DISTRIBUTORS.filter((d) => {
      if (activeCategory !== 'ALL' && d.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.headquarters.toLowerCase().includes(q) ||
          d.primaryBrandsCarried.some((b) => b.toLowerCase().includes(q)) ||
          d.coverageStates.some((s) => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Comparison Partners
  const comparedPartners = useMemo(() => {
    return CHANNEL_DISTRIBUTORS.filter((d) => selectedForComparison.includes(d.id));
  }, [selectedForComparison]);

  const toggleCompare = (id: string) => {
    if (selectedForComparison.includes(id)) {
      if (selectedForComparison.length > 1) {
        setSelectedForComparison(selectedForComparison.filter((item) => item !== id));
      }
    } else {
      if (selectedForComparison.length < 3) {
        setSelectedForComparison([...selectedForComparison, id]);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-slate-800">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-purple-200 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <div className="bg-purple-600 p-1.5 rounded-lg text-white shadow-sm shadow-purple-500/20">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black text-purple-950 tracking-tight uppercase">
              {lang === 'de'
                ? 'VERTRIEBSPARTNER-GESUNDHEIT & CHANNEL CONFLICT MATRIX'
                : 'CHANNEL DISTRIBUTOR HEALTH & PORTFOLIO CONFLICT MATRIX'}
            </h2>
          </div>
          <p className="text-[11px] text-purple-700 mt-1 font-mono">
            {lang === 'de'
              ? 'Aggregierte Analyse deutscher Agrar-Genossenschaften (BayWa, AGRAVIS, RWZ) & Mineralöl-Großhändler (Hoyer, AVIA, Westfalen)'
              : 'Evaluation of major German agricultural cooperatives, private fuel wholesalers, fleet lead-times, and brand conflict risks'}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 font-semibold">
            {lang === 'de' ? 'WHOLESALERS' : 'WHOLESALERS'}: <strong className="text-purple-700 font-black">{CHANNEL_DISTRIBUTORS.length}</strong>
          </span>
          <span className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 font-semibold">
            {lang === 'de' ? 'DEPOTS GESAMT' : 'TOTAL DEPOTS'}: <strong className="text-purple-700 font-black">{totalDepots}</strong>
          </span>
        </div>
      </div>

      {/* Top Level Business KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
        <div className="bg-white border border-purple-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] text-purple-800 font-bold uppercase block">{lang === 'de' ? 'Depot-Netzwerk' : 'Active Depots'}</span>
          <div className="text-xl font-black text-purple-950 mt-1">{totalDepots}</div>
          <span className="text-[9.5px] text-purple-600">Standorte (DE)</span>
        </div>

        <div className="bg-white border border-purple-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] text-purple-800 font-bold uppercase block">{lang === 'de' ? 'Lkw-Tankflotte' : 'Delivery Fleet'}</span>
          <div className="text-xl font-black text-purple-950 mt-1">{formatNumber(totalTrucks)}</div>
          <span className="text-[9.5px] text-purple-600">ADR Tankzüge</span>
        </div>

        <div className="bg-white border border-purple-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] text-purple-800 font-bold uppercase block">{lang === 'de' ? 'Tanklager-Cap' : 'Storage Cap'}</span>
          <div className="text-xl font-black text-purple-950 mt-1">{formatNumber(convertTonnes(totalTankStorageTonnes, unit))}</div>
          <span className="text-[9.5px] text-purple-600">{formatUnitLabel(unit, lang)} Puffer</span>
        </div>

        <div className="bg-white border border-purple-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] text-purple-800 font-bold uppercase block">{lang === 'de' ? 'Jahres-Umsatzvolumen' : 'Annual Volume'}</span>
          <div className="text-xl font-black text-emerald-600 mt-1">{formatNumber(convertTonnes(totalLubricantVolumeTonnes, unit))}</div>
          <span className="text-[9.5px] text-emerald-700">{formatUnitLabel(unit, lang)} / Jahr</span>
        </div>

        <div className="bg-white border border-purple-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] text-purple-800 font-bold uppercase block">{lang === 'de' ? 'Ø Lieferzeit (SLA)' : 'Avg Delivery SLA'}</span>
          <div className="text-xl font-black text-indigo-600 mt-1">{avgLeadTimeHours}h</div>
          <span className="text-[9.5px] text-indigo-700">Bundesweit</span>
        </div>

        <div className="bg-white border border-purple-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] text-purple-800 font-bold uppercase block">{lang === 'de' ? 'ESG / Bio-Readiness' : 'Bio Readiness'}</span>
          <div className="text-xl font-black text-purple-950 mt-1">{avgEsgScore} / 100</div>
          <span className="text-[9.5px] text-emerald-600 font-bold">RAL-UZ 178 Ready</span>
        </div>
      </div>

      {/* Navigation View Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-purple-200/60 pb-3">
        <button
          onClick={() => setActiveViewTab('overall')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
            activeViewTab === 'overall'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20'
              : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <PieIcon className="w-3.5 h-3.5" />
          <span>{lang === 'de' ? '0. Gesamt-Netzwerk & Großhandels-Infrastruktur' : '0. Wholesale Network & Infrastructure'}</span>
        </button>

        <button
          onClick={() => setActiveViewTab('benchmark')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
            activeViewTab === 'benchmark'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20'
              : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{lang === 'de' ? '1. Direkter 3-Partner Vergleich & Simulation' : '1. Direct Partner Comparison'}</span>
        </button>

        <button
          onClick={() => setActiveViewTab('directory')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
            activeViewTab === 'directory'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20'
              : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{lang === 'de' ? '2. Großhändler-Verzeichnis (8 Großkonzerne)' : '2. Distributor Directory'}</span>
        </button>

        <button
          onClick={() => setActiveViewTab('brands')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
            activeViewTab === 'brands'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20'
              : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{lang === 'de' ? '3. Führende Schmierstoffhersteller (10 Brands)' : '3. Leading Manufacturers'}</span>
        </button>
      </div>

      {/* View Tab 0: Overall Distributor Network Infrastructure */}
      {activeViewTab === 'overall' && (
        <div className="space-y-6">
          {/* Wholesale Volume & Fleet Capacity Recharts Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white border border-purple-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  <h3 className="font-black text-xs uppercase text-purple-950 font-mono">
                    {lang === 'de' ? 'GROSSHÄNDLER DURCHSATZ (TONNEN/JAHR) & TANKLAGER' : 'DISTRIBUTOR VOLUME (TONNES/YR) & STORAGE'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 font-bold">
                  8 GROSSHÄNDLER
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={CHANNEL_DISTRIBUTORS.map(d => ({
                      name: d.name.split(' ')[0],
                      volume: d.annualThroughputTonnes,
                      storage: d.tankStorageTotalTonnes,
                      fullName: d.name
                    }))}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
                    <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 11, fontFamily: 'sans-serif' }} />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 11, fontFamily: 'monospace' }} unit=" t" />
                    <Tooltip
                      formatter={(val: any) => [`${formatNumber(val)} t`, '']}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#ddd6fe', borderRadius: '0.75rem', fontFamily: 'monospace', fontSize: '11px', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.1)' }}
                    />
                    <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="volume" name="Jahresvolumen (t)" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="storage" name="Tanklager-Cap (t)" fill="#c084fc" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regional Dominance & Cluster Breakdown */}
            <div className="lg:col-span-5 bg-white border border-purple-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <h3 className="font-black text-xs uppercase text-purple-950 font-mono">
                    {lang === 'de' ? 'REGIONALE DOMINANZ & KANAL-SPALTUNG' : 'REGIONAL DISTRIBUTION CLUSTERS'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">
                  DE GEBIETE
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { region: 'Süddeutschland (BY, BW)', leaders: 'BayWa AG (280 Depots) + AVIA Süd', fleet: '1.200 Lkw', color: 'border-purple-300 bg-purple-50/60' },
                  { region: 'Norddeutschland (NI, SH, HH, HB, MV)', leaders: 'Hoyer Gruppe (200 Depots) + team energie', fleet: '1.000 Lkw', color: 'border-indigo-300 bg-indigo-50/60' },
                  { region: 'Westdeutschland & Rheinland (NW, RP, SL, HE)', leaders: 'AGRAVIS (220 Depots) + RWZ (75 Depots) + Westfalen', fleet: '970 Lkw', color: 'border-purple-200 bg-purple-50/40' },
                  { region: 'Ostdeutschland (SN, ST, TH, BB, BE)', leaders: 'Raiffeisen Kassel + AGRAVIS Ost + Hoyer', fleet: '250 Lkw', color: 'border-purple-200 bg-purple-50/40' },
                ].map((item, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border ${item.color} space-y-1`}>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-900 font-sans">{item.region}</span>
                      <span className="text-purple-700 font-black">{item.fleet}</span>
                    </div>
                    <p className="text-[10.5px] text-slate-600 font-sans leading-tight">
                      Dominante Kanäle: <strong className="text-purple-950">{item.leaders}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Channel Comparison Matrix: Cooperatives vs Independent Wholesalers */}
          <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center space-x-2">
                <Warehouse className="w-4 h-4 text-purple-600" />
                <h3 className="font-black text-xs uppercase text-purple-950 font-mono">
                  {lang === 'de' ? 'KANAL-VERGLEICH: AGRAR-GENOSSENSCHAFTEN VS. FREIE MINERALÖLHÄNDLER' : 'CHANNEL COMPARISON: AGRI COOPERATIVES VS. FUEL WHOLESALERS'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 font-bold">
                KANAL-PROFIL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-emerald-950 uppercase font-sans">1. Agrar-Genossenschaften</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">BayWa, AGRAVIS, RWZ, Kassel</span>
                </div>
                <ul className="space-y-2 text-[11px] text-slate-700 font-sans">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Massives Depotnetz:</strong> 607 Standorte mit flächendeckender ländlicher Anbindung und eigener Werkstattinfrastruktur.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Private-Label Dominanz:</strong> Starker Vertrieb von Eigenmarken (z.B. TECTROL) mit hoher Marge für die Genossenschaft.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Marken-Konflikt-Risiko:</strong> Hohe Loyalität zu TECTROL erschwert die Platzierung von Drittmarken (Castrol, Shell).</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-purple-950 uppercase font-sans">2. Freie Mineralöl-Großhändler</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">Hoyer, AVIA, Westfalen, team</span>
                </div>
                <ul className="space-y-2 text-[11px] text-slate-700 font-sans">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Schnellste Flotten-SLAs:</strong> Ø 19.5h Lieferzeit über dedizierte Autobahn-Depots und 1.250+ eigene Tankwagen.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Multi-Brand Neutralität:</strong> Breites Markensortiment (Shell, Mobil, Castrol, Fuchs, TotalEnergies) mit direktem Werkstattservice.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Flüssiggas & Kraftstoff-Kopplung:</strong> Attraktive Bündelverträge (Diesel + Motoröl + AdBlue) für gewerbliche Speditionen.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Strategic Action Plan for Wholesalers */}
          <div className="p-5 bg-gradient-to-br from-purple-900 to-indigo-950 rounded-2xl text-white shadow-md space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-300" />
              <h3 className="font-black text-sm uppercase tracking-wide">
                {lang === 'de' ? 'STRATEGISCHE DIREKTIVEN FÜR DIE PARTNER-SELEKTION' : 'EXECUTIVE DIRECTIVES FOR DISTRIBUTOR ENGAGEMENT'}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-purple-100">
              <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-purple-300 font-bold block text-[11px]">1. Dual-Sourcing Strategie</span>
                <p className="text-[11px] leading-relaxed text-purple-100/90 font-sans">
                  Kombination aus BayWa (Süd) und Hoyer (Nord) garantiert unter 24h Reaktionszeit für 94% der deutschen Industrie- und Agrar-Postleitzahlen.
                </p>
              </div>
              <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-purple-300 font-bold block text-[11px]">2. Bio-Schmierstoff Readiness</span>
                <p className="text-[11px] leading-relaxed text-purple-100/90 font-sans">
                  AGRAVIS und RWZ verfügen über die höchsten ESG-Compliance Scores (94/100) für forst- und wasserwirtschaftliche Ausschreibungen (Blauer Engel).
                </p>
              </div>
              <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-purple-300 font-bold block text-[11px]">3. MOQ & Sicherheitslager-Puffer</span>
                <p className="text-[11px] leading-relaxed text-purple-100/90 font-sans">
                  Großbetriebe mit &gt;1.500L Tagesbedarf sollten bei Hoyer oder AVIA feste 208L Fasskontingente sichern, um Transportzuschläge von bis zu €45/Palette zu vermeiden.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Tab 1: Direct Partner Comparison & Simulation */}
      {activeViewTab === 'benchmark' && (
        <div className="space-y-6">
          {/* Side-by-Side Comparison Engine */}
          <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center space-x-2">
                <span className="status-badge bg-purple-100 text-purple-900 border border-purple-200 font-bold text-[10px]">
                  BENCHMARK
                </span>
                <span className="font-black text-xs uppercase font-mono text-purple-950">
                  {lang === 'de' ? 'DIREKTER PARTNER-VERGLEICH (MAX. 3 PARTNER)' : 'DIRECT PARTNER COMPARISON (MAX 3)'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 font-bold">
                {selectedForComparison.length} / 3 {lang === 'de' ? 'AUSGEWÄHLT' : 'SELECTED'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparedPartners.map((partner) => {
                const conflictColor =
                  partner.conflictRiskRating === 'HIGH'
                    ? 'text-rose-700 bg-rose-50 border-rose-200 font-bold'
                    : partner.conflictRiskRating === 'MEDIUM'
                    ? 'text-purple-900 bg-purple-100 border-purple-200 font-bold'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold';

                const borderAccent =
                  partner.conflictRiskRating === 'HIGH'
                    ? 'border-l-4 border-rose-500'
                    : partner.conflictRiskRating === 'MEDIUM'
                    ? 'border-l-4 border-purple-600'
                    : 'border-l-4 border-emerald-500';

                // Tank Storage Requirement calculation
                const minTankSizeNeededLitre = (partner.averageLeadTimeHours / 24 + simSafetyBufferDays) * simDailyDemandLitre;

                return (
                  <div
                    key={partner.id}
                    className={`bg-white p-4 rounded-xl border border-purple-200/90 ${borderAccent} space-y-3 relative shadow-xs`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">
                          {partner.category === 'COOPERATIVE_AGRI' ? 'Agrar-Genossenschaft' : 'Freier Großhändler'}
                        </span>
                        <h3 className="font-black text-sm text-purple-950 uppercase">{partner.name}</h3>
                        <p className="text-[10px] text-slate-500 font-mono">{partner.headquarters}</p>
                      </div>
                      <span className={`status-badge ${conflictColor}`}>
                        {partner.conflictRiskRating} RISK
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-2 border-t border-purple-100">
                      <div className="bg-purple-50/50 p-2.5 rounded-lg border border-purple-200">
                        <span className="text-slate-500 uppercase block text-[8px] font-bold">{lang === 'de' ? 'Depots / Standorte' : 'Active Depots'}</span>
                        <span className="text-purple-950 font-black text-xs">{partner.activeDepotsCount}</span>
                      </div>

                      <div className="bg-purple-50/50 p-2.5 rounded-lg border border-purple-200">
                        <span className="text-slate-500 uppercase block text-[8px] font-bold">{lang === 'de' ? 'Lieferflotte (Lkw)' : 'Delivery Trucks'}</span>
                        <span className="text-purple-950 font-black text-xs">{partner.fleetTrucks}</span>
                      </div>

                      <div className="bg-purple-50/50 p-2.5 rounded-lg border border-purple-200">
                        <span className="text-slate-500 uppercase block text-[8px] font-bold">{lang === 'de' ? 'Tanklager Cap' : 'Storage Cap'}</span>
                        <span className="text-purple-950 font-bold text-xs">
                          {formatNumber(convertTonnes(partner.tankStorageTotalTonnes, unit))} {formatUnitLabel(unit, lang)}
                        </span>
                      </div>

                      <div className="bg-purple-50/50 p-2.5 rounded-lg border border-purple-200">
                        <span className="text-slate-500 uppercase block text-[8px] font-bold">{lang === 'de' ? 'Lieferzeit' : 'Avg Lead-Time'}</span>
                        <span className="text-emerald-700 font-bold text-xs">{partner.averageLeadTimeHours} Std.</span>
                      </div>
                    </div>

                    {/* Brands Carried */}
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1 font-bold">
                        {lang === 'de' ? 'Geführte Marken:' : 'Carried Brands:'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {partner.primaryBrandsCarried.map((brand, i) => (
                          <span key={i} className="status-badge bg-purple-50 text-purple-900 border border-purple-200 text-[9px] font-medium">
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Simulation Result Box */}
                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-[10px] font-mono space-y-1">
                      <div className="text-[9px] text-purple-900 font-bold flex items-center space-x-1 uppercase">
                        <Clock className="w-3 h-3 text-purple-600" />
                        <span>{lang === 'de' ? 'Tanklager-Bedarf für Betrieb' : 'Required Tank Buffer'}</span>
                      </div>
                      <div className="text-slate-700 flex justify-between">
                        <span>{lang === 'de' ? 'Empf. Tankvolumen:' : 'Rec. Tank Volume:'}</span>
                        <strong className="text-purple-950 font-bold">{formatNumber(Math.round(minTankSizeNeededLitre))} L</strong>
                      </div>
                      <div className="text-slate-700 flex justify-between">
                        <span>MOQ Mindestbestellung:</span>
                        <span className="text-slate-600">{partner.minOrderQuantityLitre} L</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed pt-1 font-sans">
                      {lang === 'de' ? partner.descriptionDe : partner.descriptionEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Demand & Buffer Simulation Control Panel */}
          <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <h3 className="font-black text-xs uppercase text-purple-950 font-mono">
                {lang === 'de' ? 'BETRIEBLICHE TANKLAGER-BEDARFS-SIMULATION' : 'OPERATIONAL TANK STORAGE SIMULATOR'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Täglicher Schmierstoffbedarf:</span>
                  <strong className="text-purple-950 font-bold">{simDailyDemandLitre} Liter / Tag</strong>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="100"
                  value={simDailyDemandLitre}
                  onChange={(e) => setSimDailyDemandLitre(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Gewünschte Sicherheits-Reichweite:</span>
                  <strong className="text-purple-950 font-bold">{simSafetyBufferDays} Tage Puffer</strong>
                </div>
                <input
                  type="range"
                  min="3"
                  max="30"
                  step="1"
                  value={simSafetyBufferDays}
                  onChange={(e) => setSimSafetyBufferDays(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Tab 2: Full Distributor Directory Table */}
      {(activeViewTab === 'directory' || activeViewTab === 'overall') && (
        <div className="bg-white border border-purple-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-purple-50/50 border-b border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Category Toggle */}
            <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-purple-200">
              <button
                onClick={() => setActiveCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  activeCategory === 'ALL' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-700 hover:text-purple-950'
                }`}
              >
                {lang === 'de' ? 'ALLE PARTNER' : 'ALL PARTNERS'}
              </button>
              <button
                onClick={() => setActiveCategory('COOPERATIVE_AGRI')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  activeCategory === 'COOPERATIVE_AGRI' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-700 hover:text-purple-950'
                }`}
              >
                {lang === 'de' ? 'AGRAR-GENOSSENSCHAFTEN' : 'AGRI COOPERATIVES'}
              </button>
              <button
                onClick={() => setActiveCategory('INDEPENDENT_WHOLESALER')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  activeCategory === 'INDEPENDENT_WHOLESALER' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-700 hover:text-purple-950'
                }`}
              >
                {lang === 'de' ? 'MINERALÖL-GROSSHÄNDLER' : 'FUEL WHOLESALERS'}
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-purple-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'de' ? 'Partner oder Marke suchen...' : 'Search partner or brand...'}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs text-slate-900 placeholder-purple-400 font-mono focus:outline-none focus:border-purple-600 transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-purple-50/80 text-purple-950 font-mono text-[10px] uppercase border-b border-purple-200">
                <tr>
                  <th className="py-3 px-3.5">{lang === 'de' ? 'Vergleich' : 'Compare'}</th>
                  <th className="py-3 px-4">{lang === 'de' ? 'Großhändler & Zentrale' : 'Distributor & HQ'}</th>
                  <th className="py-3 px-3.5">{lang === 'de' ? 'Kategorie' : 'Category'}</th>
                  <th className="py-3 px-3.5 text-right">Depots</th>
                  <th className="py-3 px-3.5 text-right">Flotte (Lkw)</th>
                  <th className="py-3 px-3.5 text-right">{lang === 'de' ? 'Lieferzeit' : 'Lead-Time'}</th>
                  <th className="py-3 px-4">{lang === 'de' ? 'Geführte Marken' : 'Carried Brands'}</th>
                  <th className="py-3 px-3.5 text-center">{lang === 'de' ? 'Konflikt-Risiko' : 'Conflict Risk'}</th>
                  <th className="py-3 px-3.5 text-center">{lang === 'de' ? 'ESG / Bio-Score' : 'Bio Score'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100 font-mono text-[11px]">
                {filteredDistributors.map((d) => {
                  const isCompared = selectedForComparison.includes(d.id);
                  return (
                    <tr key={d.id} className="data-row hover:bg-purple-50/60 transition-colors">
                      <td className="py-3 px-3.5">
                        <button
                          onClick={() => toggleCompare(d.id)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold font-mono transition-colors cursor-pointer ${
                            isCompared
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                          }`}
                        >
                          {isCompared ? '✓ AKTIV' : '+ VERGLEICH'}
                        </button>
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <div className="font-bold text-slate-900">{d.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{d.headquarters}</div>
                      </td>
                      <td className="py-3 px-3.5 text-[10px]">
                        {d.category === 'COOPERATIVE_AGRI' ? (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Agrar-Genossenschaft</span>
                        ) : (
                          <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">Mineralölhandel</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-right text-slate-900 font-bold">{d.activeDepotsCount}</td>
                      <td className="py-3 px-3.5 text-right text-slate-700">{d.fleetTrucks}</td>
                      <td className="py-3 px-3.5 text-right text-emerald-700 font-bold">{d.averageLeadTimeHours}h</td>
                      <td className="py-3 px-4 font-sans text-slate-700">
                        <div className="flex flex-wrap gap-1">
                          {d.primaryBrandsCarried.map((b, i) => (
                            <span key={i} className="status-badge bg-purple-50 border border-purple-200 text-purple-900 text-[9px] font-mono">
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span
                          className={`status-badge inline-block ${
                            d.conflictRiskRating === 'HIGH'
                              ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
                              : d.conflictRiskRating === 'MEDIUM'
                              ? 'bg-purple-100 text-purple-900 border-purple-200 font-bold'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold'
                          }`}
                        >
                          {d.conflictRiskRating}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span className="font-bold text-purple-900 font-mono">{d.esgBioComplianceScore} / 100</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Tab 3: Major Brands Catalog Subsection */}
      {(activeViewTab === 'brands' || activeViewTab === 'overall') && (
        <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-purple-600" />
            <h3 className="font-black text-xs uppercase text-purple-950 font-mono">
              {lang === 'de' ? 'FÜHRENDE SCHMIERSTOFFHERSTELLER IN DEUTSCHLAND' : 'MAJOR LUBRICANT MANUFACTURERS IN GERMANY'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {MAJOR_LUBRICANT_BRANDS.map((brand) => (
              <div key={brand.id} className="p-4 bg-purple-50/40 rounded-xl border border-purple-200 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">
                      {brand.country === 'DE' ? '🇩🇪 Deutsches Traditionshaus' : '🌍 Global Major'}
                    </span>
                    <h4 className="font-black text-sm text-purple-950 uppercase">{brand.name}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">{brand.headquarters}</p>
                  </div>
                  <span className="status-badge bg-purple-100 text-purple-900 border border-purple-200 font-mono font-bold text-xs">
                    {brand.marketShareDePercent}% MARKT
                  </span>
                </div>

                <div className="pt-2 border-t border-purple-100 space-y-1.5 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-500 uppercase block text-[8px] font-bold">Flaggschiff-Produktlinien:</span>
                    <span className="text-slate-800">{brand.flagshipLines.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase block text-[8px] font-bold">Wichtigste OEM-Freigaben:</span>
                    <span className="text-purple-800 text-[9px] font-semibold">{brand.oemApprovals.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
