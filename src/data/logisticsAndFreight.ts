import { 
  AutobahnCorridor, 
  WaterwayCorridor, 
  PortTerminalThroughput, 
  LogisticsDisruptionAlert, 
  RefinedDemandForecast 
} from '../types';

export const AUTOBAHN_CORRIDORS: AutobahnCorridor[] = [
  {
    id: 'a1_hansalinie',
    code: 'A1',
    name: 'A1 (Hansalinie & Ruhrtangente)',
    descriptionDe: 'Zentrale Nord-Süd-Verkehrsachse von der Ostsee (Heiligenhafen) über Hamburg, Bremen, Münster, Dortmund, Leverkusen/Köln nach Saarbrücken.',
    descriptionEn: 'Major North-South freight spine from Baltic Sea via Hamburg, Bremen, Ruhr Area, Cologne to Saarbrücken.',
    totalLengthKm: 748,
    totalTrucksDaily: 28400,
    totalHdeoConsumptionTonnesYear: 11800,
    overallCongestionIndex: 78,
    color: '#f59e0b', // Amber
    disruptionRiskRating: 'HIGH',
    estimatedTransitDelayHours: 1.8,
    connectedStates: ['SH', 'HH', 'NI', 'HB', 'NW', 'RP', 'SL'],
    keyChokePoints: ['Hamburg Süderelbe Norderelbbrücke', 'Bremer Kreuz', 'Kamener Kreuz', 'Leverkusen Rheinbrücke', 'Lüdenscheid/Rahmede Umleitung'],
    polyline: [
      [54.3725, 10.9780], // Heiligenhafen
      [53.8655, 10.6865], // Lübeck
      [53.5511, 9.9937],  // Hamburg
      [53.0793, 8.8017],  // Bremen
      [52.2799, 8.0472],  // Osnabrück
      [51.9607, 7.6261],  // Münster
      [51.5136, 7.4653],  // Dortmund
      [51.3671, 7.4633],  // Hagen / Lüdenscheid
      [50.9375, 6.9603],  // Köln / Leverkusen
      [50.3569, 6.7580],  // Eifel Blankenheim
      [49.2401, 6.9969],  // Saarbrücken
    ],
    segments: [
      {
        id: 'a1_seg_1',
        name: 'Hamburg Süd - Bremen Kreuz',
        startCity: 'Hamburg',
        endCity: 'Bremen',
        lengthKm: 118,
        trucksPerDay: 32400,
        truckSharePercent: 26.8,
        congestionIndex: 82,
        avgSpeedKmh: 68,
        hdeoConsumptionLitrePerMonth: 128000,
        status: 'CONGESTED',
        activeDisruptions: ['Baustelle Dibbersen 6-Streifiger Ausbau', 'Dauerstau Stuckenborstel'],
        delayMinutes: 38,
      },
      {
        id: 'a1_seg_2',
        name: 'Bremen - Osnabrück - Münster',
        startCity: 'Bremen',
        endCity: 'Münster',
        lengthKm: 172,
        trucksPerDay: 26800,
        truckSharePercent: 24.2,
        congestionIndex: 65,
        avgSpeedKmh: 76,
        hdeoConsumptionLitrePerMonth: 165000,
        status: 'MODERATE',
        activeDisruptions: ['Sanierung Wildeshausen'],
        delayMinutes: 18,
      },
      {
        id: 'a1_seg_3',
        name: 'Kamener Kreuz - Leverkusen / Köln',
        startCity: 'Dortmund/Kamen',
        endCity: 'Köln',
        lengthKm: 94,
        trucksPerDay: 36500,
        truckSharePercent: 31.4,
        congestionIndex: 91,
        avgSpeedKmh: 54,
        hdeoConsumptionLitrePerMonth: 142000,
        status: 'DISRUPTED',
        activeDisruptions: ['Leverkusener Rheinbrücke Gewichtsbeschränkung & Baustellenstau', 'Tunnel Köln-Lövenich'],
        delayMinutes: 52,
      },
      {
        id: 'a1_seg_4',
        name: 'Köln - Trier - Saarbrücken',
        startCity: 'Köln',
        endCity: 'Saarbrücken',
        lengthKm: 185,
        trucksPerDay: 18200,
        truckSharePercent: 19.5,
        congestionIndex: 45,
        avgSpeedKmh: 84,
        hdeoConsumptionLitrePerMonth: 95000,
        status: 'CLEAR',
        activeDisruptions: ['Lückenschluss Eifel einspurige Verkehrsführung'],
        delayMinutes: 12,
      },
    ],
  },
  {
    id: 'a2_warschauer_allee',
    code: 'A2',
    name: 'A2 (Ost-West Transit "Warschauer Allee")',
    descriptionDe: 'Europas höchstfrequentierte Ost-West Schwerlast-Schlagader (TEN-T North Sea-Baltic Corridor) von Oberhausen/Ruhrgebiet über Bielefeld, Hannover, Magdeburg nach Berlin (Dreieck Werder).',
    descriptionEn: 'Europe\'s heaviest East-West freight corridor connecting Dutch/Ruhr industrial hub with Poland and Eastern Europe.',
    totalLengthKm: 473,
    totalTrucksDaily: 34800,
    totalHdeoConsumptionTonnesYear: 14200,
    overallCongestionIndex: 86,
    color: '#ef4444', // Red
    disruptionRiskRating: 'CRITICAL',
    estimatedTransitDelayHours: 2.4,
    connectedStates: ['NW', 'NI', 'ST', 'BB', 'BE'],
    keyChokePoints: ['Kreuz Oberhausen', 'Bad Oeynhausen / Porta Westfalica', 'Kreuz Hannover-Ost', 'Lehrte Güterverkehrsknoten', 'Magdeburg Elbbrücke'],
    polyline: [
      [51.5200, 6.8600],  // Oberhausen
      [51.5700, 7.1000],  // Gelsenkirchen
      [51.5136, 7.4653],  // Dortmund Nord
      [51.6800, 8.0000],  // Hamm
      [52.0300, 8.5300],  // Bielefeld
      [52.2000, 8.8000],  // Bad Oeynhausen
      [52.3759, 9.7320],  // Hannover
      [52.3700, 10.0000], // Lehrte
      [52.2600, 10.5200], // Braunschweig
      [52.1205, 11.6276], // Magdeburg
      [52.3600, 12.5000], // Brandenburg an der Havel
      [52.3650, 12.9150], // Dreieck Werder / Berlin Ring
    ],
    segments: [
      {
        id: 'a2_seg_1',
        name: 'Oberhausen - Kamener Kreuz - Bielefeld',
        startCity: 'Oberhausen',
        endCity: 'Bielefeld',
        lengthKm: 142,
        trucksPerDay: 38200,
        truckSharePercent: 34.0,
        congestionIndex: 89,
        avgSpeedKmh: 58,
        hdeoConsumptionLitrePerMonth: 185000,
        status: 'DISRUPTED',
        activeDisruptions: ['Brückensanierung Kreuz Recklinghausen', 'Schwerlast-Pulkbildung'],
        delayMinutes: 46,
      },
      {
        id: 'a2_seg_2',
        name: 'Bielefeld - Bad Oeynhausen - Hannover',
        startCity: 'Bielefeld',
        endCity: 'Hannover',
        lengthKm: 108,
        trucksPerDay: 35600,
        truckSharePercent: 32.5,
        congestionIndex: 85,
        avgSpeedKmh: 62,
        hdeoConsumptionLitrePerMonth: 145000,
        status: 'CONGESTED',
        activeDisruptions: ['Baustelle Bad Nenndorf', 'Gefahrgut-Lkw Kontrollstelle'],
        delayMinutes: 34,
      },
      {
        id: 'a2_seg_3',
        name: 'Hannover - Braunschweig - Magdeburg',
        startCity: 'Hannover',
        endCity: 'Magdeburg',
        lengthKm: 135,
        trucksPerDay: 33900,
        truckSharePercent: 31.0,
        congestionIndex: 82,
        avgSpeedKmh: 66,
        hdeoConsumptionLitrePerMonth: 168000,
        status: 'CONGESTED',
        activeDisruptions: ['Elbüberquerung Hohenwarthe Baustelle'],
        delayMinutes: 28,
      },
      {
        id: 'a2_seg_4',
        name: 'Magdeburg - Ziesar - Berliner Ring',
        startCity: 'Magdeburg',
        endCity: 'Dreieck Werder',
        lengthKm: 88,
        trucksPerDay: 28500,
        truckSharePercent: 27.5,
        congestionIndex: 68,
        avgSpeedKmh: 75,
        hdeoConsumptionLitrePerMonth: 98000,
        status: 'MODERATE',
        activeDisruptions: ['Fahrbahnsanierung Wollin'],
        delayMinutes: 16,
      },
    ],
  },
  {
    id: 'a3_rhine_danube',
    code: 'A3',
    name: 'A3 (Rhein-Main-Donau Trans-European)',
    descriptionDe: 'Europäische Hauptachse (TEN-T Rhine-Danube Corridor) von der niederländischen Grenze (Elten) über Köln, Frankfurt am Main, Würzburg, Nürnberg, Regensburg nach Passau (Österreich).',
    descriptionEn: 'Core Trans-European highway linking Rotterdam/Ruhr with Bavaria, Austria, and Southeast Europe.',
    totalLengthKm: 769,
    totalTrucksDaily: 31900,
    totalHdeoConsumptionTonnesYear: 13100,
    overallCongestionIndex: 83,
    color: '#8b5cf6', // Purple
    disruptionRiskRating: 'HIGH',
    estimatedTransitDelayHours: 2.1,
    connectedStates: ['NW', 'RP', 'HE', 'BY'],
    keyChokePoints: ['Kreuz Leverkusen', 'Kölner Ring Heumar', 'Frankfurter Kreuz', 'Spessart-Steigung Rohrbrunn', 'Nürnberg-Nord / Kreuz Fürth', 'Regensburg Donaubrücke'],
    polyline: [
      [51.8600, 6.1600],  // Emmerich / Elten
      [51.4344, 6.7623],  // Duisburg
      [50.9375, 6.9603],  // Köln
      [50.3600, 7.6000],  // Montabaur / Westerwald
      [50.1109, 8.6821],  // Frankfurt am Main
      [49.9800, 9.1500],  // Aschaffenburg
      [49.7913, 9.9534],  // Würzburg
      [49.5900, 11.0000], // Erlangen
      [49.4521, 11.0767], // Nürnberg
      [49.1800, 11.7500], // Neumarkt in der Oberpfalz
      [49.0134, 12.1016], // Regensburg
      [48.7800, 12.9500], // Deggendorf
      [48.5667, 13.4319], // Passau / Suben
    ],
    segments: [
      {
        id: 'a3_seg_1',
        name: 'Emmerich - Oberhausen - Köln',
        startCity: 'Emmerich',
        endCity: 'Köln',
        lengthKm: 145,
        trucksPerDay: 31200,
        truckSharePercent: 28.5,
        congestionIndex: 80,
        avgSpeedKmh: 65,
        hdeoConsumptionLitrePerMonth: 162000,
        status: 'CONGESTED',
        activeDisruptions: ['Kreuz Kaiserberg Umbau', 'Duisburg-Wedau Speditionsschleuse'],
        delayMinutes: 32,
      },
      {
        id: 'a3_seg_2',
        name: 'Köln - Limburg - Frankfurter Kreuz',
        startCity: 'Köln',
        endCity: 'Frankfurt',
        lengthKm: 180,
        trucksPerDay: 35800,
        truckSharePercent: 29.8,
        congestionIndex: 88,
        avgSpeedKmh: 59,
        hdeoConsumptionLitrePerMonth: 215000,
        status: 'DISRUPTED',
        activeDisruptions: ['Dauerstau Frankfurter Kreuz', 'Wiesbadener Kreuz Sanierung'],
        delayMinutes: 44,
      },
      {
        id: 'a3_seg_3',
        name: 'Frankfurt - Würzburg - Nürnberg',
        startCity: 'Frankfurt',
        endCity: 'Nürnberg',
        lengthKm: 228,
        trucksPerDay: 32400,
        truckSharePercent: 27.2,
        congestionIndex: 79,
        avgSpeedKmh: 68,
        hdeoConsumptionLitrePerMonth: 248000,
        status: 'CONGESTED',
        activeDisruptions: ['Spessart-Ausbau 6-Streifig Steilstrecke', 'Biebelrieder Dreieck Stau'],
        delayMinutes: 36,
      },
      {
        id: 'a3_seg_4',
        name: 'Nürnberg - Regensburg - Passau',
        startCity: 'Nürnberg',
        endCity: 'Passau',
        lengthKm: 216,
        trucksPerDay: 27800,
        truckSharePercent: 25.4,
        congestionIndex: 72,
        avgSpeedKmh: 74,
        hdeoConsumptionLitrePerMonth: 210000,
        status: 'MODERATE',
        activeDisruptions: ['Regensburg Donaubrücke Sinzing Sanierung', 'Grenzkontrollen Suben / Passau'],
        delayMinutes: 24,
      },
    ],
  },
  {
    id: 'a7_scandinavia_alps',
    code: 'A7',
    name: 'A7 (Skandinavien-Alpen Nord-Süd-Achse)',
    descriptionDe: 'Deutschlands längste Autobahn (962 km) von der dänischen Grenze (Ellund) über Flensburg, Hamburg (Elbtunnel), Hannover, Kassel, Fulda, Würzburg, Ulm nach Füssen/Österreich.',
    descriptionEn: 'Germany\'s longest highway (962 km) forming the key corridor between Scandinavia and the Alps.',
    totalLengthKm: 962,
    totalTrucksDaily: 26500,
    totalHdeoConsumptionTonnesYear: 12500,
    overallCongestionIndex: 74,
    color: '#06b6d4', // Cyan
    disruptionRiskRating: 'MEDIUM',
    estimatedTransitDelayHours: 1.9,
    connectedStates: ['SH', 'HH', 'NI', 'HE', 'BY', 'BW'],
    keyChokePoints: ['Elbtunnel Hamburg', 'Rader Hochbrücke Rendsburg', 'Kasseler Berge Steigungsstrecke', 'Kreuz Biebelried', 'Albaufstieg / Virngrundtunnel'],
    polyline: [
      [54.8300, 9.3300],  // Flensburg / Ellund
      [54.3000, 9.6800],  // Rendsburg (Rader Hochbrücke)
      [53.5511, 9.9937],  // Hamburg (Elbtunnel)
      [52.7500, 9.6000],  // Walsrode
      [52.3759, 9.7320],  // Hannover
      [51.5300, 9.9300],  // Göttingen
      [51.3127, 9.4797],  // Kassel (Kasseler Berge)
      [50.5500, 9.6800],  // Fulda
      [49.7913, 9.9534],  // Würzburg
      [49.1800, 10.1800], // Rothenburg ob der Tauber
      [48.8400, 10.1000], // Aalen / Ellwangen
      [48.4011, 9.9876],  // Ulm
      [47.9800, 10.1800], // Memmingen
      [47.5700, 10.7000], // Füssen / Reutte
    ],
    segments: [
      {
        id: 'a7_seg_1',
        name: 'Flensburg - Rendsburg - Hamburg Elbtunnel',
        startCity: 'Flensburg',
        endCity: 'Hamburg',
        lengthKm: 156,
        trucksPerDay: 22400,
        truckSharePercent: 21.0,
        congestionIndex: 76,
        avgSpeedKmh: 70,
        hdeoConsumptionLitrePerMonth: 132000,
        status: 'CONGESTED',
        activeDisruptions: ['Neubau Rader Hochbrücke Rendsburg', 'Elbtunnel Blockabfertigung'],
        delayMinutes: 32,
      },
      {
        id: 'a7_seg_2',
        name: 'Hamburg - Hannover - Göttingen',
        startCity: 'Hamburg',
        endCity: 'Göttingen',
        lengthKm: 245,
        trucksPerDay: 28900,
        truckSharePercent: 25.8,
        congestionIndex: 71,
        avgSpeedKmh: 75,
        hdeoConsumptionLitrePerMonth: 235000,
        status: 'MODERATE',
        activeDisruptions: ['6-streifiger Ausbau Seesen - Nörten-Hardenberg'],
        delayMinutes: 20,
      },
      {
        id: 'a7_seg_3',
        name: 'Göttingen - Kassel - Fulda - Würzburg',
        startCity: 'Göttingen',
        endCity: 'Würzburg',
        lengthKm: 218,
        trucksPerDay: 30100,
        truckSharePercent: 28.2,
        congestionIndex: 82,
        avgSpeedKmh: 64,
        hdeoConsumptionLitrePerMonth: 258000,
        status: 'CONGESTED',
        activeDisruptions: ['Kasseler Berge Extremsteigungen (HDEO thermischer Verschleiß)', 'Rhön-Querung Baustelle'],
        delayMinutes: 38,
      },
      {
        id: 'a7_seg_4',
        name: 'Würzburg - Ulm - Memmingen - Füssen',
        startCity: 'Würzburg',
        endCity: 'Füssen',
        lengthKm: 343,
        trucksPerDay: 24200,
        truckSharePercent: 22.4,
        congestionIndex: 62,
        avgSpeedKmh: 82,
        hdeoConsumptionLitrePerMonth: 275000,
        status: 'CLEAR',
        activeDisruptions: ['Sanierung Virngrundtunnel', 'Tunnel Füssen Blockabfertigung Reiseverkehr'],
        delayMinutes: 14,
      },
    ],
  },
  {
    id: 'a8_swabia_bavaria',
    code: 'A8',
    name: 'A8 (Süddeutsche Industrie- & Alpenmagistrale)',
    descriptionDe: 'Zentrale süddeutsche Hochleistungsachse von Karlsruhe über Pforzheim, Stuttgart, Ulm, Augsburg, München nach Salzburg (Österreich). Versorgt die Automobil- und Maschinenbau-Cluster von Daimler, Porsche, Bosch und BMW.',
    descriptionEn: 'Southern Germany industrial powerhouse artery connecting Stuttgart, Ulm, Augsburg, Munich and the Alps.',
    totalLengthKm: 505,
    totalTrucksDaily: 25200,
    totalHdeoConsumptionTonnesYear: 10400,
    overallCongestionIndex: 79,
    color: '#10b981', // Emerald
    disruptionRiskRating: 'HIGH',
    estimatedTransitDelayHours: 1.6,
    connectedStates: ['BW', 'BY'],
    keyChokePoints: ['Pforzheim Enztalquerung', 'Stuttgart Degerloch / Flughafen', 'Albaufstieg Aichelberg/Gruibingen', 'München-Süd / Irschenberg Steilstrecke'],
    polyline: [
      [49.0069, 8.4037],  // Karlsruhe
      [48.8900, 8.7000],  // Pforzheim
      [48.7758, 9.1829],  // Stuttgart
      [48.6200, 9.6000],  // Aichelberg / Albaufstieg
      [48.4011, 9.9876],  // Ulm
      [48.3705, 10.8978], // Augsburg
      [48.1351, 11.5820], // München
      [47.8500, 11.9500], // Irschenberg
      [47.8567, 12.1289], // Rosenheim
      [47.8000, 12.9800], // Bad Reichenhall / Salzburg
    ],
    segments: [
      {
        id: 'a8_seg_1',
        name: 'Karlsruhe - Pforzheim - Stuttgart',
        startCity: 'Karlsruhe',
        endCity: 'Stuttgart',
        lengthKm: 78,
        trucksPerDay: 31500,
        truckSharePercent: 26.5,
        congestionIndex: 88,
        avgSpeedKmh: 56,
        hdeoConsumptionLitrePerMonth: 95000,
        status: 'DISRUPTED',
        activeDisruptions: ['Enztalquerung Pforzheim Dauerbaustelle', 'Leonberger Dreieck Stau'],
        delayMinutes: 42,
      },
      {
        id: 'a8_seg_2',
        name: 'Stuttgart - Aichelberg (Albaufstieg) - Ulm',
        startCity: 'Stuttgart',
        endCity: 'Ulm',
        lengthKm: 88,
        trucksPerDay: 28400,
        truckSharePercent: 24.8,
        congestionIndex: 82,
        avgSpeedKmh: 65,
        hdeoConsumptionLitrePerMonth: 104000,
        status: 'CONGESTED',
        activeDisruptions: ['Neubau Albaufstieg Aichelberg-Gruibingen', 'Lkw-Überholverbot Steigung'],
        delayMinutes: 26,
      },
      {
        id: 'a8_seg_3',
        name: 'Ulm - Augsburg - München',
        startCity: 'Ulm',
        endCity: 'München',
        lengthKm: 148,
        trucksPerDay: 25600,
        truckSharePercent: 22.0,
        congestionIndex: 69,
        avgSpeedKmh: 78,
        hdeoConsumptionLitrePerMonth: 152000,
        status: 'MODERATE',
        activeDisruptions: ['Eschenrieder Spange Baustelle'],
        delayMinutes: 16,
      },
      {
        id: 'a8_seg_4',
        name: 'München - Irschenberg - Salzburg',
        startCity: 'München',
        endCity: 'Salzburg',
        lengthKm: 128,
        trucksPerDay: 21800,
        truckSharePercent: 20.4,
        congestionIndex: 74,
        avgSpeedKmh: 72,
        hdeoConsumptionLitrePerMonth: 122000,
        status: 'MODERATE',
        activeDisruptions: ['Irschenberg Steigungsstau', 'Grenzkontrollen Walserberg'],
        delayMinutes: 24,
      },
    ],
  },
  {
    id: 'a9_berlin_munich',
    code: 'A9',
    name: 'A9 (Berlin-Leipzig-Nürnberg-München Achse)',
    descriptionDe: 'Direkte Schnellverbindung zwischen der Bundeshauptstadt Berlin, dem mitteldeutschen Chemierevier (Leuna/Bitterfeld), der Technologieregion Nürnberg und der Metropole München.',
    descriptionEn: 'Core North-East to South spine linking Berlin, Central German Chemical Triangle, Nuremberg, and Munich.',
    totalLengthKm: 530,
    totalTrucksDaily: 27400,
    totalHdeoConsumptionTonnesYear: 11200,
    overallCongestionIndex: 72,
    color: '#ec4899', // Pink
    disruptionRiskRating: 'MEDIUM',
    estimatedTransitDelayHours: 1.3,
    connectedStates: ['BB', 'ST', 'SN', 'TH', 'BY'],
    keyChokePoints: ['Schkeuditzer Kreuz (Leipzig/Halle)', 'Hermsdorfer Kreuz', 'Frankenwald-Gefälle', 'Kreuz Nürnberg-Ost', 'Dreieck Holledau', 'München-Nord (Allianz Arena)'],
    polyline: [
      [52.3200, 12.9800], // Dreieck Potsdam (A10)
      [51.9800, 12.5500], // Dessau / Coswig
      [51.4500, 12.2000], // Leipzig / Halle (Schkeuditzer Kreuz)
      [50.8900, 11.8500], // Hermsdorfer Kreuz
      [50.3200, 11.7800], // Hof / Frankenwald
      [49.9500, 11.5800], // Bayreuth
      [49.4521, 11.0767], // Nürnberg
      [48.7656, 11.4237], // Ingolstadt (Audi HQ)
      [48.5500, 11.6000], // Dreieck Holledau
      [48.1351, 11.5820], // München-Nord
    ],
    segments: [
      {
        id: 'a9_seg_1',
        name: 'Potsdam - Dessau - Schkeuditzer Kreuz (Leipzig)',
        startCity: 'Potsdam',
        endCity: 'Leipzig',
        lengthKm: 132,
        trucksPerDay: 26800,
        truckSharePercent: 24.5,
        congestionIndex: 64,
        avgSpeedKmh: 80,
        hdeoConsumptionLitrePerMonth: 142000,
        status: 'CLEAR',
        activeDisruptions: ['Elbebrücke Vockerode Sanierung'],
        delayMinutes: 12,
      },
      {
        id: 'a9_seg_2',
        name: 'Leipzig - Hermsdorf - Hof (Frankenwald)',
        startCity: 'Leipzig',
        endCity: 'Hof',
        lengthKm: 146,
        trucksPerDay: 29400,
        truckSharePercent: 27.2,
        congestionIndex: 75,
        avgSpeedKmh: 72,
        hdeoConsumptionLitrePerMonth: 175000,
        status: 'MODERATE',
        activeDisruptions: ['Hermsdorfer Kreuz 8-streifiger Umbau', 'Frankenwald Gefällestrecke'],
        delayMinutes: 22,
      },
      {
        id: 'a9_seg_3',
        name: 'Hof - Bayreuth - Nürnberg',
        startCity: 'Hof',
        endCity: 'Nürnberg',
        lengthKm: 110,
        trucksPerDay: 28200,
        truckSharePercent: 26.0,
        congestionIndex: 70,
        avgSpeedKmh: 76,
        hdeoConsumptionLitrePerMonth: 138000,
        status: 'CLEAR',
        activeDisruptions: ['Hirschaid Fahrbahnerneuerung'],
        delayMinutes: 14,
      },
      {
        id: 'a9_seg_4',
        name: 'Nürnberg - Ingolstadt - München',
        startCity: 'Nürnberg',
        endCity: 'München',
        lengthKm: 142,
        trucksPerDay: 32500,
        truckSharePercent: 28.5,
        congestionIndex: 84,
        avgSpeedKmh: 64,
        hdeoConsumptionLitrePerMonth: 188000,
        status: 'CONGESTED',
        activeDisruptions: ['Dreieck Holledau Stau', 'München-Nord Kreuz Allianz Arena Zulauf'],
        delayMinutes: 34,
      },
    ],
  },
];

