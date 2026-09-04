export type Language = 'de' | 'en';

export type MetricUnit = 'tonnes' | 'kilolitres' | 'barrels';

export type FluidSector = 
  | 'automotive_pcmo' 
  | 'transport_hdeo' 
  | 'industrial_metalworking' 
  | 'wind_renewable' 
  | 'chemical_process' 
  | 'marine_inland' 
  | 'agri_forestry';

export interface FluidSectorInfo {
  id: FluidSector;
  nameDe: string;
  nameEn: string;
  color: string;
  iconName: string;
  keySpecs: string[];
  typicalViscosity: string[];
  descriptionDe: string;
  descriptionEn: string;
}

export interface BundeslandData {
  id: string;
  code: string; // e.g. "BW", "BY", "NW"
  nameDe: string;
  nameEn: string;
  capital: string;
  lat: number;
  lng: number;
  areaKm2: number;
  population: number;
  gdpBillionEur: number;
  // Demand breakdown (metric tonnes per year)
  demandTonnes: {
    automotive_pcmo: number;
    transport_hdeo: number;
    industrial_metalworking: number;
    wind_renewable: number;
    chemical_process: number;
    marine_inland: number;
    agri_forestry: number;
  };
  // Local blending and supply capacity (metric tonnes per year)
  localProductionCapacityTonnes: number;
  localStorageCapacityTonnes: number;
  activeRefineriesBlendingPlants: string[];
  keyLogisticsCorridors: string[];
  primaryChannelPartners: string[];
  whiteSpotCount: number;
  deficitRiskScore: number; // 0-100 (high = urgent deficit)
}

export interface WhiteSpotCluster {
  id: string;
  name: string;
  bundeslandId: string;
  bundeslandName: string;
  lat: number;
  lng: number;
  radiusKm: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'EMERGING';
  opportunityScore: number; // 0-100
  unmetDemandTonnes: number;
  estimatedMarketValueEur: number;
  primarySector: FluidSector;
  secondarySectors: FluidSector[];
  requiredSpecs: string[];
  incumbentCompetitors: string[];
  underservedAudience: string;
  recommendedChannelType: 'Agrar-Genossenschaft (BayWa/RWZ)' | 'Mineralöl-Großhandel (Hoyer/AVIA)' | 'Technischer Fachgroßhandel' | 'Direktvertrieb OEM/Key-Account' | 'Marine Bunker Service';
  strategicRecommendationDe: string;
  strategicRecommendationEn: string;
  keyIndustrialAnchors: string[];
  plzCoverage: string[];
}

export interface GroundRegistrySite {
  id: string;
  name: string;
  type: 'BLENDING_PLANT' | 'REFINERY' | 'WHOLESALER_DEPOT' | 'AUTOHOF_FLEET' | 'AGRI_COOPERATIVE' | 'WIND_HUB' | 'CHEMICAL_PARK' | 'PORT_TERMINAL';
  brandAffiliation: string;
  bundeslandId: string;
  city: string;
  plz: string;
  lat: number;
  lng: number;
  throughputTonnesPerYear: number;
  tankStorageCapTonnes: number;
  deliveryRadiusKm: number;
  sectorsServed: FluidSector[];
  hasRailSiding: boolean;
  hasWaterwayAccess: boolean;
  hasBioLubricantCert: boolean; // Blauer Engel / Ecolabel
  contactPerson?: string;
  phone?: string;
  status: 'ACTIVE' | 'CONGESTED' | 'EXPANDING' | 'REORGANIZING';
}

