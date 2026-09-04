import { FluidSectorInfo } from '../types';

export const FLUID_SECTORS: FluidSectorInfo[] = [
  {
    id: 'automotive_pcmo',
    nameDe: 'Automotive OEM & Aftermarket (PCMO/MCO)',
    nameEn: 'Passenger Car Motor Oil & OEM Aftermarket',
    color: '#3b82f6', // blue-500
    iconName: 'Car',
    keySpecs: [
      'ACEA C2/C3/C5/C6',
      'VW 504.00 / 507.00 (LongLife III)',
      'VW 508.00 / 509.00 (0W-20 FE)',
      'MB 229.51 / 229.52 / 229.71',
      'BMW Longlife-04 / Longlife-17 FE+',
      'Porsche C30 / A40 / C20',
      'Opel/Vauxhall OV 040 1547',
    ],
    typicalViscosity: ['0W-20', '0W-30', '5W-30', '5W-40', '0W-16'],
    descriptionDe: 'Hochleistungs-Leichtlaufmotorenöle für moderne Benzin-, Diesel- und Hybridmotoren mit Partikelfilter (GPF/DPF) und strengen Freigaben deutscher Automobilhersteller.',
    descriptionEn: 'High-performance low-SAPS motor oils for modern gasoline, diesel, and hybrid engines with DPF/GPF meeting strict German OEM specifications.',
  },
  {
    id: 'transport_hdeo',
    nameDe: 'Nutzfahrzeuge & Flottenlogistik (HDEO)',
    nameEn: 'Heavy Commercial Transport & Fleet Logistics',
    color: '#f59e0b', // amber-500
    iconName: 'Truck',
    keySpecs: [
      'ACEA E6 / E8 / E9 / E11',
      'MAN M 3677 / M 3777 / M 3477',
      'MB 228.51 / MB 228.52',
      'Volvo VDS-4.5 / VDS-5',
      'Scania LDF-4',
      'DAF Extended Drain',
      'Renault RLD-3',
    ],
    typicalViscosity: ['5W-30', '10W-40', '15W-40', '5W-20'],
    descriptionDe: 'Schwerlast-Motorenöle für Euro VI-e Fernverkehr- und Verteilerflotten entlang der deutschen Autobahnkorridore (A1, A2, A3, A7, A8, A9) mit bis zu 150.000 km Wechselintervallen.',
    descriptionEn: 'Heavy-duty engine oils for Euro VI-e long-haul and regional distribution fleets along German highway corridors with up to 150,000 km drain intervals.',
  },
  {
    id: 'industrial_metalworking',
    nameDe: 'Industrie & Präzisions-Metallbearbeitung (MWF)',
    nameEn: 'Industrial & Precision Metalworking Fluids',
    color: '#10b981', // emerald-500
    iconName: 'Cog',
    keySpecs: [
      'DIN 51524 Teil 2 & 3 (HLP / HVLP Hydrauliköle)',
      'DIN 51517 Teil 3 (CLP / CLP HC Industriegetriebeöle)',
      'Wassermischbare KSS (bor- & biozidfrei)',
      'Synthetische Ester-Spindel- & Bettbahnöle (CGLP)',
      'Minimalmengenschmierung (MMS)',
    ],
    typicalViscosity: ['ISO VG 10', 'ISO VG 32', 'ISO VG 46', 'ISO VG 68', 'ISO VG 220', 'ISO VG 320'],
    descriptionDe: 'Präzisions-Kühlschmierstoffe, Spindelöle und Hydraulikfluids für den deutschen Maschinen- und Anlagenbau (Baden-Württemberg, NRW, Bayern).',
    descriptionEn: 'Precision coolants, slideway oils, and hydraulic fluids tailored for German machine tool manufacturers and precision engineering.',
  },
  {
    id: 'wind_renewable',
    nameDe: 'Erneuerbare Energien & Windkraft',
    nameEn: 'Renewable Energy & Wind Turbine Lubrication',
    color: '#06b6d4', // cyan-500
    iconName: 'Wind',
    keySpecs: [
      'High-Micropitting Gear Oils (ISO VG 320 / 460)',
      'Synthetic PAO & PAG Schmierstoffe',
      'Offshore Korrosionsschutzfette (NLGI 1/2)',
      'Pitch & Yaw Lagerfette (-40°C bis +150°C)',
      'Flender / Siemens Gamesa / Vestas Freigaben',
    ],
    typicalViscosity: ['ISO VG 320', 'ISO VG 460', 'ISO VG 680'],
    descriptionDe: 'Synthetische Hochleistungs-Getriebeöle und Spezialfette mit extremem Graufleckigkeitsschutz für Onshore- und Offshore-Windturbinen in Nord- und Ostsee sowie Mittelgebirgen.',
    descriptionEn: 'Synthetic high-viscosity gear lubricants and specialty greases with extreme micropitting resistance for North Sea/Baltic offshore and inland wind parks.',
  },
  {
    id: 'chemical_process',
    nameDe: 'Chemie- & Prozessindustrie',
    nameEn: 'Chemical & Continuous Process Industry',
    color: '#8b5cf6', // violet-500
    iconName: 'FlaskConical',
    keySpecs: [
      'NSF H1 / HALAL / KOSHER (Lebensmitteltechnik)',
      'Hochtemperatur-Kettenöle (> 250°C)',
      'Synthetische Schrauben- & Kolbenkompressorenöle',
      'Vakuumpumpenöle (PFPE / Fluorierte Fluide)',
      'DIN 51506 VDL / DIN 51503 Kältemaschinenöle',
    ],
    typicalViscosity: ['ISO VG 46', 'ISO VG 100', 'ISO VG 150', 'ISO VG 220'],
    descriptionDe: 'Spezialschmierstoffe für Reaktoren, Kompressoren und Fördersysteme in den Chemieparks Ludwigshafen (BASF), Leverkusen (Chempark), Dormagen und Leuna.',
    descriptionEn: 'Specialty lubricants for reactors, gas compressors, and continuous lines in German chemical mega-hubs (BASF Ludwigshafen, Chempark Rhine-Ruhr, Leuna).',
  },
  {
    id: 'marine_inland',
    nameDe: 'Binnenschifffahrt & Seeschiffahrt (Marine)',
    nameEn: 'Inland Waterways & Seaport Maritime Bunkering',
    color: '#64748b', // slate-500
    iconName: 'Anchor',
    keySpecs: [
      'Trunk Piston Engine Oils (TPEO BN 12-40)',
      'Bio-Hydrauliköle für Schleusen & Ruderanlagen (Vessel General Permit - VGP)',
      'Binnenschiffsmotorenöle (Rheinschifffahrt CCV / CCR II)',
      'Heckrohr- & Stevenrohrschmierstoffe (EAL Bio-Stern Tube)',
    ],
    typicalViscosity: ['SAE 30', 'SAE 40', 'ISO VG 46 EAL', 'ISO VG 68'],
    descriptionDe: 'Bunkerschmierstoffe für Flussfrachter auf Rhein, Elbe, Donau und Mittellandkanal sowie Hochsee-Bunkerdienste an den Häfen Hamburg und Bremen/Bremerhaven.',
    descriptionEn: 'Bunker lubricants for inland river barges (Rhine, Danube, Elbe) and deep-sea bunkering at Ports of Hamburg and Bremen/Bremerhaven.',
  },
  {
    id: 'agri_forestry',
    nameDe: 'Agrartechnik & Forstwirtschaft (Bio-Lube)',
    nameEn: 'Agricultural Machinery & Forestry (Bio-Lubricants)',
    color: '#84cc16', // lime-500
    iconName: 'Tractor',
    keySpecs: [
      'UTTO (Universal Tractor Transmission Oil)',
      'STOU (Super Tractor Oil Universal)',
      'Blauer Engel (RAL-UZ 178) Biologisch abbaubare Hydrauliköle (HEES / HETG)',
      'EU Ecolabel Bio-Sägekettenöle',
      'John Deere JDM J20C / Fendt KDM / Claas Agrar-Specs',
    ],
    typicalViscosity: ['10W-30', '10W-40', '80W', 'ISO VG 46 Bio'],
    descriptionDe: 'Multifunktionale Traktoren- und Getriebeöle sowie zertifizierte Bio-Schmierstoffe für Landwirte, Forstbetriebe und Lohnunternehmer (Vertrieb über BayWa & Raiffeisen).',
    descriptionEn: 'Multifunctional tractor fluids (UTTO/STOU) and certified biodegradable hydraulic oils for agricultural cooperatives, forestry, and contract farming.',
  },
];
