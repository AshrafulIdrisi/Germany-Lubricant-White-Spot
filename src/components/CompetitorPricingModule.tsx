import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  RefreshCw, 
  ExternalLink, 
  AlertCircle, 
  Sparkles, 
  Package, 
  Layers, 
  MapPin, 
  Percent, 
  Terminal, 
  CheckCircle2, 
  FileSpreadsheet, 
  FileText,
  BarChart3,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
  PieChart as PieIcon,
  Award,
  Globe2,
  Building2,
  Scale,
  Activity,
  ArrowUpRight,
  Truck
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
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
import * as XLSX from 'xlsx';
import { 
  COMPETITOR_DISTRIBUTOR_PLATFORMS, 
  COMPETITOR_PRODUCT_PRICES, 
  REGIONAL_PRICE_SPREADS, 
  PRICE_GAP_OPPORTUNITIES, 
  SCRAPING_JOB_LOGS 
} from '../data/competitorPricingData';
import { MAJOR_LUBRICANT_BRANDS } from '../data/brandsAndDistributors';
import { 
  CompetitorProductPrice, 
  PackagingType, 
  LubricantCategory, 
  Language, 
  MetricUnit, 
  ScrapingJobLog 
} from '../types';
import { formatNumber, formatCurrency } from '../utils/exportUtils';

interface CompetitorPricingModuleProps {
  lang: Language;
  unit: MetricUnit;
}