export interface ChannelDistributor {
  id: string;
  name: string;
  headquarters: string;
  category: 'COOPERATIVE_AGRI' | 'INDEPENDENT_WHOLESALER' | 'MAJOR_NETWORK' | 'SPECIALIST_TECHNICAL';
  coverageStates: string[];
  activeDepotsCount: number;
  fleetTrucks: number;
  tankStorageTotalTonnes: number;
  annualThroughputTonnes: number;
  primaryBrandsCarried: string[];
  sectorFocus: FluidSector[];
  averageLeadTimeHours: number;
  minOrderQuantityLitre: number;
  conflictRiskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  esgBioComplianceScore: number; // 0-100
  financialStabilityRating: 'AAA' | 'AA' | 'A' | 'BBB';
  descriptionDe: string;
  descriptionEn: string;
}

export interface OverpassPoi {
  id: string | number;
  lat: number;
  lon: number;
  name?: string;
  type: string;
  amenity?: string;
  shop?: string;
  industrial?: string;
  craft?: string;
  brand?: string;
  operator?: string;
  street?: string;
  housenumber?: string;
  postcode?: string;
  city?: string;
  opening_hours?: string;
  fuel_diesel?: string;
  fuel_hvo?: string;
  phone?: string;
  website?: string;
}

export interface MarketSimulationState {
  windCapacityGrowthPercent: number;
  automotiveIceDeclinePercent: number;
  machineToolingSurgePercent: number;
  hdeoTransportGrowthPercent: number;
  bioLubeMandatePercent: number;
  selectedStateFilter: string;
  selectedSectorFilter: string;
  searchQuery: string;
}

// ==========================================
// LOGISTICS, FREIGHT & MARITIME TELEMETRY
// ==========================================

export interface AutobahnSegment {
  id: string;
  name: string;
  startCity: string;
  endCity: string;
  lengthKm: number;
  trucksPerDay: number;
  truckSharePercent: number;
  congestionIndex: number; // 0-100
  avgSpeedKmh: number;
  hdeoConsumptionLitrePerMonth: number;
  status: 'CLEAR' | 'MODERATE' | 'CONGESTED' | 'DISRUPTED';
  activeDisruptions: string[];
  delayMinutes: number;
}

export interface AutobahnCorridor {
  id: string;
  code: 'A1' | 'A2' | 'A3' | 'A7' | 'A8' | 'A9';
  name: string;
  descriptionDe: string;
  descriptionEn: string;
  totalLengthKm: number;
  totalTrucksDaily: number;
  totalHdeoConsumptionTonnesYear: number;
  overallCongestionIndex: number; // 0-100
  color: string;
  polyline: [number, number][]; // Lat, Lng coordinates for GIS map
  segments: AutobahnSegment[];
  keyChokePoints: string[];
  disruptionRiskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedTransitDelayHours: number;
  connectedStates: string[];
}

export interface WaterwayGaugeStation {
  id: string;
  name: string;
  river: 'Rhein' | 'Elbe' | 'Donau';
  locationKm: number;
  lat: number;
  lng: number;
  bundeslandCode?: string;
  currentLevelCm: number;
  meanLevelCm: number;
  criticalLowThresholdCm: number;
  criticalHighThresholdCm: number;
  bargeMaxLoadPercent: number;
  lowWaterSurchargeActive: boolean;
  lowWaterSurchargeEurPerTonne: number;
  trend: 'RISING' | 'FALLING' | 'STABLE';
  status: 'NORMAL' | 'LOW_WATER_ALERT' | 'HIGH_WATER_ALERT' | 'SEVERELY_RESTRICTED';
  supplyDisruptionRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lastUpdated: string;
}

export type GaugeStation = WaterwayGaugeStation;

export interface WaterwayCorridor {
  id: string;
  name: string;
  river: 'Rhein' | 'Elbe' | 'Donau';
  descriptionDe: string;
  descriptionEn: string;
  totalLengthKm: number;
  annualCargoMillionTonnes: number;
  bulkBaseOilSharePercent: number;
  marineLubeBunkeringTonnesYear: number;
  polyline: [number, number][]; // Lat, Lng coordinates for GIS map
  gaugeStations: WaterwayGaugeStation[];
  status: 'NAVIGABLE' | 'RESTRICTED_DRAFT' | 'SEVERELY_CONSTRAINED';
  modalShiftToRoadRailTonnesMonth: number;
}

