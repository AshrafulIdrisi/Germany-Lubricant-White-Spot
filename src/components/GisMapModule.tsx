import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  BundeslandData, 
  WhiteSpotCluster, 
  GroundRegistrySite, 
  OverpassPoi, 
  FluidSector, 
  Language, 
  MetricUnit,
  AutobahnCorridor,
  WaterwayCorridor,
  PortTerminalThroughput,
  LogisticsDisruptionAlert,
  GaugeStation
} from '../types';
import { FLUID_SECTORS } from '../data/fluidSpecs';
import { 
  AUTOBAHN_CORRIDORS, 
  WATERWAY_CORRIDORS, 
  PORT_TERMINALS_DATA, 
  LOGISTICS_DISRUPTIONS 
} from '../data/logisticsAndFreight';
import { convertTonnes, formatUnitLabel, formatNumber, formatCurrency } from '../utils/exportUtils';
import { 
  Layers, 
  Filter, 
  Search, 
  Target, 
  Building2, 
  Truck, 
  Wind, 
  Anchor, 
  FlaskConical, 
  Tractor, 
  Info, 
  X, 
  ExternalLink, 
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Factory,
  Waves,
  Gauge,
  Navigation,
  Fuel,
  Compass,
  Zap
} from 'lucide-react';

interface GisMapModuleProps {
  bundeslaender: BundeslandData[];
  whiteSpots: WhiteSpotCluster[];
  groundRegistry: GroundRegistrySite[];
  overpassPois: OverpassPoi[];
  lang: Language;
  unit: MetricUnit;
  onSelectWhiteSpot?: (ws: WhiteSpotCluster) => void;
  onSelectState?: (stateId: string) => void;
}

