import React, { useState } from 'react';
import { HelpCircle, RefreshCw, AlertTriangle, CheckCircle, Sparkles, HelpCircle as QuestionIcon } from 'lucide-react';

interface MythBusterProps {
  language: 'en' | 'swa';
}

interface MythItem {
  id: string;
  mythEn: string;
  mythSw: string;
  factEn: string;
  factSw: string;
  contextEn: string;
  contextSw: string;
}

export default function MythBuster({ language }: MythBusterProps) {
  const [flippedIds, setFlippedIds] = useState<string[]>([]);

  const myths: MythItem[] = [
    {
      id: 'witchcraft',
      mythEn: 'Is autism caused by witchcraft, ancestral curses, or parental sins?',
      mythSw: 'Je, usonji unasababishwa na uchawi, laana za ukoo, au madhambi ya wazazi?',
      factEn: 'Autism is a natural, biological brain developmental variation. It is not spiritual retribution or a curse.',
      factSw: 'Usonji ni ulemavu wa kibiolojia wa ukuaji wa ubongo. Sio kisasi cha kiroho wala laana ya ukoo.',
      contextEn: 'Medical studies globally confirm that autism is a genetic neurodevelopmental condition that begins during fetal development. Parents did nothing wrong, and children are not cursed.',
      contextSw: 'Utafiti wa daktari unathibitisha usonji unasababishwa na vinasaba vya uzazi (genetics). Wazazi hawajafanya kosa lolote, na mtoto hana laana wala hajarogwa.'
    },
    {
      id: 'bad-parenting',
      mythEn: 'Is autism caused by lazy parenting, neglect, or too much screen time?',
      mythSw: 'Je, usonji unatokana na ulezi mbaya, kupuuza mtoto, au kuangalia sana runinga?',
      factEn: 'Autism is innate from birth. Parenting style does not cause autism.',
      factSw: 'Usonji upo tangu kuzaliwa. Tabia au mbinu ya ulezi haisababishi usonji.',
      contextEn: 'While screen time can impact developmental milestones or speech, it does not cause autism. Caregivers of autistic children are incredibly hard-working and deserve support, not blame.',
      contextSw: 'Ingawa kuangalia sana simu/TV kunaweza kuchelewesha kuongea kwa mtoto yeyote, hakusababishi usonji. Usonji ni jinsi ubongo ulivyofanya kazi tangu kuzaliwa.'
    },
    {
      id: 'non-verbal-intelligence',
      mythEn: 'Are children who cannot speak (non-verbal) incapable of learning or unintelligent?',
      mythSw: 'Je, watoto wasioweza kuongea hawana akili au hawawezi kusoma kabisa?',
      factEn: 'Inability to speak does not mean inability to think, feel, or learn.',
      factSw: 'Kutoweza kuongea hakumaanishi kutoweza kufikiri, kuhisi, au kusoma.',
      contextEn: 'Autistic children who are non-verbal have deep thoughts, feelings, and high intellectual capacity. When given alternative AAC speech cards or visual boards, they communicate brilliant ideas and excel.',
      contextSw: 'Watoto wasioweza kuongea wana uwezo mkubwa wa kufikiri na kuhisi. Wakipewa kadi za picha (PECS) au kompyuta ya sauti (AAC), wanaweza kueleza mawazo yao makubwa na kufaulu sana.'
    },
    {
      id: 'contagious',
      mythEn: 'Can autism be passed like a disease to other children in school?',
      mythSw: 'Je, usonji ni ugonjwa unaoweza kuambukiza watoto wengine shuleni?',
      factEn: 'Autism is not contagious. It is not an infection or disease.',
      factSw: 'Usonji hauambukizi kabisa. Sio ugonjwa wa virusi au bakteria.',
      contextEn: 'You cannot "catch" autism by playing, sharing food, or sitting in class with an autistic child. Mainstream children actually learn empathy, tolerance, and kindness by studying with neurodivergent peers.',
      contextSw: 'Huwezi kuambukizwa usonji kwa kucheza au kusoma pamoja na mtoto mwenye usonji. Watoto wengine hupata faida ya kujifunza upendo na uvumilivu wanaposoma nao darasani.'
    },
    {
      id: 'wealthy-condition',
      mythEn: 'Is autism a modern "foreign" condition that only affects wealthy families or urban children?',
      mythSw: 'Je, usonji ni ugonjwa mpya wa kigeni unaoathiri tu watoto wa matajiri au wa mjini?',
      factEn: 'Autism exists worldwide in all social classes, tribes, and income brackets. It is not limited to wealthy or urban populations.',
      factSw: 'Usonji upo kote ulimwenguni katika kabila zote, tabaka za kijamii, na viwango vyote vya mapato.',
      contextEn: 'Autism has always existed in Kenya, but lack of awareness and clinical diagnostic centers in rural areas previously led to underdiagnosis or misattribution to spiritual causes.',
      contextSw: 'Usonji umekuwepo tangu zamani nchini Kenya, lakini ukosefu wa uelewa na vituo vya kupimia vijijini ulikwamisha kugunduliwa kwake mapema.'
    }
  ];

  const handleCardClick = (id: string) => {
    setFlippedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleRevealAll = () => {
    if (flippedIds.length === myths.length) {
      setFlippedIds([]);
    } else {
      setFlippedIds(myths.map(m => m.id));
    }
  };

  return (
    <div id="myth-buster-hub" className="myth-buster bg-white rounded-[32px] p-6 sm:p-8 border border-[#C77700]/10 shadow-sm">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-100 pb-5">
        <div>
          <span className="text-[10px] font-bold text-[#C77700] uppercase tracking-[0.2em] block mb-1">
            {language === 'en' ? 'CULTURAL ADVOCACY & COMPASSION' : 'KUPINGA UNYANYAPAA NA UPENDO'}
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2D3748]">
            {language === 'en' ? 'Interactive Autism Myth Buster' : 'Ukweli na Hadithi Kuhusu Usonji'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {language === 'en' 
              ? 'Tapping any card reveals the scientific explanation, written gently to support community discussions in Kenya.' 
              : 'Gusa kadi yoyote kuona ukweli wa kitaalamu uliorandishwa na mila zetu ili kuelimisha jamii.'}
          </p>
        </div>

        <button
          onClick={handleRevealAll}
          className="flex items-center gap-1 text-xs font-black uppercase text-[#2F6B4F] bg-[#2F6B4F]/10 px-3 py-1.5 rounded-full hover:bg-[#2F6B4F]/15 cursor-pointer shrink-0 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>
            {flippedIds.length === myths.length 
              ? (language === 'en' ? 'Reset All' : 'Anza Upya') 
              : (language === 'en' ? 'Reveal All Facts' : 'Onyesha Kweli Zote')}
          </span>
        </button>
      </div>

      {/* Grid of Interactive 3D Flip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myths.map((item) => {
          const isFlipped = flippedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item.id)}
              className="h-72 cursor-pointer group [perspective:1000px] rounded-[24px]"
            >
              <div
                className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                  isFlipped ? '[transform:rotateY(180deg)]' : ''
                }`}
              >
                {/* CARD FRONT: The Misconception/Myth */}
                <div className="absolute inset-0 w-full h-full p-6 sm:p-8 bg-gradient-to-br from-[#FFF8EE] to-[#FFF8EE]/50 border-2 border-[#C77700]/15 rounded-[24px] [backface-visibility:hidden] flex flex-col justify-between hover:border-[#C77700]/40 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/10">
                      {language === 'en' ? 'Myth / Swali' : 'Imani Potofu'}
                    </span>
                  </div>

                  <h4 className="text-base font-serif font-bold text-[#2D3748] pr-4 leading-snug">
                    {language === 'en' ? item.mythEn : item.mythSw}
                  </h4>

                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#C77700] transition-colors uppercase tracking-widest flex items-center gap-1">
                    <span>{language === 'en' ? 'Click to reveal truth' : 'Gusa uone ukweli'}</span>
                    <span>&rarr;</span>
                  </span>
                </div>

                {/* CARD BACK: The Reality/Fact */}
                <div className="absolute inset-0 w-full h-full p-6 sm:p-8 bg-white border-2 border-green-500/25 rounded-[24px] [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between shadow-lg shadow-green-500/5">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/10">
                      {language === 'en' ? 'Clinical Fact' : 'Ukweli Halisi'}
                    </span>
                  </div>

                  <div className="my-2 overflow-y-auto max-h-36 pr-1">
                    <h5 className="text-xs font-black text-green-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {language === 'en' ? 'The Science:' : 'Utafiti unavyosema:'}
                    </h5>
                    <p className="text-xs font-bold text-gray-800 leading-snug mb-2">
                      {language === 'en' ? item.factEn : item.factSw}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {language === 'en' ? item.contextEn : item.contextSw}
                    </p>
                  </div>

                  <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest text-center mt-2">
                    {language === 'en' ? 'Click to flip back' : 'Gusa kugeuza kadi'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
