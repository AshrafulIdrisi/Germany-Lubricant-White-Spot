import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BundeslandData, WhiteSpotCluster, GroundRegistrySite, OverpassPoi, MetricUnit, Language } from '../types';
import { AUTOBAHN_CORRIDORS, WATERWAY_CORRIDORS, PORT_TERMINALS_DATA, LOGISTICS_DISRUPTIONS } from '../data/logisticsAndFreight';
import { COMPETITOR_PRODUCT_PRICES, REGIONAL_PRICE_SPREADS, PRICE_GAP_OPPORTUNITIES, COMPETITOR_DISTRIBUTOR_PLATFORMS } from '../data/competitorPricingData';

export function convertTonnes(tonnes: number, unit: MetricUnit): number {
  if (unit === 'kilolitres') {
    return Math.round(tonnes * 1.136); // Approx avg lube density ~0.88 kg/L => 1.136 KL/t
  }
  if (unit === 'barrels') {
    return Math.round(tonnes * 7.14); // Approx ~7.14 bbl / tonne
  }
  return tonnes;
}

export function formatUnitLabel(unit: MetricUnit, lang: Language): string {
  if (unit === 'kilolitres') return lang === 'de' ? 'kL (KiloLiter)' : 'kL (KiloLitres)';
  if (unit === 'barrels') return lang === 'de' ? 'bbl (Fässer)' : 'bbl (Barrels)';
  return lang === 'de' ? 't (Tonnen/Jahr)' : 't (Tonnes/yr)';
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('de-DE').format(num);
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(num);
}