export interface PortTerminalThroughput {
  id: string;
  name: string;
  city: string;
  type: 'MARITIME_SEAPORT' | 'INLAND_TRIMODAL_PORT';
  lat: number;
  lng: number;
  annualTeuMillion: number;
  annualCargoMillionTonnes: number;
  growthRatePercent: number;
  commercialVesselCallsYear: number;
  avgVesselTurnaroundHours: number;
  marineCylinderOilDemandTonnesYear: number;
  marineSystemOilDemandTonnesYear: number;
  bunkeringTerminalsCount: number;
  congestionIndex: number; // 0-100
  status: 'OPTIMAL' | 'MODERATE_DELAY' | 'CONGESTED';
  keyCommodities: string[];
  connectedWaterways: string[];
  bunkerSuppliers: string[];
}

export interface LogisticsDisruptionAlert {
  id: string;
  titleDe: string;
  titleEn: string;
  type: 'AUTOBAHN_BRIDGE_CLOSURE' | 'RIVER_LOW_WATER_DROUGHT' | 'PORT_CONTAINER_CONGESTION' | 'RAIL_SIDING_DEFICIT';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'WARNING';
  corridor: string;
  lat?: number;
  lng?: number;
  affectedRegions: string[];
  affectedLubeProducts: string[];
  impactDescriptionDe: string;
  impactDescriptionEn: string;
  mitigationRecommendationDe: string;
  mitigationRecommendationEn: string;
  estimatedDelayDays: number;
  freightCostSurchargePercent: number;
}

export interface RefinedDemandForecast {
  baselineHdeoTonnesYear: number;
  refinedHdeoTonnesYear: number;
  hdeoDeltaPercent: number;
  baselineMarineTonnesYear: number;
  refinedMarineTonnesYear: number;
  marineDeltaPercent: number;
  roadModalShiftImpactTonnes: number;
  riverDraughtConstraintImpactTonnes: number;
  portThroughputImpactTonnes: number;
  criticalChokePointCount: number;
}

// ==========================================
// COMPETITOR PRICING & MARKET SCRAPING
// ==========================================

export type LubricantCategory = 'automotive_pcmo' | 'transport_hdeo' | 'industrial_metalworking' | 'agri_forestry_bio';

export type PackagingType = '1L' | '5L' | '20L' | '208L' | '1000L';

export interface CompetitorDistributorPlatform {
  id: string;
  name: string;
  type: 'ONLINE_RETAILER' | 'B2B_DISTRIBUTOR' | 'MANUFACTURER_DIRECT' | 'AGRI_COOPERATIVE';
  websiteUrl: string;
  baseCountry: string;
  deliveryCoverage: 'NATIONWIDE' | 'REGIONAL_SOUTH' | 'REGIONAL_NORTH' | 'REGIONAL_EAST';
  adrDangerousGoodsSurchargeEur: number;
  minOrderFreeShippingEur: number;
  avgDeliveryTimeDays: number;
  catalogSizeSkus: number;
  pricePositioning: 'BUDGET_DISCOUNTER' | 'MARKET_AVERAGE' | 'PREMIUM_AUTHORIZED';
  lastScrapedTimestamp: string;
  scrapeStatus: 'SUCCESS' | 'WARNING' | 'PENDING';
}

export interface PricePointByPack {
  packSize: PackagingType;
  packVolumeLitres: number;
  grossPriceEur: number;
  netPriceEur: number;
  pricePerLitreEur: number;
  inStock: boolean;
  stockLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'OUT_OF_STOCK';
}

