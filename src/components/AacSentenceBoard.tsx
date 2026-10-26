import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Volume2, 
  ArrowLeft, 
  Download, 
  Printer, 
  Eye,
  Hand,
  Heart,
  AlertCircle,
  Droplets,
  UtensilsCrossed,
  Moon,
  HelpCircle,
  VolumeX,
  Smile,
  Frown,
  HeartHandshake,
  type LucideIcon
} from 'lucide-react';

interface AacSentenceBoardProps {
  language: 'en' | 'swa';
  onSpeak: (engText: string, swaText: string) => void;
  onDownload?: () => void;
}

interface ItemOption {
  en: string;
  swa: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

export default function AacSentenceBoard({ language, onSpeak, onDownload }: AacSentenceBoardProps) {
  const location = useLocation();
  const [isPrintFriendly, setIsPrintFriendly] = useState(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('print') === 'true' || location.state?.printMode === true;
  });
  const [selectedSubject, setSelectedSubject] = useState<ItemOption | null>(null);
  const [selectedObject, setSelectedObject] = useState<ItemOption | null>(null);

  const subjects: ItemOption[] = [
    { en: 'I want', swa: 'Nataka', icon: Hand, colorClass: 'text-[#2F6B4F]', bgClass: 'bg-[#2F6B4F]/10' },
    { en: 'I feel', swa: 'Ninahisi', icon: Heart, colorClass: 'text-[#C77700]', bgClass: 'bg-[#C77700]/10' },
    { en: 'I need', swa: 'Nahitaji', icon: AlertCircle, colorClass: 'text-red-600', bgClass: 'bg-red-50' },
  ];

  const objects: ItemOption[] = [
    { en: 'Water', swa: 'Maji', icon: Droplets, colorClass: 'text-blue-600', bgClass: 'bg-blue-50' },
    { en: 'Food', swa: 'Chakula', icon: UtensilsCrossed, colorClass: 'text-orange-600', bgClass: 'bg-orange-50' },
    { en: 'Sleep', swa: 'Kulala', icon: Moon, colorClass: 'text-purple-600', bgClass: 'bg-purple-50' },
    { en: 'Help', swa: 'Msaada', icon: HelpCircle, colorClass: 'text-red-600', bgClass: 'bg-red-50' },
    { en: 'Quiet', swa: 'Utulivu', icon: VolumeX, colorClass: 'text-teal-600', bgClass: 'bg-teal-50' },
    { en: 'Happy', swa: 'Furaha', icon: Smile, colorClass: 'text-yellow-600', bgClass: 'bg-yellow-50' },
    { en: 'Sad', swa: 'Huzuni', icon: Frown, colorClass: 'text-indigo-600', bgClass: 'bg-indigo-50' },
    { en: 'Hug', swa: 'Kukumbatiwa', icon: HeartHandshake, colorClass: 'text-pink-600', bgClass: 'bg-pink-50' },
  ];

  const playSentence = () => {
    if (!selectedSubject || !selectedObject) return;
    const engStr = `${selectedSubject.en} ${selectedObject.en}`;
    const swaStr = `${selectedSubject.swa} ${selectedObject.swa}`;
    onSpeak(engStr, swaStr);
  };

