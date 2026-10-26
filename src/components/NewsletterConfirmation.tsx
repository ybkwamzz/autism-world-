import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  HeartHandshake, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight,
  MailCheck,
  Calendar
} from 'lucide-react';

interface NewsletterConfirmationProps {
  language: 'en' | 'swa';
}

export default function NewsletterConfirmation({ language }: NewsletterConfirmationProps) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const stateEmail = (location.state as { email?: string } | null)?.email;
  const subscribedEmail = stateEmail || searchParams.get('email') || '';

  const contentHighlights = [
    {
      icon: Calendar,
      accent: 'text-[#C77700] bg-[#C77700]/10',
      title: language === 'en' ? 'Community Updates & Workshops' : 'Taarifa za Jamii na Warsha',
      description: language === 'en'
        ? 'Timely updates on sensory-friendly family meetups, county support networks, and special education initiatives across Kenya.'
        : 'Taarifa za wakati kuhusu mikutano ya familia rafiki kwa hisia, mitandao ya usaidizi ya kaunti, na mipango ya elimu maalum kote Kenya.'
    },
    {
      icon: BookOpen,
      accent: 'text-[#2F6B4F] bg-[#2F6B4F]/10',
      title: language === 'en' ? 'Printable Therapy Resources' : 'Zana za Tiba Zinazoweza Kuchapishwa',
      description: language === 'en'
        ? 'New bilingual (English & Kiswahili) AAC communication cards, visual schedules, and practical home-based sensory guides.'
        : 'Kadi mpya za mawasiliano za AAC kwa Kiingereza na Kiswahili, ratiba za picha, na miongozo rahisi ya hisia nyumbani.'
    },
    {
      icon: HeartHandshake,
      accent: 'text-[#E89B2E] bg-[#E89B2E]/15',
      title: language === 'en' ? 'Real Impact Stories' : 'Hadithi Halisi za Mafanikio',
      description: language === 'en'
        ? 'Authentic, encouraging reflections shared by Kenyan parents, siblings, teachers, and autistic advocates breaking stigma.'
        : 'Simulizi za kweli na za kutia moyo kutoka kwa wazazi, ndugu, walimu, na watetezi wa usonji nchini Kenya wanaovunja unyanyapaa.'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-8">
      <div className="bg-white dark:bg-[#231E1A] rounded-[36px] border border-[#C77700]/15 dark:border-white/10 shadow-sm overflow-hidden">
        
        {/* Top Confirmation Banner */}
        <div className="bg-[#2F6B4F] text-[#FFF8EE] px-6 py-10 sm:px-12 sm:py-12 relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '18px 18px' }}
          />
          
          <div className="relative z-10 flex flex-col items-start max-w-2xl">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center mb-6 border border-white/25">
              <MailCheck className="w-7 h-7 text-[#E89B2E]" />
            </div>

            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#E89B2E] mb-2">
              {language === 'en' ? 'SUBSCRIPTION CONFIRMED' : 'USAJILI ULIOTHIBITISHWA'}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight tracking-tight text-white">
              {language === 'en' 
                ? 'Asante! Thank You for Joining Our Community.' 
                : 'Asante! Umejiunga Rasmi na Jamii Yetu.'}
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[#FFF8EE]/90 leading-relaxed">
              {language === 'en'
                ? 'You are now subscribed to the Autism Unmasked Kenya monthly newsletter. Together, we are building a more inclusive, understanding environment for every neurodivergent child and family.'
                : 'Sasa umejisajili kupokea jarida la kila mwezi la Autism Unmasked Kenya. Pamoja, tunajenga mazingira jumuishi na yenye uelewa kwa kila mtoto na familia.'}
            </p>

            {subscribedEmail && (
              <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#FFF8EE] bg-black/20 px-4 py-2 rounded-xl border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-[#E89B2E] shrink-0" />
                <span>
                  {language === 'en' 
                    ? `Confirmation sent to ${subscribedEmail}` 
                    : `Uthibitisho umetumwa kwa ${subscribedEmail}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-10 lg:p-12 space-y-10">
          
          {/* What You Will Receive Section */}
          <section aria-labelledby="what-to-expect-heading">
            <div className="mb-6">
              <span className="text-[10px] font-bold text-[#C77700] uppercase tracking-[0.2em] block">
                {language === 'en' ? 'WHAT TO EXPECT IN YOUR INBOX' : 'UTAKACHOPOKEA KWENYE BARUA PEPE'}
              </span>
              <h2 id="what-to-expect-heading" className="text-2xl font-bold font-serif text-[#2D3748] dark:text-[#F5EFEB] mt-1">
                {language === 'en' ? 'Curated Support, Once a Month' : 'Msaada Maalum, Mara Moja kwa Mwezi'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                {language === 'en'
                  ? 'Every edition is thoughtfully prepared by Kenyan educators, therapists, and parents to bring practical value directly to your home.'
                  : 'Kila toleo huandaliwa kwa uangalifu na walimu, wataalamu wa tiba, na wazazi nchini Kenya ili kuleta manufaa ya moja kwa moja nyumbani kwako.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contentHighlights.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={idx}
                    className="rounded-2xl p-6 bg-[#FFF8EE]/70 dark:bg-white/5 border border-[#C77700]/15 dark:border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${item.accent}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold font-serif text-[#2D3748] dark:text-[#F5EFEB] mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Privacy Commitment Section */}
          <section 
            aria-labelledby="privacy-commitment-heading"
            className="rounded-2xl p-6 sm:p-8 bg-[#FFF8EE] dark:bg-white/5 border border-[#2F6B4F]/25 flex flex-col sm:flex-row items-start gap-5"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#2F6B4F]/10 text-[#2F6B4F] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 id="privacy-commitment-heading" className="text-lg font-bold font-serif text-[#2D3748] dark:text-[#F5EFEB]">
                {language === 'en' ? 'Our Privacy & Dignity Commitment' : 'Ahadi Yetu ya Faragha na Heshima'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {language === 'en'
                  ? 'We deeply respect your family’s trust and privacy. Your email address is used strictly to share Autism Unmasked Kenya updates, resources, and community stories. We will never sell, rent, or share your personal information with third parties, and we never send spam. You can update your preferences or unsubscribe with a single click at the bottom of any email.'
                  : 'Tunaheshimu sana imani na faragha ya familia yako. Anwani yako ya barua pepe inatumika tu kushiriki taarifa, nyaraka za tiba, na hadithi za jamii za Autism Unmasked Kenya. Kamwe hatutauza, kukodisha, au kushiriki taarifa zako binafsi na wahusika wengine. Unaweza kujiondoa wakati wowote kwa kubofya mara moja tu.'}
              </p>
            </div>
          </section>

          {/* Navigation Actions */}
          <div className="pt-4 border-t border-[#C77700]/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#C77700] hover:bg-[#a66200] text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'en' ? 'Back to Homepage' : 'Rudi Mwanzo (Homepage)'}</span>
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
              <Link
                to="/toolkit"
                className="text-[#2F6B4F] hover:text-[#C77700] transition-colors flex items-center gap-1 py-2 px-3"
              >
                <span>{language === 'en' ? 'Explore Therapy Toolkit' : 'Chunguza Zana za Tiba'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">•</span>
              <Link
                to="/blog"
                className="text-[#2D3748] dark:text-[#F5EFEB] hover:text-[#C77700] transition-colors flex items-center gap-1 py-2 px-3"
              >
                <span>{language === 'en' ? 'Read Community Stories' : 'Soma Hadithi za Jamii'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