export interface CompetitorProductPrice {
  id: string;
  productName: string;
  brand: string;
  category: LubricantCategory;
  viscosityGrade: string;
  oemApprovals: string[];
  industrySpecs: string[];
  distributorId: string;
  distributorName: string;
  distributorType: string;
  pricingByPack: Record<PackagingType, PricePointByPack>;
  regionalPriceIndices: Record<string, number>; // Bundesland code -> price multiplier (e.g., BW: 1.05, SN: 0.97)
  monthlyPriceHistory: { month: string; avgPricePerLitreEur: number }[];
  baseOilGroup: 'Group I' | 'Group II' | 'Group III (HC)' | 'Group IV (PAO)' | 'Group V (Ester/Bio)';
  isPriceLeader: boolean;
  priceLeaderSpreadPercent: number; // vs median
  url: string;
  lastUpdated: string;
}

export interface RegionalPriceSpread {
  bundeslandCode: string;
  bundeslandName: string;
  priceIndex: number; // 1.00 = national average
  avgPricePerLitreEur: number;
  hdeoAvgDrumPriceEur: number;
  hydraulicHlp46IbcPriceEur: number;
  pcmo5w30CanisterPriceEur: number;
  adrSurchargeAvgEur: number;
  priceVarianceFromNationalAvgPercent: number;
  dominantDistributors: string[];
}

export interface PriceGapOpportunity {
  id: string;
  productCategory: LubricantCategory;
  targetProduct: string;
  highestPricePlatform: { name: string; pricePerLitre: number; pack: PackagingType };
  lowestPricePlatform: { name: string; pricePerLitre: number; pack: PackagingType };
  absoluteSpreadEurPerLitre: number;
  marginArbitragePercent: number;
  recommendedActionDe: string;
  recommendedActionEn: string;
  opportunityType: 'PACKAGING_WATERFALL' | 'REGIONAL_ARBITRAGE' | 'OEM_VS_PRIVATE_LABEL' | 'DISTRIBUTOR_DISCOUNT';
}

export interface ScrapingJobLog {
  id: string;
  timestamp: string;
  distributorId: string;
  distributorName: string;
  productsScraped: number;
  newPriceGapsFound: number;
  durationMs: number;
  status: 'COMPLETED' | 'RUNNING' | 'FAILED';
  httpStatus: number;
  notes: string;
}

// ==========================================
// FUEL PUMPS, DISPENSERS & FUEL WHITE SPOTS
// ==========================================

export type FuelStationType = 
  | 'HIGHWAY_SERVICE_AREA' 
  | 'AUTOHOF' 
  | 'URBAN_FLEET_HUB' 
  | 'RURAL_COOP' 
  | 'CARDLOCK_UNATTENDED' 
  | 'COMMERCIAL_DEPOT';

export type FuelProductType = 
  | 'DIESEL_B7' 
  | 'HVO100' 
  | 'SUPER_E10' 
  | 'SUPER_E5' 
  | 'SUPER_PLUS_98' 
  | 'ADBLUE_BULK' 
  | 'BIO_LNG' 
  | 'BIO_CNG' 
  | 'HYDROGEN_350_700' 
  | 'HPC_EV_300KW';

export interface FuelStationRecord {
  id: string;
  name: string;
  brand: string;
  stationType: FuelStationType;
  bundeslandId: string;
  bundeslandName: string;
  city: string;
  plz: string;
  lat: number;
  lng: number;
  corridorHighway: string;
  highwayExitKm: number;
  dailyThroughputM3: number;
  pumpIslandsCount: number;
  totalPumpsCount: number;
  hvo100Available: boolean;
  lkwHighSpeedDieselAvailable: boolean;
  adblueBulkAvailable: boolean;
  lngCngAvailable: boolean;
  hpcChargerCount: number;
  truckParkingSpots: number;
  lubricantsRetailCabinetVolumeLiters: number;
  pricePerLitreDiesel: number;
  pricePerLitreHvo100: number;
  pricePerLitreE10: number;
  pricePerLitreAdBlue: number;
  cardAcceptance: string[];
  operatorContact: string;
}

