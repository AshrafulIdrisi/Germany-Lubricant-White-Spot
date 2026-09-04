import { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShieldCheck,
  CreditCard,
  Leaf,
  Layers,
  Sparkles,
  PieChart as PieChartIcon,
  Activity,
  Sliders,
  Award,
  ChevronRight,
  Info,
  Building2,
  Zap,
  Target
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Language, MetricUnit } from '../types';
import {
  EXECUTIVE_PORTFOLIO_KPIS,
  CAPEX_PROJECT_PIPELINE,
  FLEET_CARD_PAYMENT_METRICS,
  THG_REGULATORY_ARBITRAGE,
  STRATEGIC_LEADERSHIP_SCENARIOS
} from '../data/leadershipData';

interface ExecutiveLeadershipCockpitProps {
  lang: Language;
  unit: MetricUnit;
}

export function ExecutiveLeadershipCockpit({ lang }: ExecutiveLeadershipCockpitProps) {
  const [selectedScenario, setSelectedScenario] = useState<'conservative' | 'baseline' | 'aggressive'>('baseline');
  const [activeSubView, setActiveSubView] = useState<'overview' | 'capex_pipeline' | 'fleet_interchange' | 'thg_esg'>('overview');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(CAPEX_PROJECT_PIPELINE[0].id);
  const [hurdleRate, setHurdleRate] = useState<number>(8.0); // % minimum IRR required
  const [customFleetVolumeM3, setCustomFleetVolumeM3] = useState<number>(120000); // 120,000 m3 annual company fleet volume
  const [propCardShareGoal, setPropCardShareGoal] = useState<number>(55); // target 55% proprietary card share

  const isDe = lang === 'de';

  const currentScenario = STRATEGIC_LEADERSHIP_SCENARIOS[selectedScenario];

  // Dynamic portfolio calculations based on Hurdle Rate and Scenario
  const qualifiedProjects = useMemo(() => {
    return CAPEX_PROJECT_PIPELINE.filter(p => p.projectIrrPercent >= hurdleRate);
  }, [hurdleRate]);

  const totalAllocatedCapex = useMemo(() => {
    return qualifiedProjects.reduce((sum, p) => sum + p.capexEur, 0);
  }, [qualifiedProjects]);

  const totalProjectedAnnualEbitda = useMemo(() => {
    return qualifiedProjects.reduce((sum, p) => sum + p.expectedAnnualEbitdaEur, 0);
  }, [qualifiedProjects]);

  const portfolioWeightedIrr = useMemo(() => {
    if (totalAllocatedCapex === 0) return 0;
    const weightedSum = qualifiedProjects.reduce((sum, p) => sum + (p.projectIrrPercent * p.capexEur), 0);
    return (weightedSum / totalAllocatedCapex).toFixed(1);
  }, [qualifiedProjects, totalAllocatedCapex]);

  const totalTenYearNpv = useMemo(() => {
    return qualifiedProjects.reduce((sum, p) => sum + p.tenYearNpvEur, 0);
  }, [qualifiedProjects]);

  // Selected project details
  const selectedProject = useMemo(() => {
    return CAPEX_PROJECT_PIPELINE.find(p => p.id === selectedProjectId) || CAPEX_PROJECT_PIPELINE[0];
  }, [selectedProjectId]);

  // Fleet card savings calculation (shifting 1% from third-party aggregators to proprietary card)
  const fleetInterchangeSavings = useMemo(() => {
    const baselinePropShare = 38.5;
    const shiftPercent = Math.max(0, propCardShareGoal - baselinePropShare);
    const shiftedVolumeLiters = (customFleetVolumeM3 * 1000) * (shiftPercent / 100);
    // Average fee difference between DKV/UTA/Routex (~1.9%) and Proprietary (~0.25%) at €1.65/L = 2.72 ct/L saved
    const avgFeeSavingPerLitre = 0.0272;
    const annualCashSavingsEur = shiftedVolumeLiters * avgFeeSavingPerLitre;
    return {
      shiftPercent,
      shiftedVolumeLiters,
      annualCashSavingsEur,
      fiveYearCumulatedCashEur: annualCashSavingsEur * 5
    };
  }, [customFleetVolumeM3, propCardShareGoal]);

  // Total THG Quoten generation summary
  const totalThgRevenue = useMemo(() => {
    return THG_REGULATORY_ARBITRAGE.reduce((sum, item) => sum + item.totalAnnualThgRevenueEur, 0);
  }, []);

  const totalCo2eAbated = useMemo(() => {
    return THG_REGULATORY_ARBITRAGE.reduce((sum, item) => sum + item.co2eAbatementTonnesPerYear, 0);
  }, []);

  // Format currency
  const formatEur = (val: number) => {
    if (val >= 1000000) {
      return `€${(val / 1000000).toFixed(2)}M`;
    }
    if (val >= 1000) {
      return `€${(val / 1000).toFixed(0)}k`;
    }
    return `€${val.toFixed(0)}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top C-Level Briefing Bar */}
      <div className="bg-white border border-purple-100 shadow-sm rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-purple-100 text-purple-800 border border-purple-200">
                {isDe ? 'C-Level Führungscockpit' : 'C-Suite Executive Cockpit'}
              </span>
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {isDe ? 'Vorstandsbeschluss-Bereit (Q3/Q4 2026)' : 'Board-Ready Strategic Baseline'}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
              {isDe 
                ? 'Strategische Kapitalallokation, Marge & ESG-Arbitrage' 
                : 'Strategic Capital Allocation, Margin & ESG Arbitrage'}
            </h1>
            <p className="text-sm text-slate-700 mt-1 max-w-3xl">
              {isDe
                ? 'Ganzheitliche Steuerung von CapEx-Investitionen, IRR-Hurdle-Rates, THG-Quoten-Monetarisierung und Flottenkarten-Margenoptimierung für das gesamte Bundesgebiet.'
                : 'Executive management of CapEx pipelines, IRR hurdle rates, THG-Quota monetization, and fleet card margin optimization across Germany.'}
            </p>
          </div>

          {/* Strategic Scenario Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-700 px-2 uppercase tracking-wider flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-purple-600" />
              {isDe ? 'Szenario:' : 'Scenario:'}
            </span>
            {(['conservative', 'baseline', 'aggressive'] as const).map((scKey) => {
              const sc = STRATEGIC_LEADERSHIP_SCENARIOS[scKey];
              const isSelected = selectedScenario === scKey;
              return (
                <button
                  key={scKey}
                  onClick={() => setSelectedScenario(scKey)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-purple-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {isDe 
                    ? (scKey === 'conservative' ? 'Konservativ' : scKey === 'baseline' ? 'Ausgewogen (Standard)' : 'Aggressiv / Dominanz')
                    : (scKey === 'conservative' ? 'Conservative' : scKey === 'baseline' ? 'Balanced (Baseline)' : 'Aggressive Dominance')}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6 High-Impact Executive KPI Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-6 relative z-10">
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-lg p-3.5 hover:border-purple-300 transition-colors">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              {isDe ? 'Gesamtmarkt (TAM)' : 'Total Market TAM'}
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {formatEur(EXECUTIVE_PORTFOLIO_KPIS.totalEnterpriseTamEur)}
            </div>
            <div className="text-[11px] text-slate-700 mt-0.5">
              {isDe ? 'Schmierstoffe + Kraftstoffe DE' : 'Lubricants + Fuels DE'}
            </div>
          </div>

          <div className="bg-purple-50/60 border border-purple-200/70 rounded-lg p-3.5 hover:border-purple-300 transition-colors">
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-900 flex items-center justify-between">
              {isDe ? 'White-Spot Marge' : 'White-Spot Margin'}
              <Target className="w-3.5 h-3.5 text-purple-700" />
            </div>
            <div className="text-xl font-bold text-purple-950 mt-1">
              {formatEur(EXECUTIVE_PORTFOLIO_KPIS.annualizedWhiteSpotMarginCaptureEur)}
            </div>
            <div className="text-[11px] text-purple-800 font-medium mt-0.5">
              {isDe ? 'Ungedecktes Rohertragspotenzial' : 'Unserved Gross Margin Pool'}
            </div>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-lg p-3.5 hover:border-emerald-300 transition-colors">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center justify-between">
              {isDe ? 'Portfolio 10J-NPV' : 'Portfolio 10Y NPV'}
              <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
            </div>
            <div className="text-xl font-bold text-emerald-950 mt-1">
              {formatEur(totalTenYearNpv)}
            </div>
            <div className="text-[11px] text-emerald-800 font-medium mt-0.5">
              {isDe ? `Diskontsatz: ${currentScenario.discountRatePercent}%` : `Discount: ${currentScenario.discountRatePercent}%`}
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-200/70 rounded-lg p-3.5 hover:border-blue-300 transition-colors">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center justify-between">
              {isDe ? 'Gewichteter IRR' : 'Weighted IRR'}
              <TrendingUp className="w-3.5 h-3.5 text-blue-700" />
            </div>
            <div className="text-xl font-bold text-blue-950 mt-1">
              {portfolioWeightedIrr}%
            </div>
            <div className="text-[11px] text-blue-800 font-medium mt-0.5">
              {isDe ? `Hurdle Rate: ${hurdleRate}%` : `Hurdle: ${hurdleRate}% min`}
            </div>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/70 rounded-lg p-3.5 hover:border-amber-300 transition-colors">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center justify-between">
              {isDe ? 'THG-Quote Ertrag' : 'THG Quota Yield'}
              <Zap className="w-3.5 h-3.5 text-amber-700" />
            </div>
            <div className="text-xl font-bold text-amber-950 mt-1">
              {formatEur(totalThgRevenue)}
            </div>
            <div className="text-[11px] text-amber-800 font-medium mt-0.5">
              {isDe ? 'Zertifikaterlös / Jahr' : 'Annual Certificate Income'}
            </div>
          </div>

          <div className="bg-teal-50/60 border border-teal-200/70 rounded-lg p-3.5 hover:border-teal-300 transition-colors">
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-900 flex items-center justify-between">
              {isDe ? 'CO2-Minderung' : 'CO2 Abatement'}
              <Leaf className="w-3.5 h-3.5 text-teal-700" />
            </div>
            <div className="text-xl font-bold text-teal-950 mt-1">
              {(totalCo2eAbated / 1000).toFixed(1)}k t
            </div>
            <div className="text-[11px] text-teal-800 font-medium mt-0.5">
              {isDe ? 'Scope 1-3 Einsparung p.a.' : 'Scope 1-3 avoided p.a.'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubView('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubView === 'overview'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          {isDe ? '1. Vorstandsbriefing & Allokation' : '1. Board Briefing & Allocation'}
        </button>

        <button
          onClick={() => setActiveSubView('capex_pipeline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubView === 'capex_pipeline'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          {isDe ? '2. CapEx Projekt-Pipeline (IRR/NPV)' : '2. CapEx Pipeline (IRR/NPV)'}
        </button>

        <button
          onClick={() => setActiveSubView('fleet_interchange')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubView === 'fleet_interchange'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          {isDe ? '3. Flottenkarten & Interchange-Margen' : '3. Fleet Card & Interchange'}
        </button>

        <button
          onClick={() => setActiveSubView('thg_esg')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubView === 'thg_esg'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Leaf className="w-4 h-4" />
          {isDe ? '4. THG-Quoten & CSRD-Arbitrage' : '4. THG Quota & CSRD ESG'}
        </button>
      </div>

      {/* VIEW 1: OVERVIEW & BOARD BRIEFING */}
      {activeSubView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Strategic Decision Matrix & Hurdle Slider */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-700" />
                    {isDe ? 'Strategische Führungsprioritäten & Hurdle-Rate Filter' : 'Strategic Priorities & Hurdle Rate Filter'}
                  </h2>
                  <p className="text-xs text-slate-700">
                    {isDe 
                      ? 'Dynamische Selektion von CapEx-Vorhaben basierend auf Mindestverzinsung (Hurdle Rate).'
                      : 'Filter capital projects dynamically based on minimum Internal Rate of Return (IRR).'}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
                  <span className="text-xs font-bold text-purple-900">
                    {isDe ? 'Mindest-IRR:' : 'Hurdle Rate:'}
                  </span>
                  <input
                    type="range"
                    min="5"
                    max="45"
                    step="1"
                    value={hurdleRate}
                    onChange={(e) => setHurdleRate(parseFloat(e.target.value))}
                    className="w-24 accent-purple-700 cursor-pointer"
                  />
                  <span className="text-xs font-extrabold text-purple-950 font-mono">
                    {hurdleRate}%
                  </span>
                </div>
              </div>

              {/* Active Scenario Highlights */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {currentScenario.label}
                  </span>
                  <span className="text-xs font-bold text-purple-700">
                    {qualifiedProjects.length} / {CAPEX_PROJECT_PIPELINE.length} {isDe ? 'Projekte qualifiziert' : 'Projects Approved'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-1">
                  {currentScenario.desc}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200">
                  <div>
                    <span className="text-[11px] text-slate-700 block">{isDe ? 'Geplantes CapEx' : 'Allocated CapEx'}</span>
                    <span className="text-sm font-bold text-slate-900">{formatEur(totalAllocatedCapex)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-700 block">{isDe ? 'Proj. Jahres-EBITDA' : 'Annual EBITDA'}</span>
                    <span className="text-sm font-bold text-emerald-700">+{formatEur(totalProjectedAnnualEbitda)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-700 block">{isDe ? 'Kapitalrückfluss (Payback)' : 'Blended Payback'}</span>
                    <span className="text-sm font-bold text-purple-700">
                      {(totalAllocatedCapex / Math.max(1, totalProjectedAnnualEbitda)).toFixed(1)} {isDe ? 'Jahre' : 'years'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project Comparison Bar Chart */}
              <div className="h-64 mt-4">
                <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                  <span>{isDe ? 'IRR % vs. 10-Jahres NPV (€M) der White-Spot Vorhaben' : 'Project IRR % vs 10-Year NPV (€M)'}</span>
                  <span className="text-[11px] text-slate-700 font-normal">{isDe ? 'Sortiert nach IRR' : 'Sorted by IRR'}</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={qualifiedProjects} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="id" 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      tickFormatter={(id) => {
                        const p = qualifiedProjects.find(item => item.id === id);
                        return p ? p.corridor.split(' ')[0] : id;
                      }}
                    />
                    <YAxis yAxisId="left" orientation="left" stroke="#7c3aed" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fontSize: 10 }} />
                    <Tooltip 
                      formatter={(val: number, name: string) => [
                        name === 'projectIrrPercent' ? `${val}%` : `€${(val / 1000000).toFixed(2)}M`,
                        name === 'projectIrrPercent' ? 'IRR %' : '10Y NPV'
                      ]}
                      labelFormatter={(id) => {
                        const p = qualifiedProjects.find(item => item.id === id);
                        return p ? p.title : id;
                      }}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Bar yAxisId="left" dataKey="projectIrrPercent" name="projectIrrPercent" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="tenYearNpvEur" name="tenYearNpvEur" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right: Executive Memo & Decision Checklist */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-purple-700" />
                {isDe ? 'Vorstands-Beschlussvorlage (Memo)' : 'Executive Board Memo'}
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100">
                  <span className="font-bold text-purple-900 block mb-1">
                    {isDe ? '1. Marge vor reinem Volumen' : '1. Margin Over Pure Volume'}
                  </span>
                  {isDe
                    ? 'Fokus auf HVO100 (+12 ct/L Marge) und Kleingebinde-Schmierstoffe (2,34x Aufschlag) kompensiert den Margendruck bei fossilem B7-Diesel.'
                    : 'Targeting HVO100 (+12 ct/L margin) and small-pack lubricants (2.34x multiplier) shields EBITDA from standard diesel compression.'}
                </div>

                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <span className="font-bold text-emerald-900 block mb-1">
                    {isDe ? '2. Schnelle Paybacks priorisieren' : '2. Prioritize Rapid Paybacks'}
                  </span>
                  {isDe
                    ? 'Brownfield-Retrofits im GVZ Erfurt und Augsburg bieten Paybacks unter 1,3 Jahren und sollten vor großvolumigen Greenfield-Arealen freigegeben werden.'
                    : 'Brownfield retrofits at GVZ Erfurt and Augsburg yield paybacks <1.3 years, providing self-funding cash flow for Greenfield sites.'}
                </div>

                <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                  <span className="font-bold text-amber-900 block mb-1">
                    {isDe ? '3. Flottenkarten-Interchange stoppen' : '3. Capture Card Interchange'}
                  </span>
                  {isDe
                    ? 'Eine Erhöhung des Eigenkarten-Anteils um 10% sichert jährliche Gebühreneinsparungen von über €320.000 gegenüber DKV/UTA-Abzügen.'
                    : 'A 10% shift toward proprietary closed-loop cards saves >€320k annually from third-party DKV/UTA interchange erosion.'}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">{isDe ? 'Portfolio-Sicherheitsindex:' : 'Portfolio Safety Index:'}</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                  {isDe ? 'Sehr Hoch (AAA)' : 'Very High (AAA)'}
                </span>
              </div>
            </div>

            {/* Quick Export / Print Board Briefing */}
            <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  {isDe ? 'C-Level Export' : 'Executive Export'}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              </div>
              <p className="text-xs text-slate-300 mb-3">
                {isDe 
                  ? 'Erstellen Sie eine 1-Seiten-Zusammenfassung für den Aufsichtsrat oder Investorenkreis.' 
                  : 'Export a 1-page investment committee summary.'}
              </p>
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <DollarSign className="w-3.5 h-3.5" />
                {isDe ? 'Vorstandsbericht drucken / PDF' : 'Print Board Report / PDF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CAPEX PIPELINE & IRR SCATTER */}
      {activeSubView === 'capex_pipeline' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-700" />
                  {isDe ? 'CapEx-Investitionsportfolio & White-Spot Projekte' : 'CapEx Investment Portfolio & Corridor Projects'}
                </h2>
                <p className="text-xs text-slate-700">
                  {isDe 
                    ? 'Detaillierter Überblick über alle 8 vorqualifizierten Ausbauvorhaben mit IRR, Amortisationszeit und Kannibalisierungsrisiko.'
                    : 'Detailed overview of all 8 pre-qualified expansion projects with IRR, payback periods, and cannibalization index.'}
                </p>
              </div>

              <div className="text-xs text-slate-700 font-medium">
                {isDe ? 'Gesamtinvestitionsbedarf:' : 'Total Pipeline CapEx:'}{' '}
                <span className="font-extrabold text-slate-900 text-sm">
                  {formatEur(CAPEX_PROJECT_PIPELINE.reduce((s, p) => s + p.capexEur, 0))}
                </span>
              </div>
            </div>

            {/* Interactive Table of Projects */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider bg-slate-50">
                    <th className="p-3">{isDe ? 'Projekt / Korridor' : 'Project / Corridor'}</th>
                    <th className="p-3">{isDe ? 'Typ' : 'Type'}</th>
                    <th className="p-3 text-right">{isDe ? 'CapEx (€)' : 'CapEx (€)'}</th>
                    <th className="p-3 text-right">{isDe ? 'Jahres-EBITDA' : 'Annual EBITDA'}</th>
                    <th className="p-3 text-right">{isDe ? 'IRR %' : 'IRR %'}</th>
                    <th className="p-3 text-right">{isDe ? 'Amortisation' : 'Payback'}</th>
                    <th className="p-3 text-right">{isDe ? '10J-NPV' : '10Y NPV'}</th>
                    <th className="p-3 text-center">{isDe ? 'Kannibalisierung' : 'Cannibalization'}</th>
                    <th className="p-3 text-center">{isDe ? 'Dringlichkeit' : 'Priority'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CAPEX_PROJECT_PIPELINE.map((proj) => {
                    const isSelected = selectedProjectId === proj.id;
                    const passesHurdle = proj.projectIrrPercent >= hurdleRate;

                    return (
                      <tr 
                        key={proj.id}
                        onClick={() => setSelectedProjectId(proj.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-purple-50/80 font-medium' 
                            : !passesHurdle 
                              ? 'opacity-40 hover:opacity-80 bg-slate-50/50' 
                              : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{proj.title}</div>
                          <div className="text-[11px] text-slate-700">{proj.corridor}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            proj.projectType === 'GREENFIELD_AUTOHOF'
                              ? 'bg-emerald-100 text-emerald-800'
                              : proj.projectType === 'BROWNFIELD_RETROFIT'
                              ? 'bg-blue-100 text-blue-800'
                              : proj.projectType === 'CARDLOCK_AUTOMATION'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {proj.projectType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono font-semibold text-slate-900">
                          {formatEur(proj.capexEur)}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-700">
                          +{formatEur(proj.expectedAnnualEbitdaEur)}
                        </td>
                        <td className="p-3 text-right font-mono font-extrabold text-purple-700">
                          {proj.projectIrrPercent}%
                        </td>
                        <td className="p-3 text-right font-mono text-slate-700">
                          {proj.paybackPeriodYears} {isDe ? 'J.' : 'yrs'}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          {formatEur(proj.tenYearNpvEur)}
                        </td>
                        <td className="p-3 text-center font-mono text-slate-700">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            proj.cannibalizationRiskPercent < 3 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {proj.cannibalizationRiskPercent}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            proj.urgencyPriority === 'IMMEDIATE_Q1_Q2'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {proj.urgencyPriority === 'IMMEDIATE_Q1_Q2' 
                              ? (isDe ? 'SOFORT Q1/Q2' : 'IMMEDIATE') 
                              : (isDe ? 'MITTELFRISTIG' : 'MEDIUM')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Project Deep Dive Card */}
          <div className="bg-purple-900 text-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  {isDe ? 'Ausgewähltes Investitionsdossier' : 'Selected Investment Dossier'}
                </span>
                <h3 className="text-xl font-bold mt-1 text-white">
                  {selectedProject.title}
                </h3>
                <p className="text-xs text-purple-200 mt-0.5">
                  {selectedProject.corridor}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] text-purple-300 block">{isDe ? 'Vorstands-IRR' : 'Project IRR'}</span>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                    {selectedProject.projectIrrPercent}%
                  </span>
                </div>
                <div className="text-right pl-3 border-l border-purple-800">
                  <span className="text-[11px] text-purple-300 block">{isDe ? 'Amortisation' : 'Payback'}</span>
                  <span className="text-2xl font-extrabold text-white font-mono">
                    {selectedProject.paybackPeriodYears} {isDe ? 'Jahre' : 'yrs'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div>
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1">
                  {isDe ? 'Finanzielle Eckdaten' : 'Financial Profile'}
                </span>
                <ul className="space-y-1.5 text-xs text-purple-100">
                  <li className="flex justify-between">
                    <span className="text-purple-300">{isDe ? 'Investition (CapEx):' : 'CapEx Requirement:'}</span>
                    <span className="font-bold text-white font-mono">{formatEur(selectedProject.capexEur)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-300">{isDe ? 'Jahresumsatz (Erwartet):' : 'Expected Revenue:'}</span>
                    <span className="font-bold text-white font-mono">{formatEur(selectedProject.expectedAnnualRevenueEur)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-300">{isDe ? 'Jahres-EBITDA:' : 'Expected EBITDA:'}</span>
                    <span className="font-bold text-emerald-300 font-mono">+{formatEur(selectedProject.expectedAnnualEbitdaEur)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-purple-300">{isDe ? '10-Jahres Net Present Value:' : '10-Year NPV:'}</span>
                    <span className="font-bold text-white font-mono">{formatEur(selectedProject.tenYearNpvEur)}</span>
                  </li>
                </ul>
              </div>

              <div>
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1">
                  {isDe ? 'ESG & Strategische Absicherung' : 'ESG & Strategic Fit'}
                </span>
                <div className="space-y-2 text-xs text-purple-100">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300">{isDe ? 'ESG Scope 1-3 Score:' : 'ESG Scope Score:'}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono">
                      {selectedProject.esgScopeReductionScore} / 100
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300">{isDe ? 'Eigen-Kannibalisierung:' : 'Cannibalization Risk:'}</span>
                    <span className="px-2 py-0.5 rounded bg-purple-800 text-purple-200 font-bold font-mono">
                      {selectedProject.cannibalizationRiskPercent}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1">
                  {isDe ? 'Identifizierte Risikofaktoren' : 'Identified Risk Factors'}
                </span>
                <ul className="space-y-1 text-xs text-purple-200 list-disc list-inside">
                  {selectedProject.keyRiskFactors.map((rf, idx) => (
                    <li key={idx}>{rf}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: FLEET CARD & INTERCHANGE ARBITRAGE */}
      {activeSubView === 'fleet_interchange' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Card Interchange Analysis */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-700" />
                    {isDe ? 'Flottenkarten-Interchange & Margenerosion' : 'Fleet Card Interchange & Margin Capture'}
                  </h2>
                  <p className="text-xs text-slate-700">
                    {isDe 
                      ? 'Vergleich von Fremdkarten-Disagios (DKV, UTA, Routex bis zu 2,10%) gegenüber der geschlossenen Eigenkarte (0,25%).'
                      : 'Erosion of gross margins across DKV, UTA, Routex vs closed-loop proprietary fleet cards.'}
                  </p>
                </div>
              </div>

              {/* Card Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider bg-slate-50">
                      <th className="p-3">{isDe ? 'Zahlungskanal / Kartenemittent' : 'Payment Channel'}</th>
                      <th className="p-3 text-right">{isDe ? 'Volumen-Anteil' : 'Volume Share'}</th>
                      <th className="p-3 text-right">{isDe ? 'Disagio / Fee' : 'Interchange Fee'}</th>
                      <th className="p-3 text-right">{isDe ? 'Netto-Marge' : 'Net Margin'}</th>
                      <th className="p-3 text-center">{isDe ? 'Valuta' : 'Settlement'}</th>
                      <th className="p-3 text-center">{isDe ? 'Kundenbindung' : 'Retention'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {FLEET_CARD_PAYMENT_METRICS.map((card) => {
                      const isProp = card.cardType === 'PROPRIETARY_CARD';
                      return (
                        <tr key={card.cardType} className={isProp ? 'bg-purple-50/70 font-semibold' : 'hover:bg-slate-50'}>
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{card.name}</div>
                            <div className="text-[11px] text-slate-700">Rating: {card.creditRiskRating}</div>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">
                            {card.volumeSharePercent}%
                          </td>
                          <td className="p-3 text-right font-mono text-red-600 font-bold">
                            {card.interchangeFeePercent}%
                          </td>
                          <td className="p-3 text-right font-mono font-extrabold text-emerald-700">
                            {card.netMarginYieldCentPerLitre} ct/L
                          </td>
                          <td className="p-3 text-center font-mono text-slate-700">
                            {card.settlementDelayDays} {isDe ? 'Tage' : 'days'}
                          </td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-800">
                              {card.customerRetentionIndex}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Small Pack vs Bulk Lubricant Basket Multiplier */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-purple-700" />
                {isDe ? 'Schmierstoff-Cross-Selling & Gebinde-Margen-Hebel' : 'Lubricant Cross-Selling & Pack Multiplier'}
              </h3>
              <p className="text-xs text-slate-700 mb-4">
                {isDe
                  ? 'Verkauf von 1L/5L Nachfüllgebinden an Autohöfen und Zapfsäulen erzielt 2,34x höhere Margen als industrielle Großgebinde (IBC).'
                  : 'Selling 1L/5L top-up engine oils at truck dispensers yields 2.34x higher margins than bulk commercial IBC deliveries.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs font-bold text-slate-700 block">{isDe ? 'Schmierstoff-zu-Diesel Quote' : 'Lube-to-Fuel Ratio'}</span>
                  <div className="text-lg font-bold text-slate-900 mt-1">1.85 L / 1.000 L</div>
                  <span className="text-[11px] text-slate-700">{isDe ? 'Flotten-Durchschnitt' : 'Fleet average cross-sell'}</span>
                </div>

                <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-lg">
                  <span className="text-xs font-bold text-purple-900 block">{isDe ? 'Kleingebinde Marge (1L/5L)' : 'Small Pack Margin (1L)'}</span>
                  <div className="text-lg font-bold text-purple-950 mt-1">€6.85 / Liter</div>
                  <span className="text-[11px] text-purple-800 font-medium">{isDe ? 'vs. €2.92/L bei IBC Großmenge' : 'vs €2.92/L bulk IBC'}</span>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-xs font-bold text-emerald-900 block">{isDe ? 'EBITDA-Hebel pro Standort' : 'EBITDA Uplift per Site'}</span>
                  <div className="text-lg font-bold text-emerald-950 mt-1">+€42.500 / Jahr</div>
                  <span className="text-[11px] text-emerald-800 font-medium">{isDe ? 'Reiner Lube-Cabinet Ertrag' : 'Automated lube locker yield'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Dynamic Proprietary Card Conversion Simulator */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-700" />
                {isDe ? 'Eigenkarten-Migrations-Simulator' : 'Proprietary Card Simulator'}
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>{isDe ? 'Flottenvolumen (m³/Jahr):' : 'Annual Volume (m³):'}</span>
                    <span className="text-purple-900 font-mono">{customFleetVolumeM3.toLocaleString()} m³</span>
                  </div>
                  <input
                    type="range"
                    min="30000"
                    max="300000"
                    step="10000"
                    value={customFleetVolumeM3}
                    onChange={(e) => setCustomFleetVolumeM3(parseInt(e.target.value))}
                    className="w-full accent-purple-700 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>{isDe ? 'Ziel-Eigenkartenquote:' : 'Target Proprietary Share:'}</span>
                    <span className="text-purple-900 font-mono">{propCardShareGoal}%</span>
                  </div>
                  <input
                    type="range"
                    min="38"
                    max="80"
                    step="1"
                    value={propCardShareGoal}
                    onChange={(e) => setPropCardShareGoal(parseInt(e.target.value))}
                    className="w-full accent-purple-700 cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-700 mt-1">
                    {isDe ? 'Basis: 38.5% -> Delta:' : 'Baseline: 38.5% -> Delta:'}{' '}
                    <span className="font-bold text-emerald-700">+{fleetInterchangeSavings.shiftPercent.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-900 block">
                      {isDe ? 'Direkte jährliche Gebühreneinsparung:' : 'Direct Annual Interchange Savings:'}
                    </span>
                    <span className="text-xl font-extrabold text-emerald-950 font-mono">
                      {formatEur(fleetInterchangeSavings.annualCashSavingsEur)}
                    </span>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-[11px] font-bold text-purple-900 block">
                      {isDe ? '5-Jahres kumulierter Liquiditätsgewinn:' : '5-Year Cumulated Cash Boost:'}
                    </span>
                    <span className="text-xl font-extrabold text-purple-950 font-mono">
                      {formatEur(fleetInterchangeSavings.fiveYearCumulatedCashEur)}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-700 italic">
                  {isDe
                    ? '*Berechnet auf Basis von 2,72 ct/L durchschnittlicher Gebührendifferenz zu DKV/UTA/Routex bei €1,65/L Bruttopreis.'
                    : '*Based on 2.72 ct/L avg fee spread vs DKV/UTA/Routex at €1.65/L retail.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: THG-QUOTEN & CSRD ESG DECARBONIZATION */}
      {activeSubView === 'thg_esg' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-emerald-700" />
                    {isDe ? 'THG-Quoten Monetarisierung & CSRD ESG-Konformität' : 'THG Quota Monetization & CSRD ESG Strategy'}
                  </h2>
                  <p className="text-xs text-slate-700">
                    {isDe 
                      ? 'Rechtlicher Rahmen nach BImSchG zur Erzielung von Zusatzerlösen durch den Inverkehrbringer-Nachweis erneuerbarer Kraftstoffe.'
                      : 'Regulatory greenhouse gas quota arbitrage (BImSchG) for paraffinic HVO100, Bio-LNG, and Megawatt EV.'}
                  </p>
                </div>
              </div>

              {/* THG Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider bg-slate-50">
                      <th className="p-3">{isDe ? 'Erneuerbarer Energieträger' : 'Renewable Fuel Segment'}</th>
                      <th className="p-3 text-right">{isDe ? 'CO2-Minderung (t/J)' : 'CO2 Abated (t/yr)'}</th>
                      <th className="p-3 text-right">{isDe ? 'THG-Quotenpreis (€/t)' : 'THG Price (€/t)'}</th>
                      <th className="p-3 text-right">{isDe ? 'Jahreserlös (€)' : 'Annual Revenue (€)'}</th>
                      <th className="p-3 text-center">{isDe ? 'CSRD Audit Readiness' : 'Audit Readiness'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {THG_REGULATORY_ARBITRAGE.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{item.segment}</div>
                          <div className="text-[11px] text-slate-700">Zielkorridor: {item.scopeReductionTargetYear}</div>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-teal-700">
                          {item.co2eAbatementTonnesPerYear.toLocaleString()} t
                        </td>
                        <td className="p-3 text-right font-mono text-slate-900 font-semibold">
                          €{item.thgCertificateYieldEurPerTonne}/t
                        </td>
                        <td className="p-3 text-right font-mono font-extrabold text-emerald-700">
                          {formatEur(item.totalAnnualThgRevenueEur)}
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                            {item.complianceReadiness}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: CSRD Compliance Checklist for Fleets */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                {isDe ? 'CSRD Scope-3 Kundenbindung' : 'CSRD Scope-3 Fleet Advantage'}
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <p>
                  {isDe
                    ? 'Ab 2026 sind über 15.000 deutsche Unternehmen verpflichtet, ihre vor- und nachgelagerten Scope-3 Lieferkettenemissionen nach EU CSRD offenzulegen.'
                    : 'Over 15,000 German mid-caps must disclose Scope-3 supply chain emissions under EU CSRD directives starting 2026.'}
                </p>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 space-y-1.5">
                  <span className="font-bold text-emerald-900 block">{isDe ? 'Zertifizierter HVO100 Lieferschein' : 'Certified HVO100 Delivery Certificate'}</span>
                  <p className="text-[11px] text-emerald-800">
                    {isDe
                      ? 'Automatischer digitaler Massenbilanz-Nachweis nach RED II/III sichert Kundenverträge mit DAX- und Mittelstands-Speditionen.'
                      : 'Automated RED II/III mass balance certificates lock in enterprise freight customer contracts.'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">{isDe ? 'THG-Preis-Hedging Strategie' : 'THG Price Hedging Strategy'}</span>
                  <p className="text-[11px] text-slate-700">
                    {isDe
                      ? 'Absicherung von Quotenpreisen über Terminverträge (380 €/t Mindestboden) schützt vor Volatilität im Bundesanzeiger.'
                      : 'Hedging quota prices with forward contracts (€380/t floor) protects against German registry market drops.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
