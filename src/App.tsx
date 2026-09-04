/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { GisMapModule } from './components/GisMapModule';
import { LogisticsIntelligenceModule } from './components/LogisticsIntelligenceModule';
import { CompetitorPricingModule } from './components/CompetitorPricingModule';
import { SupplyDemandBalancer } from './components/SupplyDemandBalancer';
import { WhiteSpotsOptimizer } from './components/WhiteSpotsOptimizer';
import { DistributorMatrix } from './components/DistributorMatrix';
import { FuelPumpsModule } from './components/FuelPumpsModule';
import { ExecutiveLeadershipCockpit } from './components/ExecutiveLeadershipCockpit';
import { OsmOverpassHarvester } from './components/OsmOverpassHarvester';
import { AiStrategyAdvisor } from './components/AiStrategyAdvisor';
import { ExportModal } from './components/ExportModal';

import { BUNDESLAENDER_DATA } from './data/bundeslaender';
import { WHITE_SPOT_CLUSTERS } from './data/whiteSpots';
import { GROUND_REGISTRY_SITES } from './data/groundRegistry';
import { Language, MetricUnit, OverpassPoi, WhiteSpotCluster } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'map' | 'leadership' | 'balancer' | 'white_spots' | 'distributors' | 'logistics' | 'pricing' | 'fuel_pumps' | 'osm_harvester' | 'ai_advisor'
  >('leadership');
  const [lang, setLang] = useState<Language>('de');
  const [unit, setUnit] = useState<MetricUnit>('tonnes');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [overpassPois, setOverpassPois] = useState<OverpassPoi[]>([]);

  // Total Market Stats
  const totalMarketTonnes = useMemo(() => {
    return BUNDESLAENDER_DATA.reduce((acc, b) => {
      const stateTotal = Object.values(b.demandTonnes).reduce((a, c) => a + c, 0);
      return acc + stateTotal;
    }, 0);
  }, []);

  const totalDeficitCount = useMemo(() => {
    return BUNDESLAENDER_DATA.filter((b) => {
      const totalDemand = Object.values(b.demandTonnes).reduce((a, c) => a + c, 0);
      return b.localProductionCapacityTonnes < totalDemand;
    }).length;
  }, []);

  const handleSelectWhiteSpot = (ws: WhiteSpotCluster) => {
    // Can switch tab or highlight
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-900 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-950 purple-subtle-glow">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        unit={unit}
        setUnit={setUnit}
        onOpenExport={() => setIsExportModalOpen(true)}
        totalMarketTonnes={totalMarketTonnes}
        totalDeficitCount={totalDeficitCount}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'leadership' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ExecutiveLeadershipCockpit
              lang={lang}
              unit={unit}
            />
          </div>
        )}

        {activeTab === 'map' && (
          <GisMapModule
            bundeslaender={BUNDESLAENDER_DATA}
            whiteSpots={WHITE_SPOT_CLUSTERS}
            groundRegistry={GROUND_REGISTRY_SITES}
            overpassPois={overpassPois}
            lang={lang}
            unit={unit}
            onSelectWhiteSpot={handleSelectWhiteSpot}
          />
        )}

        {activeTab === 'logistics' && (
          <LogisticsIntelligenceModule
            lang={lang}
            unit={unit}
          />
        )}

        {activeTab === 'pricing' && (
          <CompetitorPricingModule
            lang={lang}
            unit={unit}
          />
        )}

        {activeTab === 'fuel_pumps' && (
          <FuelPumpsModule
            lang={lang}
            unit={unit}
          />
        )}

        {activeTab === 'balancer' && (
          <SupplyDemandBalancer
            bundeslaender={BUNDESLAENDER_DATA}
            lang={lang}
            unit={unit}
          />
        )}

        {activeTab === 'white_spots' && (
          <WhiteSpotsOptimizer
            whiteSpots={WHITE_SPOT_CLUSTERS}
            lang={lang}
            unit={unit}
            onSelectCluster={handleSelectWhiteSpot}
          />
        )}

        {activeTab === 'distributors' && (
          <DistributorMatrix
            lang={lang}
            unit={unit}
          />
        )}

        {activeTab === 'osm_harvester' && (
          <OsmOverpassHarvester
            overpassPois={overpassPois}
            setOverpassPois={setOverpassPois}
            lang={lang}
            unit={unit}
          />
        )}

        {activeTab === 'ai_advisor' && (
          <AiStrategyAdvisor
            lang={lang}
            unit={unit}
          />
        )}
      </main>

      {/* Export Modal Dialog */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        bundeslaender={BUNDESLAENDER_DATA}
        whiteSpots={WHITE_SPOT_CLUSTERS}
        groundRegistry={GROUND_REGISTRY_SITES}
        overpassPois={overpassPois}
        lang={lang}
        unit={unit}
      />

      {/* Telemetry Status Bar Footer */}
      <footer className="h-8 bg-white/90 backdrop-blur-sm border-t border-purple-200/80 text-[10.5px] text-purple-900/70 flex items-center justify-between px-4 sm:px-6 shrink-0 font-mono select-none z-30">
        <div className="flex items-center space-x-4 overflow-x-auto">
          <span className="flex items-center space-x-1.5 text-purple-950 font-medium">
            <span className="text-purple-600 font-bold">SOURCE:</span>
            <span>AFM / UNITI DEUTSCHLAND / BAFA</span>
          </span>
          <span className="hidden sm:inline text-purple-200">|</span>
          <span className="hidden sm:flex items-center space-x-1.5">
            <span className="text-purple-500 font-semibold">STANDARDS:</span>
            <span className="text-purple-900">DIN 51524 / DIN 51517 / ACEA E4-E8 / RAL-UZ 178</span>
          </span>
          <span className="hidden md:inline text-purple-200">|</span>
          <span className="hidden md:flex items-center space-x-1.5">
            <span className="text-purple-500 font-semibold">OVERPASS HARVESTER:</span>
            <span className="text-emerald-600 font-bold">ONLINE</span>
          </span>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-purple-950 font-semibold">GRID ENGINE: STABLE</span>
          </span>
          <span className="text-purple-200">|</span>
          <span className="text-purple-700 font-bold bg-purple-100 px-1.5 py-0.5 rounded text-[10px]">V2.5.0-LAVENDER</span>
        </div>
      </footer>
    </div>
  );
}

