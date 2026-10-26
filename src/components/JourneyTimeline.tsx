import React, { useState } from 'react';
import { HelpCircle, ChevronRight, RefreshCw, Sparkles, CheckCircle, Info, Map, ChevronLeft } from 'lucide-react';

interface JourneyTimelineProps {
  language: 'en' | 'swa';
}

interface Question {
  id: string;
  questionEn: string;
  questionSw: string;
  options: {
    value: string;
    labelEn: string;
    labelSw: string;
    score: number;
  }[];
}

export default function JourneyTimeline({ language }: JourneyTimelineProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState<boolean>(false);

  const questions: Question[] = [
    {
      id: 'age',
      questionEn: 'What is your child\'s current age?',
      questionSw: 'Umri wa mtoto wako ni upi sasa?',
      options: [
        { value: 'under-3', labelEn: 'Under 3 years old', labelSw: 'Chini ya miaka 3', score: 1 },
        { value: '3-to-6', labelEn: '3 to 6 years old', labelSw: 'Miaka 3 hadi 6', score: 2 },
        { value: 'above-6', labelEn: 'Above 6 years old', labelSw: 'Zaidi ya miaka 6', score: 3 },
      ]
    },
    {
      id: 'speech',
      questionEn: 'How would you describe your child\'s speech level?',
      questionSw: 'Unawezaje kuelezea kiwango cha usemi cha mtoto wako?',
      options: [
        { value: 'non-verbal', labelEn: 'Non-verbal (does not speak words yet)', labelSw: 'Hana maneno bado (haongei kabisa)', score: 3 },
        { value: 'single-words', labelEn: 'Single words or echoes (repeats words)', labelSw: 'Maneno mamoja-mamoja au anarudia ulichosema', score: 2 },
        { value: 'fluent', labelEn: 'Conversational (forms full sentences)', labelSw: 'Anaongea kwa ufasaha kuunda sentensi', score: 1 },
      ]
    },
    {
      id: 'social',
      questionEn: 'What are your primary social skills observations?',
      questionSw: 'Je, umeona nini kuhusu ushirikiano wake na wengine?',
      options: [
        { value: 'prefers-alone', labelEn: 'Prefers to play alone / avoids eye contact', labelSw: 'Anapendelea kucheza peke yake / anakwepa macho', score: 3 },
        { value: 'struggles-join', labelEn: 'Wants to join others but struggles to interact', labelSw: 'Anataka kujiunga na wenzake lakini anashindwa jinsi ya kufanya', score: 2 },
        { value: 'engages-well', labelEn: 'Engages well with peers with minimal friction', labelSw: 'Anashirikiana vyema na wenzake bila changamoto kubwa', score: 1 },
      ]
    },
    {
      id: 'sensory',
      questionEn: 'Does your child display sensory sensitivities?',
      questionSw: 'Je, anaonyesha kuathiriwa na hisia za nje (sauti, mwanga n.k.)?',
      options: [
        { value: 'severe', labelEn: 'Highly sensitive (gets overwhelmed by loud sounds/crowds)', labelSw: 'Sana (anasumbuliwa sana na kelele, umati, au taa)', score: 3 },
        { value: 'mild', labelEn: 'Mild (only certain fabrics, textures, or foods)', labelSw: 'Kiasi (vyakula au nguo fulani pekee)', score: 2 },
        { value: 'none', labelEn: 'None observed at this moment', labelSw: 'Hajaonyesha changamoto zozote bado', score: 1 },
      ]
    }
  ];

  const handleSelectOption = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResult(false);
  };

  // Generate personalized roadmap steps based on input
  const getRoadmap = () => {
    const ageVal = answers['age'];
    const speechVal = answers['speech'];
    const sensoryVal = answers['sensory'];

    const steps = [];

    // Step 1: Medical / Assessment Direction
    if (ageVal === 'under-3') {
      steps.push({
        titleEn: 'Step 1: Early Intervention Screening',
        titleSw: 'Hatua ya 1: Upimaji na Utambuzi wa Mapema',
        actionEn: 'Schedule a developmental screening at Gertrude’s Hospital or KNH pediatric clinic immediately. Early intervention before age 3 unlocks significant neural plasticity advantages.',
        actionSw: 'Panga upimaji wa ukuaji katika Hospitali ya Gertrude au Kliniki ya KNH mara moja. Kuanza tiba kabla ya miaka 3 hutoa matokeo bora zaidi.',
        tipEn: 'Focus on pediatric motor therapies and active non-verbal vocalization.',
        tipSw: 'Zingatia tiba za harakati za viungo na kuamsha sauti bila maneno.'
      });
    } else {
      steps.push({
        titleEn: 'Step 1: Neurodevelopmental Assessment & IEP Preparation',
        titleSw: 'Hatua ya 1: Upimaji Kamili wa Ukuaji wa Akili',
        actionEn: 'Acquire a formal cognitive and learning assessment. This assessment report is legally required in Kenya to formulate an Individualized Education Program (IEP) for school.',
        actionSw: 'Tafuta ripoti rasmi ya upimaji wa masomo na uwezo wa akili. Ripoti hii inahitajika kisheria Kenya kuandaa ratiba maalum ya IEP shuleni.',
        tipEn: 'Provide this report to potential schools during admission interviews.',
        tipSw: 'Peana ripoti hii kwa shule unapoenda kufanya mahojiano ya kujiunga.'
      });
    }

    // Step 2: Communication Tools
    if (speechVal === 'non-verbal' || speechVal === 'single-words') {
      steps.push({
        titleEn: 'Step 2: Establish Non-Verbal AAC Bridges',
        titleSw: 'Hatua ya 2: Anzisha Njia za Mawasiliano ya Kadi (AAC)',
        actionEn: 'Do not wait for speech. Download our Printable AAC Speech Cards and implement the "I Want" Communication Strip at home to let your child express physical needs and bypass frustrating tantrums.',
        actionSw: 'Usisubiri aongee. Pakua kadi zetu za sauti (AAC) na ufundishe ukanda wa sentensi "Nataka..." nyumbani ili mtoto aeleze mahitaji yake bila kulia au kukasirika.',
        tipEn: 'Consistently pair the AAC card visual with the real physical object.',
        tipSw: 'Kila mara fananisha kadi ya picha na kitu halisi unachompa mtoto.'
      });
    } else {
      steps.push({
        titleEn: 'Step 2: Social Skills & Peer Group Play',
        titleSw: 'Hatua ya 2: Mazoezi ya Ushirikiano na Kucheza na Wenzake',
        actionEn: 'Enroll your child in structured, small-group playdates or speech therapy circles. Support peer interactions by practicing simple turn-taking schedules and social stories.',
        actionSw: 'Mshirikishe mtoto katika michezo midogo ya makundi au duru za tiba ya lugha. Saidia ushirikiano kwa kufanya mazoezi ya kubadilishana zamu.',
        tipEn: 'Create a "Turn-taking" board using simple visual placeholders.',
        tipSw: 'Unda ratiba rahisi ya kuonyesha nani anafuata kucheza.'
      });
    }

    // Step 3: Sensory or Educational Placement
    if (sensoryVal === 'severe') {
      steps.push({
        titleEn: 'Step 3: Establish Home Sensory Calming Space',
        titleSw: 'Hatua ya 3: Unda Chumba au Kona Tulivu Nyumbani',
        actionEn: 'Designate a low-light, quiet sensory corner at home. Integrate therapeutic low-frequency humming audios (like our Sensory Calming Room generator) to help soothe auditory or crowd sensory overloads.',
        actionSw: 'Tenga kona moja tulivu nyumbani isiyo na mwanga mkali au kelele. Tumia mashine ya kutoa sauti ya mawimbi tulivu kusaidia kumtuliza anapozidiwa na kelele.',
        tipEn: 'Equip the corner with soft pillows, visual ripples, and weight blankets.',
        tipSw: 'Weka mito laini, vitu vyenye mwanga mdogo na mablanketi mazito katika kona hiyo.'
      });
    } else {
      steps.push({
        titleEn: 'Step 3: Seek Inclusive Schooling with Shadow LSA Support',
        titleSw: 'Hatua ya 3: Shule Jumuishi na Msaada wa Shadow LSA',
        actionEn: 'Approach inclusive schools in your city. Draft and deliver our pre-populated "School Advocacy Letter" requesting customized IEP accommodation and permission to place a trained shadow teacher in class.',
        actionSw: 'Tafuta shule jumuishi karibu nawe. Chapisha barua yetu maalum ya ombi la kurekebisha masomo na kuomba ruhusa ya mwalimu msaidizi (shadow).',
        tipEn: 'Our Resource Download Center contains the official shadow teacher letter template.',
        tipSw: 'Maktaba yetu ya nyaraka ina kiolezo rasmi cha barua ya shadow teacher.'
      });
    }

    return steps;
  };

  const isCurrentAnswered = answers[questions[currentStep].id] !== undefined;

  return (
    <div id="journey-timeline-engine" className="journey-timeline-module bg-white rounded-[32px] p-6 sm:p-8 border border-[#C77700]/10 shadow-sm">
      
      {/* Medical Disclaimer Alert block */}
      <div className="mb-6 flex gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs font-semibold text-amber-800 leading-relaxed">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold block">
            {language === 'en' ? 'IMPORTANT CLINICAL DISCLAIMER' : 'ILANI MUHIMU YA KITAALAMU'}
          </span>
          {language === 'en'
            ? 'This interactive guidance engine is NOT a medical diagnosis, developmental test, or screening assessment. It is a general navigation tool to help Kenyan parents quickly locate helpful therapeutic worksheets, school letters, and verified clinics based on typical childhood milestone scenarios.'
            : 'Msaidizi huyu si kipimo cha daktari wala utambuzi wa ugonjwa. Hii ni zana ya kukusaidia tu kupata kwa haraka nyaraka sahihi, barua za shule, na hospitali za msaada kulingana na mahitaji yako.'}
        </div>
      </div>

      {!showResult ? (
        <div>
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {language === 'en' ? `Question ${currentStep + 1} of ${questions.length}` : `Swali la ${currentStep + 1} kati ya ${questions.length}`}
            </span>
            <div className="flex gap-1">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 w-6 rounded-full transition-colors ${
                    idx <= currentStep ? 'bg-[#C77700]' : 'bg-gray-100'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Question Text */}
          <h4 className="text-base sm:text-lg font-serif font-bold text-[#2D3748] mb-6">
            {language === 'en' ? questions[currentStep].questionEn : questions[currentStep].questionSw}
          </h4>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3.5 mb-8">
            {questions[currentStep].options.map((option) => {
              const isSelected = answers[questions[currentStep].id] === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelectOption(questions[currentStep].id, option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#C77700] bg-[#C77700]/5 text-[#C77700] font-bold'
                      : 'border-gray-100 bg-gray-50/50 hover:bg-gray-50 text-gray-700 hover:border-gray-200'
                  }`}
                >
                  <span className="text-xs sm:text-sm">
                    {language === 'en' ? option.labelEn : option.labelSw}
                  </span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-[#C77700] bg-[#C77700]' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center border-t border-gray-50 pt-5">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-1 py-2.5 px-4 rounded-xl text-xs font-bold border ${
                currentStep === 0
                  ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{language === 'en' ? 'Back' : 'Nyuma'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!isCurrentAnswered}
              className={`flex items-center gap-1.5 py-2.5 px-6 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                isCurrentAnswered
                  ? 'bg-[#2D3748] hover:bg-black text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === questions.length - 1 ? (language === 'en' ? 'Generate Roadmap' : 'Unda Ramani') : (language === 'en' ? 'Next Question' : 'Mbele')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        // Results Visualization Roadmap
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-[#2F6B4F]/10 text-[#2F6B4F] rounded-2xl flex items-center justify-center">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#2D3748]">
                  {language === 'en' ? 'Your Personalized Support Roadmap' : 'Ramani Yako ya Kusaidia Mtoto'}
                </h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {language === 'en' ? 'Based on typical milestones' : 'Kulingana na hatua za ukuaji'}
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-bold text-[#C77700] hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Start Over' : 'Anza Upya'}</span>
            </button>
          </div>

          {/* Stepper Steps UI */}
          <div className="space-y-6 relative before:absolute before:left-4 sm:before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
            {getRoadmap().map((step, idx) => (
              <div key={idx} className="flex gap-4 sm:gap-6 relative">
                {/* Visual Step bubble */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white border-2 border-[#2F6B4F] text-[#2F6B4F] font-bold text-xs rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm">
                  {idx + 1}
                </div>

                <div className="bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-2xl p-5 flex-1 transition-all">
                  <h5 className="text-sm font-extrabold text-[#2D3748] mb-1.5">
                    {language === 'en' ? step.titleEn : step.titleSw}
                  </h5>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    {language === 'en' ? step.actionEn : step.actionSw}
                  </p>
                  <div className="bg-[#FFF8EE] px-3.5 py-2 rounded-xl text-[11px] text-[#C77700] font-semibold border border-[#C77700]/10 flex gap-2">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>
                      <strong>{language === 'en' ? 'Clinical Tip: ' : 'Ushauri: '}</strong>
                      {language === 'en' ? step.tipEn : step.tipSw}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive footer actions */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-[#2D3748] rounded-xl text-xs font-bold cursor-pointer"
            >
              {language === 'en' ? 'Test Another Child Scenario' : 'Pima Hali Nyingine'}
            </button>
            <div className="flex-1 flex bg-[#2F6B4F] text-white rounded-xl items-center justify-center py-3 text-xs font-extrabold tracking-wider uppercase">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>{language === 'en' ? 'Guidance Generated' : 'Ramani Imekamilika'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
