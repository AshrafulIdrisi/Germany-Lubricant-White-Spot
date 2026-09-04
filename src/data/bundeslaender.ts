import { BundeslandData } from '../types';

export const BUNDESLAENDER_DATA: BundeslandData[] = [
  {
    id: 'baden_wuerttemberg',
    code: 'BW',
    nameDe: 'Baden-Württemberg',
    nameEn: 'Baden-Württemberg',
    capital: 'Stuttgart',
    lat: 48.6616,
    lng: 9.3501,
    areaKm2: 35751,
    population: 11280000,
    gdpBillionEur: 572.8,
    demandTonnes: {
      automotive_pcmo: 38500,
      transport_hdeo: 24200,
      industrial_metalworking: 49800, // Capital of German Maschinenbau
      wind_renewable: 3200,
      chemical_process: 14500,
      marine_inland: 6800, // Rhine ports: Mannheim, Karlsruhe, Kehl
      agri_forestry: 11200,
    },
    localProductionCapacityTonnes: 115000, // Fuchs Mannheim, Zeller+Gmelin Eislingen, BANTLEON Ulm, Oest Freudenstadt
    localStorageCapacityTonnes: 72000,
    activeRefineriesBlendingPlants: [
      'Fuchs Petrolub SE (Mannheim Plant)',
      'Zeller+Gmelin / Divinol (Eislingen/Fils)',
      'BANTLEON GmbH (Ulm)',
      'Oest Gruppe (Freudenstadt)',
      'MiRO Mineraloelraffinerie Oberrhein (Karlsruhe)',
    ],
    keyLogisticsCorridors: ['A8 Stuttgart-München', 'A5 Rheintal-Achse', 'A81 Bodensee-Stuttgart', 'Rheinwasserstraße Mannheim-Karlsruhe'],
    primaryChannelPartners: ['BayWa Schmierstoffe Südwest', 'AVIA Bantleon', 'Fuchs Direct B2B', 'Klüber Technical Support'],
    whiteSpotCount: 4,
    deficitRiskScore: 32, // Strong domestic blending base
  },
  {
    id: 'bayern',
    code: 'BY',
    nameDe: 'Bayern (Bavaria)',
    nameEn: 'Bavaria',
    capital: 'München',
    lat: 48.7904,
    lng: 11.4979,
    areaKm2: 70542,
    population: 13370000,
    gdpBillionEur: 716.8,
    demandTonnes: {
      automotive_pcmo: 46200, // BMW, Audi, large private fleet
      transport_hdeo: 29500, // A3, A8, A9, A93 transit
      industrial_metalworking: 44000, // High-tech, automotive suppliers
      wind_renewable: 4100,
      chemical_process: 18200, // Bavarian Chemical Triangle (Burghausen)
      marine_inland: 4200, // Danube & Main-Danube Canal
      agri_forestry: 21800, // Largest agricultural acreage
    },
    localProductionCapacityTonnes: 88000, // LIQUI MOLY Ulm/Neu-Ulm, Klüber Munich, Bayernoil Neustadt/Vohburg
    localStorageCapacityTonnes: 85000,
    activeRefineriesBlendingPlants: [
      'LIQUI MOLY GmbH (Neu-Ulm & Ulm)',
      'Klüber Lubrication München SE',
      'Bayernoil Raffinerie (Neustadt & Vohburg an der Donau)',
      'OMV Deutschland (Burghausen Refinery)',
    ],
    keyLogisticsCorridors: ['A9 München-Nürnberg-Berlin', 'A3 Frankfurt-Passau-Austria', 'A8 München-Salzburg', 'Donau-Wasserstraße'],
    primaryChannelPartners: ['BayWa AG (Headquarters Munich - 180+ Agri/Lube Depots)', 'AVIA Süd', 'Hoyer Süd-Zentrale'],
    whiteSpotCount: 5,
    deficitRiskScore: 48,
  },
  {
    id: 'nordrhein_westfalen',
    code: 'NW',
    nameDe: 'Nordrhein-Westfalen (NRW)',
    nameEn: 'North Rhine-Westphalia',
    capital: 'Düsseldorf',
    lat: 51.4332,
    lng: 7.6616,
    areaKm2: 34110,
    population: 17920000,
    gdpBillionEur: 793.8,
    demandTonnes: {
      automotive_pcmo: 58000, // Densely populated Ruhr/Rhineland
      transport_hdeo: 42000, // European logistics gateway (A1, A2, A3, A40)
      industrial_metalworking: 47500, // Heavy machinery, steel, toolmaking
      wind_renewable: 5500,
      chemical_process: 34000, // Chempark Leverkusen, Dormagen, Krefeld-Uerdingen
      marine_inland: 14500, // Duisburg Port (largest inland port in the world), Rhine
      agri_forestry: 13500,
    },
    localProductionCapacityTonnes: 145000, // Shell Wesseling/Godorf, BP/Castrol Bochum/Gelsenkirchen, Rhenus Lub Mönchengladbach
    localStorageCapacityTonnes: 110000,
    activeRefineriesBlendingPlants: [
      'Shell Energy and Chemicals Park Rheinland (Wesseling & Godorf)',
      'BP Gelsenkirchen / Castrol Europa SE (Bochum)',
      'Rhenus Lub GmbH & Co KG (Mönchengladbach)',
      'Westfalen AG (Münster HQ Blending/Filling)',
    ],
    keyLogisticsCorridors: ['A1/A2/A3 Kamener Kreuz & Ruhr Valley', 'Duisburg Inland Port Hub', 'Rhine Barge Corridor'],
    primaryChannelPartners: ['AGRAVIS Raiffeisen AG (Münster)', 'Westfalen AG', 'RWZ Rhein-Main', 'Castrol B2B Direkt'],
    whiteSpotCount: 5,
    deficitRiskScore: 38,
  },
  {
    id: 'niedersachsen',
    code: 'NI',
    nameDe: 'Niedersachsen (Lower Saxony)',
    nameEn: 'Lower Saxony',
    capital: 'Hannover',
    lat: 52.6367,
    lng: 9.8451,
    areaKm2: 47710,
    population: 8000000,
    gdpBillionEur: 339.4,
    demandTonnes: {
      automotive_pcmo: 28000, // VW Wolfsburg, Hannover, Emden
      transport_hdeo: 26500, // A7 north-south, A2 east-west, A1
      industrial_metalworking: 22000,
      wind_renewable: 14800, // Leading onshore wind & offshore bases (Cuxhaven)
      chemical_process: 9800,
      marine_inland: 8500, // Emden, Wilhelmshaven, Mittellandkanal
      agri_forestry: 24500, // Intensive agriculture & livestock
    },
    localProductionCapacityTonnes: 92000, // SRS Schmierstoff Salzbergen, Ravenol Werther/border, Hoyer Visselhövede
    localStorageCapacityTonnes: 78000,
    activeRefineriesBlendingPlants: [
      'SRS Schmierstoff Vertrieb GmbH (Salzbergen Refinery)',
      'Hoyer Unternehmensgruppe (Visselhövede Mega-Depot)',
      'Holborn Europa Raffinerie (Hamburg/Harburg/Lower Saxony border)',
    ],
    keyLogisticsCorridors: ['A7 Hamburg-Hannover-Kassel', 'A2 Ruhr-Hannover-Berlin', 'Mittellandkanal & Weser'],
    primaryChannelPartners: ['Hoyer Unternehmensgruppe (Visselhövede HQ)', 'AGRAVIS Raiffeisen AG (Hannover/Oldenburg)', 'team energie'],
    whiteSpotCount: 3,
    deficitRiskScore: 35,
  },
  {
    id: 'hessen',
    code: 'HE',
    nameDe: 'Hessen (Hesse)',
    nameEn: 'Hesse',
    capital: 'Wiesbaden',
    lat: 50.6521,
    lng: 9.1624,
    areaKm2: 21115,
    population: 6300000,
    gdpBillionEur: 323.4,
    demandTonnes: {
      automotive_pcmo: 21500,
      transport_hdeo: 24800, // Frankfurt airport cargo, Kassel transport hub
      industrial_metalworking: 16500, // Wetzlar precision optics, Kassel rolling stock
      wind_renewable: 3100,
      chemical_process: 16200, // Industriepark Höchst, Merck Darmstadt
      marine_inland: 4800, // Main & Rhine junction
      agri_forestry: 7400,
    },
    localProductionCapacityTonnes: 22000, // Moderate local blending, relies heavily on Rhine-Main & Mannheim supply
    localStorageCapacityTonnes: 36000,
    activeRefineriesBlendingPlants: [
      'Industriepark Höchst Chemical Lube Storage',
      'Raiffeisen Waren GmbH Central Tankfarm (Kassel)',
    ],
    keyLogisticsCorridors: ['Frankfurter Kreuz (A3/A5)', 'Kasseler Berge A7 Hub', 'Main-Rhine Fluvial Nexus'],
    primaryChannelPartners: ['RWZ Rhein-Main eG', 'Raiffeisen Waren GmbH (Kassel)', 'AVIA Weitkamp & Hess'],
    whiteSpotCount: 3,
    deficitRiskScore: 68, // Significant deficit imported from BW/NRW
  },
  {
    id: 'sachsen',
    code: 'SN',
    nameDe: 'Sachsen (Saxony)',
    nameEn: 'Saxony',
    capital: 'Dresden',
    lat: 51.1045,
    lng: 13.2017,
    areaKm2: 18450,
    population: 4080000,
    gdpBillionEur: 146.5,
    demandTonnes: {
      automotive_pcmo: 13800, // VW Zwickau, Porsche/BMW Leipzig
      transport_hdeo: 14200, // A4 Poland transit, A14, A72
      industrial_metalworking: 18500, // Silicon Saxony, Chemnitz machine tools
      wind_renewable: 2600,
      chemical_process: 8500, // Nünchritz (Wacker Silicones), Böhlen
      marine_inland: 1800, // Elbe waterway
      agri_forestry: 6900,
    },
    localProductionCapacityTonnes: 18000,
    localStorageCapacityTonnes: 24000,
    activeRefineriesBlendingPlants: [
      'Regional Independent Blenders (Chemnitz & Zwickau)',
      'Addinol Regional Supply Link (Leuna neighbor)',
    ],
    keyLogisticsCorridors: ['A4 Dresden-Chemnitz-Erfurt', 'A14 Leipzig-Dresden', 'Elbe Inland Port Riesa/Dresden'],
    primaryChannelPartners: ['BayWa Schmierstoffe Ost', 'TotalEnergies Ost-Vertrieb', 'Addinol Fachhandel'],
    whiteSpotCount: 2,
    deficitRiskScore: 59,
  },
  {
    id: 'rheinland_pfalz',
    code: 'RP',
    nameDe: 'Rheinland-Pfalz (Rhineland-Palatinate)',
    nameEn: 'Rhineland-Palatinate',
    capital: 'Mainz',
    lat: 49.9576,
    lng: 7.6402,
    areaKm2: 19854,
    population: 4100000,
    gdpBillionEur: 162.2,
    demandTonnes: {
      automotive_pcmo: 13500,
      transport_hdeo: 12800, // A61 freight route from Benelux
      industrial_metalworking: 12200, // Kaiserslautern, Koblenz manufacturing
      wind_renewable: 3800, // Hunsrück wind expansion
      chemical_process: 28000, // BASF Ludwigshafen (world's largest chemical complex)
      marine_inland: 7200, // Rhine river ports (Ludwigshafen, Mainz, Koblenz)
      agri_forestry: 8600, // Viticulture & agriculture
    },
    localProductionCapacityTonnes: 75000, // ROWE Mineralölwerk Worms, BASF Ludwigshafen specialty synthesis
    localStorageCapacityTonnes: 52000,
    activeRefineriesBlendingPlants: [
      'ROWE MINERALÖLWERK GMBH (Worms Mega-Plant)',
      'BASF SE Ludwigshafen (Polyolester & Synthetic Base Fluids)',
    ],
    keyLogisticsCorridors: ['A61 Venlo-Ludwigshafen', 'A6 Saarbrücken-Mannheim', 'Rhine Marine Siding'],
    primaryChannelPartners: ['RWZ Rhein-Main eG (Köln/Mainz)', 'ROWE Global Direct', 'AVIA Schneider'],
    whiteSpotCount: 2,
    deficitRiskScore: 28, // High self-sufficiency due to ROWE Worms & BASF
  },
  {
    id: 'schleswig_holstein',
    code: 'SH',
    nameDe: 'Schleswig-Holstein',
    nameEn: 'Schleswig-Holstein',
    capital: 'Kiel',
    lat: 54.2194,
    lng: 9.6961,
    areaKm2: 15804,
    population: 2950000,
    gdpBillionEur: 112.7,
    demandTonnes: {
      automotive_pcmo: 9400,
      transport_hdeo: 8900, // A7 Scandinavian corridor
      industrial_metalworking: 5200,
      wind_renewable: 18500, // Premier Wind Powerhub (Husum, North Sea)
      chemical_process: 4100, // Brunsbüttel ChemCoast Park
      marine_inland: 9800, // Kiel Canal (Kieler Förde), Lübeck Baltic Port
      agri_forestry: 10400,
    },
    localProductionCapacityTonnes: 26000, // Raffinerie Heide (Hemmingstedt)
    localStorageCapacityTonnes: 38000,
    activeRefineriesBlendingPlants: [
      'Raffinerie Heide GmbH (Hemmingstedt / Dithmarschen)',
      'Brunsbüttel Ports Lube Bunker Terminal',
    ],
    keyLogisticsCorridors: ['A7 Hamburg-Flensburg-Denmark', 'Nord-Ostsee-Kanal (Kiel Canal)', 'B5 Wind Corridor'],
    primaryChannelPartners: ['team energie GmbH & Co. KG (Flensburg HQ)', 'AGRAVIS Nord', 'Hoyer Nord-West'],
    whiteSpotCount: 2,
    deficitRiskScore: 54, // Wind & Marine specialized deficit
  },
  {
    id: 'brandenburg',
    code: 'BB',
    nameDe: 'Brandenburg',
    nameEn: 'Brandenburg',
    capital: 'Potsdam',
    lat: 52.4125,
    lng: 12.5316,
    areaKm2: 29654,
    population: 2570000,
    gdpBillionEur: 88.5,
    demandTonnes: {
      automotive_pcmo: 8500, // Tesla Gigafactory Grünheide
      transport_hdeo: 11200, // A10 Berliner Ring, A2/A12 transit to Poland
      industrial_metalworking: 7400, // Ludwigsfelde, Eisenhüttenstadt steel
      wind_renewable: 9800, // Vast onshore wind parks
      chemical_process: 6800, // PCK Raffinerie Schwedt, Schwarzheide (BASF)
      marine_inland: 2100, // Oder-Spree-Kanal
      agri_forestry: 14200, // Large agricultural cooperatives
    },
    localProductionCapacityTonnes: 58000, // PCK Raffinerie Schwedt
    localStorageCapacityTonnes: 45000,
    activeRefineriesBlendingPlants: [
      'PCK Raffinerie GmbH (Schwedt/Oder)',
      'BASF Schwarzheide GmbH (Polyurethane/Polyol specialty plants)',
    ],
    keyLogisticsCorridors: ['A10 Berliner Ring Hub', 'A12 Berlin-Frankfurt(Oder)-Warsaw', 'A9/A13 South Link'],
    primaryChannelPartners: ['Raiffeisen Agrar Brandenburg', 'TotalEnergies Ost', 'Hoyer Ost-Logistik'],
    whiteSpotCount: 2,
    deficitRiskScore: 42,
  },
  {
    id: 'sachsen_anhalt',
    code: 'ST',
    nameDe: 'Sachsen-Anhalt',
    nameEn: 'Saxony-Anhalt',
    capital: 'Magdeburg',
    lat: 51.9503,
    lng: 11.6923,
    areaKm2: 20452,
    population: 2180000,
    gdpBillionEur: 75.4,
    demandTonnes: {
      automotive_pcmo: 7200,
      transport_hdeo: 9800, // A2, A9, A14 corridors
      industrial_metalworking: 9100, // Heavy equipment, Magdeburg/Dessau
      wind_renewable: 8200, // High wind turbine density
      chemical_process: 19500, // Chemiedreieck Leuna & Bitterfeld-Wolfen
      marine_inland: 3400, // Elbe & Mittellandkanal junction Magdeburg
      agri_forestry: 12800, // Börde premium farmland
    },
    localProductionCapacityTonnes: 125000, // ADDINOL Lube Oil GmbH Leuna & TotalEnergies Leuna Raffinerie
    localStorageCapacityTonnes: 65000,
    activeRefineriesBlendingPlants: [
      'ADDINOL Lube Oil GmbH (Leuna Modern Blending Plant)',
      'TotalEnergies Raffinerie Mitteldeutschland (Leuna)',
      'Chemiepark Bitterfeld-Wolfen Specialty Hub',
    ],
    keyLogisticsCorridors: ['A9 Leipzig-Berlin', 'A14 Magdeburg-Halle', 'Mittellandkanal Kreuz Magdeburg'],
    primaryChannelPartners: ['ADDINOL Direkthandel & Fachpartner', 'TotalEnergies Mitteldeutschland', 'BayWa Ost'],
    whiteSpotCount: 2,
    deficitRiskScore: 18, // Major net exporter to surrounding states!
  },
  {
    id: 'thueringen',
    code: 'TH',
    nameDe: 'Thüringen (Thuringia)',
    nameEn: 'Thuringia',
    capital: 'Erfurt',
    lat: 51.011,
    lng: 11.0328,
    areaKm2: 16179,
    population: 2120000,
    gdpBillionEur: 71.4,
    demandTonnes: {
      automotive_pcmo: 7100, // Opel Eisenach, supplier park
      transport_hdeo: 10400, // A4 east-west, A71, A9 central hub
      industrial_metalworking: 11800, // Jena optics, Suhl tooling, Erfurt stamping
      wind_renewable: 3100,
      chemical_process: 3900,
      marine_inland: 400,
      agri_forestry: 7800,
    },
    localProductionCapacityTonnes: 12000,
    localStorageCapacityTonnes: 19000,
    activeRefineriesBlendingPlants: [
      'Erfurt Central Logistics Tankfarm',
      'Regional Specialty Lubricant Compounders (Gera & Jena)',
    ],
    keyLogisticsCorridors: ['Erfurter Kreuz A4/A71', 'Hermsdorfer Kreuz A4/A9'],
    primaryChannelPartners: ['Raiffeisen Waren GmbH (Erfurt Branch)', 'Hoyer Thüringen', 'Ravenol Vertrieb'],
    whiteSpotCount: 2,
    deficitRiskScore: 66, // Needs imports from Leuna & Salzbergen
  },
  {
    id: 'hamburg',
    code: 'HH',
    nameDe: 'Hamburg (Freie und Hansestadt)',
    nameEn: 'Hamburg',
    capital: 'Hamburg',
    lat: 53.5511,
    lng: 9.9937,
    areaKm2: 755,
    population: 1900000,
    gdpBillionEur: 144.2,
    demandTonnes: {
      automotive_pcmo: 7800,
      transport_hdeo: 13500, // Port container drayage & European logistics
      industrial_metalworking: 8200, // Airbus Hamburg-Finkenwerder aviation tooling, Aurubis copper
      wind_renewable: 2800, // Headquarters & turbine testing
      chemical_process: 6400,
      marine_inland: 28500, // Germany's premier sea port & bunker terminal
      agri_forestry: 900,
    },
    localProductionCapacityTonnes: 85000, // Shell Grasbrook Lubricant Plant (one of Europe's largest base & lube hubs), ExxonMobil
    localStorageCapacityTonnes: 95000,
    activeRefineriesBlendingPlants: [
      'Shell Schmierstoffwerk Grasbrook (Hamburg Port)',
      'ExxonMobil Central Europe HQ & Tank Terminal (Hamburg-Wilhelmsburg)',
      'Hoyer Marine Bunker Station (Port of Hamburg)',
    ],
    keyLogisticsCorridors: ['Elbe Shipping Fairway', 'A1/A7 Elbtunnel Freight Nexus', 'Hamburg Port Railway'],
    primaryChannelPartners: ['Shell Marine & B2B Deutschland', 'Hoyer Marine Bunkering', 'Mabanaft Tanklager'],
    whiteSpotCount: 2,
    deficitRiskScore: 24, // Global maritime export powerhouse
  },
  {
    id: 'bremen',
    code: 'HB',
    nameDe: 'Bremen & Bremerhaven',
    nameEn: 'Bremen & Bremerhaven',
    capital: 'Bremen',
    lat: 53.0793,
    lng: 8.8017,
    areaKm2: 419,
    population: 680000,
    gdpBillionEur: 37.8,
    demandTonnes: {
      automotive_pcmo: 3400, // Mercedes-Benz Werk Bremen
      transport_hdeo: 6800, // Automotive transshipment BLG logistics
      industrial_metalworking: 5200, // Aerospace, steel, marine engineering
      wind_renewable: 2400, // Offshore wind staging in Bremerhaven
      chemical_process: 1900,
      marine_inland: 14200, // Port of Bremerhaven (container & car-carrier bunkering)
      agri_forestry: 400,
    },
    localProductionCapacityTonnes: 15000,
    localStorageCapacityTonnes: 32000,
    activeRefineriesBlendingPlants: [
      'Bremen Seaport Lube Terminal',
      'Bremerhaven Marine Fuel & Lubricant Bunkering Depot',
    ],
    keyLogisticsCorridors: ['A27 Bremen-Bremerhaven-Cuxhaven', 'A1 Hansalinie', 'Weser Marine Shipping'],
    primaryChannelPartners: ['team energie Weser', 'Hoyer Bremen', 'Castrol Marine North'],
    whiteSpotCount: 1,
    deficitRiskScore: 52,
  },
  {
    id: 'berlin',
    code: 'BE',
    nameDe: 'Berlin (Bundeshauptstadt)',
    nameEn: 'Berlin',
    capital: 'Berlin',
    lat: 52.52,
    lng: 13.405,
    areaKm2: 891,
    population: 3750000,
    gdpBillionEur: 179.4,
    demandTonnes: {
      automotive_pcmo: 16500, // Urban mobility, taxi/ride fleets, municipal
      transport_hdeo: 11800, // Last-mile & hub distribution
      industrial_metalworking: 4800, // Siemens, BMW Motorrad Berlin-Spandau
      wind_renewable: 600,
      chemical_process: 3200, // Bayer Pharma, Adlershof tech
      marine_inland: 1600, // Spree & Havel urban shipping
      agri_forestry: 300,
    },
    localProductionCapacityTonnes: 8000,
    localStorageCapacityTonnes: 22000,
    activeRefineriesBlendingPlants: [
      'TotalEnergies Deutschland Corporate & Depot Berlin',
      'Westhafen Urban Lube Logistics Terminal',
    ],
    keyLogisticsCorridors: ['A100 Berliner Stadtring', 'A10 Berliner Ring Interchanges', 'Spree-Oder Waterway'],
    primaryChannelPartners: ['TotalEnergies Berlin', 'AVIA Ost', 'Hoyer Metropol-Service'],
    whiteSpotCount: 1,
    deficitRiskScore: 72, // Heavily dependent on Schwedt & Leuna imports
  },
  {
    id: 'saarland',
    code: 'SL',
    nameDe: 'Saarland',
    nameEn: 'Saarland',
    capital: 'Saarbrücken',
    lat: 49.3964,
    lng: 7.023,
    areaKm2: 2570,
    population: 990000,
    gdpBillionEur: 38.5,
    demandTonnes: {
      automotive_pcmo: 3800, // Ford Saarlouis ecosystem, ZF Saarbrücken transmission
      transport_hdeo: 4200, // A6 border crossing to France/Luxembourg
      industrial_metalworking: 7500, // Saarstahl Völklingen, Dillinger Hütte, ZF Transmissions
      wind_renewable: 600,
      chemical_process: 1800,
      marine_inland: 1200, // Saar waterway to Moselle
      agri_forestry: 1100,
    },
    localProductionCapacityTonnes: 9000,
    localStorageCapacityTonnes: 14000,
    activeRefineriesBlendingPlants: [
      'Saar-Lube Regional Depot (Saarbrücken/Völklingen)',
      'ZF Special Fluids Supply Center (Saarbrücken)',
    ],
    keyLogisticsCorridors: ['A6 Saarbrücken-Metz-Paris', 'A8 Saarbrücken-Pirmasens-Karlsruhe', 'Saarkanal'],
    primaryChannelPartners: ['RWZ Rhein-Main Saar Branch', 'Fuchs Regional Technical Service', 'AVIA Südwest'],
    whiteSpotCount: 1,
    deficitRiskScore: 61,
  },
  {
    id: 'mecklenburg_vorpommern',
    code: 'MV',
    nameDe: 'Mecklenburg-Vorpommern',
    nameEn: 'Mecklenburg-Western Pomerania',
    capital: 'Schwerin',
    lat: 53.6127,
    lng: 12.4296,
    areaKm2: 23214,
    population: 1610000,
    gdpBillionEur: 53.4,
    demandTonnes: {
      automotive_pcmo: 5200,
      transport_hdeo: 6400, // A19, A20 Baltic autobahn
      industrial_metalworking: 3800, // Rostock shipyard, maritime equipment
      wind_renewable: 11200, // Baltic offshore wind hubs (Baltic 1/2, Wikinger) & coastal onshore
      chemical_process: 1400,
      marine_inland: 6800, // Port of Rostock (Baltic ferry & cargo hub), Wismar
      agri_forestry: 14600, // Massive cereal grain & rapeseed acreage
    },
    localProductionCapacityTonnes: 11000,
    localStorageCapacityTonnes: 26000,
    activeRefineriesBlendingPlants: [
      'Port of Rostock Marine & Wind Lube Terminal',
      'Hoyer Ostsee-Stützpunkt (Rostock)',
    ],
    keyLogisticsCorridors: ['A20 Ostsee-Autobahn', 'A19 Berlin-Rostock', 'Ostsee Ferry Lanes to Scandinavia'],
    primaryChannelPartners: ['AGRAVIS Ost / Raiffeisen Nordost', 'Hoyer Ostsee-Netzwerk', 'team energie MV'],
    whiteSpotCount: 2,
    deficitRiskScore: 63, // High demand for wind & agri bio-lubricants vs limited local production
  },
];