export const WATERWAY_CORRIDORS: WaterwayCorridor[] = [
  {
    id: 'rhine_waterway',
    name: 'Rhein-Wasserstraße (TEN-T Rhine-Alpine Corridor)',
    river: 'Rhein',
    descriptionDe: 'Wichtigste Binnenwasserstraße Europas für Massengüter, Grundöle (Base Oils Gr. I-III) und Schmierstoff-Fertigprodukte von ARA-Häfen (Rotterdam/Antwerpen) ins Rhein-Ruhr-Gebiet, Ludwigshafen (BASF), Mannheim (Fuchs) und Karlsruhe (MiRO).',
    descriptionEn: 'Europe\'s most critical inland waterway for base oils and bulk lubricants from ARA ports to Rhine-Ruhr, BASF Ludwigshafen, Fuchs Mannheim, and MiRO Karlsruhe.',
    totalLengthKm: 865,
    annualCargoMillionTonnes: 185.4,
    bulkBaseOilSharePercent: 14.5,
    marineLubeBunkeringTonnesYear: 12400,
    status: 'RESTRICTED_DRAFT',
    modalShiftToRoadRailTonnesMonth: 42000,
    polyline: [
      [51.8600, 6.1600],  // Emmerich (km 852)
      [51.4500, 6.7500],  // Duisburg-Ruhrort (km 780)
      [51.2200, 6.7700],  // Düsseldorf (km 744)
      [50.9400, 6.9600],  // Köln (km 688)
      [50.3600, 7.6000],  // Koblenz (km 592)
      [50.0864, 7.7628],  // Kaub / Mittelrhein (km 546 - Flaschenhals)
      [50.0000, 8.2700],  // Mainz / Wiesbaden (km 498)
      [49.4875, 8.4660],  // Mannheim / Ludwigshafen (km 425)
      [49.0300, 8.3500],  // Karlsruhe / MiRO (km 360)
      [48.5800, 7.7500],  // Kehl / Straßburg (km 293)
      [47.5600, 7.5900],  // Basel Rheinhafen (km 170)
    ],
    gaugeStations: [
      {
        id: 'pegel_kaub',
        name: 'Pegel Kaub (Mittelrhein km 546)',
        river: 'Rhein',
        locationKm: 546.0,
        lat: 50.0864,
        lng: 7.7628,
        currentLevelCm: 118,
        meanLevelCm: 215,
        criticalLowThresholdCm: 140,
        criticalHighThresholdCm: 640,
        bargeMaxLoadPercent: 42,
        lowWaterSurchargeActive: true,
        lowWaterSurchargeEurPerTonne: 28.50,
        trend: 'FALLING',
        status: 'LOW_WATER_ALERT',
        supplyDisruptionRisk: 'CRITICAL',
        lastUpdated: '2026-09-03 21:00 CEST',
      },
      {
        id: 'pegel_duisburg_ruhrort',
        name: 'Pegel Duisburg-Ruhrort (km 780)',
        river: 'Rhein',
        locationKm: 780.0,
        lat: 51.4530,
        lng: 6.7320,
        currentLevelCm: 245,
        meanLevelCm: 380,
        criticalLowThresholdCm: 200,
        criticalHighThresholdCm: 900,
        bargeMaxLoadPercent: 68,
        lowWaterSurchargeActive: false,
        lowWaterSurchargeEurPerTonne: 0,
        trend: 'STABLE',
        status: 'NORMAL',
        supplyDisruptionRisk: 'MEDIUM',
        lastUpdated: '2026-09-03 21:00 CEST',
      },
      {
        id: 'pegel_mannheim',
        name: 'Pegel Mannheim (km 425)',
        river: 'Rhein',
        locationKm: 425.0,
        lat: 49.4890,
        lng: 8.4480,
        currentLevelCm: 195,
        meanLevelCm: 310,
        criticalLowThresholdCm: 160,
        criticalHighThresholdCm: 750,
        bargeMaxLoadPercent: 55,
        lowWaterSurchargeActive: true,
        lowWaterSurchargeEurPerTonne: 16.00,
        trend: 'FALLING',
        status: 'LOW_WATER_ALERT',
        supplyDisruptionRisk: 'HIGH',
        lastUpdated: '2026-09-03 21:00 CEST',
      },
      {
        id: 'pegel_karlsruhe_maxau',
        name: 'Pegel Maxau / Karlsruhe (km 362)',
        river: 'Rhein',
        locationKm: 362.3,
        lat: 49.0350,
        lng: 8.3100,
        currentLevelCm: 430,
        meanLevelCm: 510,
        criticalLowThresholdCm: 350,
        criticalHighThresholdCm: 780,
        bargeMaxLoadPercent: 62,
        lowWaterSurchargeActive: false,
        lowWaterSurchargeEurPerTonne: 0,
        trend: 'STABLE',
        status: 'NORMAL',
        supplyDisruptionRisk: 'LOW',
        lastUpdated: '2026-09-03 21:00 CEST',
      },
    ],
  },
  {
    id: 'elbe_waterway',
    name: 'Elbe-Wasserstraße (Mittelelbe & Unterelbe)',
    river: 'Elbe',
    descriptionDe: 'Verbindet die tschechischen Industriezentren, Dresden, Magdeburg mit dem Welthafen Hamburg. Häufig von Niedrigwasserperioden im sächsischen und sachsen-anhaltinischen Abschnitt betroffen.',
    descriptionEn: 'Connects Czech manufacturing, Saxony, Saxony-Anhalt chemical clusters with Port of Hamburg. Vulnerable to summer/autumn low water levels.',
    totalLengthKm: 727,
    annualCargoMillionTonnes: 18.2,
    bulkBaseOilSharePercent: 8.2,
    marineLubeBunkeringTonnesYear: 18500,
    status: 'SEVERELY_CONSTRAINED',
    modalShiftToRoadRailTonnesMonth: 18500,
    polyline: [
      [50.8800, 14.1500], // Schöna / Grenze CZ
      [51.0504, 13.7373], // Dresden
      [51.3000, 13.3000], // Riesa
      [51.8800, 12.6500], // Lutherstadt Wittenberg
      [52.1205, 11.6276], // Magdeburg Strombrücke
      [53.0000, 11.3500], // Wittenberge
      [53.5511, 9.9937],  // Hamburg Hafen (Unterelbe)
      [53.8600, 8.7000],  // Cuxhaven / Elbmündung
    ],
    gaugeStations: [
      {
        id: 'pegel_magdeburg',
        name: 'Pegel Magdeburg-Strombrücke (km 325)',
        river: 'Elbe',
        locationKm: 325.5,
        lat: 52.1250,
        lng: 11.6420,
        currentLevelCm: 88,
        meanLevelCm: 180,
        criticalLowThresholdCm: 100,
        criticalHighThresholdCm: 500,
        bargeMaxLoadPercent: 28,
        lowWaterSurchargeActive: true,
        lowWaterSurchargeEurPerTonne: 34.00,
        trend: 'FALLING',
        status: 'SEVERELY_RESTRICTED',
        supplyDisruptionRisk: 'CRITICAL',
        lastUpdated: '2026-09-03 21:00 CEST',
      },
      {
        id: 'pegel_dresden',
        name: 'Pegel Dresden (km 55)',
        river: 'Elbe',
        locationKm: 55.6,
        lat: 51.0540,
        lng: 13.7380,
        currentLevelCm: 76,
        meanLevelCm: 155,
        criticalLowThresholdCm: 90,
        criticalHighThresholdCm: 450,
        bargeMaxLoadPercent: 20,
        lowWaterSurchargeActive: true,
        lowWaterSurchargeEurPerTonne: 42.00,
        trend: 'FALLING',
        status: 'SEVERELY_RESTRICTED',
        supplyDisruptionRisk: 'CRITICAL',
        lastUpdated: '2026-09-03 21:00 CEST',
      },
      {
        id: 'pegel_hamburg_st_pauli',
        name: 'Pegel Hamburg St. Pauli (Unterelbe)',
        river: 'Elbe',
        locationKm: 620.0,
        lat: 53.5450,
        lng: 9.9670,
        currentLevelCm: 540, // Tideunabhängig tlw.
        meanLevelCm: 520,
        criticalLowThresholdCm: 400,
        criticalHighThresholdCm: 730,
        bargeMaxLoadPercent: 100,
        lowWaterSurchargeActive: false,
        lowWaterSurchargeEurPerTonne: 0,
        trend: 'STABLE',
        status: 'NORMAL',
        supplyDisruptionRisk: 'LOW',
        lastUpdated: '2026-09-03 21:00 CEST',
      },
    ],
  },
  {
    id: 'danube_waterway',
    name: 'Donau-Wasserstraße (TEN-T Rhine-Danube Corridor)',
    river: 'Donau',
    descriptionDe: 'Verbindet Bayern (Kelheim/Regensburg/Passau) über Österreich, Ungarn, Serbien, Rumänien mit dem Schwarzen Meer. Wichtige Trasse für Agrarexporte und Raffinerie-Tankschiffe der Bayernoil Neustadt und Gunvor Ingolstadt.',
    descriptionEn: 'Connects Bavaria through Austria and the Balkans to the Black Sea. Crucial for Bavarian refinery products, base oils, and agricultural bulk transport.',
    totalLengthKm: 212, // German navigable part (Kelheim - Jochenstein)
    annualCargoMillionTonnes: 7.6,
    bulkBaseOilSharePercent: 11.2,
    marineLubeBunkeringTonnesYear: 4200,
    status: 'NAVIGABLE',
    modalShiftToRoadRailTonnesMonth: 8200,
    polyline: [
      [48.9100, 11.8700], // Kelheim (Main-Donau-Kanal Einmündung)
      [49.0134, 12.1016], // Regensburg
      [48.8800, 12.5700], // Straubing (Flaschenhals Donauausbau)
      [48.7800, 12.9500], // Deggendorf
      [48.5667, 13.4319], // Passau Dreiflüssestadt
      [48.5100, 13.7000], // Jochenstein Kraftwerk (Grenze AT)
    ],
    gaugeStations: [
      {
        id: 'pegel_hofkirchen_straubing',
        name: 'Pegel Hofkirchen / Straubing-Vilshofen (km 2256)',
        river: 'Donau',
        locationKm: 2256.0,
        lat: 48.6800,
        lng: 13.1200,
        currentLevelCm: 210,
        meanLevelCm: 290,
        criticalLowThresholdCm: 230,
        criticalHighThresholdCm: 600,
        bargeMaxLoadPercent: 58,
        lowWaterSurchargeActive: true,
        lowWaterSurchargeEurPerTonne: 14.50,
        trend: 'STABLE',
        status: 'LOW_WATER_ALERT',
        supplyDisruptionRisk: 'MEDIUM',
        lastUpdated: '2026-09-03 21:00 CEST',
      },
      {
        id: 'pegel_regensburg_schwabelweis',
        name: 'Pegel Regensburg Schwabelweis (km 2376)',
        river: 'Donau',
        locationKm: 2376.0,
        lat: 49.0220,
        lng: 12.1480,
        currentLevelCm: 285,
        meanLevelCm: 340,
        criticalLowThresholdCm: 240,
        criticalHighThresholdCm: 550,
        bargeMaxLoadPercent: 75,
        lowWaterSurchargeActive: false,
        lowWaterSurchargeEurPerTonne: 0,
        trend: 'RISING',
        status: 'NORMAL',
        supplyDisruptionRisk: 'LOW',
        lastUpdated: '2026-09-03 21:00 CEST',
      },
    ],
  },
];

