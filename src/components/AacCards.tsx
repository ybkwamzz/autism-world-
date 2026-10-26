import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Volume2, 
  ArrowLeft, 
  Download, 
  Printer, 
  Eye, 
  Droplets, 
  UtensilsCrossed, 
  HelpCircle, 
  DoorClosed, 
  CheckCircle2, 
  XCircle, 
  Smile, 
  Moon, 
  VolumeX, 
  HeartPulse,
  type LucideIcon 
} from 'lucide-react';

interface AacCardsProps {
  language: 'en' | 'swa';
  onSpeak: (engText: string, swaText: string) => void;
  voiceSpeechAlert: string | null;
  onDownload?: () => void;
}

interface FlashcardItem {
  id: string;
  text: string;
  swaText: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

export default function AacCards({ language, onSpeak, voiceSpeechAlert, onDownload }: AacCardsProps) {
  const location = useLocation();
  const [isPrintFriendly, setIsPrintFriendly] = useState(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('print') === 'true' || location.state?.printMode === true;
  });

  const flashcards: FlashcardItem[] = [
    { id: 'water', text: 'I want water', swaText: 'Nataka maji', icon: Droplets, colorClass: 'text-blue-600', bgClass: 'bg-blue-50 dark:bg-blue-950/30' },
    { id: 'food', text: 'I am hungry', swaText: 'Nina njaa', icon: UtensilsCrossed, colorClass: 'text-orange-600', bgClass: 'bg-orange-50 dark:bg-orange-950/30' },
    { id: 'help', text: 'Help me', swaText: 'Nisaidie', icon: HelpCircle, colorClass: 'text-red-600', bgClass: 'bg-red-50 dark:bg-red-950/30' },
    { id: 'toilet', text: 'Bathroom', swaText: 'Chooni', icon: DoorClosed, colorClass: 'text-amber-600', bgClass: 'bg-amber-50 dark:bg-amber-950/30' },
    { id: 'yes', text: 'Yes please', swaText: 'Ndiyo tafadhali', icon: CheckCircle2, colorClass: 'text-green-600', bgClass: 'bg-green-50 dark:bg-green-950/30' },
    { id: 'no', text: 'No thank you', swaText: 'Hapana asante', icon: XCircle, colorClass: 'text-rose-600', bgClass: 'bg-rose-50 dark:bg-rose-950/30' },
    { id: 'happy', text: 'I am happy', swaText: 'Nina furaha', icon: Smile, colorClass: 'text-yellow-600', bgClass: 'bg-yellow-50 dark:bg-yellow-950/30' },
    { id: 'tired', text: 'I feel tired', swaText: 'Nimechoka', icon: Moon, colorClass: 'text-purple-600', bgClass: 'bg-purple-50 dark:bg-purple-950/30' },
    { id: 'quiet', text: 'Quiet space', swaText: 'Sehemu tulivu', icon: VolumeX, colorClass: 'text-teal-600', bgClass: 'bg-teal-50 dark:bg-teal-950/30' },
    { id: 'sick', text: 'I feel sick', swaText: 'Naumwa', icon: HeartPulse, colorClass: 'text-red-500', bgClass: 'bg-rose-50 dark:bg-rose-950/30' },
  ];

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const speakVal = searchParams.get('speak');
    if (speakVal) {
      let card = null;
      if (speakVal === 'water') card = flashcards[0];
      else if (speakVal === 'food') card = flashcards[1];
      else if (speakVal === 'help') card = flashcards[2];
      else if (speakVal === 'toilet') card = flashcards[3];
      else if (speakVal === 'pain') card = flashcards[9];

      if (card) {
        onSpeak(card.text, card.swaText);
      }
    }
  }, [location.search, onSpeak]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${isPrintFriendly ? 'printable-area bg-white p-4 sm:p-6 text-black border-4 border-black rounded-2xl' : 'bg-white rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 card-h-shadow relative text-[#2D3748]'}`}>
      
      {/* Back to Toolkit Navigation (hidden on print) */}
      <div className="flex items-center justify-between gap-4 mb-6 no-print">
        <Link 
          to="/toolkit" 
          className="p-2 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-full text-gray-600 dark:text-gray-300 transition-colors flex items-center gap-1.5 text-xs font-bold back-to-toolkit-link"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'en' ? 'Back to Toolkit' : 'Rudi Kwenye Zana'}</span>
        </Link>

        {/* Print-friendly Toggle button */}
        <button
          onClick={() => setIsPrintFriendly(!isPrintFriendly)}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
            isPrintFriendly 
              ? 'bg-[#2F6B4F] text-white hover:bg-[#1e4432]' 
              : 'bg-[#C77700]/10 text-[#C77700] hover:bg-[#C77700]/20'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>
            {isPrintFriendly 
              ? (language === 'en' ? 'Standard Interactive View' : 'Rudi Mtazamo Kawaida') 
              : (language === 'en' ? 'Print Friendly View' : 'Mtazamo wa Kuchapa')}
          </span>
        </button>
      </div>

      {/* Print Mode Top Status Alert Bar */}
      {isPrintFriendly && (
        <div className="bg-[#2D3748] text-white p-4 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 no-print animate-pulse border-2 border-[#E89B2E]">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#E89B2E] shrink-0" />
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-wider text-[#E89B2E]">
                {language === 'en' ? 'Eco-Print Preview Active' : 'Ukurasa wa Kuchapa Uko Tayari'}
              </p>
              <p className="text-[10px] text-gray-300">
                {language === 'en' ? 'Optimized in black & white for ink saving. Click Print Below.' : 'Imeboreshwa kwa rangi nyeusi na nyeupe ili kuokoa wino.'}
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="bg-[#2F6B4F] hover:bg-[#1e4432] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 justify-center flex-1 sm:flex-initial"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'en' ? 'Print Now' : 'Chapa Sasa'}</span>
            </button>
            <button
              onClick={() => setIsPrintFriendly(false)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 justify-center flex-1 sm:flex-initial"
            >
              <Eye className="w-4 h-4" />
              <span>{language === 'en' ? 'Close Preview' : 'Funga'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Component Header Information */}
      <div className="mb-6">
        <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-wider block no-print">AAC Soundboard Voice Aids</span>
        <h3 className={`text-2xl sm:text-3xl font-bold font-serif ${isPrintFriendly ? 'text-black' : 'text-[#C77700]'}`}>
          {language === 'en' ? 'Speech Helper Flashcards' : 'Kadi za Sauti za Kujieleza'}
        </h3>
        <p className="text-xs text-gray-500 mt-1 no-print">
          {language === 'en' 
            ? 'Tap any card below. The device will speak the phrase in your selected language to aid non-verbal children.' 
            : 'Gusa kadi yoyote hapa chini. Kifaa kitasoma sentensi kwa sauti kwa lugha uliyochagua ili kusaidya mawasiliano.'}
        </p>
      </div>

      {/* Spoken Alert Feedback Panel */}
      {voiceSpeechAlert && !isPrintFriendly && (
        <div className="mb-6 bg-[#2D3748] text-white p-4 rounded-2xl flex items-center justify-center gap-3 animate-pulse border border-[#E89B2E]/30 shadow-lg no-print">
          <Volume2 className="w-5 h-5 text-[#E89B2E]" />
          <span className="text-sm font-bold font-serif italic">"{voiceSpeechAlert}"</span>
        </div>
      )}

      {/* Professional Grid of Flash Cards */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6 print-grid-cards`}>
        {flashcards.map((card) => {
          const CardIcon = card.icon;
          return (
            <button 
              key={card.id}
              disabled={isPrintFriendly}
              onClick={() => onSpeak(card.text, card.swaText)}
              className={`flex flex-col items-center justify-between text-center rounded-2xl transition-all p-5 h-44 ${
                isPrintFriendly 
                  ? 'print-eco-card border-2 border-black bg-white text-black font-semibold' 
                  : 'border border-slate-200/80 dark:border-white/10 card-h-shadow cursor-pointer bg-white dark:bg-stone-900 hover:border-[#C77700]/50 text-[#2D3748]'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 ${card.bgClass} ${card.colorClass}`}>
                <CardIcon className="w-7 h-7" />
              </div>
              <span className={`text-xs font-black block leading-snug ${isPrintFriendly ? 'text-black text-sm' : 'text-[#2D3748]'}`}>
                {language === 'en' ? card.text : card.swaText}
              </span>
              
              {!isPrintFriendly && (
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#C77700] mt-1.5 flex items-center gap-1 no-print">
                  <Volume2 className="w-3 h-3 animate-pulse" />
                  <span>{language === 'en' ? 'Tap to Speak' : 'Gusa uongee'}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Footer Actions Panel */}
      <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left text-[10px] text-gray-400 font-bold tracking-wider uppercase no-print">
          {language === 'en' 
            ? 'Speech synthesizer active (English en-US / Swahili sw-KE)' 
            : 'Mchanganyiko wa sauti unatumika (Kiingereza en-US / Kiswahili sw-KE)'}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto no-print">
          <button 
            onClick={handlePrint}
            className="bg-[#2F6B4F] hover:bg-[#1e4432] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'en' ? 'Print Cards Layout' : 'Chapa Kadi za Picha'}</span>
          </button>

          <button 
            onClick={() => {
              if (onDownload) onDownload();
              alert(language === 'en' ? 'Downloading Speech Helper Cards PDF...' : 'Inapakua Kadi za Sauti za Kujieleza...');
            }}
            className="bg-[#2D3748] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'en' ? 'Download Cards PDF' : 'Pakua Kadi PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
