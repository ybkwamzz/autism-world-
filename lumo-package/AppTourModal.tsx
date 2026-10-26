import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Volume2, 
  Sparkles, 
  LayoutGrid, 
  Mic, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw,
  Compass,
  CheckCircle2,
  Bot
} from 'lucide-react';

interface AppTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'swa';
  speakText: (engText: string, swaText: string) => void;
  onOpenLumo?: () => void;
}

export default function AppTourModal({
  isOpen,
  onClose,
  language,
  speakText,
  onOpenLumo
}: AppTourModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const navigate = useNavigate();

  const tourSteps = [
    {
      id: 'lumo',
      titleEn: '1. Lumo 24/7 AI Assistant',
      titleSw: '1. Msaidizi wa Akili Mbandia Lumo',
      subtitleEn: 'Instant guidance for autism care in Kenya',
      subtitleSw: 'Msaada wa haraka wa usonji nchini Kenya',
      icon: <Bot className="w-8 h-8 text-[#2F6B4F]" />,
      badgeBg: 'bg-[#2F6B4F]/10 border-[#2F6B4F]/30 text-[#2F6B4F]',
      textEn: 'Meet Lumo, your supportive AI assistant available 24 hours a day. Ask Lumo about autism assessment centres across Kenya, early developmental signs, sensory guidance, or special education advice.',
      textSw: 'Mfahamu Lumo, msaidizi wako wa akili mbandia anayepatikana masaa 24. Muulize Lumo kuhusu vituo vya tathmini ya usonji nchini Kenya, dalili za mapema, ushauri wa hisia, au elimu maalum.',
      actionLabelEn: 'Try Lumo Assistant',
      actionLabelSw: 'Mjaribu Lumo Sasa',
      onAction: () => {
        onClose();
        if (onOpenLumo) onOpenLumo();
      }
    },
    {
      id: 'toolkit',
      titleEn: '2. Interactive Therapy Toolkit',
      titleSw: '2. Zana Shirikishi za Tiba',
      subtitleEn: 'Visual schedules, PECS cards & calming tools',
      subtitleSw: 'Ratiba za picha, kadi za sauti na utulivu',
      icon: <LayoutGrid className="w-8 h-8 text-[#C77700]" />,
      badgeBg: 'bg-[#C77700]/10 border-[#C77700]/30 text-[#C77700]',
      textEn: 'Explore our interactive Toolkit featuring Visual Schedules for daily predictability, PECS Speech Cards for instant audio words, PECS Sentence Board to build phrases, and the Sensory Calming timer for meltdown relief.',
      textSw: 'Mfahamu mfululizo wetu wa zana za tiba: Ratiba ya picha kwa shughuli za kila siku, kadi za sauti za PECS kufundisha maneno, ubao wa sentensi, na chumba cha utulivu cha kupunguza mfadhaiko.',
      actionLabelEn: 'Open Toolkit Page',
      actionLabelSw: 'Fungua Ukurasa wa Zana',
      onAction: () => {
        onClose();
        navigate('/toolkit');
      }
    },
    {
      id: 'voice',
      titleEn: '3. Hands-Free Voice & Read Aloud',
      titleSw: '3. Kivinjari cha Sauti na Msomaji',
      subtitleEn: 'Accessible navigation for all users',
      subtitleSw: 'Urahisi wa kutumia kwa kila mtu',
      icon: <Mic className="w-8 h-8 text-[#E89B2E]" />,
      badgeBg: 'bg-[#E89B2E]/10 border-[#E89B2E]/30 text-[#E89B2E]',
      textEn: 'Use our Voice Navigator microphone button at the bottom left to control the app hands-free with spoken commands. You can also toggle Read Aloud mode in the top bar to listen to any text on screen.',
      textSw: 'Tumia kivinjari cha sauti chini kushoto kuamuru programu kwa sauti au kwa kuandika. Washa msomaji wa sauti juu kusikiliza maandishi yoyote yaliyo kwenye skrini.',
      actionLabelEn: 'Got It, Next Step',
      actionLabelSw: 'Sawa, Hatua Inayofuata',
      onAction: null
    },
    {
      id: 'community',
      titleEn: '4. Kenyan Stories & IEP Downloads',
      titleSw: '4. Hadithi za Wazazi na Barua za IEP',
      subtitleEn: 'Real parent voices & printable templates',
      subtitleSw: 'Hadithi halisi na nyaraka za kuchapisha',
      icon: <BookOpen className="w-8 h-8 text-[#2F6B4F]" />,
      badgeBg: 'bg-[#2F6B4F]/10 border-[#2F6B4F]/30 text-[#2F6B4F]',
      textEn: 'Read inspiring stories from Kenyan parents, siblings, and special educators. Download free printable IEP request letters for school shadow teachers and print-ready visual charts.',
      textSw: 'Soma hadithi na uzoefu wa wazazi, ndugu na walimu nchini Kenya. Pakua barua za IEP za shule bila malipo na nyaraka za kuchapisha za ratiba za picha.',
      actionLabelEn: 'Read Community Stories',
      actionLabelSw: 'Soma Hadithi za Jamii',
      onAction: () => {
        onClose();
        navigate('/blog');
      }
    }
  ];

  const currentStep = tourSteps[currentStepIndex];

  // Auto speak step content on change
  useEffect(() => {
    if (!isOpen) return;

    setIsSpeaking(true);
    speakText(currentStep.textEn, currentStep.textSw);

    const timer = setTimeout(() => {
      setIsSpeaking(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentStepIndex, isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < tourSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReplayVoice = () => {
    setIsSpeaking(true);
    speakText(currentStep.textEn, currentStep.textSw);
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFF8EE] text-[#2D3748] rounded-[36px] border-4 border-[#C77700]/30 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Header / Top Ribbon */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200/80 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C77700] text-white flex items-center justify-center font-bold shadow-sm">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#C77700] uppercase tracking-widest block">
                {language === 'en' ? 'Interactive App Tour' : 'Mwongozo wa Saa na Sauti'}
              </span>
              <h3 className="text-sm font-bold font-serif text-[#2D3748]">
                {language === 'en' ? `Step ${currentStepIndex + 1} of ${tourSteps.length}` : `Hatua ya ${currentStepIndex + 1} kati ya ${tourSteps.length}`}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200/60 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            title={language === 'en' ? 'Close Tour' : 'Funga Mwongozo'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="flex gap-2 mb-6">
          {tourSteps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentStepIndex 
                  ? 'w-8 bg-[#C77700]' 
                  : idx < currentStepIndex 
                    ? 'w-2 bg-[#2F6B4F]' 
                    : 'w-2 bg-gray-200'
              }`}
              title={`Go to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Main Step Content Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm relative mb-6">
          
          {/* Top Step Icon & Title */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-2xl border ${currentStep.badgeBg} shrink-0`}>
              {currentStep.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-lg font-bold font-serif text-[#2D3748] leading-tight">
                {language === 'en' ? currentStep.titleEn : currentStep.titleSw}
              </h4>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">
                {language === 'en' ? currentStep.subtitleEn : currentStep.subtitleSw}
              </p>
            </div>
          </div>

          {/* Voice Indicator Badge */}
          <div className="bg-[#FFF8EE] border border-[#C77700]/20 rounded-2xl p-3 mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Volume2 className={`w-4 h-4 text-[#C77700] ${isSpeaking ? 'animate-bounce' : ''}`} />
              <span className="text-[11px] font-extrabold text-[#C77700] uppercase tracking-wider">
                {isSpeaking 
                  ? (language === 'en' ? 'Lumo Speaking Guide...' : 'Lumo Anahutubia...') 
                  : (language === 'en' ? 'Voice Guide Subtitles' : 'Maelezo ya Sauti')}
              </span>
            </div>
            
            <button
              onClick={handleReplayVoice}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C77700]/10 hover:bg-[#C77700]/20 text-[#C77700] text-[10px] font-extrabold transition-colors cursor-pointer"
              title={language === 'en' ? 'Listen to voice again' : 'Sikiliza tena'}
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === 'en' ? 'Replay Voice' : 'Sikiliza Tena'}</span>
            </button>
          </div>

          {/* Step Text Explanation */}
          <p className="text-xs sm:text-sm text-[#2D3748] leading-relaxed font-medium">
            {language === 'en' ? currentStep.textEn : currentStep.textSw}
          </p>

          {/* Optional Action Shortcut Button */}
          {currentStep.onAction && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={currentStep.onAction}
                className="bg-[#2F6B4F] hover:bg-[#23513b] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'en' ? currentStep.actionLabelEn : currentStep.actionLabelSw}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Bottom Controls (Prev / Next) */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              currentStepIndex === 0 
                ? 'opacity-30 cursor-not-allowed bg-gray-200 text-gray-500' 
                : 'bg-white hover:bg-gray-100 text-[#2D3748] border border-gray-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{language === 'en' ? 'Previous' : 'Nyuma'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            >
              {language === 'en' ? 'Skip Tour' : 'Ruka'}
            </button>

            <button
              onClick={handleNext}
              className="bg-[#C77700] hover:bg-[#a06000] text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <span>
                {currentStepIndex === tourSteps.length - 1 
                  ? (language === 'en' ? 'Finish Tour' : 'Kamilisha') 
                  : (language === 'en' ? 'Next Step' : 'Inayofuata')}
              </span>
              {currentStepIndex === tourSteps.length - 1 ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
