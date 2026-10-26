import React, { useState } from 'react';
import { HelpCircle, ChevronRight, RefreshCw, AlertCircle, FileText, CheckCircle, Info, Star } from 'lucide-react';

interface SchoolReadinessProps {
  language: 'en' | 'swa';
  onNavigateToDownloads?: () => void;
}

interface AssessmentQuestion {
  id: string;
  textEn: string;
  textSw: string;
}

export default function SchoolReadiness({ language, onNavigateToDownloads }: SchoolReadinessProps) {
  const [answers, setAnswers] = useState<Record<string, 'yes' | 'no' | 'sometimes'>>({});
  const [showScore, setShowScore] = useState(false);

  const questions: AssessmentQuestion[] = [
    {
      id: 'step-instructions',
      textEn: 'Can the child follow simple 1-step instructions (e.g. "Come here", "Sit down")?',
      textSw: 'Je, mtoto anaweza kufuata maagizo rahisi ya hatua moja (mfano "Njoo hapa", "Keti chini")?'
    },
    {
      id: 'sit-ten-mins',
      textEn: 'Can the child sit or engage quietly in a single structured task for 10 minutes?',
      textSw: 'Je, mtoto anaweza kuketi au kufanya kazi moja maalum kwa utulivu kwa dakika 10?'
    },
    {
      id: 'communicate-needs',
      textEn: 'Can the child communicate basic physical needs (hunger, toilet, pain) via speech, gestures, or kadi za picha (PECS)?',
      textSw: 'Je, mtoto anaweza kueleza mahitaji yake ya kimsingi (njaa, kwenda chooni, maumivu) kwa sauti au kadi?'
    },
    {
      id: 'handle-transitions',
      textEn: 'Does the child handle transition changes from one activity to another with minimal distress?',
      textSw: 'Je, mtoto anakabiliana na mabadiliko ya kutoka shughuli moja hadi nyingine bila kufanya ghasia?'
    },
    {
      id: 'peer-proximity',
      textEn: 'Can the child tolerate being in close physical proximity with peer classmates without aggression?',
      textSw: 'Je, mtoto anaweza kuvumilia kuwa karibu na wanafunzi wenzake darasani bila kuwapiga au kusukumana?'
    }
  ];

  const handleToggle = (qId: string, choice: 'yes' | 'no' | 'sometimes') => {
    setAnswers(prev => ({ ...prev, [qId]: choice }));
  };

  const calculateResults = () => {
    let score = 0;
    questions.forEach(q => {
      const ans = answers[q.id];
      if (ans === 'yes') score += 2;
      else if (ans === 'sometimes') score += 1;
      // 'no' gets 0 points
    });

    const maxScore = questions.length * 2; // 10 points max
    const percentage = Math.round((score / maxScore) * 100);

    let classification = '';
    let descriptionEn = '';
    let descriptionSw = '';
    let recommendationEn = '';
    let recommendationSw = '';
    let targetDownloadId = 'advocacy-letter-shadow';

    if (percentage >= 80) {
      classification = 'Ready for Mainstream Classroom';
      descriptionEn = 'Excellent foundational classroom readiness indicators. Your child displays strong independent engagement, baseline joint attention, and clear functional communication.';
      descriptionSw = 'Tayari Kabisa Kujiunga na Darasa la Kawaida. Mtoto anaonyesha uwezo mkubwa wa kufuata maelezo na kuwasiliana na wenzake shuleni.';
      recommendationEn = 'Your child is suitable for standard primary schools. We recommend providing teachers with our IEP Classroom Accommodations Template to ensure they receive extra visual reminders.';
      recommendationSw = 'Mpatie mwalimu mkuu kiolezo chetu cha IEP kuomba mtoto apewe msaada kidogo wa picha na mapumziko akizidiwa.';
      targetDownloadId = 'letters-school-accommodations';
    } else if (percentage >= 40) {
      classification = 'Suitable for Mainstream with Shadow Assistant (LSA)';
      descriptionEn = 'Capable of inclusion with targeted learning assistance. Your child handles baseline transitions but experiences occasional overwhelm or attention fatigue.';
      descriptionSw = 'Yafaa Shule ya Kawaida akiwa na Mwalimu Msaidizi (Shadow Teacher). Mtoto anaweza kusoma lakini anahitaji msaidizi karibu naye kumgundua akizidiwa.';
      recommendationEn = 'Highly recommended to deploy a trained Shadow Teacher or Learning Support Assistant. You MUST present our "Shadow Teacher Advocacy Letter" to the school board to authorize school placement support.';
      recommendationSw = 'Ni lazima kuweka msaidizi wa darasani. Pakua na uwasilishe "Barua yetu ya Shadow Teacher" kwa bodi ya shule kuruhusu msaidizi huyo aingie darasani.';
      targetDownloadId = 'advocacy-letter-shadow';
    } else {
      classification = 'Requires Specialized / Adaptive Sensory Environment';
      descriptionEn = 'Requires specialized, highly adaptive small-classroom support. Traditional large classrooms may trigger immense sensory overloads and limit emotional regulation.';
      descriptionSw = 'Anahitaji Shule Maalumu yenye Vyumba Vidogo vya Tiba. Mazingira makubwa yenye kelele yanaweza kumzidi nguvu kihisia na kumzuia kusoma.';
      recommendationEn = 'We recommend prioritizing pediatric speech and occupational therapies. Set up a physical home visual schedule using our printable cards, and explore adaptive specialized academies near you.';
      recommendationSw = 'Zingatia kwanza kliniki za therapies na upakue Kadi za Picha nyumbani. Pia, tafuta shule maalum zilizoorodheshwa kwenye Orodha yetu ya Huduma Kenya.';
      targetDownloadId = 'schedule-printable-cards';
    }

    return { percentage, classification, descriptionEn, descriptionSw, recommendationEn, recommendationSw, targetDownloadId };
  };

  const isAllAnswered = questions.every(q => answers[q.id] !== undefined);

  const handleReset = () => {
    setAnswers({});
    setShowScore(false);
  };

  return (
    <div id="school-readiness-checker" className="school-readiness-checker-module bg-white rounded-[32px] p-6 sm:p-8 border border-[#C77700]/10 shadow-sm">
      
      {/* Disclaimer / Info block */}
      <div className="mb-6 flex gap-3 bg-green-500/5 border border-green-500/10 rounded-2xl p-4 text-xs font-semibold text-[#2F6B4F] leading-relaxed">
        <Info className="w-5 h-5 text-[#2F6B4F] shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold block">
            {language === 'en' ? 'UNDERSTANDING THE ASSESSMENT' : 'JINSI KIPIMO KINAVYOFANYA KAZI'}
          </span>
          {language === 'en'
            ? 'This interactive check evaluates motor integration, verbal readiness, and attention retention required for mainstream Kenyan classrooms. Answer objectively to generate suitable school advocacy tools.'
            : 'Kipimo hiki kinatathmini uwezo wa kufuata masomo, utulivu, na mawasiliano yanayohitajika darasani. Jibu kwa ukweli ili kupata barua rasmi inayofaa shule yako.'}
        </div>
      </div>

      {!showScore ? (
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
              <div className="flex gap-3 mb-3">
                <span className="text-xs font-black text-[#C77700] shrink-0 bg-[#FFF8EE] border border-[#C77700]/10 w-6 h-6 rounded-full flex items-center justify-center">
                  {idx + 1}
                </span>
                <h4 className="text-xs sm:text-sm font-extrabold text-[#2D3748] leading-snug">
                  {language === 'en' ? q.textEn : q.textSw}
                </h4>
              </div>

              {/* Yes/No/Sometimes buttons selection */}
              <div className="flex gap-2.5 max-w-md ml-9">
                {(['yes', 'sometimes', 'no'] as const).map((choice) => {
                  const isSelected = answers[q.id] === choice;
                  let colorClass = '';
                  if (isSelected) {
                    if (choice === 'yes') colorClass = 'border-green-600 bg-green-50 text-green-700';
                    else if (choice === 'sometimes') colorClass = 'border-amber-500 bg-amber-50 text-amber-700';
                    else colorClass = 'border-red-500 bg-red-50 text-red-700';
                  } else {
                    colorClass = 'border-gray-100 bg-gray-50/50 hover:bg-gray-50 text-gray-500 hover:border-gray-200';
                  }

                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handleToggle(q.id, choice)}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 cursor-pointer transition-all ${colorClass}`}
                    >
                      {choice === 'yes' && (language === 'en' ? 'Yes' : 'Ndiyo')}
                      {choice === 'sometimes' && (language === 'en' ? 'Sometimes' : 'Kiasi')}
                      {choice === 'no' && (language === 'en' ? 'No' : 'Hapana')}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Generate Results CTA */}
          <div className="pt-4 border-t border-gray-50 flex justify-end">
            <button
              onClick={() => { if (isAllAnswered) setShowScore(true); }}
              disabled={!isAllAnswered}
              className={`flex items-center gap-2 py-3.5 px-8 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                isAllAnswered
                  ? 'bg-[#2D3748] hover:bg-black text-white shadow-md'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{language === 'en' ? 'Analyze School Readiness' : 'Chambua Uwezo wa Shule'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        // Score Screen UI
        <div className="animate-fade-in text-center py-4">
          {(() => {
            const result = calculateResults();
            return (
              <div className="max-w-xl mx-auto">
                
                {/* Circular Score display */}
                <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      className="stroke-gray-100 fill-none"
                      strokeWidth="10"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      className="stroke-[#2F6B4F] fill-none transition-all duration-1000"
                      strokeWidth="12"
                      strokeDasharray={377}
                      strokeDashoffset={377 - (377 * result.percentage) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-serif font-black text-[#2D3748]">
                      {result.percentage}%
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                      {language === 'en' ? 'Readiness' : 'Uwezo'}
                    </span>
                  </div>
                </div>

                {/* Qualitative Verdict */}
                <span className="inline-flex items-center gap-1 bg-[#2F6B4F]/10 text-[#2F6B4F] px-4 py-1.5 rounded-full text-xs font-extrabold mb-4 border border-[#2F6B4F]/15">
                  <Star className="w-4 h-4 fill-current" />
                  {result.classification}
                </span>

                <p className="text-xs text-gray-600 leading-relaxed mb-3 font-medium">
                  {language === 'en' ? result.descriptionEn : result.descriptionSw}
                </p>

                <p className="text-xs text-[#C77700] leading-relaxed mb-8 px-4 font-bold border-l-2 border-[#C77700]/30 py-1 bg-[#FFF8EE] rounded-r-xl">
                  {language === 'en' ? result.recommendationEn : result.recommendationSw}
                </p>

                {/* ADVOCACY LETTER INTEGRATION CTA */}
                <div className="bg-[#FFF8EE] border border-[#C77700]/15 rounded-[24px] p-5 mb-6 text-left">
                  <h5 className="text-xs font-black text-[#2D3748] uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#C77700]" />
                    {language === 'en' ? 'Recommended Action Item' : 'Hatua Inayopendekezwa kuchukuliwa'}
                  </h5>
                  <p className="text-[11px] text-gray-500 leading-normal mb-4">
                    {language === 'en'
                      ? 'Presenting structured clinical templates is proven to lower admission barriers in Kenyan schools. Download your personalized advocacy package.'
                      : 'Kuwapa shule barua rasmi zilizorekebishwa kitaalamu inasaidia kupunguza kukataliwa kwa watoto wetu. Pakua faili hili sasa.'}
                  </p>

                  <button
                    onClick={onNavigateToDownloads}
                    className="w-full bg-[#C77700] hover:bg-[#a66300] text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{language === 'en' ? 'Go to Download Library' : 'Nenda Maktabani Kupakua'}</span>
                  </button>
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-gray-400 hover:text-[#2D3748] flex items-center gap-1 mx-auto mt-6 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Retake Readiness Test' : 'Pima Upya'}</span>
                </button>

              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
