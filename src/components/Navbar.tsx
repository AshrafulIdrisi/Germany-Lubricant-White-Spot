import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, MetricUnit } from '../types';
import { 
  Map, 
  Scale, 
  Target, 
  Users, 
  Search, 
  Sparkles, 
  Download, 
  Globe2, 
  Fuel, 
  Layers,
  Activity,
  DollarSign,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'leadership' | 'balancer' | 'white_spots' | 'distributors' | 'logistics' | 'pricing' | 'fuel_pumps' | 'osm_harvester' | 'ai_advisor';
  setActiveTab: (tab: 'map' | 'leadership' | 'balancer' | 'white_spots' | 'distributors' | 'logistics' | 'pricing' | 'fuel_pumps' | 'osm_harvester' | 'ai_advisor') => void;
  lang: Language;
  setLang: (l: Language) => void;
  unit: MetricUnit;
  setUnit: (u: MetricUnit) => void;
  onOpenExport: () => void;
  totalMarketTonnes: number;
  totalDeficitCount: number;
}

interface NavItem {
  id: 'map' | 'leadership' | 'balancer' | 'white_spots' | 'distributors' | 'logistics' | 'pricing' | 'fuel_pumps' | 'osm_harvester' | 'ai_advisor';
  labelDe: string;
  labelEn: string;
  descriptionDe: string;
  descriptionEn: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  unit,
  setUnit,
  onOpenExport,
  totalMarketTonnes,
  totalDeficitCount,
}) => {
  const [isSliderMenuOpen, setIsSliderMenuOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { 
      id: 'leadership', 
      labelDe: 'Vorstand & CapEx Cockpit', 
      labelEn: 'Executive & CapEx Cockpit', 
      descriptionDe: 'C-Level KPIs, IRR Hurdle-Rates, THG-Quoten & Flottenkarten-Marge',
      descriptionEn: 'C-Suite KPIs, IRR Hurdle Rates, THG Quotas & Fleet Card Margins',
      icon: TrendingUp, 
      badge: 'C-Level' 
    },
    { 
      id: 'map', 
      labelDe: 'GIS Karte & Cluster', 
      labelEn: 'GIS Map & Hubs', 
      descriptionDe: 'Interaktive 16-Länder Karte mit Mischwerken & Hubs',
      descriptionEn: 'Interactive 16-state map with blending plants & hubs',
      icon: Map 
    },
    { 
      id: 'logistics', 
      labelDe: 'Logistik & Telemetrie', 
      labelEn: 'Logistics Telemetry', 
      descriptionDe: 'Autobahn A1-A9, Rheinpegel Kaub & Seehäfen',
      descriptionEn: 'Autobahn freight A1-A9, Rhine gauges & seaports',
      icon: Activity, 
      badge: 'A1-A9' 
    },
    { 
      id: 'pricing', 
      labelDe: 'Wettbewerber-Preise', 
      labelEn: 'Competitor Pricing', 
      descriptionDe: 'Distributor-Scraper (1L bis 1000L IBC) & Arbitrage',
      descriptionEn: 'Distributor price scraper (1L to 1000L IBC) & arbitrage',
      icon: DollarSign, 
      badge: 'Scraper' 
    },
    { 
      id: 'fuel_pumps', 
      labelDe: 'Kraftstoff & Zapfsäulen', 
      labelEn: 'Fuel & Pump Analytics', 
      descriptionDe: 'HVO100 Lücken, 150L/min Lkw-Säulen & MTS-K Spreads',
      descriptionEn: 'HVO100 gaps, 150L/min high-flow dispensers & MTS-K spreads',
      icon: Fuel, 
      badge: 'HVO100' 
    },
    { 
      id: 'balancer', 
      labelDe: '16 Länder Bilanzierer', 
      labelEn: 'State Balancer', 
      descriptionDe: 'Angebot/Nachfrage-Simulation für alle 16 Bundesländer',
      descriptionEn: 'Supply & demand simulator across all 16 states',
      icon: Scale 
    },
    { 
      id: 'white_spots', 
      labelDe: '30+ White-Spots', 
      labelEn: '30+ White-Spots', 
      descriptionDe: 'Unversorgte Gewerbeparks & Windcluster',
      descriptionEn: 'Underserved industrial zones & wind clusters',
      icon: Target, 
      badge: '30+' 
    },
    { 
      id: 'distributors', 
      labelDe: 'Vertriebspartner Matrix', 
      labelEn: 'Distributor Matrix', 
      descriptionDe: 'AVIA, BayWa, Hoyer, ZG Raiffeisen Partnerprofile',
      descriptionEn: 'AVIA, BayWa, Hoyer, ZG Raiffeisen partner profiles',
      icon: Users 
    },
    { 
      id: 'osm_harvester', 
      labelDe: 'OSM PLZ Harvester', 
      labelEn: 'OSM PLZ Harvester', 
      descriptionDe: 'Live Overpass API Extraktor für Tankstellen & Flotten',
      descriptionEn: 'Live Overpass API extractor for stations & fleets',
      icon: Search, 
      badge: 'Overpass' 
    },
    { 
      id: 'ai_advisor', 
      labelDe: 'KI Markt-Stratege', 
      labelEn: 'AI Strategist', 
      descriptionDe: 'Gemini KI-gestützte Beschaffungs- & Ausbau-Empfehlungen',
      descriptionEn: 'Gemini AI-powered procurement & expansion insights',
      icon: Sparkles 
    },
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const activeItemIndex = navItems.findIndex((item) => item.id === activeTab);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-slate-800 border-b border-purple-200/80 shadow-sm shadow-purple-500/5 transition-all">
      {/* Top telemetry & metadata status bar in soft purple-white */}
      <div className="px-4 sm:px-6 lg:px-8 h-9 bg-purple-50/90 border-b border-purple-100 flex items-center justify-between text-xs text-purple-950 font-medium">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <span className="flex items-center space-x-2 font-mono text-[11px]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-600"></span>
            </span>
            <span className="text-purple-700 uppercase tracking-wider text-[10px] font-bold">LUBE INTEL:</span>
            <span className="text-purple-900 font-extrabold">LIVE TELEMETRY</span>
          </span>
          <span className="hidden md:inline text-purple-200">|</span>
          <span className="hidden md:flex items-center space-x-1.5 font-mono text-[11px]">
            <span className="text-purple-600 uppercase text-[10px] font-semibold">MARKTKAPAZITÄT:</span>
            <span className="text-purple-900 font-bold bg-purple-200/60 px-1.5 py-0.5 rounded text-[10px]">
              {new Intl.NumberFormat('de-DE').format(totalMarketTonnes)} t/a
            </span>
          </span>
          <span className="hidden lg:inline text-purple-200">|</span>
          <span className="hidden lg:flex items-center space-x-1.5 font-mono text-[11px]">
            <span className="text-purple-600 uppercase text-[10px] font-semibold">SEKTOREN:</span>
            <span className="text-purple-900 font-medium">AUTO • WIND • MARINE • MWF • AGRI</span>
          </span>
          <span className="hidden xl:inline text-purple-200">|</span>
          <span className="hidden xl:flex items-center space-x-1.5 font-mono text-[11px]">
            <span className="text-purple-600 uppercase text-[10px] font-semibold">DEFIZIT-LÄNDER:</span>
            <span className="text-rose-600 font-bold bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded text-[10px]">
              {totalDeficitCount} / 16
            </span>
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Unit Toggle */}
          <div className="flex items-center bg-purple-100/80 border border-purple-200 rounded-lg p-0.5 shadow-inner">
            <button
              onClick={() => setUnit('tonnes')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase transition-all ${
                unit === 'tonnes' 
                  ? 'bg-white text-purple-900 shadow-sm font-black' 
                  : 'text-purple-700 hover:text-purple-900'
              }`}
            >
              t/a
            </button>
            <button
              onClick={() => setUnit('kilolitres')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase transition-all ${
                unit === 'kilolitres' 
                  ? 'bg-white text-purple-900 shadow-sm font-black' 
                  : 'text-purple-700 hover:text-purple-900'
              }`}
            >
              kL
            </button>
            <button
              onClick={() => setUnit('barrels')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase transition-all ${
                unit === 'barrels' 
                  ? 'bg-white text-purple-900 shadow-sm font-black' 
                  : 'text-purple-700 hover:text-purple-900'
              }`}
            >
              bbl
            </button>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center bg-purple-100/80 border border-purple-200 rounded-lg p-0.5 shadow-inner">
            <button
              onClick={() => setLang('de')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono transition-all ${
                lang === 'de' ? 'bg-white text-purple-900 shadow-sm' : 'text-purple-700 hover:text-purple-900'
              }`}
            >
              DE 🇩🇪
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono transition-all ${
                lang === 'en' ? 'bg-white text-purple-900 shadow-sm' : 'text-purple-700 hover:text-purple-900'
              }`}
            >
              EN 🇬🇧
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm shadow-purple-500/20 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px] uppercase font-bold tracking-tight">Export</span>
          </button>

          {/* Slider Drawer Menu Button */}
          <button
            onClick={() => setIsSliderMenuOpen(!isSliderMenuOpen)}
            className={`p-1.5 rounded-lg border transition-all ${
              isSliderMenuOpen
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'
            }`}
            title="Menu Slider & Module Overview"
          >
            {isSliderMenuOpen ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar with Smooth Menu Slider */}
      <div className="px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div 
          className="flex items-center space-x-3 cursor-pointer select-none shrink-0 group" 
          onClick={() => setActiveTab('map')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-2 flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform">
            <Fuel className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black tracking-tight text-slate-900 uppercase">
                LUBE INTEL <span className="font-bold text-purple-600">DEUTSCHLAND</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-purple-100 text-purple-800 border border-purple-200">
                16 LÄNDER
              </span>
            </div>
            <p className="text-[10.5px] text-purple-900/60 font-medium">
              {lang === 'de' ? 'Markt- & Logistik-Intelligence Plattform' : 'Market & Logistics Intelligence Platform'}
            </p>
          </div>
        </div>

        {/* Animated Horizontal Menu Slider */}
        <div className="relative flex items-center flex-1 max-w-4xl justify-end min-w-0">
          {/* Left Arrow Scroll for Slider */}
          <button
            onClick={() => handleScroll('left')}
            className="hidden xl:flex items-center justify-center w-7 h-7 rounded-full bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 shadow-sm mr-1 shrink-0 transition-transform active:scale-90"
            title="Slide left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Slider Container with Motion Slider Indicator */}
          <div 
            ref={scrollContainerRef}
            className="flex items-center space-x-1.5 overflow-x-auto py-1 px-1.5 rounded-2xl bg-purple-100/70 border border-purple-200/70 scrollbar-none max-w-full"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap z-10 select-none ${
                    isActive
                      ? 'text-purple-950 font-black'
                      : 'text-slate-600 hover:text-purple-900 hover:bg-white/40'
                  }`}
                >
                  {/* Sliding Indicator Pill via Motion */}
                  {isActive && (
                    <motion.div
                      layoutId="active-menu-pill"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm shadow-purple-500/10 border border-purple-200/80 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}

                  <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-purple-600' : 'text-purple-400'}`} />
                  <span className="tracking-tight">{lang === 'de' ? item.labelDe : item.labelEn}</span>
                  
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 rounded-md text-[8.5px] font-mono font-extrabold uppercase transition-colors ${
                      isActive 
                        ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                        : 'bg-purple-200/60 text-purple-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Arrow Scroll for Slider */}
          <button
            onClick={() => handleScroll('right')}
            className="hidden xl:flex items-center justify-center w-7 h-7 rounded-full bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 shadow-sm ml-1 shrink-0 transition-transform active:scale-90"
            title="Slide right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sliding Overview Drawer / Full Menu Slider Panel */}
      <AnimatePresence>
        {isSliderMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-purple-100 bg-gradient-to-b from-purple-50/95 via-white to-purple-50/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-5 shadow-lg shadow-purple-500/10"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-purple-200/60">
                <div className="flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-black uppercase text-purple-900 tracking-wider">
                    {lang === 'de' ? 'Schnellnavigation & Modul-Übersicht' : 'Quick Navigation & Module Slider'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-purple-600 font-bold">
                  {lang === 'de' ? `Aktiv: Modul ${activeItemIndex + 1} von ${navItems.length}` : `Active: Module ${activeItemIndex + 1} of ${navItems.length}`}
                </span>
              </div>

              {/* Grid of All 8 Core Modules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSliderMenuOpen(false);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                        isActive
                          ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20 scale-[1.02]'
                          : 'bg-white hover:bg-purple-50/80 text-slate-800 border-purple-200/80 hover:border-purple-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-purple-200' : 'text-purple-400'}`}>
                            #{idx + 1}
                          </span>
                          {item.badge && (
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase ${
                              isActive ? 'bg-white text-purple-900' : 'bg-purple-100 text-purple-800 border border-purple-200'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className={`text-xs font-black uppercase tracking-tight mb-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                          {lang === 'de' ? item.labelDe : item.labelEn}
                        </h4>
                        <p className={`text-[11px] leading-relaxed ${isActive ? 'text-purple-100' : 'text-slate-500'}`}>
                          {lang === 'de' ? item.descriptionDe : item.descriptionEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
