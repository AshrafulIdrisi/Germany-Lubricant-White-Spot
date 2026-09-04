import React, { useState } from 'react';
import { Language, MetricUnit } from '../types';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ShieldCheck, 
  Building2, 
  Flame, 
  FileText, 
  ArrowRight,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface AiStrategyAdvisorProps {
  lang: Language;
  unit: MetricUnit;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiStrategyAdvisor: React.FC<AiStrategyAdvisorProps> = ({
  lang,
  unit,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: lang === 'de'
        ? 'Willkommen beim KI-Markt-Strategen für Schmierstoffe in Deutschland. Wie kann ich Sie bei Tender-Freigaben, Channel-Partner-Strategien (BayWa, Hoyer, RWZ) oder DIN/OEM-Spezifikationen unterstützen?'
        : 'Welcome to the AI Lubricant Market Strategist for Germany. How can I assist you with tender approvals, channel partner expansion (BayWa, Hoyer, RWZ), or DIN/OEM fluid specifications?',
      timestamp: '09:00',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    {
      labelDe: 'Maschinenbau BaWü ohne Fuchs-Konflikt',
      labelEn: 'BaWü Tooling without Fuchs conflict',
      query: 'Wie penetrieren wir den Maschinenbau-Korridor Baden-Württemberg (Stuttgart/Esslingen), ohne in direkten Exklusivitätskonflikt mit Fuchs zu geraten?',
    },
    {
      labelDe: 'Euro VI-e Flottentender (A7 Korridor)',
      labelEn: 'Euro VI-e Fleet Tender (A7 Corridor)',
      query: 'Welche Spezifikationen und Liefergarantien werden für einen Lkw-Flottentender (Euro VI-e, MB 228.51, MAN M 3677) entlang der A7 gefordert?',
    },
    {
      labelDe: 'Pitch-Strategie für BayWa (Bio-Hydraulik)',
      labelEn: 'BayWa Pitch Strategy (Bio-Hydraulics)',
      query: 'Welche Argumente und Zertifikate (Blauer Engel RAL-UZ 178, OECD 301B) überzeugen den Einkauf bei BayWa und RWZ für Bio-Hydrauliköle?',
    },
    {
      labelDe: 'Offshore-Wind PAO Getriebeöle (Nordsee)',
      labelEn: 'Offshore Wind PAO Gear Oils (North Sea)',
      query: 'Welche Anforderungen (Siemens Gamesa, Vestas, ISO VG 320 PAO) gelten für Offshore-Windparks im Raum Helgoland/Borkum und wie optimiert man den Ölwechsel-Zyklus?',
    },
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = '';
      const q = query.toLowerCase();

      if (q.includes('fuchs') || q.includes('maschinenbau') || q.includes('bawü') || q.includes('stuttgart')) {
        aiResponse = `**Strategie für den Maschinenbau-Korridor Baden-Württemberg (Fokus: Nischen & Hochleistungs-Fluide):**\n\n` +
          `1. **Direkter Wettbewerb vermeiden:** Fuchs dominiert standardisierte Emulsionen über Rahmenverträge mit Trumpf, DMG MORI und Schuler. Fokussieren Sie stattdessen auf:\n` +
          `   - *Minimalmengenschmierung (MMS) auf Esterbasis* mit extrem niedrigem Verdampfungsverlust (DIN 51385-L-MMS).\n` +
          `   - *Zink- und aschefreie Hydrauliköle (HVLP-D ISO VG 46)* mit erhöhtem Schmutztragevermögen für Präzisionsspindeln.\n` +
          `2. **Route-to-Market:** Kooperation mit technischen Großhändlern wie *Klocke & Lingemann* oder *Haberkorn*, die keinen exklusiven Fuchs-Konzernvertrag haben.\n` +
          `3. **Service-Hebel:** Bereitstellung von mobilem Fluid-Monitoring (Sensoren für Partikelzählung ISO 4406 & Wassergehalt ppm).`;
      } else if (q.includes('euro vi') || q.includes('flotte') || q.includes('hdeo') || q.includes('a7') || q.includes('man') || q.includes('mb 228')) {
        aiResponse = `**Tender-Anforderungen für schwere Nutzfahrzeug-Flotten (Euro VI-e Transit):**\n\n` +
          `1. **Pflicht-Spezifikationen:**\n` +
          `   - MB-Freigabe 228.51 / 228.52 (Low-SAPS zum Schutz der DPF- und SCR-Katalysatoren).\n` +
          `   - MAN M 3677 (Extended Drain bis zu 140.000 km) sowie Scania LDF-4 / Volvo VDS-4.5.\n` +
          `2. **Tank- und Logistik-Garantien:**\n` +
          `   - Belieferung binnen 24-48 Stunden über Partner mit hoher Depot-Dichte (z.B. *Hoyer Unternehmensgruppe* oder *AVIA*).\n` +
          `   - Bereitstellung von 1.000 L IBC-Containern mit digitaler Füllstandstelemetrie.\n` +
          `3. **Nachhaltigkeits-Bonus:** HVO100-Verträglichkeitsnachweis und CO₂-neutraler Transportnachweis.`;
      } else if (q.includes('baywa') || q.includes('rwz') || q.includes('bio') || q.includes('blauer engel') || q.includes('agrar')) {
        aiResponse = `**Key-Account Pitch-Leitfaden für Agrar-Genossenschaften (BayWa / RWZ / AGRAVIS):**\n\n` +
          `1. **Die TECTROL / Eigenmarken-Hürde:** BayWa und AGRAVIS vermarkten stark ihre Eigenmarke *TECTROL*. Daher darf Ihr Produkt nicht als Standard-UTTO positioniert werden, sondern als *Spezialität*:\n` +
          `   - *Zertifizierter Blauer Engel (RAL-UZ 178)* mit >90% biologischer Abbaubarkeit (OECD 301B).\n` +
          `   - *Zinkfreie Bio-Hydrauliköle HEES (synthetische Ester)* mit Freigabe für sensible Wasserschutzgebiete.\n` +
          `2. **Kompensationsmodell:** Angebot einer Private-Label-Option oder exklusiver Vertriebsrechte für spezifische Bio-Sortimente in Bayern/Baden-Württemberg.`;
      } else if (q.includes('wind') || q.includes('pao') || q.includes('offshore') || q.includes('nordsee')) {
        aiResponse = `**Offshore-Windpark Schmierstoff-Strategie (Deutsche Bucht / Nordsee):**\n\n` +
          `1. **Kritische Freigaben:**\n` +
          `   - Siemens Gamesa SGRE SMR / Vestas 0055-6677 / Winergy / Flender Zulassung.\n` +
          `   - Vollsynthetische Polyalphaolefin-Grundöle (PAO) ISO VG 320 mit Micropitting-Schutzstufe >10 (FVA 54/7).\n` +
          `2. **Ölwechsel-Zyklen:** Standard-Intervalle von 5 bis 7 Jahren fordern extreme thermo-oxidative Stabilität.\n` +
          `3. **Offshore-Logistik:** Bunkern über Cuxhaven oder Bremerhaven via Offshore-Versorger-Schiffe mit zertifizierten Spül- und Pumpaggregaten.`;
      } else {
        aiResponse = `**Markt-Analyse für Ihre Anfrage:**\n\n` +
          `1. **Spezifikations-Audit:** In Deutschland entscheiden OEM-Zulassungen (z.B. VW 504/507, MB 229.52, DIN 51524-3 HVLP) über ca. 82% der industriellen Kaufentscheidungen.\n` +
          `2. **Distributions-Empfehlung:** Eine Kombination aus direktem Key-Account-Management für Großindustrie und Großhandelsverträgen mit freien Händlern (Hoyer, AVIA, Westfalen) minimiert das Risiko von Channel Conflicts.\n` +
          `3. **Zertifizierungen:** Investieren Sie in DIN EN ISO 9001, IATF 16949 und Blauer Engel RAL-UZ 178 für maximale Wettbewerbsfähigkeit.`;
      }

      const aiMsg: Message = {
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-slate-800">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-purple-200 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <div className="bg-purple-600 p-1.5 rounded-lg text-white shadow-sm shadow-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black text-purple-950 tracking-tight uppercase">
              {lang === 'de'
                ? 'KI MARKT-STRATEGE & TENDER-FREIGABE BERATER'
                : 'AI MARKET STRATEGIST & TENDER ADVISOR'}
            </h2>
          </div>
          <p className="text-[11px] text-purple-700 mt-1 font-mono">
            {lang === 'de'
              ? 'Deep-Domain Assistenz für deutsche OEM-Spezifikationen, Channel-Partner-Strategien und Vertriebs-Playbooks'
              : 'Deep-domain strategic advisor for German OEM approvals, distributor negotiation playbooks, and fluid engineering'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="status-badge bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span>AI ENGINE ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Suggested Strategy Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(p.query)}
            className="p-3.5 bg-white hover:bg-purple-50/60 border border-purple-200 hover:border-purple-400 rounded-xl text-left transition-all space-y-1.5 group cursor-pointer shadow-xs"
          >
            <div className="font-bold font-mono text-[11px] text-purple-950 group-hover:text-purple-700 flex items-center justify-between uppercase">
              <span>{lang === 'de' ? p.labelDe : p.labelEn}</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-700 transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{p.query}</p>
          </button>
        ))}
      </div>

      {/* Main Chat Stream */}
      <div className="bg-white border border-purple-200 rounded-2xl shadow-sm flex flex-col h-[520px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-thin bg-purple-50/20">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-white border border-purple-200 text-purple-700'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed space-y-1.5 ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white border border-purple-200 text-slate-800 shadow-xs'
                }`}
              >
                <div className={`flex items-center justify-between text-[9px] font-mono mb-1 ${
                  msg.sender === 'user' ? 'text-purple-200' : 'text-purple-600'
                }`}>
                  <span className="uppercase font-bold">{msg.sender === 'user' ? 'OPERATOR' : 'LUBEINTEL AI CO-PILOT'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className={`whitespace-pre-line text-xs ${
                  msg.sender === 'user' ? 'text-white' : 'text-slate-800'
                }`}>{msg.text}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-purple-600 font-mono animate-pulse bg-purple-50 p-2 rounded-xl border border-purple-100 max-w-fit">
              <Bot className="w-3.5 h-3.5 text-purple-600" />
              <span>Analysiere deutsche Industrie- und OEM-Spezifikationen...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-white border-t border-purple-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                lang === 'de'
                  ? 'Frage zu OEM-Freigaben, BayWa-Exklusivität, HDEO-Flotten oder DIN-Normen stellen...'
                  : 'Ask about OEM approvals, distributor strategies, fleet tenders, or DIN standards...'
              }
              className="flex-1 bg-purple-50/50 border border-purple-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-purple-400 font-mono focus:outline-none focus:border-purple-600 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold font-mono uppercase rounded-xl text-xs transition-colors flex items-center space-x-1.5 shrink-0 shadow-sm shadow-purple-500/20 cursor-pointer"
            >
              <span>{lang === 'de' ? 'SENDEN' : 'SEND'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