export interface FuelWhiteSpotCluster {
  id: string;
  name: string;
  corridor: string;
  bundeslandId: string;
  bundeslandName: string;
  lat: number;
  lng: number;
  gapType: 'HVO100_DEFICIT' | 'LKW_HIGHSPEED_DEFICIT' | 'ADBLUE_BULK_DEFICIT' | 'UNATTENDED_CARDLOCK_DEFICIT' | 'BIO_LNG_DEFICIT' | 'COMPLETE_FUEL_GAP';
  deficitSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  nearestAlternativeDistanceKm: number;
  dailyUnservedVolumePotentialM3: number;
  annualRevenuePotentialEur: number;
  targetedFleetCount: number;
  industrialAnchorZones: string[];
  strategicJustificationDe: string;
  strategicJustificationEn: string;
  recommendedDispenserSetup: string;
  estimatedCapexEur: number;
  paybackYears: number;
  hvo100ConversionViable: boolean;
}

export interface MtsKPricingBenchmark {
  fuelType: FuelProductType;
  label: string;
  nationalAvgPriceEur: number;
  autobahnAvgPriceEur: number;
  autohofAvgPriceEur: number;
  cityOffHighwayAvgPriceEur: number;
  refineryGateWholesaleEur: number;
  stationGrossMarginCentPerLitre: number;
  volatility24hCent: number;
}

// ==========================================
// C-SUITE & EXECUTIVE STRATEGY TYPES
// ==========================================

export interface ExecutiveStrategicKPIs {
  totalEnterpriseTamEur: number; // €1.68B
  annualizedWhiteSpotMarginCaptureEur: number; // €118.5M
  blendedPortfolioGrossMarginPercent: number; // 29.4%
  portfolioRoicPercent: number; // 22.8%
  fiveYearPortfolioNpvEur: number; // €84.2M
  weightedAverageIrrPercent: number; // 24.6%
  annualCo2AbatementTonnes: number; // 48,500 t
  thgQuotenRevenuePotentialEur: number; // €14.2M
  capitalEfficiencyRatio: number; // 3.42x
}

export interface CapExInvestmentProject {
  id: string;
  title: string;
  corridor: string;
  projectType: 'GREENFIELD_AUTOHOF' | 'BROWNFIELD_RETROFIT' | 'CARDLOCK_AUTOMATION' | 'BIO_LNG_CRYOGENIC' | 'LUBE_DISTRIBUTION_DEPOT';
  capexEur: number;
  opexAnnualEur: number;
  expectedAnnualRevenueEur: number;
  expectedAnnualEbitdaEur: number;
  paybackPeriodYears: number;
  tenYearNpvEur: number;
  projectIrrPercent: number;
  cannibalizationRiskPercent: number; // risk of taking volume from own existing sites
  esgScopeReductionScore: number; // 0-100
  urgencyPriority: 'IMMEDIATE_Q1_Q2' | 'MEDIUM_TERM' | 'EXPLORATORY';
  keyRiskFactors: string[];
}

export interface FleetCardPaymentBreakdown {
  cardType: 'PROPRIETARY_CARD' | 'DKV_MOBILITY' | 'UTA_EDENRED' | 'ROUTEX_EUROSHELL' | 'BANK_CREDIT_DIRECT';
  name: string;
  volumeSharePercent: number;
  interchangeFeePercent: number;
  settlementDelayDays: number;
  netMarginYieldCentPerLitre: number;
  customerRetentionIndex: number; // 0-100
  creditRiskRating: 'AAA' | 'AA' | 'A' | 'BBB';
}

export interface ThgRegulatoryMetric {
  segment: string;
  co2eAbatementTonnesPerYear: number;
  thgCertificateYieldEurPerTonne: number;
  totalAnnualThgRevenueEur: number;
  scopeReductionTargetYear: string;
  complianceReadiness: number; // 0-100%
}