export const GisMapModule: React.FC<GisMapModuleProps> = ({
  bundeslaender,
  whiteSpots,
  groundRegistry,
  overpassPois,
  lang,
  unit,
  onSelectWhiteSpot,
  onSelectState,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Layer Toggles
  const [showWhiteSpots, setShowWhiteSpots] = useState(true);
  const [showBlendingPlants, setShowBlendingPlants] = useState(true);
  const [showAutohof, setShowAutohof] = useState(true);
  const [showAgriCooperatives, setShowAgriCooperatives] = useState(true);
  const [showChemicalParks, setShowChemicalParks] = useState(true);
  const [showWindHubs, setShowWindHubs] = useState(true);
  const [showPortTerminals, setShowPortTerminals] = useState(true);
  const [showOsmPois, setShowOsmPois] = useState(false);

  // New Logistics Telemetry Layer Toggles
  const [showAutobahnCorridors, setShowAutobahnCorridors] = useState(true);
  const [showWaterwayCorridors, setShowWaterwayCorridors] = useState(true);
  const [showLogisticsDisruptions, setShowLogisticsDisruptions] = useState(true);

  // Filter by Sector
  const [selectedSector, setSelectedSector] = useState<FluidSector | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedObject, setSelectedObject] = useState<{
    type: 'WHITE_SPOT' | 'GROUND_SITE' | 'STATE' | 'OSM_POI' | 'AUTOBAHN' | 'WATERWAY' | 'PORT' | 'GAUGE' | 'DISRUPTION';
    data: any;
  } | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [51.1657, 10.4515], // Center of Germany
        zoom: 6,
        minZoom: 5,
        maxZoom: 18,
        zoomControl: false,
      });

      // Add zoom control top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Light theme OpenStreetMap tiles with high contrast purple-compatible styling
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount handled gracefully
    };
  }, []);

  // Update Markers, Polylines and Clusters
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // 1. Render Autobahn Corridors (A1, A2, A3, A7, A8, A9)
    if (showAutobahnCorridors) {
      AUTOBAHN_CORRIDORS.forEach((corridor) => {
        const strokeColor =
          corridor.disruptionRiskRating === 'CRITICAL'
            ? '#f43f5e'
            : corridor.disruptionRiskRating === 'HIGH'
            ? '#f59e0b'
            : '#3b82f6';

        const polyline = L.polyline(corridor.polyline as [number, number][], {
          color: strokeColor,
          weight: 4.5,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round',
        });

        // Click on highway
        polyline.on('click', () => {
          setSelectedObject({ type: 'AUTOBAHN', data: corridor });
          const midPoint = corridor.polyline[Math.floor(corridor.polyline.length / 2)];
          mapInstanceRef.current?.flyTo([midPoint[0], midPoint[1]], 8, { duration: 1 });
        });

        layerGroup.addLayer(polyline);

        // Autobahn Badge Marker at midpoint
        const midPoint = corridor.polyline[Math.floor(corridor.polyline.length / 2)];
        const badgeIcon = L.divIcon({
          className: 'custom-autobahn-badge',
          html: `
            <div style="
              background-color: #1d4ed8;
              border: 1.5px solid #93c5fd;
              color: #ffffff;
              font-family: monospace;
              font-weight: 900;
              font-size: 10px;
              padding: 2px 5px;
              border-radius: 4px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.6);
              cursor: pointer;
              text-align: center;
              white-space: nowrap;
            ">
              ${corridor.code}
            </div>
          `,
          iconSize: [28, 18],
          iconAnchor: [14, 9],
        });

        const badgeMarker = L.marker([midPoint[0], midPoint[1]], { icon: badgeIcon });
        badgeMarker.on('click', () => {
          setSelectedObject({ type: 'AUTOBAHN', data: corridor });
          mapInstanceRef.current?.flyTo([midPoint[0], midPoint[1]], 8, { duration: 1 });
        });

        layerGroup.addLayer(badgeMarker);
      });
    }

    // 2. Render Inland Waterway Corridors (Rhein, Elbe, Donau) & Gauge Stations
    if (showWaterwayCorridors) {
      WATERWAY_CORRIDORS.forEach((waterway) => {
        const polyline = L.polyline(waterway.polyline as [number, number][], {
          color: '#06b6d4',
          weight: 4,
          opacity: 0.8,
          dashArray: '8, 4',
        });

        polyline.on('click', () => {
          setSelectedObject({ type: 'WATERWAY', data: waterway });
          const midPoint = waterway.polyline[Math.floor(waterway.polyline.length / 2)];
          mapInstanceRef.current?.flyTo([midPoint[0], midPoint[1]], 8, { duration: 1 });
        });

        layerGroup.addLayer(polyline);

        // Render Gauge Stations
        waterway.gaugeStations.forEach((gauge) => {
          const isGaugeAlert = gauge.status === 'LOW_WATER_ALERT' || gauge.status === 'SEVERELY_RESTRICTED';
          const gaugeColor = isGaugeAlert ? '#f43f5e' : '#06b6d4';

          const gaugeIcon = L.divIcon({
            className: 'custom-gauge-marker',
            html: `
              <div style="
                width: 22px;
                height: 22px;
                background-color: ${isGaugeAlert ? '#881337' : '#083344'};
                border: 2px solid ${gaugeColor};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${gaugeColor};
                font-weight: 800;
                font-size: 9px;
                font-family: monospace;
                box-shadow: 0 0 8px ${gaugeColor};
                cursor: pointer;
              ">
                🌊
              </div>
            `,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });

          const gaugeMarker = L.marker([gauge.lat, gauge.lng], { icon: gaugeIcon });
          gaugeMarker.on('click', () => {
            setSelectedObject({ type: 'GAUGE', data: { ...gauge, waterwayName: waterway.name } });
            mapInstanceRef.current?.flyTo([gauge.lat, gauge.lng], 10, { duration: 1 });
          });

          layerGroup.addLayer(gaugeMarker);
        });
      });
    }

    // 3. Render Seaports and Inland Ports
    if (showPortTerminals) {
      PORT_TERMINALS_DATA.forEach((port) => {
        const portIcon = L.divIcon({
          className: 'custom-port-marker',
          html: `
            <div style="
              width: 26px;
              height: 26px;
              background-color: #065f46;
              border: 2px solid #34d399;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 13px;
              box-shadow: 0 0 10px rgba(52, 211, 153, 0.5);
              cursor: pointer;
            ">
              ⚓
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const portMarker = L.marker([port.lat, port.lng], { icon: portIcon });
        portMarker.on('click', () => {
          setSelectedObject({ type: 'PORT', data: port });
          mapInstanceRef.current?.flyTo([port.lat, port.lng], 10, { duration: 1 });
        });

        layerGroup.addLayer(portMarker);
      });
    }

    // 4. Render Supply Chain Disruption Alerts
    if (showLogisticsDisruptions) {
      LOGISTICS_DISRUPTIONS.forEach((alert) => {
        if (alert.lat == null || alert.lng == null) return;
        const alertLat = alert.lat;
        const alertLng = alert.lng;
        const alertIcon = L.divIcon({
          className: 'custom-alert-marker',
          html: `
            <div style="
              position: relative;
              width: 28px;
              height: 28px;
              background-color: #be123c;
              border: 2px solid #ffffff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 13px;
              box-shadow: 0 0 14px #f43f5e;
              animation: pulse 1.5s infinite;
              cursor: pointer;
            ">
              ⚠️
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const alertMarker = L.marker([alertLat, alertLng], { icon: alertIcon });
        alertMarker.on('click', () => {
          setSelectedObject({ type: 'DISRUPTION', data: alert });
          mapInstanceRef.current?.flyTo([alertLat, alertLng], 9, { duration: 1 });
        });

        layerGroup.addLayer(alertMarker);
      });
    }

    // 5. Render White-Spots
    if (showWhiteSpots) {
      const filteredSpots = whiteSpots.filter((ws) => {
        if (selectedSector !== 'ALL') {
          return ws.primarySector === selectedSector || ws.secondarySectors.includes(selectedSector);
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            ws.name.toLowerCase().includes(q) ||
            ws.bundeslandName.toLowerCase().includes(q) ||
            ws.plzCoverage.some((p) => p.includes(q)) ||
            ws.keyIndustrialAnchors.some((a) => a.toLowerCase().includes(q))
          );
        }
        return true;
      });

      filteredSpots.forEach((ws) => {
        const color =
          ws.priority === 'CRITICAL'
            ? '#f43f5e'
            : ws.priority === 'HIGH'
            ? '#f59e0b'
            : '#3b82f6';

        const icon = L.divIcon({
          className: 'custom-white-spot-marker',
          html: `
            <div style="
              position: relative;
              width: 28px;
              height: 28px;
              background-color: ${color};
              border: 2px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 0 12px ${color};
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 800;
              font-size: 11px;
              cursor: pointer;
            ">
              <span style="font-family: monospace;">${ws.opportunityScore}</span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([ws.lat, ws.lng], { icon });
        const circle = L.circle([ws.lat, ws.lng], {
          radius: ws.radiusKm * 1000,
          color: color,
          fillColor: color,
          fillOpacity: 0.08,
          weight: 1,
          dashArray: '4, 4',
        });

        marker.on('click', () => {
          setSelectedObject({ type: 'WHITE_SPOT', data: ws });
          if (onSelectWhiteSpot) onSelectWhiteSpot(ws);
          mapInstanceRef.current?.flyTo([ws.lat, ws.lng], 9, { duration: 1 });
        });

        layerGroup.addLayer(circle);
        layerGroup.addLayer(marker);
      });
    }

    // 6. Render Ground Registry Sites
    groundRegistry.forEach((site) => {
      if (site.type === 'BLENDING_PLANT' || site.type === 'REFINERY') {
        if (!showBlendingPlants) return;
      } else if (site.type === 'AUTOHOF_FLEET') {
        if (!showAutohof) return;
      } else if (site.type === 'AGRI_COOPERATIVE') {
        if (!showAgriCooperatives) return;
      } else if (site.type === 'CHEMICAL_PARK') {
        if (!showChemicalParks) return;
      } else if (site.type === 'WIND_HUB') {
        if (!showWindHubs) return;
      }

      if (selectedSector !== 'ALL' && !site.sectorsServed.includes(selectedSector)) {
        return;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          site.name.toLowerCase().includes(q) ||
          site.city.toLowerCase().includes(q) ||
          site.plz.includes(q) ||
          site.brandAffiliation.toLowerCase().includes(q);
        if (!match) return;
      }

      let markerBg = '#38bdf8';
      let markerBorder = '#0284c7';
      let iconSymbol = '⚙️';

      if (site.type === 'BLENDING_PLANT' || site.type === 'REFINERY') {
        markerBg = '#8b5cf6';
        markerBorder = '#7c3aed';
        iconSymbol = '🏭';
      } else if (site.type === 'AUTOHOF_FLEET') {
        markerBg = '#f97316';
        markerBorder = '#ea580c';
        iconSymbol = '🚛';
      } else if (site.type === 'AGRI_COOPERATIVE') {
        markerBg = '#84cc16';
        markerBorder = '#65a30d';
        iconSymbol = '🌾';
      } else if (site.type === 'CHEMICAL_PARK') {
        markerBg = '#ec4899';
        markerBorder = '#db2777';
        iconSymbol = '🧪';
      } else if (site.type === 'WIND_HUB') {
        markerBg = '#06b6d4';
        markerBorder = '#0891b2';
        iconSymbol = '💨';
      }

      const icon = L.divIcon({
        className: 'custom-ground-marker',
        html: `
          <div style="
            width: 22px;
            height: 22px;
            background-color: ${markerBg};
            border: 1.5px solid ${markerBorder};
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            cursor: pointer;
          ">
            ${iconSymbol}
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([site.lat, site.lng], { icon });
      marker.on('click', () => {
        setSelectedObject({ type: 'GROUND_SITE', data: site });
        mapInstanceRef.current?.flyTo([site.lat, site.lng], 10, { duration: 1 });
      });

      layerGroup.addLayer(marker);
    });

    // 7. Render Harvested OSM POIs
    if (showOsmPois && overpassPois.length > 0) {
      overpassPois.forEach((poi) => {
        const icon = L.divIcon({
          className: 'custom-osm-marker',
          html: `
            <div style="
              width: 14px;
              height: 14px;
              background-color: #eab308;
              border: 1px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 0 6px #eab308;
              cursor: pointer;
            "></div>
          `,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const marker = L.marker([poi.lat, poi.lon], { icon });
        marker.on('click', () => {
          setSelectedObject({ type: 'OSM_POI', data: poi });
        });
        layerGroup.addLayer(marker);
      });
    }

  }, [
    showWhiteSpots,
    showBlendingPlants,
    showAutohof,
    showAgriCooperatives,
    showChemicalParks,
    showWindHubs,
    showPortTerminals,
    showOsmPois,
    showAutobahnCorridors,
    showWaterwayCorridors,
    showLogisticsDisruptions,
    selectedSector,
    searchQuery,
    whiteSpots,
    groundRegistry,
    overpassPois,
  ]);

  // Jump to Germany Overview
  const handleResetView = () => {
    mapInstanceRef.current?.flyTo([51.1657, 10.4515], 6, { duration: 1 });
  };

  return (
    <div className="relative w-full h-[calc(100vh-6.5rem)] bg-[#faf8ff] flex flex-col md:flex-row overflow-hidden">
      {/* Map Filter & Layer Sidebar (Desktop Left) */}
      <div className="w-full md:w-80 bg-white/95 backdrop-blur-md border-r border-purple-200 p-3.5 flex flex-col space-y-3.5 z-10 overflow-y-auto scrollbar-thin text-xs text-slate-800 shadow-sm">
        
        {/* Search Input */}
        <div>
          <label className="block text-[10px] font-mono font-bold text-purple-900 mb-1 uppercase">
            {lang === 'de' ? 'SUCHE (STADT, PLZ, UNTERNEHMEN, AUTOBAHN)' : 'SEARCH (CITY, PLZ, COMPANY, HIGHWAY)'}
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'de' ? 'z.B. A2, Stuttgart, 70173, Fuchs, BayWa' : 'e.g. A2, Stuttgart, 70173, Fuchs, BayWa'}
              className="w-full pl-8 pr-3 py-1.5 bg-purple-50/70 border border-purple-200 rounded-lg text-slate-900 placeholder-purple-400 font-mono text-xs focus:outline-none focus:border-purple-600 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-purple-400 hover:text-purple-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sector Filter Chips */}
        <div>
          <label className="block text-[10px] font-mono font-bold text-purple-900 mb-1 flex items-center justify-between uppercase">
            <span>{lang === 'de' ? 'INDUSTRIE-SEKTOR FILTER' : 'INDUSTRY SECTOR FILTER'}</span>
            <span className="text-purple-600 font-bold">{selectedSector === 'ALL' ? '7/7' : '1/7'}</span>
          </label>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedSector('ALL')}
              className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                selectedSector === 'ALL'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                  : 'bg-purple-50/70 border border-purple-200 text-purple-800 hover:bg-purple-100'
              }`}
            >
              {lang === 'de' ? 'ALLE SEKTOREN' : 'ALL SECTORS'}
            </button>
            {FLUID_SECTORS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSector(sec.id)}
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-colors flex items-center space-x-1 cursor-pointer ${
                  selectedSector === sec.id
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                    : 'bg-purple-50/70 border border-purple-200 text-purple-800 hover:bg-purple-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sec.color }} />
                <span>{lang === 'de' ? sec.nameDe.split(' ')[0] : sec.nameEn.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Logistics & Freight Telemetry Layers */}
        <div className="pt-2 border-t border-purple-100">
          <label className="block text-[10px] font-mono font-bold text-purple-900 mb-1.5 flex items-center justify-between uppercase">
            <span className="flex items-center space-x-1">
              <Truck className="w-3.5 h-3.5 text-purple-600" />
              <span>{lang === 'de' ? 'LOGISTIK & FRACHT TELEMETRIE' : 'LOGISTICS & FREIGHT LAYERS'}</span>
            </span>
            <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded border border-purple-200 font-bold">
              LIVE
            </span>
          </label>

          <div className="space-y-1 text-[11px] font-mono">
            <label className="flex items-center justify-between p-1.5 bg-purple-50/50 rounded-lg border border-purple-200/80 cursor-pointer hover:bg-purple-100/70 transition-colors">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded bg-blue-600 border border-blue-400" />
                <span className="font-bold text-slate-800">
                  {lang === 'de' ? 'Autobahnen A1-A9 (HDEO)' : 'Autobahn Corridors A1-A9'}
                </span>
              </span>
              <input
                type="checkbox"
                checked={showAutobahnCorridors}
                onChange={(e) => setShowAutobahnCorridors(e.target.checked)}
                className="rounded accent-purple-600"
              />
            </label>

            <label className="flex items-center justify-between p-1.5 bg-purple-50/50 rounded-lg border border-purple-200/80 cursor-pointer hover:bg-purple-100/70 transition-colors">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded bg-cyan-500" />
                <span className="font-bold text-slate-800">
                  {lang === 'de' ? 'Rhein/Elbe/Donau & Pegel' : 'Waterways & Gauge Stations'}
                </span>
              </span>
              <input
                type="checkbox"
                checked={showWaterwayCorridors}
                onChange={(e) => setShowWaterwayCorridors(e.target.checked)}
                className="rounded accent-purple-600"
              />
            </label>

            <label className="flex items-center justify-between p-1.5 bg-purple-50/50 rounded-lg border border-purple-200/80 cursor-pointer hover:bg-purple-100/70 transition-colors">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span className="font-bold text-slate-800">
                  {lang === 'de' ? 'Seehäfen (TEU & Marine Öle)' : 'Port Terminals (TEU/Marine)'}
                </span>
              </span>
              <input
                type="checkbox"
                checked={showPortTerminals}
                onChange={(e) => setShowPortTerminals(e.target.checked)}
                className="rounded accent-purple-600"
              />
            </label>

            <label className="flex items-center justify-between p-1.5 bg-rose-50 rounded-lg border border-rose-200 cursor-pointer hover:bg-rose-100/80 transition-colors">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-bold text-rose-800">
                  {lang === 'de' ? 'Lieferketten-Störungen' : 'Disruptions & Bottlenecks'}
                </span>
              </span>
              <input
                type="checkbox"
                checked={showLogisticsDisruptions}
                onChange={(e) => setShowLogisticsDisruptions(e.target.checked)}
                className="rounded accent-purple-600"
              />
            </label>
          </div>
        </div>

        {/* GIS Standard Layers Control */}
        <div className="pt-2 border-t border-purple-100">
          <label className="block text-[10px] font-mono font-bold text-purple-900 mb-1.5 flex items-center justify-between uppercase">
            <span className="flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>{lang === 'de' ? 'STANDORT- & KANAL-EBENEN' : 'CHANNEL & ASSET LAYERS'}</span>
            </span>
          </label>

          <div className="space-y-1 text-[11px] font-mono">
            <label className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-purple-200/80 cursor-pointer hover:bg-purple-50 transition-colors">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                <span className="font-bold text-slate-800">
                  {lang === 'de' ? '30+ White-Spot Korridore' : '30+ White-Spot Clusters'}
                </span>
              </span>
              <input
                type="checkbox"
                checked={showWhiteSpots}
                onChange={(e) => setShowWhiteSpots(e.target.checked)}
                className="rounded accent-purple-600"
              />
            </label>

            <label className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-purple-200/80 cursor-pointer hover:bg-purple-50 transition-colors">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded bg-purple-500" />
                <span className="text-slate-700">{lang === 'de' ? 'Blending & Raffinerien' : 'Blending & Refineries'}</span>
              </span>
              <input
                type="checkbox"
                checked={showBlendingPlants}
                onChange={(e) => setShowBlendingPlants(e.target.checked)}
                className="rounded accent-purple-600"
              />
            </label>

            <label className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-purple-200/80 cursor-pointer hover:bg-purple-50 transition-colors">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded bg-orange-500" />
                <span className="text-slate-700">{lang === 'de' ? 'Autohöfe & HDEO Depots' : 'Autohöfe & Fleet Depots'}</span>
              </span>
              <input
                type="checkbox"
                checked={showAutohof}
                onChange={(e) => setShowAutohof(e.target.checked)}
                className="rounded accent-purple-600"
              />
            </label>

            <label className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-purple-200/80 cursor-pointer hover:bg-purple-50 transition-colors">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded bg-lime-500" />
                <span className="text-slate-700">{lang === 'de' ? 'BayWa & Raiffeisen Hubs' : 'Agri Cooperatives'}</span>
              </span>
              <input
                type="checkbox"
                checked={showAgriCooperatives}
                onChange={(e) => setShowAgriCooperatives(e.target.checked)}
                className="rounded accent-purple-600"
              />
            </label>

            <label className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-purple-200/80 cursor-pointer hover:bg-purple-50 transition-colors">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded bg-pink-500" />
                <span className="text-slate-700">{lang === 'de' ? 'Chemieparks (BASF/Chempark)' : 'Chemical Parks'}</span>
              </span>
              <input
                type="checkbox"
                checked={showChemicalParks}
                onChange={(e) => setShowChemicalParks(e.target.checked)}
                className="rounded accent-purple-600"
              />
            </label>

            <label className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-purple-200/80 cursor-pointer hover:bg-purple-50 transition-colors">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded bg-cyan-500" />
                <span className="text-slate-700">{lang === 'de' ? 'Windenergie Staging Bases' : 'Wind Energy Bases'}</span>
              </span>
              <input
                type="checkbox"
                checked={showWindHubs}
                onChange={(e) => setShowWindHubs(e.target.checked)}
                className="rounded accent-purple-600"
              />
            </label>

            {overpassPois.length > 0 && (
              <label className="flex items-center justify-between p-1.5 bg-purple-100/80 rounded-lg border border-purple-300 cursor-pointer hover:bg-purple-200 transition-colors">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
                  <span className="text-purple-900 font-bold">
                    {lang === 'de' ? `OSM Live POIs (${overpassPois.length})` : `OSM Harvested (${overpassPois.length})`}
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={showOsmPois}
                  onChange={(e) => setShowOsmPois(e.target.checked)}
                  className="rounded accent-purple-600"
                />
              </label>
            )}
          </div>
        </div>

        {/* Quick Jump to Bundesland */}
        <div className="pt-2 border-t border-purple-100">
          <label className="block text-[10px] font-mono font-bold text-purple-900 mb-1 uppercase">
            {lang === 'de' ? 'SCHNELLWAHL BUNDESLAND' : 'JUMP TO FEDERAL STATE'}
          </label>
          <select
            onChange={(e) => {
              const b = bundeslaender.find((st) => st.id === e.target.value);
              if (b && mapInstanceRef.current) {
                mapInstanceRef.current.flyTo([b.lat, b.lng], 8, { duration: 1.2 });
                setSelectedObject({ type: 'STATE', data: b });
                if (onSelectState) onSelectState(b.id);
              }
            }}
            className="w-full py-1.5 px-2 bg-purple-50/70 border border-purple-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-purple-600 focus:bg-white"
          >
            <option value="">{lang === 'de' ? '-- Bundesland wählen --' : '-- Select State --'}</option>
            {bundeslaender.map((b) => (
              <option key={b.id} value={b.id}>
                {b.code} - {b.nameDe}
              </option>
            ))}
          </select>
        </div>

        {/* Action button */}
        <button
          onClick={handleResetView}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-mono font-bold uppercase rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm shadow-purple-500/20"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>{lang === 'de' ? 'DEUTSCHLAND ZENTRIEREN' : 'CENTER ALL GERMANY'}</span>
        </button>
      </div>

      {/* Main Map Canvas */}
      <div className="flex-1 h-full relative">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Legend / Summary Top Left */}
        <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md border border-purple-200 p-3.5 rounded-xl shadow-xl text-xs max-w-xs hidden sm:block">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold font-mono text-purple-950 flex items-center space-x-1.5 uppercase text-[11px]">
              <Target className="w-3.5 h-3.5 text-purple-600" />
              <span>{lang === 'de' ? 'GIS TELEMETRIE' : 'GIS TELEMETRY'}</span>
            </span>
            <span className="status-badge bg-purple-100 text-purple-800 border border-purple-200 text-[9px] font-bold">
              6 AUTOBAHNEN • 3 FLÜSSE
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="bg-purple-50/70 p-2 rounded-lg border border-purple-100">
              <div className="text-purple-600 uppercase text-[9px] font-semibold">{lang === 'de' ? 'LKW-Korridore' : 'Truck Corridors'}</div>
              <div className="text-purple-950 font-bold text-xs mt-0.5">{AUTOBAHN_CORRIDORS.length} Routen</div>
            </div>
            <div className="bg-purple-50/70 p-2 rounded-lg border border-purple-100">
              <div className="text-purple-600 uppercase text-[9px] font-semibold">{lang === 'de' ? 'Pegel & Häfen' : 'Gauges & Ports'}</div>
              <div className="text-purple-950 font-bold text-xs mt-0.5">{PORT_TERMINALS_DATA.length + 5} Hubs</div>
            </div>
          </div>
        </div>

        {/* Inspection Drawer / Popup (Bottom or Right) */}
        {selectedObject && (
          <div className="absolute bottom-4 right-4 z-[400] w-96 max-w-[calc(100vw-2rem)] max-h-[80vh] bg-white/95 backdrop-blur-md border border-purple-200 rounded-2xl shadow-2xl p-5 overflow-y-auto scrollbar-thin text-xs text-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-2.5 mb-3 border-b border-purple-100">
              <div>
                <span className="status-badge bg-purple-100 text-purple-900 border border-purple-300 text-[9px]">
                  {selectedObject.type === 'AUTOBAHN'
                    ? lang === 'de' ? 'AUTOBAHN SCHWERLAST-KORRIDOR' : 'AUTOBAHN FREIGHT CORRIDOR'
                    : selectedObject.type === 'WATERWAY'
                    ? lang === 'de' ? 'BINNENWASSERSTRASSE' : 'INLAND WATERWAY CORRIDOR'
                    : selectedObject.type === 'PORT'
                    ? lang === 'de' ? 'SEEHAFEN / CONTAINERTERMINAL' : 'SEAPORT TERMINAL'
                    : selectedObject.type === 'GAUGE'
                    ? lang === 'de' ? 'PEGEL-MESSSTELLE' : 'GAUGE STATION'
                    : selectedObject.type === 'DISRUPTION'
                    ? lang === 'de' ? 'LIEFERKETTEN-ENGPASS' : 'SUPPLY CHAIN DISRUPTION'
                    : selectedObject.type === 'WHITE_SPOT'
                    ? lang === 'de' ? 'STRATEGISCHER WHITE-SPOT' : 'STRATEGIC WHITE-SPOT'
                    : selectedObject.type === 'GROUND_SITE'
                    ? lang === 'de' ? 'STANDORT-REGISTER' : 'GROUND REGISTRY SITE'
                    : selectedObject.type === 'STATE'
                    ? lang === 'de' ? 'BUNDESLAND BILANZ' : 'FEDERAL STATE BALANCE'
                    : 'OSM HARVESTED POI'}
                </span>
                <h3 className="font-extrabold text-sm text-purple-950 mt-1 leading-snug uppercase">
                  {selectedObject.data.name || selectedObject.data.nameDe || selectedObject.data.titleDe || selectedObject.data.titleEn}
                </h3>
              </div>
              <button
                onClick={() => setSelectedObject(null)}
                className="p-1.5 rounded-lg bg-purple-50 text-purple-500 hover:text-purple-900 hover:bg-purple-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content for Autobahn Corridor */}
            {selectedObject.type === 'AUTOBAHN' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="p-2.5 bg-purple-50/70 rounded-xl border-l-4 border-purple-600 border-t border-r border-b border-purple-200">
                    <div className="text-purple-700 text-[9px] uppercase font-bold">LKW-VERKEHR / TAG</div>
                    <div className="text-purple-950 font-bold text-xs mt-0.5">{formatNumber(selectedObject.data.totalTrucksDaily)} LKW</div>
                  </div>
                  <div className="p-2.5 bg-purple-50/70 rounded-xl border-l-4 border-cyan-600 border-t border-r border-b border-purple-200">
                    <div className="text-purple-700 text-[9px] uppercase font-bold">HDEO BEDARF / JAHR</div>
                    <div className="text-cyan-900 font-bold text-xs mt-0.5">{formatNumber(selectedObject.data.totalHdeoConsumptionTonnesYear)} t/a</div>
                  </div>
                </div>

                <div className="space-y-1 text-[10px] font-mono bg-purple-50/40 p-2.5 rounded-xl border border-purple-100">
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">Streckenlänge:</span>
                    <span className="text-slate-900 font-bold">{selectedObject.data.totalLengthKm} km</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">Verbundene Länder:</span>
                    <span className="text-purple-900 font-bold">{selectedObject.data.connectedStates.join(', ')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">Stau-Index / Risiko:</span>
                    <span className="text-rose-600 font-bold">{selectedObject.data.overallCongestionIndex}/100 ({selectedObject.data.disruptionRiskRating})</span>
                  </div>
                </div>

                <div className="p-2.5 bg-purple-50/60 rounded-xl border border-purple-200 text-xs">
                  <span className="text-[10px] font-mono text-purple-900 uppercase font-bold block mb-1">
                    Kritische Engpässe (Choke Points):
                  </span>
                  <ul className="list-disc list-inside text-slate-700 space-y-0.5 text-[11px] font-mono">
                    {selectedObject.data.keyChokePoints.map((cp: string, i: number) => (
                      <li key={i}>{cp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Content for Waterway Corridor */}
            {selectedObject.type === 'WATERWAY' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="p-2.5 bg-purple-50/70 rounded-xl border-l-4 border-cyan-600 border-t border-r border-b border-purple-200">
                    <div className="text-purple-700 text-[9px] uppercase font-bold">FRACHTVOLUMEN</div>
                    <div className="text-cyan-900 font-bold text-xs mt-0.5">{selectedObject.data.annualCargoMillionTonnes}M t/Jahr</div>
                  </div>
                  <div className="p-2.5 bg-purple-50/70 rounded-xl border-l-4 border-purple-600 border-t border-r border-b border-purple-200">
                    <div className="text-purple-700 text-[9px] uppercase font-bold">GRUNDÖL-ANTEIL</div>
                    <div className="text-purple-950 font-bold text-xs mt-0.5">{selectedObject.data.bulkBaseOilSharePercent}%</div>
                  </div>
                </div>

                <div className="space-y-1 text-[10px] font-mono bg-purple-50/40 p-2.5 rounded-xl border border-purple-100">
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">Marine Schmierstoffe:</span>
                    <span className="text-slate-900 font-bold">{formatNumber(selectedObject.data.marineLubeBunkeringTonnesYear)} t/a</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">Status:</span>
                    <span className="text-rose-600 font-bold">{selectedObject.data.status}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">Modal-Shift (Straße/Schiene):</span>
                    <span className="text-purple-700 font-bold">+{formatNumber(selectedObject.data.modalShiftToRoadRailTonnesMonth)} t/Monat</span>
                  </div>
                </div>
              </div>
            )}

            {/* Content for Port */}
            {selectedObject.type === 'PORT' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="p-2.5 bg-purple-50/70 rounded-xl border-l-4 border-emerald-600 border-t border-r border-b border-purple-200">
                    <div className="text-purple-700 text-[9px] uppercase font-bold">CONTAINER DURCHSATZ</div>
                    <div className="text-emerald-900 font-bold text-xs mt-0.5">{selectedObject.data.annualTeuMillion}M TEU</div>
                  </div>
                  <div className="p-2.5 bg-purple-50/70 rounded-xl border-l-4 border-cyan-600 border-t border-r border-b border-purple-200">
                    <div className="text-purple-700 text-[9px] uppercase font-bold">SCHIFFSANLÄUFE</div>
                    <div className="text-cyan-900 font-bold text-xs mt-0.5">{formatNumber(selectedObject.data.commercialVesselCallsYear)} / a</div>
                  </div>
                </div>

                <div className="space-y-1 text-[10px] font-mono bg-purple-50/40 p-2.5 rounded-xl border border-purple-100">
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">Marine Cylinder Oil (2-Stroke):</span>
                    <span className="text-purple-950 font-bold">{formatNumber(selectedObject.data.marineCylinderOilDemandTonnesYear)} t/a</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">System & Trunk Piston (4-Stroke):</span>
                    <span className="text-cyan-900 font-bold">{formatNumber(selectedObject.data.marineSystemOilDemandTonnesYear)} t/a</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">Bunker-Lieferanten:</span>
                    <span className="text-slate-800">{selectedObject.data.bunkerSuppliers.join(', ')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Content for Gauge */}
            {selectedObject.type === 'GAUGE' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="p-2.5 bg-purple-50/70 rounded-xl border-l-4 border-rose-500 border-t border-r border-b border-purple-200">
                    <div className="text-purple-700 text-[9px] uppercase font-bold">AKTUELLER PEGEL</div>
                    <div className="text-rose-600 font-bold text-base mt-0.5">{selectedObject.data.currentLevelCm} cm</div>
                  </div>
                  <div className="p-2.5 bg-purple-50/70 rounded-xl border-l-4 border-cyan-500 border-t border-r border-b border-purple-200">
                    <div className="text-purple-700 text-[9px] uppercase font-bold">ABLADETIEFE / KAPAZITÄT</div>
                    <div className="text-cyan-700 font-bold text-base mt-0.5">{selectedObject.data.bargeMaxLoadPercent}%</div>
                  </div>
                </div>

                <div className="space-y-1 text-[10px] font-mono bg-purple-50/40 p-2.5 rounded-xl border border-purple-100">
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">Mittelwasser (MW):</span>
                    <span className="text-slate-900 font-bold">{selectedObject.data.meanLevelCm} cm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">Kritischer Schwellenwert:</span>
                    <span className="text-rose-600 font-bold">{selectedObject.data.criticalLowThresholdCm} cm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">Kleinwasserzuschlag (KWZ):</span>
                    <span className={selectedObject.data.lowWaterSurchargeActive ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                      {selectedObject.data.lowWaterSurchargeActive ? `+${formatCurrency(selectedObject.data.lowWaterSurchargeEurPerTonne)}/t` : 'Kein Zuschlag'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Content for Disruption */}
            {selectedObject.type === 'DISRUPTION' && (
              <div className="space-y-3">
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs">
                  <div className="font-bold text-rose-700 mb-1 flex items-center gap-1.5 uppercase text-[10px] font-mono">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>{selectedObject.data.severity} SEVERITY LEVEL</span>
                  </div>
                  <p className="text-[11px] text-slate-700">
                    {lang === 'de' ? selectedObject.data.impactDescriptionDe : selectedObject.data.impactDescriptionEn}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                  <div className="p-2 bg-purple-50/70 rounded-lg border border-purple-100">
                    <span className="text-slate-500 uppercase text-[9px] block">Verzögerung</span>
                    <span className="text-rose-600 font-bold text-xs">+{selectedObject.data.estimatedDelayDays} Tage</span>
                  </div>
                  <div className="p-2 bg-purple-50/70 rounded-lg border border-purple-100">
                    <span className="text-slate-500 uppercase text-[9px] block">Frachtaufschlag</span>
                    <span className="text-purple-900 font-bold text-xs">+{selectedObject.data.freightCostSurchargePercent}%</span>
                  </div>
                </div>

                <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-[11px] text-slate-800">
                  <span className="text-[10px] font-mono text-purple-900 uppercase font-bold block mb-0.5">
                    Mitigation / Ausweichroute:
                  </span>
                  {lang === 'de' ? selectedObject.data.mitigationRecommendationDe : selectedObject.data.mitigationRecommendationEn}
                </div>
              </div>
            )}

            {/* Content for White Spot */}
            {selectedObject.type === 'WHITE_SPOT' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="p-2.5 bg-purple-50/70 rounded-xl border-l-4 border-rose-500 border-t border-r border-b border-purple-200">
                    <div className="text-purple-700 text-[9px] uppercase font-bold">
                      {lang === 'de' ? 'UNERFÜLLTER BEDARF' : 'UNMET DEMAND'}
                    </div>
                    <div className="text-rose-600 font-bold text-xs mt-0.5">
                      {formatNumber(convertTonnes(selectedObject.data.unmetDemandTonnes, unit))} {formatUnitLabel(unit, lang)}
                    </div>
                  </div>
                  <div className="p-2.5 bg-purple-50/70 rounded-xl border-l-4 border-emerald-500 border-t border-r border-b border-purple-200">
                    <div className="text-purple-700 text-[9px] uppercase font-bold">
                      {lang === 'de' ? 'MARKTWERT' : 'MARKET VALUE'}
                    </div>
                    <div className="text-emerald-700 font-bold text-xs mt-0.5">
                      {formatCurrency(selectedObject.data.estimatedMarketValueEur)}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-[9px] font-mono uppercase mb-1">
                    {lang === 'de' ? 'EMPFOHLENER VERTRIEBSKANAL' : 'RECOMMENDED CHANNEL PARTNER'}
                  </div>
                  <div className="p-2 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 font-mono text-xs flex items-center space-x-2">
                    <Truck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span className="font-bold">{selectedObject.data.recommendedChannelType}</span>
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-[9px] font-mono uppercase mb-1">
                    {lang === 'de' ? 'GEFORDERTE SPEZIFIKATIONEN' : 'REQUIRED FLUID SPECS'}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedObject.data.requiredSpecs.map((spec: string, i: number) => (
                      <span key={i} className="status-badge bg-purple-100 border border-purple-200 text-purple-800 text-[9px] font-mono">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-slate-800 text-[11px] leading-relaxed">
                  <div className="font-bold text-purple-900 mb-0.5 flex items-center space-x-1 uppercase text-[10px] font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>{lang === 'de' ? 'Strategische Handlungsempfehlung' : 'Strategic Entry Playbook'}</span>
                  </div>
                  {lang === 'de'
                    ? selectedObject.data.strategicRecommendationDe
                    : selectedObject.data.strategicRecommendationEn}
                </div>
              </div>
            )}

            {/* Content for Ground Site */}
            {selectedObject.type === 'GROUND_SITE' && (
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="p-2.5 bg-purple-50/70 rounded-xl border-l-4 border-cyan-500 border-t border-r border-b border-purple-200">
                    <div className="text-purple-700 text-[9px] uppercase font-bold">{lang === 'de' ? 'DURCHSATZ / JAHR' : 'THROUGHPUT / YR'}</div>
                    <div className="text-cyan-900 font-bold text-xs mt-0.5">
                      {formatNumber(convertTonnes(selectedObject.data.throughputTonnesPerYear, unit))} {formatUnitLabel(unit, lang)}
                    </div>
                  </div>
                  <div className="p-2.5 bg-purple-50/70 rounded-xl border-l-4 border-purple-500 border-t border-r border-b border-purple-200">
                    <div className="text-purple-700 text-[9px] uppercase font-bold">{lang === 'de' ? 'TANKLAGER KAPAZITÄT' : 'TANK STORAGE'}</div>
                    <div className="text-purple-950 font-bold text-xs mt-0.5">
                      {formatNumber(convertTonnes(selectedObject.data.tankStorageCapTonnes, unit))} {formatUnitLabel(unit, lang)}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-[10px] font-mono bg-purple-50/40 p-2 rounded-xl border border-purple-100">
                  <div className="flex justify-between py-0.5 border-b border-purple-100">
                    <span className="text-slate-500">{lang === 'de' ? 'Marken-Affiliation' : 'Brand Affiliation'}:</span>
                    <span className="font-semibold text-purple-950">{selectedObject.data.brandAffiliation}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-purple-100">
                    <span className="text-slate-500">{lang === 'de' ? 'Standort & PLZ' : 'City & PLZ'}:</span>
                    <span className="text-slate-800">{selectedObject.data.plz} {selectedObject.data.city}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-purple-100">
                    <span className="text-slate-500">{lang === 'de' ? 'Lieferradius' : 'Delivery Radius'}:</span>
                    <span className="text-slate-800">{selectedObject.data.deliveryRadiusKm} km</span>
                  </div>
                </div>
              </div>
            )}

            {/* Content for State */}
            {selectedObject.type === 'STATE' && (
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="p-2.5 bg-purple-50/70 rounded-xl border-l-4 border-purple-600 border-t border-r border-b border-purple-200">
                    <div className="text-purple-700 text-[9px] uppercase font-bold">{lang === 'de' ? 'GESAMTBEDARF' : 'TOTAL DEMAND'}</div>
                    <div className="text-purple-950 font-bold text-xs mt-0.5">
                      {formatNumber(
                        convertTonnes(
                          Object.values(selectedObject.data.demandTonnes as Record<string, number>).reduce((a, c) => a + c, 0),
                          unit
                        )
                      )}{' '}
                      {formatUnitLabel(unit, lang)}
                    </div>
                  </div>
                  <div className="p-2.5 bg-purple-50/70 rounded-xl border-l-4 border-cyan-600 border-t border-r border-b border-purple-200">
                    <div className="text-purple-700 text-[9px] uppercase font-bold">{lang === 'de' ? 'PRODUKTION' : 'CAPACITY'}</div>
                    <div className="text-cyan-900 font-bold text-xs mt-0.5">
                      {formatNumber(convertTonnes(selectedObject.data.localProductionCapacityTonnes, unit))}{' '}
                      {formatUnitLabel(unit, lang)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content for OSM POI */}
            {selectedObject.type === 'OSM_POI' && (
              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-purple-700 text-[10px] font-mono font-bold">OSM TAG / TYP</div>
                  <div className="text-purple-950 font-semibold mt-0.5">
                    {selectedObject.data.amenity || selectedObject.data.shop || selectedObject.data.industrial || selectedObject.data.type}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};