  const clearSentence = () => {
    setSelectedSubject(null);
    setSelectedObject(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${isPrintFriendly ? 'printable-area bg-white p-4 sm:p-6 text-black border-4 border-black rounded-[32px]' : 'bg-white rounded-[32px] border-2 border-[#C77700]/10 p-6 sm:p-8 shadow-md relative text-[#2D3748]'}`}>
      
      {/* Back to Toolkit Navigation (hidden on print) */}
      <div className="flex items-center justify-between gap-4 mb-6 no-print">
        <Link 
          to="/toolkit" 
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors flex items-center gap-1.5 text-xs font-bold back-to-toolkit-link"
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

      {/* Print Mode Top Status Alert Bar (Visible only when Print Friendly Mode is active, hidden on print output) */}
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

      {/* Header text */}
      <div className="mb-6">
        <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-wider block no-print">AAC Communication Strip</span>
        <h3 className={`text-2xl sm:text-3xl font-bold font-serif ${isPrintFriendly ? 'text-black' : 'text-[#C77700]'}`}>
          {language === 'en' ? 'Construct Sentences' : 'Tengeneza Sentensi za Mawasiliano'}
        </h3>
        <p className="text-xs text-gray-500 mt-1 no-print">
          {language === 'en' 
            ? 'Help children formulate statements by choosing a subject (action) and an object (need).' 
            : 'Saidia watoto kuunda kauli kwa kuchagua mada (kitendo) na kitu (mahitaji).'}
        </p>
      </div>

      {/* Active Sentence Strip */}
      <div className={`p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 mb-8 min-h-[90px] ${
        isPrintFriendly 
          ? 'border-4 border-black bg-white text-black' 
          : 'bg-white border-2 border-[#2F6B4F] shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          {selectedSubject ? (
            <div className={`px-4 py-2.5 rounded-xl flex items-center gap-2.5 ${
              isPrintFriendly 
                ? 'border-2 border-black bg-white text-black' 
                : `${selectedSubject.bgClass} border border-[#2F6B4F]/30 ${selectedSubject.colorClass}`
            }`}>
              {React.createElement(selectedSubject.icon, { className: 'w-5 h-5 shrink-0' })}
              <span className={`text-xs font-black ${isPrintFriendly ? 'text-black text-sm' : ''}`}>
                {language === 'en' ? selectedSubject.en : selectedSubject.swa}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-300 italic">
              {language === 'en' ? '[Choose Action]' : '[Chagua Kitendo]'}
            </span>
          )}

          <span className="text-gray-400 font-bold text-lg">&rarr;</span>

          {selectedObject ? (
            <div className={`px-4 py-2.5 rounded-xl flex items-center gap-2.5 ${
              isPrintFriendly 
                ? 'border-2 border-black bg-white text-black' 
                : `${selectedObject.bgClass} border border-[#C77700]/30 ${selectedObject.colorClass}`
            }`}>
              {React.createElement(selectedObject.icon, { className: 'w-5 h-5 shrink-0' })}
              <span className={`text-xs font-black ${isPrintFriendly ? 'text-black text-sm' : ''}`}>
                {language === 'en' ? selectedObject.en : selectedObject.swa}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-300 italic">
              {language === 'en' ? '[Choose Need]' : '[Chagua Mahitaji]'}
            </span>
          )}
        </div>

        {/* Clear/Speak actions (hidden in print-friendly mode) */}
        {!isPrintFriendly && (
          <div className="flex gap-2 w-full sm:w-auto justify-end no-print">
            <button 
              disabled={!selectedSubject || !selectedObject}
              onClick={playSentence}
              className="bg-[#2F6B4F] hover:bg-[#1e4432] disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>{language === 'en' ? 'Speak' : 'Soma'}</span>
            </button>
            <button 
              onClick={clearSentence}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              {language === 'en' ? 'Clear' : 'Futa'}
            </button>
          </div>
        )}
      </div>

      {/* Selection Area / Card Grid Sheet (optimized for cutting out in print mode) */}
      <div className="space-y-8">
        
        {/* Step 1: Subjects */}
        <div>
          <h4 className={`text-xs font-extrabold uppercase tracking-widest mb-3 ${isPrintFriendly ? 'text-black font-black text-sm' : 'text-[#2F6B4F]'}`}>
            {language === 'en' ? 'Step 1: Actions (Cutout Cards)' : 'Hatua ya 1: Vitendo'}
          </h4>
          <div className={`grid gap-3 ${isPrintFriendly ? 'grid-cols-3 print-grid-cards' : 'grid-cols-1 sm:grid-cols-3'}`}>
            {subjects.map((sub, idx) => {
              const SubIcon = sub.icon;
              return (
                <button 
                  key={idx}
                  disabled={isPrintFriendly}
                  onClick={() => setSelectedSubject(sub)}
                  className={`flex flex-col items-center justify-center text-center p-4 rounded-2xl transition-all ${
                    isPrintFriendly 
                      ? 'print-eco-card border-2 border-black bg-white text-black' 
                      : selectedSubject?.en === sub.en 
                        ? 'bg-[#2F6B4F]/10 border-2 border-[#2F6B4F] card-h-shadow' 
                        : 'bg-white border border-slate-200/80 dark:border-white/10 card-h-shadow hover:border-[#2F6B4F]/40 cursor-pointer'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${sub.bgClass} ${sub.colorClass}`}>
                    <SubIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black">{language === 'en' ? sub.en : sub.swa}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Objects */}
        <div>
          <h4 className={`text-xs font-extrabold uppercase tracking-widest mb-3 ${isPrintFriendly ? 'text-black font-black text-sm' : 'text-[#C77700]'}`}>
            {language === 'en' ? 'Step 2: Needs (Cutout Cards)' : 'Hatua ya 2: Mahitaji'}
          </h4>
          <div className={`grid gap-3 ${isPrintFriendly ? 'grid-cols-4 print-grid-cards' : 'grid-cols-2 sm:grid-cols-4'}`}>
            {objects.map((obj, idx) => {
              const ObjIcon = obj.icon;
              return (
                <button 
                  key={idx}
                  disabled={isPrintFriendly}
                  onClick={() => setSelectedObject(obj)}
                  className={`flex flex-col items-center justify-center text-center p-4 rounded-2xl transition-all ${
                    isPrintFriendly 
                      ? 'print-eco-card border-2 border-black bg-white text-black' 
                      : selectedObject?.en === obj.en 
                        ? 'bg-[#C77700]/10 border-2 border-[#C77700] card-h-shadow' 
                        : 'bg-white border border-slate-200/80 dark:border-white/10 card-h-shadow hover:border-[#C77700]/40 cursor-pointer'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${obj.bgClass} ${obj.colorClass}`}>
                    <ObjIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black">{language === 'en' ? obj.en : obj.swa}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Print Option Footer */}
      <div className="mt-8 pt-6 border-t border-[#C77700]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-[10px] text-gray-400 font-medium text-center sm:text-left no-print">
          {language === 'en' ? 'Combine cards to form sentences' : 'Changanya kadi ili kuunda sentensi'}
        </span>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto no-print">
          <button 
            onClick={handlePrint}
            className="bg-[#2F6B4F] hover:bg-[#1e4432] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'en' ? 'Print Communication Strip' : 'Chapa Ukanda wa Mawasiliano'}</span>
          </button>

          <button 
            onClick={() => {
              if (onDownload) onDownload();
              alert(language === 'en' ? 'Compiling active communication strip. Downloading PDF...' : 'Inatayarisha ukanda wa mawasiliano. Inapakua PDF...');
            }}
            className="bg-[#2D3748] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'en' ? 'Download PDF' : 'Pakua PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