export const CompetitorPricingModule: React.FC<CompetitorPricingModuleProps> = ({
  lang,
  unit
}) => {
  const [activeTab, setActiveTab] = useState<'overall' | 'matrix' | 'waterfall' | 'regional' | 'trends' | 'arbitrage' | 'scraper'>('overall');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistributor, setSelectedDistributor] = useState<string>('all');
  const [selectedPackSize, setSelectedPackSize] = useState<PackagingType>('208L');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isScrapingRunning, setIsScrapingRunning] = useState<boolean>(false);
  const [jobLogs, setJobLogs] = useState<ScrapingJobLog[]>(SCRAPING_JOB_LOGS);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return COMPETITOR_PRODUCT_PRICES.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedDistributor !== 'all' && p.distributorId !== selectedDistributor) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = p.productName.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchApproval = p.oemApprovals.some(a => a.toLowerCase().includes(q));
        const matchSpec = p.industrySpecs.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchBrand && !matchApproval && !matchSpec) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedDistributor, searchQuery]);

  // Aggregate Stats
  const avgRegionalSpread = useMemo(() => {
    const maxIdx = Math.max(...REGIONAL_PRICE_SPREADS.map(r => r.priceIndex));
    const minIdx = Math.min(...REGIONAL_PRICE_SPREADS.map(r => r.priceIndex));
    return Math.round((maxIdx - minIdx) * 1000) / 10; // e.g. 11.4%
  }, []);

  // Multi-brand historical trend dataset for chart
  const trendChartData = useMemo(() => {
    const months = ['2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
    return months.map(m => {
      const point: any = { month: m };
      COMPETITOR_PRODUCT_PRICES.slice(0, 5).forEach(p => {
        const h = p.monthlyPriceHistory.find(hist => hist.month === m);
        if (h) {
          point[p.brand + ' (' + p.category.substring(0, 4) + ')'] = h.avgPricePerLitreEur;
        }
      });
      return point;
    });
  }, []);

  // Handler for running the live scraper simulator
  const handleTriggerScrape = () => {
    setIsScrapingRunning(true);
    setTimeout(() => {
      const newLog: ScrapingJobLog = {
        id: `job_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' CEST',
        distributorId: 'live_batch_all',
        distributorName: 'All 10 German Online Retailers (Batch Harvest)',
        productsScraped: 2140,
        newPriceGapsFound: 18,
        durationMs: 4250,
        status: 'COMPLETED',
        httpStatus: 200,
        notes: 'Successfully crawled 10 platforms; validated price-per-litre spreads across 1L, 5L, 20L, 208L, and 1000L IBC containers.',
      };
      setJobLogs(prev => [newLog, ...prev]);
      setIsScrapingRunning(false);
    }, 1600);
  };

  // Export to Excel (XLSX)
  const handleExportXlsx = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Competitor Products & Packaging Prices
    const productData = COMPETITOR_PRODUCT_PRICES.map(p => ({
      'ID': p.id,
      'Product Name': p.productName,
      'Brand': p.brand,
      'Category': p.category,
      'Viscosity': p.viscosityGrade,
      'Distributor': p.distributorName,
      'Distributor Type': p.distributorType,
      'Base Oil Group': p.baseOilGroup,
      'Price Leader': p.isPriceLeader ? 'YES' : 'NO',
      'Price Spread vs Median (%)': p.priceLeaderSpreadPercent,
      '1L Gross (€)': p.pricingByPack['1L']?.grossPriceEur || 0,
      '1L Net (€/L)': p.pricingByPack['1L']?.pricePerLitreEur || 0,
      '5L Gross (€)': p.pricingByPack['5L']?.grossPriceEur || 0,
      '5L Net (€/L)': p.pricingByPack['5L']?.pricePerLitreEur || 0,
      '20L Net (€/L)': p.pricingByPack['20L']?.pricePerLitreEur || 0,
      '208L Net (€/L)': p.pricingByPack['208L']?.pricePerLitreEur || 0,
      '1000L IBC Net (€/L)': p.pricingByPack['1000L']?.pricePerLitreEur || 0,
      'OEM Approvals': p.oemApprovals.join('; '),
      'Industry Specs': p.industrySpecs.join('; '),
      'Source URL': p.url,
      'Last Scraped': p.lastUpdated,
    }));
    const ws1 = XLSX.utils.json_to_sheet(productData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Competitor Price Grid');

    // Sheet 2: 16 Bundesländer Regional Price Indices
    const regionalData = REGIONAL_PRICE_SPREADS.map(r => ({
      'State Code': r.bundeslandCode,
      'Bundesland': r.bundeslandName,
      'Regional Price Index': r.priceIndex,
      'Variance vs National Avg (%)': r.priceVarianceFromNationalAvgPercent,
      'Avg Price (€/L)': r.avgPricePerLitreEur,
      'Avg 208L Drum HDEO (€)': r.hdeoAvgDrumPriceEur,
      'Avg 1000L IBC HLP 46 (€)': r.hydraulicHlp46IbcPriceEur,
      'Avg 5L PCMO Canister (€)': r.pcmo5w30CanisterPriceEur,
      'ADR Freight Surcharge (€)': r.adrSurchargeAvgEur,
      'Dominant Distributors': r.dominantDistributors.join('; '),
    }));
    const ws2 = XLSX.utils.json_to_sheet(regionalData);
    XLSX.utils.book_append_sheet(wb, ws2, '16 Länder Regional Spreads');

    // Sheet 3: Arbitrage & Margin Gap Opportunities
    const arbData = PRICE_GAP_OPPORTUNITIES.map(g => ({
      'Opportunity ID': g.id,
      'Category': g.opportunityType,
      'Target Lubricant': g.targetProduct,
      'Highest Price Platform': g.highestPricePlatform.name,
      'High Price (€/L)': g.highestPricePlatform.pricePerLitre,
      'Lowest Price Platform': g.lowestPricePlatform.name,
      'Low Price (€/L)': g.lowestPricePlatform.pricePerLitre,
      'Absolute Spread (€/L)': g.absoluteSpreadEurPerLitre,
      'Arbitrage Margin (%)': g.marginArbitragePercent,
      'Recommendation (DE)': g.recommendedActionDe,
      'Recommendation (EN)': g.recommendedActionEn,
    }));
    const ws3 = XLSX.utils.json_to_sheet(arbData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Arbitrage Opportunities');

    const fileName = `German_Lubricant_Competitor_Pricing_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Export to CSV
  const handleExportCsv = () => {
    const headers = ['Product', 'Brand', 'Category', 'Viscosity', 'Distributor', 'Pack_Size', 'Gross_EUR', 'Net_EUR_L', 'Price_Leader', 'Approvals', 'URL'];
    const rows: string[][] = [];

    COMPETITOR_PRODUCT_PRICES.forEach(p => {
      Object.values(p.pricingByPack).forEach(pack => {
        rows.push([
          `"${p.productName.replace(/"/g, '""')}"`,
          `"${p.brand}"`,
          p.category,
          p.viscosityGrade,
          `"${p.distributorName}"`,
          pack.packSize,
          pack.grossPriceEur.toFixed(2),
          pack.pricePerLitreEur.toFixed(2),
          p.isPriceLeader ? 'YES' : 'NO',
          `"${p.oemApprovals.join('; ')}"`,
          p.url
        ]);
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `German_Lube_Competitor_Prices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Title & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-purple-200/80 p-5 rounded-2xl shadow-sm shadow-purple-500/5">
        <div>
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-xl bg-purple-100 text-purple-700 shadow-sm">
              <DollarSign className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2.5">
                {lang === 'de' ? 'Wettbewerber Preis-Scraper & Margen-Radar' : 'Competitor Pricing & Scraping Radar'}
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-bold">
                  16 LÄNDER BENCHMARK
                </span>
              </h1>
              <p className="text-xs text-purple-900/60 font-medium mt-0.5">
                {lang === 'de'
                  ? 'Automatisierte Preisüberwachung führender deutscher Online-Händler & B2B-Distributoren mit Gebindestaffel & XLSX/CSV-Export'
                  : 'Scrapes pricing data across major German online retailers & distributors with packaging waterfalls and XLSX/CSV export'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Scraper Trigger & Export */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleTriggerScrape}
            disabled={isScrapingRunning}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all shadow-sm ${
              isScrapingRunning
                ? 'bg-purple-100 text-purple-400 border border-purple-200 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 active:scale-95'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScrapingRunning ? 'animate-spin' : ''}`} />
            <span>{isScrapingRunning ? (lang === 'de' ? 'Scrape läuft...' : 'Scraping...') : (lang === 'de' ? 'Live Scrape Starten' : 'Run Scraper')}</span>
          </button>

          <button
            onClick={handleExportXlsx}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm shadow-purple-500/20 transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>XLSX Export</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 shadow-sm transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white border border-purple-200/80 rounded-2xl p-4 shadow-sm shadow-purple-500/5">
          <span className="text-[11px] text-purple-800/70 font-semibold uppercase block">{lang === 'de' ? 'Gescrapte Plattformen' : 'Tracked Platforms'}</span>
          <div className="text-slate-900 font-black text-xl mt-0.5">{COMPETITOR_DISTRIBUTOR_PLATFORMS.length} <span className="text-xs text-purple-600 font-normal">Händler</span></div>
          <span className="text-[10px] font-bold text-emerald-600">100% Online & B2B</span>
        </div>

        <div className="bg-white border border-purple-200/80 rounded-2xl p-4 shadow-sm shadow-purple-500/5">
          <span className="text-[11px] text-purple-800/70 font-semibold uppercase block">{lang === 'de' ? 'Gefilterte Benchmark SKUs' : 'Tracked SKUs'}</span>
          <div className="text-purple-700 font-black text-xl mt-0.5">{filteredProducts.length} <span className="text-xs text-purple-600 font-normal">Produkte</span></div>
          <span className="text-[10px] text-purple-500">PCMO, HDEO, MWF, Bio</span>
        </div>

        <div className="bg-white border border-purple-200/80 rounded-2xl p-4 shadow-sm shadow-purple-500/5">
          <span className="text-[11px] text-purple-800/70 font-semibold uppercase block">{lang === 'de' ? 'Regionale Preisspreizung' : 'Regional Price Spread'}</span>
          <div className="text-indigo-600 font-black text-xl mt-0.5">±{avgRegionalSpread}%</div>
          <span className="text-[10px] text-purple-500">Süddeutschland vs Ost</span>
        </div>

        <div className="bg-white border border-purple-200/80 rounded-2xl p-4 shadow-sm shadow-purple-500/5">
          <span className="text-[11px] text-purple-800/70 font-semibold uppercase block">{lang === 'de' ? 'Aktive Arbitrage-Lücken' : 'Arbitrage Gaps'}</span>
          <div className="text-rose-600 font-black text-xl mt-0.5">{PRICE_GAP_OPPORTUNITIES.length} <span className="text-xs text-purple-600 font-normal">High-Impact</span></div>
          <span className="text-[10px] font-bold text-purple-700">Bis zu 75% Margenspanne</span>
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-purple-200/60 pb-3">
        <button
          onClick={() => setActiveTab('overall')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
            activeTab === 'overall' 
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20' 
              : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <PieIcon className="w-3.5 h-3.5" />
          <span>{lang === 'de' ? '0. Gesamtmarkt & Wettbewerber-Ökosystem' : '0. Macro Landscape & Market Share'}</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
            activeTab === 'matrix' 
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20' 
              : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{lang === 'de' ? '1. Preis-Matrix & Preisführer' : '1. Price Grid & Leaders'}</span>
        </button>

        <button
          onClick={() => setActiveTab('waterfall')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
            activeTab === 'waterfall' 
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20' 
              : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>{lang === 'de' ? '2. Gebinde-Staffel (1L bis 1000L IBC)' : '2. Packaging Waterfall'}</span>
        </button>

        <button
          onClick={() => setActiveTab('regional')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
            activeTab === 'regional' 
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20' 
              : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{lang === 'de' ? '3. 16 Bundesländer Regional-Index' : '3. 16 States Regional Index'}</span>
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
            activeTab === 'trends' 
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20' 
              : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{lang === 'de' ? '4. 12-Monats Preis-Trend' : '4. 12-Month Price Trend'}</span>
        </button>

        <button
          onClick={() => setActiveTab('arbitrage')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
            activeTab === 'arbitrage' 
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20' 
              : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Percent className="w-3.5 h-3.5 text-rose-500" />
          <span>{lang === 'de' ? '5. Arbitrage- & Margen-Lücken' : '5. Arbitrage & Gaps'}</span>
        </button>

        <button
          onClick={() => setActiveTab('scraper')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
            activeTab === 'scraper' 
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20' 
              : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>{lang === 'de' ? '6. Scraper Terminal & Logs' : '6. Scraper Terminal'}</span>
        </button>
      </div>

      {/* Tab 0: Overall Competitor & Macro Market Landscape */}
      {activeTab === 'overall' && (
        <div className="space-y-6">
          {/* Executive Macro Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-800 uppercase">{lang === 'de' ? 'Gesamtmarkt TAM Wert' : 'Total Addressable Market'}</span>
                <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700"><DollarSign className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">€3.65 Mrd.</div>
              <p className="text-[11px] text-purple-600 mt-1 font-mono">985.000 Tonnen / Jahr (DE)</p>
            </div>

            <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-800 uppercase">{lang === 'de' ? 'Blended Bruttomarge' : 'Blended Gross Margin'}</span>
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700"><TrendingUp className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-2">24.8%</div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">+3.2% ggü. Vorjahr (Synthetik-Mix)</p>
            </div>

            <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-800 uppercase">{lang === 'de' ? 'Gebinde-Aufschlag' : 'Small-Pack Multiplier'}</span>
                <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700"><Package className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl font-black text-purple-700 mt-2">+290%</div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">1L Flasche (€16.40) vs 1000L IBC (€4.20)</p>
            </div>

            <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-800 uppercase">{lang === 'de' ? 'Top-Hersteller Konzentration' : 'CR4 Market Concentration'}</span>
                <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700"><ShieldCheck className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl font-black text-indigo-600 mt-2">55.5%</div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">Fuchs, Shell, Castrol & Liqui Moly</p>
            </div>
          </div>

          {/* Market Share Distribution Chart & Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white border border-purple-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                <div className="flex items-center space-x-2">
                  <PieIcon className="w-4 h-4 text-purple-600" />
                  <h3 className="font-black text-xs uppercase text-purple-950 font-mono">
                    {lang === 'de' ? 'DEUTSCHER SCHMIERSTOFFMARKT: HERSTELLER-MARKTANTEILE (%)' : 'GERMAN LUBRICANT MARKET: BRAND MARKET SHARE (%)'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                  TOTAL: 100% (985k t)
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={MAJOR_LUBRICANT_BRANDS.map(b => ({
                      name: b.name.split(' ')[0],
                      share: b.marketShareDePercent,
                      fullName: b.name,
                      country: b.country
                    }))}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" horizontal={false} />
                    <XAxis type="number" unit="%" stroke="#6b7280" tick={{ fontSize: 11, fontFamily: 'monospace' }} domain={[0, 20]} />
                    <YAxis dataKey="name" type="category" stroke="#6b7280" tick={{ fontSize: 11, fontFamily: 'sans-serif' }} width={70} />
                    <Tooltip
                      formatter={(val: any) => [`${val}% Marktanteil DE`, 'Marktanteil']}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#ddd6fe', borderRadius: '0.75rem', fontFamily: 'monospace', fontSize: '11px', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.1)' }}
                    />
                    <Bar dataKey="share" radius={[0, 8, 8, 0]}>
                      {MAJOR_LUBRICANT_BRANDS.map((entry, index) => {
                        const colors = ['#7c3aed', '#9333ea', '#6366f1', '#a855f7', '#c084fc', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-purple-100 text-[10px] font-mono text-slate-600">
                <div className="bg-purple-50/50 p-2 rounded-lg border border-purple-100">
                  <span className="text-purple-900 font-bold block">Fuchs Petrolub</span>
                  <span>14.8% • Nr. 1 Industrie</span>
                </div>
                <div className="bg-purple-50/50 p-2 rounded-lg border border-purple-100">
                  <span className="text-purple-900 font-bold block">Shell Deutschland</span>
                  <span>15.6% • Nr. 1 Flotte</span>
                </div>
                <div className="bg-purple-50/50 p-2 rounded-lg border border-purple-100">
                  <span className="text-purple-900 font-bold block">Castrol / BP</span>
                  <span>13.9% • Nr. 1 OEM First</span>
                </div>
                <div className="bg-purple-50/50 p-2 rounded-lg border border-purple-100">
                  <span className="text-purple-900 font-bold block">LIQUI MOLY</span>
                  <span>11.2% • Nr. 1 Werkstatt</span>
                </div>
              </div>
            </div>

            {/* Packaging Multiplier & Elasticity Waterfall */}
            <div className="lg:col-span-5 bg-white border border-purple-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-purple-600" />
                  <h3 className="font-black text-xs uppercase text-purple-950 font-mono">
                    {lang === 'de' ? 'GEBINDE-PREISELASTIZITÄT & MARGEN-HEBEL' : 'PACKAGING PRICE ELASTICITY'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">
                  BASE: 1000L IBC
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { size: '1L Flasche (Retail / Tankstelle)', price: '€16.40', index: '+290%', margin: '42.5%', color: 'bg-rose-500', barWidth: 'w-full' },
                  { size: '5L Kanister (DIY / Kfz-Werkstatt)', price: '€11.20', index: '+166%', margin: '34.0%', color: 'bg-purple-600', barWidth: 'w-3/4' },
                  { size: '20L Werkstatt-Pail (Gewerbe)', price: '€8.10', index: '+92%', margin: '27.5%', color: 'bg-indigo-500', barWidth: 'w-1/2' },
                  { size: '208L Stahlfass (Flotten-Standard)', price: '€5.45', index: '+30%', margin: '22.0%', color: 'bg-cyan-500', barWidth: 'w-1/3' },
                  { size: '1000L IBC Tank (Großindustrie / Bulk)', price: '€4.20', index: 'Base (0%)', margin: '16.5%', color: 'bg-emerald-500', barWidth: 'w-1/4' },
                ].map((tier, idx) => (
                  <div key={idx} className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-900 font-sans">{tier.size}</span>
                      <span className="text-purple-950 font-black">{tier.price} / L</span>
                    </div>
                    <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${tier.color} rounded-full`} style={{ width: tier.margin }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Index vs. Bulk: <strong className="text-purple-700 font-bold">{tier.index}</strong></span>
                      <span>Marge: <strong className="text-emerald-700 font-bold">{tier.margin}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sector TAM & Realized Price Matrix */}
          <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <h3 className="font-black text-xs uppercase text-purple-950 font-mono">
                  {lang === 'de' ? 'SEKTOR-TAM & DURCHSCHNITTLICHE GROSSHANDELS-PREISSPANNEN' : 'SECTOR TAM & WHOLESALE PRICE REALIZATION'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 font-bold">
                6 KERNSEKTOREN
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-purple-50/80 text-purple-950 uppercase text-[10px] font-bold border-b border-purple-200">
                  <tr>
                    <th className="py-2.5 px-3.5 font-sans">Schmierstoff-Sektor</th>
                    <th className="py-2.5 px-3.5 text-right">TAM Marktvolumen</th>
                    <th className="py-2.5 px-3.5 text-right">Volumen (Tonnen)</th>
                    <th className="py-2.5 px-3.5 text-right">Ø Großhandel (€/L)</th>
                    <th className="py-2.5 px-3.5 text-right">Ø Retail (€/L)</th>
                    <th className="py-2.5 px-3.5 text-right">Bruttomarge (%)</th>
                    <th className="py-2.5 px-3.5">Führende Wettbewerber</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100 text-[11px]">
                  {[
                    { sector: 'Automotive OEM / PCMO', tam: '€1.120 Mio.', vol: '305.000 t', bulk: '€6.20', retail: '€16.50', margin: '28.5%', leaders: 'Castrol, Liqui Moly, Shell, Ravenol' },
                    { sector: 'Transport & Flotte (HDEO)', tam: '€940 Mio.', vol: '230.000 t', bulk: '€4.35', retail: '€9.80', margin: '22.4%', leaders: 'Shell Rimula, TotalEnergies Rubia, ROWE' },
                    { sector: 'Industrie-Hydraulik & Getriebe (HLP/CLP)', tam: '€780 Mio.', vol: '215.000 t', bulk: '€3.80', retail: '€8.20', margin: '24.1%', leaders: 'Fuchs Renolin, Mobil DTE, SRS Hydrofluid' },
                    { sector: 'Windenergie PAO Getriebeöle', tam: '€240 Mio.', vol: '25.000 t', bulk: '€9.50', retail: '€24.00', margin: '34.2%', leaders: 'Castrol Optigear, Klüber, Mobil SHC' },
                    { sector: 'Agrar & Forstwirtschaft (UTTO/Bio)', tam: '€310 Mio.', vol: '95.000 t', bulk: '€4.10', retail: '€8.90', margin: '21.8%', leaders: 'BayWa TECTROL, AGRAVIS, TotalEnergies' },
                    { sector: 'Metallbearbeitung & KSS (MWF)', tam: '€260 Mio.', vol: '45.000 t', bulk: '€7.20', retail: '€18.50', margin: '31.0%', leaders: 'Fuchs Ecocool, Castrol Alusol, Blaser' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-purple-50/50 transition-colors">
                      <td className="py-2.5 px-3.5 font-sans font-bold text-slate-900">{row.sector}</td>
                      <td className="py-2.5 px-3.5 text-right font-black text-purple-950">{row.tam}</td>
                      <td className="py-2.5 px-3.5 text-right text-slate-600">{row.vol}</td>
                      <td className="py-2.5 px-3.5 text-right font-bold text-slate-800">{row.bulk}</td>
                      <td className="py-2.5 px-3.5 text-right text-purple-700 font-bold">{row.retail}</td>
                      <td className="py-2.5 px-3.5 text-right text-emerald-700 font-black">{row.margin}</td>
                      <td className="py-2.5 px-3.5 font-sans text-slate-700 text-[10.5px]">{row.leaders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategic Executive Takeaways */}
          <div className="p-5 bg-gradient-to-br from-purple-900 to-indigo-950 rounded-2xl text-white shadow-md space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-300" />
              <h3 className="font-black text-sm uppercase tracking-wide">
                {lang === 'de' ? 'STRATEGISCHE DIREKTIVEN FÜR DIE MARGEN-OPTIMIERUNG' : 'EXECUTIVE STRATEGY DIRECTIVES FOR MARGIN CAPTURE'}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-purple-100">
              <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-purple-300 font-bold block text-[11px]">1. 208L Fass vs IBC Arbitrage</span>
                <p className="text-[11px] leading-relaxed text-purple-100/90 font-sans">
                  Fassware erzielt im Flottenmarkt +30% Aufschlag gegenüber IBC. Umfüllung in eigene 208L Gebinde sichert €1.25/L Zusatzmarge bei Speditionen.
                </p>
              </div>
              <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-purple-300 font-bold block text-[11px]">2. Windenergie PAO Spezialisierung</span>
                <p className="text-[11px] leading-relaxed text-purple-100/90 font-sans">
                  Mit 34.2% Bruttomarge ist der Windparksektor in Nord-/Ostdeutschland (Schleswig-Holstein, MV, BB) der rentabelste Wachstumshebel.
                </p>
              </div>
              <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-purple-300 font-bold block text-[11px]">3. Agrar Private-Label Gegenoffensive</span>
                <p className="text-[11px] leading-relaxed text-purple-100/90 font-sans">
                  BayWa TECTROL und AGRAVIS dominieren ländliche Gebiete. Gezielte Kampagnen mit OEM-Freigaben (DIN 51524 / ACEA E8) können bis zu 15% Marktanteil zurückgewinnen.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar (For Matrix & Waterfall) */}
      {(activeTab === 'matrix' || activeTab === 'waterfall') && (
        <div className="bg-white border border-purple-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'de' ? 'Freitext (Castrol, VW 504.00, HLP 46)...' : 'Search (Castrol, 5W-30, HLP 46)...'}
                className="bg-purple-50/60 border border-purple-200 rounded-xl pl-8 pr-3 py-1.5 text-slate-800 placeholder-purple-400 focus:outline-none focus:border-purple-600 w-48 sm:w-64 text-xs font-medium"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-purple-50/60 border border-purple-200 rounded-xl px-3 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-purple-600 text-xs"
            >
              <option value="all">{lang === 'de' ? 'Alle Kategorien' : 'All Categories'}</option>
              <option value="automotive_pcmo">Automotive OEM (PCMO)</option>
              <option value="transport_hdeo">Transport & Fleet (HDEO)</option>
              <option value="industrial_metalworking">Industrial & Hydraulic</option>
              <option value="agri_forestry_bio">Agri & Bio-Hydraulik</option>
            </select>

            {/* Distributor Filter */}
            <select
              value={selectedDistributor}
              onChange={(e) => setSelectedDistributor(e.target.value)}
              className="bg-purple-50/60 border border-purple-200 rounded-xl px-3 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-purple-600 text-xs"
            >
              <option value="all">{lang === 'de' ? 'Alle Händler & Portale' : 'All Distributors'}</option>
              {COMPETITOR_DISTRIBUTOR_PLATFORMS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Pack Size Selector Pill */}
          <div className="flex items-center space-x-1.5 bg-purple-100/70 p-1 rounded-xl border border-purple-200">
            <span className="text-[10.5px] text-purple-800 font-bold uppercase px-1">{lang === 'de' ? 'Gebinde:' : 'Pack:'}</span>
            {(['1L', '5L', '20L', '208L', '1000L'] as PackagingType[]).map(ps => (
              <button
                key={ps}
                onClick={() => setSelectedPackSize(ps)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  selectedPackSize === ps ? 'bg-white text-purple-900 shadow-sm font-black' : 'text-purple-700 hover:text-purple-950'
                }`}
              >
                {ps}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Price Matrix */}
      {activeTab === 'matrix' && (
        <div className="bg-white border border-purple-200/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-50/90 text-purple-900 uppercase text-[10.5px] font-bold border-b border-purple-200/80">
                <tr>
                  <th className="p-3.5">Produkt & Spezifikation</th>
                  <th className="p-3.5">Marke & Basisöl</th>
                  <th className="p-3.5">Händler / Portal</th>
                  <th className="p-3.5 text-right">1L Flasche</th>
                  <th className="p-3.5 text-right">5L Kanister</th>
                  <th className="p-3.5 text-right">20L Kanister</th>
                  <th className="p-3.5 text-right">208L Fass</th>
                  <th className="p-3.5 text-right">1000L IBC</th>
                  <th className="p-3.5 text-center">Status / Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {filteredProducts.map((p) => {
                  return (
                    <tr key={p.id} className="hover:bg-purple-50/50 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-start space-x-2">
                          {p.isPriceLeader && (
                            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-bold shrink-0 mt-0.5">
                              LEADER
                            </span>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">{p.productName}</span>
                            <span className="text-[10.5px] text-purple-700 font-semibold">{p.viscosityGrade}</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.oemApprovals.slice(0, 2).map((a, i) => (
                                <span key={i} className="text-[9px] bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded-md border border-purple-100 font-medium">
                                  {a}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="text-slate-900 font-bold block">{p.brand}</span>
                        <span className="text-[10.5px] text-slate-500">{p.baseOilGroup}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="text-purple-900 font-semibold block">{p.distributorName}</span>
                        <span className="text-[10px] text-slate-500">{p.distributorType}</span>
                      </td>

                      {/* Packaging Prices Net €/L */}
                      {(['1L', '5L', '20L', '208L', '1000L'] as PackagingType[]).map(pack => {
                        const pt = p.pricingByPack[pack];
                        const isSelected = selectedPackSize === pack;
                        return (
                          <td key={pack} className={`p-3.5 text-right ${isSelected ? 'bg-purple-100/50 font-bold' : ''}`}>
                            {pt && pt.inStock ? (
                              <div>
                                <span className="text-slate-900 font-bold text-xs">{formatCurrency(pt.pricePerLitreEur)}<span className="text-[9.5px] text-slate-500">/L</span></span>
                                <span className="text-[10px] text-slate-500 block font-normal">({formatCurrency(pt.grossPriceEur)})</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[10px] uppercase font-mono">N/A</span>
                            )}
                          </td>
                        );
                      })}

                      <td className="p-3.5 text-center">
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-purple-600 hover:text-purple-800 hover:underline text-xs font-bold"
                        >
                          <span>Shop</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Packaging Waterfall */}
      {activeTab === 'waterfall' && (
        <div className="space-y-4">
          <div className="bg-white border border-purple-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 uppercase">
                  {lang === 'de' ? 'Gebindestaffel-Degression: Vom 1L Fläschchen zum 1000L IBC' : 'Packaging Volume Discount Waterfall'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'de' ? 'Analysiert den Preisverfall je Liter über Gebindegrößen (Verpackungs- und Abfüllmarge)' : 'Price per litre degradation from retail 1L to industrial 1000L bulk'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((p) => {
                const p1 = p.pricingByPack['1L']?.pricePerLitreEur || 0;
                const p5 = p.pricingByPack['5L']?.pricePerLitreEur || 0;
                const p20 = p.pricingByPack['20L']?.pricePerLitreEur || 0;
                const p208 = p.pricingByPack['208L']?.pricePerLitreEur || 0;
                const p1000 = p.pricingByPack['1000L']?.pricePerLitreEur || 0;

                const maxP = Math.max(p1, p5, p20, p208, p1000, 1);
                const discountPercent = p1 > 0 && p1000 > 0 ? Math.round(((p1 - p1000) / p1) * 100) : 0;

                return (
                  <div key={p.id} className="bg-purple-50/40 border border-purple-200/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{p.productName}</span>
                        <span className="text-[10.5px] text-purple-700 font-medium">{p.brand} • {p.distributorName}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        -{discountPercent}% IBC Rabatt
                      </span>
                    </div>

                    {/* Visual Bar Stepdown */}
                    <div className="space-y-2 text-xs">
                      {(['1L', '5L', '20L', '208L', '1000L'] as PackagingType[]).map(pk => {
                        const pt = p.pricingByPack[pk];
                        const price = pt?.pricePerLitreEur || 0;
                        const barWidth = Math.round((price / maxP) * 100);
                        return (
                          <div key={pk} className="flex items-center space-x-2">
                            <span className="w-12 text-[10.5px] text-slate-500 font-semibold">{pk}</span>
                            <div className="flex-1 bg-purple-100 rounded-full h-3 overflow-hidden">
                              <div
                                className="h-full bg-purple-600 rounded-full"
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                            <span className="w-20 text-right text-[11px] text-slate-900 font-bold font-mono">
                              {price > 0 ? `${formatCurrency(price)}/L` : 'N/A'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Regional Index */}
      {activeTab === 'regional' && (
        <div className="space-y-4">
          <div className="bg-white border border-purple-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 uppercase">
                  {lang === 'de' ? '16 Bundesländer Schmierstoff-Preisindex & ADR-Gefahrgut-Frachtzuschläge' : '16 Federal States Price Index & Freight Surcharges'}
                </h3>
                <p className="text-xs text-purple-900/60 font-medium">
                  {lang === 'de' ? 'Basisindex Deutschland = 1.000 (Regionale Aufschläge in Bayern & BW durch Monopolstrukturen)' : 'Baseline Index DE = 1.000. Highlights regional margin variances & ADR logistics fees.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {REGIONAL_PRICE_SPREADS.map((r) => {
                const isPremium = r.priceVarianceFromNationalAvgPercent > 0;
                return (
                  <div
                    key={r.bundeslandCode}
                    className={`bg-purple-50/40 border rounded-xl p-3.5 space-y-2.5 ${
                      isPremium ? 'border-purple-300 ring-1 ring-purple-400/20' : 'border-purple-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-8 h-6 rounded-md flex items-center justify-center font-black font-mono text-xs bg-purple-200 text-purple-900 border border-purple-300">
                          {r.bundeslandCode}
                        </span>
                        <span className="font-bold text-xs text-slate-900 tracking-tight">{r.bundeslandName}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isPremium ? 'bg-purple-200 text-purple-900' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {isPremium ? '+' : ''}{r.priceVarianceFromNationalAvgPercent}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-lg border border-purple-100">
                      <div>
                        <span className="text-slate-500 text-[9.5px] block uppercase font-medium">Index</span>
                        <span className="text-slate-900 font-bold font-mono">{r.priceIndex.toFixed(3)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[9.5px] block uppercase font-medium">Ø Literpreis</span>
                        <span className="text-purple-700 font-bold font-mono">{formatCurrency(r.avgPricePerLitreEur)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[9.5px] block uppercase font-medium">208L HDEO</span>
                        <span className="text-slate-900 font-mono">{formatCurrency(r.hdeoAvgDrumPriceEur)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[9.5px] block uppercase font-medium">ADR Fracht</span>
                        <span className="text-rose-600 font-mono">+{formatCurrency(r.adrSurchargeAvgEur)}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500">
                      <span className="text-purple-700 font-semibold block">Dominante Händler:</span>
                      {r.dominantDistributors.join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 12-Month Trends */}
      {activeTab === 'trends' && (
        <div className="bg-white border border-purple-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 uppercase">
                {lang === 'de' ? '12-Monats Preisentwicklung je Liter (EUR)' : '12-Month Historical Price Trajectory'}
              </h3>
              <p className="text-xs text-purple-900/60 font-medium">
                {lang === 'de' ? 'Spiegelt Rohstoffpreise (Base Oil Group I-IV & Additivpakete) und Händlermargen wider' : 'Reflects raw base oil & additive cost pass-through across tracked benchmark brands'}
              </p>
            </div>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendChartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 11, fontFamily: 'monospace' }} unit="€" domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#ddd6fe', borderRadius: '0.75rem', fontFamily: 'monospace', fontSize: '11px', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.1)' }}
                />
                <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Castrol (auto)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="TECTROL (auto)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Ravenol (auto)" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Fuchs (tran)" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Aviaticon (tran)" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 5: Arbitrage Gaps */}
      {activeTab === 'arbitrage' && (
        <div className="space-y-4">
          <div className="text-xs text-purple-900 uppercase font-bold flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-900">
              <Zap className="w-4 h-4 text-purple-600" />
              {lang === 'de' ? 'Identifizierte Margen- & Arbitrage-Lücken im deutschen Markt' : 'Identified High-Yield Arbitrage Gaps'}
            </span>
            <span className="text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full font-bold">{PRICE_GAP_OPPORTUNITIES.length} OPPORTUNITIES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRICE_GAP_OPPORTUNITIES.map((gap) => (
              <div key={gap.id} className="bg-white border border-purple-300 rounded-2xl p-5 space-y-4 shadow-sm shadow-purple-500/5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-bold bg-purple-100 text-purple-800 border border-purple-200 uppercase">
                      {gap.opportunityType}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1.5">{gap.targetProduct}</h4>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-500 uppercase block">Margen-Vorteil</span>
                    <span className="text-emerald-600 font-black text-base">+{gap.marginArbitragePercent}%</span>
                  </div>
                </div>

                {/* Price Gap Comparison Bar */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                  <div className="border-r border-purple-200 pr-2">
                    <span className="text-[9.5px] text-rose-600 font-bold uppercase block">Höchstpreis-Portal:</span>
                    <span className="text-slate-900 font-bold block text-[11px] truncate">{gap.highestPricePlatform.name}</span>
                    <span className="text-slate-900 text-xs font-mono">{formatCurrency(gap.highestPricePlatform.pricePerLitre)}/L</span>
                  </div>
                  <div className="pl-2">
                    <span className="text-[9.5px] text-emerald-600 font-bold uppercase block">Tiefstpreis-Portal:</span>
                    <span className="text-slate-900 font-bold block text-[11px] truncate">{gap.lowestPricePlatform.name}</span>
                    <span className="text-emerald-600 font-bold text-xs font-mono">{formatCurrency(gap.lowestPricePlatform.pricePerLitre)}/L</span>
                  </div>
                </div>

                {/* Spread Metric */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Absolute Preisspreizung:</span>
                  <span className="text-purple-700 font-black text-sm font-mono">+{formatCurrency(gap.absoluteSpreadEurPerLitre)} / Liter</span>
                </div>

                {/* Tactical Recommendation */}
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-200/80 text-xs">
                  <span className="text-[10.5px] text-purple-900 uppercase font-bold flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    Handlungsempfehlung Vertrieb & Channel-Strategie:
                  </span>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    {lang === 'de' ? gap.recommendedActionDe : gap.recommendedActionEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Scraper Terminal & Logs */}
      {activeTab === 'scraper' && (
        <div className="bg-white border border-purple-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-sm text-slate-900 uppercase">
                {lang === 'de' ? 'Scraper Ausführungs-Terminal & Harvest-Protokolle' : 'Scraper Execution Terminal & Harvest Logs'}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              STATUS: CRAWLER IDLE / READY
            </span>
          </div>

          <div className="bg-purple-950 rounded-xl p-4 font-mono text-xs space-y-2 text-purple-200">
            <div className="text-purple-400 text-[11px] mb-2">// Active Scraper Targets (Selenium/Cheerio Endpoints):</div>
            {COMPETITOR_DISTRIBUTOR_PLATFORMS.map(d => (
              <div key={d.id} className="flex items-center justify-between text-[11px] hover:text-white">
                <span className="text-purple-300 font-bold">{d.name}</span>
                <span className="text-purple-400 truncate max-w-xs">{d.websiteUrl}</span>
                <span className="text-emerald-400">{d.catalogSizeSkus} SKUs</span>
                <span className="text-purple-400">{d.lastScrapedTimestamp}</span>
              </div>
            ))}
          </div>

          {/* Job Logs Stream */}
          <div className="space-y-2">
            <div className="text-xs text-purple-900 uppercase font-bold">
              {lang === 'de' ? 'Letzte Scraping-Aufträge' : 'Recent Scraping Jobs'}
            </div>
            <div className="space-y-1.5">
              {jobLogs.map((log) => (
                <div key={log.id} className="bg-purple-50/50 border border-purple-100 rounded-xl p-3 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-900 font-bold">{log.distributorName}</span>
                    <span className="text-slate-500 text-[10.5px]">({log.timestamp})</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] font-mono">
                    <span className="text-purple-700 font-bold">{log.productsScraped} SKUs</span>
                    <span className="text-emerald-700 font-bold">+{log.newPriceGapsFound} Gaps</span>
                    <span className="text-slate-500">{log.durationMs}ms</span>
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
