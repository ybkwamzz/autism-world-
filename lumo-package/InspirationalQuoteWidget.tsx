import React, { useState, useEffect } from 'react';
import { 
  Quote, 
  Sparkles, 
  Volume2, 
  RefreshCw, 
  Share2, 
  Heart, 
  Bot, 
  Check,
  MessageCircle
} from 'lucide-react';

interface InspirationalQuoteWidgetProps {
  language: 'en' | 'swa';
  onOpenLumo?: () => void;
}

interface QuoteItem {
  id: number;
  textEn: string;
  textSw: string;
  categoryEn: string;
  categorySw: string;
  authorEn: string;
  authorSw: string;
}

const QUOTES: QuoteItem[] = [
  {
    id: 1,
    textEn: "You are not failing on the hard days. You are learning a unique, beautiful language of love tailored specifically for your child.",
    textSw: "Hushindwi katika siku ngumu. Unajifunza lugha ya kipekee na nzuri ya upendo iliyotengenezwa mahususi kwa ajili ya mtoto wako.",
    categoryEn: "Parent Strength",
    categorySw: "Nguvu ya Mzazi",
    authorEn: "Lumo Parent Encouragement",
    authorSw: "Hatifaqi ya Wazazi kutoka Lumo"
  },
  {
    id: 2,
    textEn: "Progress isn't measured only by milestones, but by the trust, smiles, and connection you build with your child every single day.",
    textSw: "Maendeleo hayapimwi kwa hatua kubwa pekee, bali kwa kuaminiana, tabasamu na uhusiano unaojenga na mtoto wako kila siku.",
    categoryEn: "Celebrating Connection",
    categorySw: "Kusherehekea Uhusiano",
    authorEn: "Autism Unmasked Kenya",
    authorSw: "Usonji Bila Maski Kenya"
  },
  {
    id: 3,
    textEn: "Your child's brain perceives the world in brilliant, vivid colors. Thank you for being their safe harbour in a noisy world.",
    textSw: "Ubongo wa mtoto wako huona ulimwengu kwa rangi za ajabu. Asante kwa kuwa mahali pao salama katika ulimwengu wenye kelele.",
    categoryEn: "Sensory Empathy",
    categorySw: "Huruma ya Hisia",
    authorEn: "Lumo Daily Wisdom",
    authorSw: "Hekima ya Kila Siku ya Lumo"
  },
  {
    id: 4,
    textEn: "Remember to take a deep breath today. Caring for yourself with kindness is an essential part of caring for your child.",
    textSw: "Kumbuka kuvuta pumzi ndefu leo. Kujitunza mwenyewe kwa wema ni sehemu muhimu sana ya kuitunza familia yako.",
    categoryEn: "Self-Care & Grace",
    categorySw: "Kujitunza na Huruma",
    authorEn: "Caregiver Wellness Guide",
    authorSw: "Mwongozo wa Afya ya Mlezi"
  },
  {
    id: 5,
    textEn: "You are your child's greatest advocate. Your patience, dedication, and unconditional love are opening doors for their future.",
    textSw: "Wewe ni mtetezi mkuu wa mtoto wako. Uvumilivu, kujitolea, na upendo wako usio na kikomo vinatengeneza kesho iliyo bora.",
    categoryEn: "Advocacy & Hope",
    categorySw: "Utetezi na Tumaini",
    authorEn: "Kenyan Special Educator Network",
    authorSw: "Mtandao wa Walimu Maalum Kenya"
  },
  {
    id: 6,
    textEn: "Every small win is a victory worth celebrating—a quiet moment, a new gesture, or a calm transition is proof of your hard work.",
    textSw: "Kila mafanikio madogo ni ushindi unaostahili kusherehekea—wakati wa utulivu, ishara mpya, au mabadiliko ya utulivu ni ushahidi wa kazi yako.",
    categoryEn: "Small Victories",
    categorySw: "Ushindi Mdogo",
    authorEn: "Lumo Parent Affirmation",
    authorSw: "Kujenga Moyo Kutoka Lumo"
  },
  {
    id: 7,
    textEn: "You do not have to walk this path alone. A supportive community of Kenyan parents, teachers, and advocates is right beside you.",
    textSw: "Huhitaji kupita safari hii peke yako. Jamii inayosaidia ya wazazi, walimu na watetezi nchini Kenya inatembea pembeni yako.",
    categoryEn: "Community Togetherness",
    categorySw: "Umoja wa Jamii",
    authorEn: "Parent Support Circle",
    authorSw: "Kikundi cha Usaidizi wa Wazazi"
  },
  {
    id: 8,
    textEn: "Different is not broken. Your child's neurodivergent perspective brings unique gifts, deep honesty, and wonder into our world.",
    textSw: "Tofauti haimaanishi kuteseka. Mtazamo wa kipekee wa mtoto wako unaleta zawadi, ukweli, na maajabu katika ulimwengu wetu.",
    categoryEn: "Neurodiversity Pride",
    categorySw: "Fahari ya Usonji",
    authorEn: "Autism Unmasked Vision",
    authorSw: "Dira ya Usonji Bila Maski"
  }
];