export const PORT_TERMINALS_DATA: PortTerminalThroughput[] = [
  {
    id: 'port_hamburg',
    name: 'Hafen Hamburg (HHLA & Eurogate)',
    city: 'Hamburg',
    type: 'MARITIME_SEAPORT',
    lat: 53.5350,
    lng: 9.9600,
    annualTeuMillion: 7.75,
    annualCargoMillionTonnes: 114.2,
    growthRatePercent: 1.8,
    commercialVesselCallsYear: 14100,
    avgVesselTurnaroundHours: 32.5,
    marineCylinderOilDemandTonnesYear: 18500,
    marineSystemOilDemandTonnesYear: 9200,
    bunkeringTerminalsCount: 6,
    congestionIndex: 64,
    status: 'OPTIMAL',
    keyCommodities: ['Container', 'Chemische Erzeugnisse', 'Mineralölprodukte', 'Projektladung & Turbinen'],
    connectedWaterways: ['Unterelbe', 'Nord-Ostsee-Kanal (NOK)', 'Elbe-Seitenkanal'],
    bunkerSuppliers: ['Shell Marine', 'TotalEnergies Lubmarine', 'Castrol Marine', 'Hoyer Marine Bunkering', 'Bomin Bunker'],
  },
  {
    id: 'port_bremen_bremerhaven',
    name: 'Bremen / Bremerhaven (BLG & Eurogate)',
    city: 'Bremerhaven / Bremen',
    type: 'MARITIME_SEAPORT',
    lat: 53.5500,
    lng: 8.5600,
    annualTeuMillion: 4.62,
    annualCargoMillionTonnes: 62.8,
    growthRatePercent: -0.4,
    commercialVesselCallsYear: 6800,
    avgVesselTurnaroundHours: 26.0,
    marineCylinderOilDemandTonnesYear: 8400,
    marineSystemOilDemandTonnesYear: 4100,
    bunkeringTerminalsCount: 4,
    congestionIndex: 52,
    status: 'OPTIMAL',
    keyCommodities: ['Automobil Ro-Ro Export (1.7M Pkw/J)', 'Kühlcontainer (Reefer)', 'Offshore-Windkomponenten'],
    connectedWaterways: ['Unterweser', 'Mittelweser', 'Küstenkanal'],
    bunkerSuppliers: ['ExxonMobil Marine', 'Hoyer Marine', 'BMT Bunkers'],
  },
  {
    id: 'port_wilhelmshaven',
    name: 'JadeWeserPort Wilhelmshaven',
    city: 'Wilhelmshaven',
    type: 'MARITIME_SEAPORT',
    lat: 53.5900,
    lng: 8.1400,
    annualTeuMillion: 1.15,
    annualCargoMillionTonnes: 32.4,
    growthRatePercent: 12.5, // Strongest growth due to 18m deepwater draught
    commercialVesselCallsYear: 2100,
    avgVesselTurnaroundHours: 22.0,
    marineCylinderOilDemandTonnesYear: 5800,
    marineSystemOilDemandTonnesYear: 2900,
    bunkeringTerminalsCount: 2,
    congestionIndex: 38,
    status: 'OPTIMAL',
    keyCommodities: ['Ultra Large Container Vessels (ULCV 24.000 TEU)', 'Rohöl & Chemikalien Import', 'LNG Terminal'],
    connectedWaterways: ['Nordsee Tiefwasser Jade', 'Ems-Jade-Kanal'],
    bunkerSuppliers: ['Wilhelmshaven Tanklager (WTG)', 'Shell Marine'],
  },
  {
    id: 'port_rostock',
    name: 'Seehafen Rostock (Ostsee Hub)',
    city: 'Rostock',
    type: 'MARITIME_SEAPORT',
    lat: 54.1450,
    lng: 12.1100,
    annualTeuMillion: 0.45,
    annualCargoMillionTonnes: 28.5,
    growthRatePercent: 3.2,
    commercialVesselCallsYear: 7400,
    avgVesselTurnaroundHours: 14.5,
    marineCylinderOilDemandTonnesYear: 4600,
    marineSystemOilDemandTonnesYear: 2100,
    bunkeringTerminalsCount: 3,
    congestionIndex: 42,
    status: 'OPTIMAL',
    keyCommodities: ['Fähr- und Ro-Ro Verkehr nach Skandinavien/Baltikum', 'Agrar-Getreide', 'Dünger & Biokraftstoffe'],
    connectedWaterways: ['Ostsee', 'Warnow'],
    bunkerSuppliers: ['Rostock Bunkering Services', 'TotalEnergies Marine'],
  },
  {
    id: 'port_duisburg_duisport',
    name: 'Duisport (Größter Binnenhafen der Welt)',
    city: 'Duisburg',
    type: 'INLAND_TRIMODAL_PORT',
    lat: 51.4420,
    lng: 6.7450,
    annualTeuMillion: 4.25, // Inland intermodal TEU
    annualCargoMillionTonnes: 58.6,
    growthRatePercent: 2.1,
    commercialVesselCallsYear: 18500, // Inland barges
    avgVesselTurnaroundHours: 18.0,
    marineCylinderOilDemandTonnesYear: 9200,
    marineSystemOilDemandTonnesYear: 5400,
    bunkeringTerminalsCount: 5,
    congestionIndex: 68,
    status: 'MODERATE_DELAY',
    keyCommodities: ['Schmierstoff- & Grundöllagerung (Vopak/Bomin)', 'China-Europe Rail Freight', 'Stahl & Chemie'],
    connectedWaterways: ['Rhein', 'Ruhr', 'Rhein-Herne-Kanal', 'Wesel-Datteln-Kanal'],
    bunkerSuppliers: ['Vopak E.T.S. Duisburg', 'Fuchs Petrolub B2B', 'Hoyer Duisburg', 'VTG Tank Logistics'],
  },
];