export function exportFullExcelWorkbook(
  bundeslaender: BundeslandData[],
  whiteSpots: WhiteSpotCluster[],
  groundRegistry: GroundRegistrySite[],
  overpassPois: OverpassPoi[],
  unit: MetricUnit = 'tonnes'
) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: 16 Bundesländer State Balance
  const stateData = bundeslaender.map(b => {
    const totalDemand = Object.values(b.demandTonnes).reduce((a, c) => a + c, 0);
    const netBalance = b.localProductionCapacityTonnes - totalDemand;
    return {
      'Bundesland Code': b.code,
      'Name (DE)': b.nameDe,
      'Capital': b.capital,
      'Population': b.population,
      'GDP (€ Billion)': b.gdpBillionEur,
      [`PCMO Demand (${unit})`]: convertTonnes(b.demandTonnes.automotive_pcmo, unit),
      [`HDEO Transport Demand (${unit})`]: convertTonnes(b.demandTonnes.transport_hdeo, unit),
      [`Industrial Metalworking (${unit})`]: convertTonnes(b.demandTonnes.industrial_metalworking, unit),
      [`Wind Renewable (${unit})`]: convertTonnes(b.demandTonnes.wind_renewable, unit),
      [`Chemical Process (${unit})`]: convertTonnes(b.demandTonnes.chemical_process, unit),
      [`Marine Inland/Sea (${unit})`]: convertTonnes(b.demandTonnes.marine_inland, unit),
      [`Agri & Forestry Bio (${unit})`]: convertTonnes(b.demandTonnes.agri_forestry, unit),
      [`Total State Demand (${unit})`]: convertTonnes(totalDemand, unit),
      [`Local Production (${unit})`]: convertTonnes(b.localProductionCapacityTonnes, unit),
      [`Net Deficit/Surplus (${unit})`]: convertTonnes(netBalance, unit),
      'Deficit Risk Index (0-100)': b.deficitRiskScore,
      'Active Blending/Refining Plants': b.activeRefineriesBlendingPlants.join('; '),
      'Key Logistics Corridors': b.keyLogisticsCorridors.join('; '),
    };
  });
  const ws1 = XLSX.utils.json_to_sheet(stateData);
  XLSX.utils.book_append_sheet(wb, ws1, '16 Bundesländer Balance');

  // Sheet 2: Master White-Spot Opportunity Corridors
  const wsData = whiteSpots.map(w => ({
    'ID': w.id,
    'Opportunity Cluster Name': w.name,
    'Bundesland': w.bundeslandName,
    'Priority': w.priority,
    'Opportunity Score (0-100)': w.opportunityScore,
    [`Unmet Demand (${unit})`]: convertTonnes(w.unmetDemandTonnes, unit),
    'Est. Market Value (€)': w.estimatedMarketValueEur,
    'Primary Sector': w.primarySector,
    'Recommended Channel Partner Type': w.recommendedChannelType,
    'Key Industrial Anchors': w.keyIndustrialAnchors.join('; '),
    'Required Specs': w.requiredSpecs.join('; '),
    'Incumbent Competitors': w.incumbentCompetitors.join('; '),
    'Strategic Playbook (DE)': w.strategicRecommendationDe,
    'Postal Codes (PLZ)': w.plzCoverage.join(', '),
  }));
  const ws2 = XLSX.utils.json_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws2, '30+ White-Spot Clusters');

  // Sheet 3: Autobahn Freight Corridors (A1-A9)
  const autobahnData = AUTOBAHN_CORRIDORS.map(a => ({
    'Corridor Code': a.code,
    'Corridor Name': a.name,
    'Length (km)': a.totalLengthKm,
    'Trucks / Day': a.totalTrucksDaily,
    [`HDEO Lube Demand (${unit}/yr)`]: convertTonnes(a.totalHdeoConsumptionTonnesYear, unit),
    'Congestion Index (0-100)': a.overallCongestionIndex,
    'Disruption Risk': a.disruptionRiskRating,
    'Connected States': a.connectedStates.join(', '),
    'Key Choke Points': a.keyChokePoints.join('; '),
  }));
  const ws3 = XLSX.utils.json_to_sheet(autobahnData);
  XLSX.utils.book_append_sheet(wb, ws3, 'Autobahn Freight Telemetry');

  // Sheet 4: Inland Waterways & Gauges
  const waterwayData = WATERWAY_CORRIDORS.flatMap(w => 
    w.gaugeStations.map(g => ({
      'Waterway': w.name,
      'Gauge Station': g.name,
      'State Code': g.bundeslandCode,
      'Current Level (cm)': g.currentLevelCm,
      'Mean Level (cm)': g.meanLevelCm,
      'Critical Threshold (cm)': g.criticalLowThresholdCm,
      'Barge Loading Capacity (%)': g.bargeMaxLoadPercent,
      'Low Water Surcharge Active': g.lowWaterSurchargeActive ? 'YES' : 'NO',
      'KWZ Surcharge (€/t)': g.lowWaterSurchargeEurPerTonne,
      [`Annual Corridor Cargo (M t)`]: w.annualCargoMillionTonnes,
      [`Base Oil Freight Share (%)`]: w.bulkBaseOilSharePercent,
      [`Marine Bunkering (${unit}/yr)`]: convertTonnes(w.marineLubeBunkeringTonnesYear, unit),
      [`Modal Shift to Road (${unit}/mo)`]: convertTonnes(w.modalShiftToRoadRailTonnesMonth, unit),
    }))
  );
  const ws4 = XLSX.utils.json_to_sheet(waterwayData);
  XLSX.utils.book_append_sheet(wb, ws4, 'Waterways & Pegel Gauges');

  // Sheet 5: Seaport & Trimodal Throughput
  const portData = PORT_TERMINALS_DATA.map(p => ({
    'Port Name': p.name,
    'Type': p.type,
    'City': p.city,
    'Annual TEU (Million)': p.annualTeuMillion,
    'Annual Cargo (Million Tonnes)': p.annualCargoMillionTonnes,
    'Commercial Vessel Calls / yr': p.commercialVesselCallsYear,
    [`Marine Cylinder Oil (${unit}/yr)`]: convertTonnes(p.marineCylinderOilDemandTonnesYear, unit),
    [`Marine System Oil (${unit}/yr)`]: convertTonnes(p.marineSystemOilDemandTonnesYear, unit),
    'Bunker Suppliers': p.bunkerSuppliers.join('; '),
    'Connected Waterways': p.connectedWaterways.join('; '),
  }));
  const ws5 = XLSX.utils.json_to_sheet(portData);
  XLSX.utils.book_append_sheet(wb, ws5, 'Port Terminals Throughput');

  // Sheet 6: Competitor Price Scraper Grid
  const priceData = COMPETITOR_PRODUCT_PRICES.map(p => ({
    'Product Name': p.productName,
    'Brand': p.brand,
    'Category': p.category,
    'Viscosity': p.viscosityGrade,
    'Distributor': p.distributorName,
    'Price Leader': p.isPriceLeader ? 'YES' : 'NO',
    '1L Price (€/L)': p.pricingByPack['1L']?.pricePerLitreEur || 0,
    '5L Price (€/L)': p.pricingByPack['5L']?.pricePerLitreEur || 0,
    '20L Price (€/L)': p.pricingByPack['20L']?.pricePerLitreEur || 0,
    '208L Drum Price (€/L)': p.pricingByPack['208L']?.pricePerLitreEur || 0,
    '1000L IBC Price (€/L)': p.pricingByPack['1000L']?.pricePerLitreEur || 0,
    'OEM Approvals': p.oemApprovals.join('; '),
    'Source URL': p.url,
  }));
  const ws6 = XLSX.utils.json_to_sheet(priceData);
  XLSX.utils.book_append_sheet(wb, ws6, 'Competitor Price Matrix');

  // Sheet 7: 16 Länder Regional Price Indices & Arbitrage
  const regionalPriceData = REGIONAL_PRICE_SPREADS.map(r => ({
    'State Code': r.bundeslandCode,
    'Bundesland': r.bundeslandName,
    'Price Index (DE=1.0)': r.priceIndex,
    'Variance from National Avg (%)': r.priceVarianceFromNationalAvgPercent,
    'Avg Price (€/L)': r.avgPricePerLitreEur,
    'Avg 208L HDEO Drum (€)': r.hdeoAvgDrumPriceEur,
    'Avg 1000L HLP 46 IBC (€)': r.hydraulicHlp46IbcPriceEur,
    'Avg ADR Freight Fee (€)': r.adrSurchargeAvgEur,
    'Dominant Platforms': r.dominantDistributors.join('; '),
  }));
  const ws7 = XLSX.utils.json_to_sheet(regionalPriceData);
  XLSX.utils.book_append_sheet(wb, ws7, '16 Länder Price Index');

  // Sheet 8: Ground Registry Depots & Blending Plants
  const registryData = groundRegistry.map(g => ({
    'ID': g.id,
    'Facility Name': g.name,
    'Type': g.type,
    'Brand Affiliation': g.brandAffiliation,
    'City': g.city,
    'Postal Code (PLZ)': g.plz,
    'Bundesland ID': g.bundeslandId,
    'Latitude': g.lat,
    'Longitude': g.lng,
    [`Throughput (${unit}/yr)`]: convertTonnes(g.throughputTonnesPerYear, unit),
    [`Tank Storage (${unit})`]: convertTonnes(g.tankStorageCapTonnes, unit),
    'Delivery Radius (km)': g.deliveryRadiusKm,
    'Has Rail Siding': g.hasRailSiding ? 'YES' : 'NO',
    'Has Waterway Access': g.hasWaterwayAccess ? 'YES' : 'NO',
    'Blauer Engel Bio Cert': g.hasBioLubricantCert ? 'YES' : 'NO',
    'Status': g.status,
    'Contact': g.contactPerson || '',
    'Phone': g.phone || '',
  }));
  const ws8 = XLSX.utils.json_to_sheet(registryData);
  XLSX.utils.book_append_sheet(wb, ws8, 'Ground Registry Sites');

  // Sheet 9: Harvested OSM Overpass POIs (if any)
  if (overpassPois && overpassPois.length > 0) {
    const poiData = overpassPois.map(p => ({
      'OSM ID': p.id,
      'Name': p.name || 'Unnamed',
      'Category': p.type,
      'Amenity / Tag': p.amenity || p.shop || p.industrial || p.craft || '',
      'Brand / Operator': p.brand || p.operator || '',
      'City': p.city || '',
      'PLZ': p.postcode || '',
      'Street': p.street ? `${p.street} ${p.housenumber || ''}` : '',
      'Latitude': p.lat,
      'Longitude': p.lon,
      'Diesel': p.fuel_diesel || '',
      'HVO100': p.fuel_hvo || '',
    }));
    const ws9 = XLSX.utils.json_to_sheet(poiData);
    XLSX.utils.book_append_sheet(wb, ws9, 'OSM Harvested Outlets');
  }

  const fileName = `German_Lubricant_Intelligence_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export function exportGeoJson(whiteSpots: WhiteSpotCluster[], groundRegistry: GroundRegistrySite[]) {
  const features = [
    ...whiteSpots.map(w => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [w.lng, w.lat],
      },
      properties: {
        category: 'WHITE_SPOT_CLUSTER',
        id: w.id,
        name: w.name,
        bundesland: w.bundeslandName,
        opportunityScore: w.opportunityScore,
        unmetDemandTonnes: w.unmetDemandTonnes,
        estimatedMarketValueEur: w.estimatedMarketValueEur,
        primarySector: w.primarySector,
        recommendedChannel: w.recommendedChannelType,
      },
    })),
    ...groundRegistry.map(g => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [g.lng, g.lat],
      },
      properties: {
        category: 'GROUND_REGISTRY_SITE',
        id: g.id,
        name: g.name,
        type: g.type,
        brand: g.brandAffiliation,
        city: g.city,
        plz: g.plz,
        throughputTonnes: g.throughputTonnesPerYear,
        tankStorageTonnes: g.tankStorageCapTonnes,
        hasBioCert: g.hasBioLubricantCert,
      },
    })),
  ];

  const geoJson = {
    type: 'FeatureCollection',
    metadata: {
      title: 'German Lubricant Market Intelligence GIS Layer',
      generated: new Date().toISOString(),
      coverage: 'Federal Republic of Germany (16 Bundesländer)',
    },
    features,
  };

  const blob = new Blob([JSON.stringify(geoJson, null, 2)], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `German_Lube_GIS_Layer_${new Date().toISOString().split('T')[0]}.geojson`;
  a.click();
  URL.revokeObjectURL(url);
}

export function generatePdfReport(
  bundeslaender: BundeslandData[],
  whiteSpots: WhiteSpotCluster[],
  lang: Language = 'de'
) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(248, 250, 252);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const title = lang === 'de' 
    ? 'SCHMIERSTOFF-INTELLIGENZ DEUTSCHLAND | STRATEGISCHER MARKTBERICHT' 
    : 'GERMAN LUBRICANT MARKET INTELLIGENCE | EXECUTIVE STRATEGIC REPORT';
  doc.text(title, 14, 15);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`Stand: ${new Date().toLocaleDateString('de-DE')} | 16 Bundesländer & 30+ Opportunity Clusters`, 220, 15);

  // Executive Summary text
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(lang === 'de' ? '1. Bundesländer Versorgungsbilanz & Defizitanalyse' : '1. Federal States Supply-Demand Balance', 14, 34);

  // Table 1: State Balances
  const stateTableData = bundeslaender.map(b => {
    const totalDemand = Object.values(b.demandTonnes).reduce((a, c) => a + c, 0);
    const balance = b.localProductionCapacityTonnes - totalDemand;
    return [
      b.code,
      b.nameDe,
      formatNumber(totalDemand) + ' t',
      formatNumber(b.localProductionCapacityTonnes) + ' t',
      (balance >= 0 ? '+' : '') + formatNumber(balance) + ' t',
      b.deficitRiskScore + '/100',
      b.activeRefineriesBlendingPlants.slice(0, 1).join(', ')
    ];
  });

  autoTable(doc, {
    startY: 38,
    head: [[
      'Code', 
      lang === 'de' ? 'Bundesland' : 'State', 
      lang === 'de' ? 'Bedarf (t/J)' : 'Demand (t/y)', 
      lang === 'de' ? 'Produktion (t/J)' : 'Capacity (t/y)', 
      'Netto Bilanz', 
      lang === 'de' ? 'Defizit-Risiko' : 'Deficit Risk',
      lang === 'de' ? 'Haupt-Raffinerie / Blending' : 'Key Production Plant'
    ]],
    body: stateTableData,
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], fontSize: 8 },
    bodyStyles: { fontSize: 7, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    margin: { left: 14, right: 14 },
  });

  // Second page for White-Spots
  doc.addPage();
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 297, 20, 'F');
  doc.setTextColor(248, 250, 252);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(lang === 'de' ? '2. Top Strategische White-Spot Korridore in Deutschland' : '2. Top Strategic White-Spot Industrial Corridors', 14, 13);

  const whiteSpotRows = whiteSpots.slice(0, 15).map(w => [
    w.name.substring(0, 40) + '...',
    w.bundeslandName,
    w.priority,
    w.opportunityScore + '/100',
    formatNumber(w.unmetDemandTonnes) + ' t',
    formatCurrency(w.estimatedMarketValueEur),
    w.recommendedChannelType.substring(0, 25)
  ]);

  autoTable(doc, {
    startY: 28,
    head: [[
      'Cluster Korridor', 
      'Bundesland', 
      'Priorität', 
      'Score', 
      'Unerfüllter Bedarf (t/J)', 
      'Marktpotenzial (€)', 
      'Empfohlener Vertriebskanal'
    ]],
    body: whiteSpotRows,
    theme: 'grid',
    headStyles: { fillColor: [217, 119, 6], fontSize: 8 }, // amber-600
    bodyStyles: { fontSize: 7, textColor: [30, 41, 59] },
    margin: { left: 14, right: 14 },
  });

  doc.save(`German_Lube_Market_Intelligence_${lang.toUpperCase()}_${new Date().toISOString().split('T')[0]}.pdf`);
}