export default function InspirationalQuoteWidget({
  language,
  onOpenLumo
}: InspirationalQuoteWidgetProps) {
  // Deterministic daily index based on current date
  const getTodayIndex = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = (hash << 5) - hash + dateStr.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % QUOTES.length;
  };

  const [currentIndex, setCurrentIndex] = useState(getTodayIndex());
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentQuote = QUOTES[currentIndex];

  const handleNextQuote = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % QUOTES.length);
  };

  const handleCopyQuote = () => {
    const textToCopy = language === 'en' 
      ? `"${currentQuote.textEn}" — ${currentQuote.authorEn} (via Autism Unmasked Kenya)`
      : `"${currentQuote.textSw}" — ${currentQuote.authorSw} (pamoja na Usonji Bila Maski Kenya)`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((err) => {
      console.warn("Could not copy text: ", err);
    });
  };

  const handleReadAloud = () => {
    try {
      if ('speechSynthesis' in window && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const textToRead = language === 'en' ? currentQuote.textEn : currentQuote.textSw;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = language === 'en' ? 'en-US' : 'sw-KE';
        utterance.rate = 0.95;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#FFF8EE] via-white to-[#FFF5E5] border-2 border-[#C77700]/20 rounded-[32px] p-6 sm:p-7 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      
      {/* Decorative top-right accent glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C77700]/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header Badge */}
      <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-[#2F6B4F] text-white flex items-center justify-center font-bold shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold text-[#2F6B4F] uppercase tracking-widest block">
                {language === 'en' ? 'Lumo Daily Inspiration' : 'Agano la Kila Siku la Lumo'}
              </span>
              <span className="bg-[#C77700]/15 text-[#C77700] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                {language === 'en' ? 'For Parents' : 'Kwa Wazazi'}
              </span>
            </div>
            <p className="text-[11px] font-bold text-gray-500">
              {language === 'en' ? currentQuote.categoryEn : currentQuote.categorySw}
            </p>
          </div>
        </div>

        {/* Shuffle / Next Quote Button */}
        <button
          onClick={handleNextQuote}
          className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-[#FFF8EE] hover:border-[#C77700]/40 text-gray-600 hover:text-[#C77700] transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold shrink-0"
          title={language === 'en' ? 'Next Inspiration' : 'Hamasa Inayofuata'}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[10px] uppercase font-extrabold tracking-wider">
            {language === 'en' ? 'New Quote' : 'Msemo Mwengine'}
          </span>
        </button>
      </div>

      {/* Quote Body */}
      <div className="relative z-10 my-3">
        <Quote className="w-8 h-8 text-[#C77700]/25 mb-1 -ml-1 inline-block" />
        <p className="text-sm sm:text-base font-serif font-bold text-[#2D3748] leading-relaxed italic pr-2">
          "{language === 'en' ? currentQuote.textEn : currentQuote.textSw}"
        </p>
        <p className="mt-3 text-xs font-extrabold text-[#2F6B4F] flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 fill-[#2F6B4F]" />
          <span>— {language === 'en' ? currentQuote.authorEn : currentQuote.authorSw}</span>
        </p>
      </div>

      {/* Interactive Action Bar */}
      <div className="mt-5 pt-4 border-t border-[#C77700]/15 flex flex-wrap items-center justify-between gap-2 relative z-10">
        
        <div className="flex items-center gap-2">
          {/* Read Aloud Button */}
          <button
            onClick={handleReadAloud}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              isSpeaking 
                ? 'bg-[#C77700] text-white animate-pulse' 
                : 'bg-white border border-gray-200 text-[#2D3748] hover:bg-[#FFF8EE] hover:border-[#C77700]/30'
            }`}
            title={language === 'en' ? 'Listen to encouragement' : 'Sikiliza kwa sauti'}
          >
            <Volume2 className="w-3.5 h-3.5 text-[#C77700]" />
            <span>{isSpeaking ? (language === 'en' ? 'Speaking...' : 'Inasoma...') : (language === 'en' ? 'Listen' : 'Sikiliza')}</span>
          </button>

          {/* Share / Copy Button */}
          <button
            onClick={handleCopyQuote}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-extrabold text-[#2D3748] hover:bg-[#FFF8EE] hover:border-[#C77700]/30 transition-all cursor-pointer"
            title={language === 'en' ? 'Copy quote to share' : 'Nakili kueneza hamasa'}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#2F6B4F]" />
                <span className="text-[#2F6B4F]">{language === 'en' ? 'Copied!' : 'Imenakiliwa!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-gray-500" />
                <span>{language === 'en' ? 'Share' : 'Shiriki'}</span>
              </>
            )}
          </button>
        </div>

        {/* Ask Lumo Button */}
        {onOpenLumo && (
          <button
            onClick={onOpenLumo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2F6B4F]/10 hover:bg-[#2F6B4F]/20 text-[#2F6B4F] text-xs font-extrabold transition-all cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Talk to Lumo' : 'Zungumza na Lumo'}</span>
          </button>
        )}

      </div>

    </div>
  );
}