export const LOGISTICS_DISRUPTIONS: LogisticsDisruptionAlert[] = [
  {
    id: 'alert_kaub_low_water',
    titleDe: 'Niedrigwasser-Alarm Pegel Kaub (118 cm): KWZ-Zuschlag & Frachtverlagerung',
    titleEn: 'Low Water Alert at Gauge Kaub (118 cm): KWZ Surcharge & Modal Shift',
    type: 'RIVER_LOW_WATER_DROUGHT',
    severity: 'CRITICAL',
    corridor: 'Rhein-Wasserstraße (Mittelrhein km 546)',
    lat: 50.0867,
    lng: 7.7628,
    affectedRegions: ['RP', 'BW', 'HE', 'BY'],
    affectedLubeProducts: ['Base Oil Group I / II / III (Bulk)', 'Marine Cylinder Oil 40 BN', 'Heavy Industrial Fluids'],
    impactDescriptionDe: 'Rheinschiffe können bei Kaub nur zu ca. 42% beladen werden. Kleinwasserzuschlag (KWZ) von +28,50 €/t treibt Frachtkosten in die Höhe. Rund 42.000 t/Monat müssen auf Tankwagen und Kesselwagen verlagert werden.',
    impactDescriptionEn: 'Barges at Kaub restricted to 42% loading draft. Low water surcharge of +€28.50/t active. ~42,000 t/month shifted to road/rail tank logistics, raising spot freight rates.',
    mitigationRecommendationDe: 'Sofortige Aktivierung von Pufferlagern in Mannheim, Karlsruhe und Duisport; Verlagerung von Grundöllieferungen auf Ganzzug-Kesselwagen über Rheintalstrecke.',
    mitigationRecommendationEn: 'Activate buffer storage in Mannheim and Duisport; switch bulk base oil transports to unit train tank cars.',
    estimatedDelayDays: 3.5,
    freightCostSurchargePercent: 18.5,
  },
  {
    id: 'alert_leverkusen_a1_bridge',
    titleDe: 'Schwerlast-Engpass A1 Rheinbrücke Leverkusen & Lüdenscheid',
    titleEn: 'Heavy Freight Choke Point A1 Leverkusen Bridge & Lüdenscheid Bypass',
    type: 'AUTOBAHN_BRIDGE_CLOSURE',
    severity: 'HIGH',
    corridor: 'Autobahn A1 (Köln/Leverkusen / Sauerland)',
    lat: 51.0345,
    lng: 6.9856,
    affectedRegions: ['NW', 'HE', 'RP'],
    affectedLubeProducts: ['HDEO Fleet 10W-40', 'PCMO OEM 5W-30', 'Metalworking MWF Fluids'],
    impactDescriptionDe: 'Dauerbaustellen und Gewichtsbeschränkungen an der Leverkusener Rheinbrücke sowie Umleitungsverkehre im Sauerland führen zu durchschnittlich 52 Min. Transitverzögerung je Lkw-Tour.',
    impactDescriptionEn: 'Weight restrictions and ongoing construction at Leverkusen Bridge cause avg. 52 min freight delay per delivery tour.',
    mitigationRecommendationDe: 'Routenverlagerung über A3/A4 südlich von Köln oder Ausweichumfahrung über A45/A44; nächtliche Belieferungsfenster für Großhändler nutzen.',
    mitigationRecommendationEn: 'Reroute via A3/A4 or utilize night dispatch windows for wholesale deliveries.',
    estimatedDelayDays: 1.0,
    freightCostSurchargePercent: 6.2,
  },
  {
    id: 'alert_magdeburg_elbe_drought',
    titleDe: 'Schifffahrtsstillstand Mittelelbe Pegel Magdeburg (88 cm)',
    titleEn: 'Navigation Stoppage Middle Elbe Gauge Magdeburg (88 cm)',
    type: 'RIVER_LOW_WATER_DROUGHT',
    severity: 'HIGH',
    corridor: 'Elbe-Wasserstraße (Mittelelbe km 325)',
    lat: 52.1264,
    lng: 11.6441,
    affectedRegions: ['ST', 'SN', 'BB', 'HH'],
    affectedLubeProducts: ['Industrial Gear Oils CLP 220', 'Hydraulic HLP 46', 'Base Oil Group I'],
    impactDescriptionDe: 'Pegelstand Magdeburg Strombrücke unter 90 cm. Wirtschaftliche Binnenschifffahrt eingestellt. Vollständige Verlagerung der Chemietransporte auf Schiene und A2.',
    impactDescriptionEn: 'Gauge level below 90 cm halts commercial freight. Full chemical/lube freight diverted to rail and A2 highway.',
    mitigationRecommendationDe: 'Direktbelieferung ostdeutscher Maschinenbau-Cluster über Mitteldeutsche Tanklager Leipzig und Schwarzheide.',
    mitigationRecommendationEn: 'Supply East German industrial clusters directly from regional tank farms in Leipzig and Schwarzheide.',
    estimatedDelayDays: 2.5,
    freightCostSurchargePercent: 12.0,
  },
];

