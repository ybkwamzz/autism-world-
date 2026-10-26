import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Play, 
  BookMarked, 
  ArrowRight, 
  Compass, 
  Clapperboard, 
  CalendarDays, 
  AudioLines, 
  Rows3, 
  Wind,
  CheckCircle2,
  Mail
} from 'lucide-react';
import { Story } from '../types';
import InspirationalQuoteWidget from './InspirationalQuoteWidget';

interface HomeProps {
  language: 'en' | 'swa';
  onOpenModal: (modalName: 'video' | 'donate') => void;
  recentStories: Story[];
  onOpenLumo: () => void;
  onOpenTour?: () => void;
}

export default function Home({
  language,
  onOpenModal,
  recentStories,
  onOpenLumo,
  onOpenTour
}: HomeProps) {
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newsletterEmail.trim();
    if (!trimmed) return;
    navigate(`/newsletter-confirmation?email=${encodeURIComponent(trimmed)}`, {
      state: { email: trimmed }
    });
  };
  return (
    <div className="flex flex-col gap-12 w-full">
      
      {/* Top Section: Hero (Left) and Quick Guidance Summary (Right) */}
      <div id="hero-section" className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        
        {/* Left Hero Block (60% equivalent on desktop) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <section className="relative min-h-[360px] bg-[#C77700] rounded-[36px] overflow-hidden flex flex-col justify-end p-6 sm:p-10 text-white shadow-lg border-4 border-white transition-transform hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10"></div>
            
            {/* Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none z-0 animate-pulse" 
              style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '16px 16px' }}
            ></div>
            
            <div className="relative z-20 w-full mt-12">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.3em] mb-3 block text-[#E89B2E]">
                {language === 'en' ? 'SUPPORTING EVERY MIND' : 'KUSAIDIA KILA AKILI'}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-serif leading-[1.0] tracking-tight">
                {language === 'en' ? (
                  <>Empowering <br />Our Autistic <br />Community.</>
                ) : (
                  <>Kuwezesha <br />Jamii Yetu <br />ya Usonji.</>
                )}
              </h2>
              <p className="mt-4 max-w-lg text-xs sm:text-sm text-[#FFF8EE]/90 leading-relaxed font-semibold">
                {language === 'en' 
                  ? "Sharing real stories, breaking myths, and supporting Kenyan families to build a more inclusive society where every brain is appreciated."
                  : "Kushiriki hadithi halisi, kuvunja dhana mbaya, na kusaidia familia nchini Kenya kujenga jamii yenye usawa ambapo kila akili inathaminiwa."}
              </p>
              
              <div className="mt-6 flex flex-wrap gap-3">
                {onOpenTour && (
                  <button 
                    onClick={onOpenTour}
                    className="flex items-center gap-2 bg-[#C77700] hover:bg-[#a66200] text-white px-5 py-3 rounded-full text-xs font-extrabold tracking-wider uppercase transition-transform transform hover:scale-105 cursor-pointer shadow-lg border border-white/20"
                  >
                    <Compass className="w-4 h-4 animate-spin-slow" />
                    <span>{language === 'en' ? 'Start App Tour' : 'Anza Mwongozo'}</span>
                  </button>
                )}
                <Link 
                  to="/autism-world"
                  className="flex items-center gap-2 bg-[#2F6B4F] hover:bg-[#23533d] text-white px-5 py-3 rounded-full text-xs font-extrabold tracking-wider uppercase transition-transform transform hover:scale-105 cursor-pointer shadow-lg border border-white/20"
                >
                  <Clapperboard className="w-4 h-4 shrink-0" />
                  <span>{language === 'en' ? 'Autism World' : 'Autism World'}</span>
                </Link>
                <button 
                  onClick={() => onOpenModal('video')}
                  className="flex items-center gap-2 bg-[#E89B2E] hover:bg-[#d1841e] text-[#2D3748] px-5 py-3 rounded-full text-xs font-extrabold tracking-wider uppercase transition-transform transform hover:scale-105 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{language === 'en' ? 'Watch Intro Video' : 'Tazama Video'}</span>
                </button>
                <Link 
                  to="/toolkit"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-3 rounded-full text-xs font-bold border border-white/25 transition-colors"
                >
                  <span>{language === 'en' ? 'Explore Toolkit' : 'Chunguza Zana'}</span>
                </Link>
              </div>
            </div>

            {/* Absolute Corner Accent Play Badge */}
            <div 
              onClick={() => onOpenModal('video')}
              className="absolute top-6 right-6 sm:top-10 sm:right-10 z-20 w-12 h-12 bg-white/20 hover:bg-white/35 backdrop-blur-md rounded-full flex items-center justify-center border border-white/35 cursor-pointer transition-all transform hover:scale-110 shadow-lg"
              title="Watch video"
            >
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
          </section>
        </div>

        {/* Right Top Block (40% equivalent on desktop): Dynamic educational highlights */}
        <div className="lg:col-span-4 flex flex-col gap-6 justify-between bg-white rounded-[36px] p-6 sm:p-8 border border-[#C77700]/10 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-[#2F6B4F] mb-4">
              <BookMarked className="w-5 h-5" />
              <span className="text-xs font-extrabold uppercase tracking-widest">
                {language === 'en' ? 'Autism Facts' : 'Ukweli wa Usonji'}
              </span>
            </div>
            <h3 className="text-2xl font-bold font-serif text-[#2D3748] mb-3 leading-tight">
              {language === 'en' ? 'Understanding Autism Spectrum' : 'Kuelewa Spectrum ya Usonji'}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              {language === 'en'
                ? "Autism is a neurological variation. It influences how a person perceives, processes sensory stimuli, and interacts with others. It is NOT an illness to cure, but a processing difference to respect and accommodate."
                : "Usonji ni tofauti ya kinyurolojia. Huathiri jinsi mtu anavyotambua na kushirikiana na wengine. Sio ugonjwa wa kutibu, bali ni tofauti ya jinsi ubongo unavyofanya kazi inayohitaji heshima na malazi."}
            </p>
            
            <div className="border-t border-[#C77700]/10 pt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2F6B4F]/10 flex items-center justify-center text-[#2F6B4F] shrink-0 font-bold text-xs">✓</div>
                <p className="text-[11px] text-[#2D3748]/90 font-semibold leading-normal">
                  <strong>{language === 'en' ? 'Sensory processing' : 'Usindikaji wa hisia'}:</strong> {language === 'en' ? 'Lights, sounds, textures can feel extremely amplified.' : 'Taa, sauti, au vitambaa vinaweza kusikika kwa nguvu sana.'}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2F6B4F]/10 flex items-center justify-center text-[#2F6B4F] shrink-0 font-bold text-xs">✓</div>
                <p className="text-[11px] text-[#2D3748]/90 font-semibold leading-normal">
                  <strong>{language === 'en' ? 'Communication' : 'Mawasiliano'}:</strong> {language === 'en' ? 'Using visual supports dramatically improves expression and calmness.' : 'Kutumia misaada ya picha husaidia sana kujieleza na kuleta utulivu.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#C77700]/10 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
              {language === 'en' ? 'Guided Support' : 'Usaidizi wa Kujitolea'}
            </span>
            <button 
              onClick={onOpenLumo}
              className="text-xs font-black text-[#C77700] hover:text-[#2D3748] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'en' ? 'Chat with Lumo' : 'Ongea na Lumo'} &rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Inspirational Encouragement for Parents */}
      <section id="daily-inspiration" className="w-full">
        <InspirationalQuoteWidget 
          language={language} 
          onOpenLumo={onOpenLumo} 
        />
      </section>

      {/* Therapy Toolkit Preview Section */}
      <section className="bg-[#FFF8EE] border-t-2 border-[#C77700]/10 pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
          <div>
            <span className="text-[10px] font-bold text-[#C77700] uppercase tracking-[0.25em]">
              {language === 'en' ? 'SUPPORTIVE EXPERIENCES' : 'MBINU ZA MSAADA'}
            </span>
            <h2 className="font-bold text-3xl font-serif text-[#2D3748] mt-1">
              {language === 'en' ? 'Therapy Toolkit' : 'Zana za Tiba'}
            </h2>
          </div>
          <Link 
            to="/toolkit"
            className="text-xs font-bold text-[#2F6B4F] bg-[#2F6B4F]/10 hover:bg-[#2F6B4F]/25 px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer"
          >
            <span>{language === 'en' ? 'View All Tools' : 'Angalia Zana Zote'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Quick Schedule Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 card-h-shadow flex flex-col justify-between h-full">
            <div>
              <div className="w-11 h-11 bg-[#C77700]/10 rounded-xl flex items-center justify-center mb-4">
                <CalendarDays className="w-5 h-5 text-[#C77700]" />
              </div>
              <h3 className="text-lg font-bold text-[#2D3748] mb-1">{language === 'en' ? 'Visual Schedules' : 'Ratiba za Picha'}</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                {language === 'en' ? 'Predictable visual schedule planners that lower everyday learning stress.' : 'Mratibu wa ratiba ya kadi za picha inayopunguza wasiwasi wa kila siku.'}
              </p>
            </div>
            <Link 
              to="/toolkit/schedule"
              className="w-full bg-[#2D3748] hover:bg-black text-center text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider block transition-colors"
            >
              {language === 'en' ? 'Open Scheduler' : 'Fungua Ratiba'}
            </Link>
          </div>

          {/* Quick Cards Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 card-h-shadow flex flex-col justify-between h-full">
            <div>
              <div className="w-11 h-11 bg-[#E89B2E]/10 rounded-xl flex items-center justify-center mb-4">
                <AudioLines className="w-5 h-5 text-[#E89B2E]" />
              </div>
              <h3 className="text-lg font-bold text-[#2D3748] mb-1">{language === 'en' ? 'AAC Speech Cards' : 'Kadi za Sauti (AAC)'}</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                {language === 'en' ? 'Audio flashcards supporting non-verbal speech needs instantly.' : 'Kadi zenye sauti kuwasaidia watoto kueleza mahitaji kuanzia chakula hadi hisia.'}
              </p>
            </div>
            <Link 
              to="/toolkit/cards"
              className="w-full bg-[#2D3748] hover:bg-black text-center text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider block transition-colors"
            >
              {language === 'en' ? 'Open Soundboard' : 'Fungua Sauti'}
            </Link>
          </div>

          {/* Quick Sentence Board Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 card-h-shadow flex flex-col justify-between h-full">
            <div>
              <div className="w-11 h-11 bg-[#2F6B4F]/10 rounded-xl flex items-center justify-center mb-4">
                <Rows3 className="w-5 h-5 text-[#2F6B4F]" />
              </div>
              <h3 className="text-lg font-bold text-[#2D3748] mb-1">{language === 'en' ? 'Communication Strip' : 'Ukanda wa Maneno'}</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                {language === 'en' ? 'Allows children to build and read aloud two-step demand sentences.' : 'Huwawezesha watoto kuchagua kitendo na kitu ili kuongea kwa picha.'}
              </p>
            </div>
            <Link 
              to="/toolkit/board"
              className="w-full bg-[#2D3748] hover:bg-black text-center text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider block transition-colors"
            >
              {language === 'en' ? 'Open Board' : 'Fungua Ukanda'}
            </Link>
          </div>

          {/* Quick Calming Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 card-h-shadow flex flex-col justify-between h-full">
            <div>
              <div className="w-11 h-11 bg-[#C77700]/10 rounded-xl flex items-center justify-center mb-4">
                <Wind className="w-5 h-5 text-[#C77700]" />
              </div>
              <h3 className="text-lg font-bold text-[#2D3748] mb-1">{language === 'en' ? 'Sensory Calming Room' : 'Chumba cha Kutuliza'}</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                {language === 'en' ? 'Animated calming visual breathing aids coupled with sound generators.' : 'Mdundo wa hisia wa kupumua na mchanganyiko wa sauti tulivu.'}
              </p>
            </div>
            <Link 
              to="/toolkit/calm"
              className="w-full bg-[#2F6B4F] hover:bg-[#1e4432] text-center text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider block transition-colors"
            >
              {language === 'en' ? 'Enter Room' : 'Ingia Chumbani'}
            </Link>
          </div>

        </div>
      </section>

      {/* Featured Stories Teaser */}
      <section className="bg-[#FFF8EE] border-t-2 border-[#C77700]/10 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
          <div>
            <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-widest">
              {language === 'en' ? 'COMMUNITY STORIES' : 'HADITHI ZA JAMII'}
            </span>
            <h2 className="font-bold text-3xl font-serif text-[#2D3748] mt-1">
              {language === 'en' ? 'Featured Journeys' : 'Safari Zilizoangaziwa'}
            </h2>
          </div>
          <Link 
            to="/blog" 
            className="text-xs font-bold text-[#C77700] hover:text-[#2D3748] transition-colors flex items-center gap-1 border-b border-[#C77700]"
          >
            <span>{language === 'en' ? 'Read All Stories' : 'Soma Hadithi Zote'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentStories.slice(0, 3).map((story) => (
            <div 
              key={story.id} 
              className={`rounded-2xl p-6 card-h-shadow flex flex-col justify-between border transition-all h-full ${
                story.role === 'Sibling' 
                  ? 'bg-[#2F6B4F] text-white border-[#2F6B4F]' 
                  : 'bg-white text-[#2D3748] border-slate-200/80 dark:border-white/10'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    story.role === 'Sibling' 
                      ? 'bg-white/20 text-[#FFF8EE]' 
                      : 'bg-[#C77700]/10 text-[#C77700]'
                  }`}>
                    {story.role}
                  </span>
                  <span className={`text-[10px] ${story.role === 'Sibling' ? 'text-white/70' : 'text-gray-400'}`}>
                    {story.location}
                  </span>
                </div>
                <h3 className="text-md sm:text-lg font-bold font-serif mb-2 leading-tight">
                  {story.title}
                </h3>
                <p className={`text-xs leading-relaxed line-clamp-5 ${story.role === 'Sibling' ? 'text-white/85 italic' : 'text-gray-600'}`}>
                  "{story.content}"
                </p>
              </div>
              
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-current/10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  story.role === 'Sibling' ? 'bg-white/20 text-white' : 'bg-[#C77700]/10 text-[#C77700]'
                }`}>
                  {story.name.charAt(0)}
                </div>
                <span className="text-[10px] font-bold">
                  {story.name} • {story.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="bg-[#2D3748] text-[#FFF8EE] rounded-[32px] p-6 sm:p-10 relative overflow-hidden shadow-md border border-white/10">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-[#E89B2E] mb-2">
              <Mail className="w-4 h-4" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em]">
                {language === 'en' ? 'MONTHLY COMMUNITY NEWSLETTER' : 'JARIDA LA JAMII LA KILA MWEZI'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              {language === 'en' ? 'Stay Connected with Autism Unmasked Kenya' : 'Endelea Kuunganishwa na Autism Unmasked Kenya'}
            </h2>
            <p className="text-xs sm:text-sm text-[#FFF8EE]/80 mt-2 leading-relaxed">
              {language === 'en'
                ? 'Subscribe to receive free printable AAC visual resources, sensory-friendly event updates across Kenya, and real impact stories from local families.'
                : 'Jisajili ili upokee nyaraka za bure za picha za AAC, taarifa za matukio rafiki kwa hisia kote Kenya, na hadithi halisi kutoka kwa familia.'}
            </p>
          </div>

          <form onSubmit={handleNewsletterSignup} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 shrink-0">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder={language === 'en' ? 'Enter your email address' : 'Ingiza barua pepe yako'}
              className="w-full sm:w-72 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[#E89B2E]"
            />
            <button
              type="submit"
              className="bg-[#C77700] hover:bg-[#d1841e] text-white px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
            >
              {language === 'en' ? 'Subscribe' : 'Jisajili'}
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