export function computeRefinedDemand(
  baselineHdeoTonnes: number,
  baselineMarineTonnes: number,
  trafficDensityFactor: number = 1.05, // e.g. +5% truck intensity surge
  waterwayConstraintFactor: number = 0.92, // e.g. -8% inland marine due to low water
  portThroughputFactor: number = 1.03 // e.g. +3% container port activity
): RefinedDemandForecast {
  // Modal shift: Low water shifts ~5.2% of water freight to heavy diesel trucks => HDEO demand surges
  const roadModalShiftImpact = baselineHdeoTonnes * 0.042;
  const refinedHdeo = Math.round((baselineHdeoTonnes * trafficDensityFactor) + roadModalShiftImpact);
  const hdeoDelta = Math.round(((refinedHdeo - baselineHdeoTonnes) / baselineHdeoTonnes) * 1000) / 10;

  // Marine demand impact: Seaport growth balances inland river drought restrictions
  const inlandConstraintImpact = baselineMarineTonnes * (1 - waterwayConstraintFactor) * 0.45;
  const portSurgeImpact = baselineMarineTonnes * (portThroughputFactor - 1) * 0.55;
  const refinedMarine = Math.round(baselineMarineTonnes - inlandConstraintImpact + portSurgeImpact);
  const marineDelta = Math.round(((refinedMarine - baselineMarineTonnes) / baselineMarineTonnes) * 1000) / 10;

  return {
    baselineHdeoTonnesYear: baselineHdeoTonnes,
    refinedHdeoTonnesYear: refinedHdeo,
    hdeoDeltaPercent: hdeoDelta,
    baselineMarineTonnesYear: baselineMarineTonnes,
    refinedMarineTonnesYear: refinedMarine,
    marineDeltaPercent: marineDelta,
    roadModalShiftImpactTonnes: Math.round(roadModalShiftImpact),
    riverDraughtConstraintImpactTonnes: Math.round(inlandConstraintImpact),
    portThroughputImpactTonnes: Math.round(portSurgeImpact),
    criticalChokePointCount: 14,
  };
}
