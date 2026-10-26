import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight, CheckCircle, Mail, Bell } from 'lucide-react';

interface EventsCalendarProps {
  language: 'en' | 'swa';
}

interface EventItem {
  id: string;
  titleEn: string;
  titleSw: string;
  type: 'world-day' | 'meetup' | 'workshop' | 'school-event';
  typeLabelEn: string;
  typeLabelSw: string;
  date: string;
  time: string;
  locationEn: string;
  locationSw: string;
  descEn: string;
  descSw: string;
  speaker: string;
}

export default function EventsCalendar({ language }: EventsCalendarProps) {
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [remindMeEmail, setRemindMeEmail] = useState<string>('');
  const [emailAlertSubmitted, setEmailAlertSubmitted] = useState<boolean>(false);

  const events: EventItem[] = [
    {
      id: 'evt-world-day-1',
      titleEn: 'Kenya World Autism Awareness Day Walk & Celebration',
      titleSw: 'Mbio na Maadhimisho ya Siku ya Usonji Duniani nchini Kenya',
      type: 'world-day',
      typeLabelEn: 'World Autism Day',
      typeLabelSw: 'Siku ya Usonji',
      date: 'April 2, 2027',
      time: '8:00 AM - 1:00 PM',
      locationEn: 'Uhuru Park & Central Business District, Nairobi',
      locationSw: 'Uhuru Park na Kati ya Jiji, Nairobi',
      descEn: 'Annual community-led march to raise public awareness, overcome stigma, and celebrate neurodiversity with family fun zones and clinical help booths.',
      descSw: 'Mkutano wa kila mwaka wa jamii kuelimisha umma, kuondoa unyanyapaa, na kusherehekea watoto wetu kwa michezo na ushauri wa bure.',
      speaker: 'Organized by Autism Alliance of Kenya'
    },
    {
      id: 'evt-meetup-1',
      titleEn: 'Caregiver Peer Support & Coffee Meetup',
      titleSw: 'Mkutano wa Wazazi na Walezi Kushauriana',
      type: 'meetup',
      typeLabelEn: 'Caregiver Meetup',
      typeLabelSw: 'Mkutano wa Wazazi',
      date: 'July 25, 2026',
      time: '10:00 AM - 12:30 PM',
      locationEn: 'Java House Coffee Shop, Nyali, Mombasa',
      locationSw: 'Java House Coffee Shop, Nyali, Mombasa',
      descEn: 'A safe, informal, non-judgmental discussion circle for Kenyan moms, dads, and guardians to share practical tips on sensory management and shadow teaching.',
      descSw: 'Mzunguko salama usio na hukumu kwa akina mama na baba kubadilishana mawazo kuhusu jinsi ya kulea na kusaidia watoto wetu.',
      speaker: 'Host: Mama Zawadi'
    },
    {
      id: 'evt-workshop-1',
      titleEn: 'Online Workshop: Demystifying AAC & PECS at Home',
      titleSw: 'Warsha ya Mtandaoni: Jinsi ya Kutumia Kadi za Picha Nyumbani',
      type: 'workshop',
      typeLabelEn: 'Online Workshop',
      typeLabelSw: 'Warsha ya Mtandaoni',
      date: 'August 12, 2026',
      time: '7:30 PM - 9:00 PM EAT',
      locationEn: 'Live on Google Meet (Link provided on registration)',
      locationSw: 'Mkutano wa Google Meet (Kiungo utatumiwa baada ya kujiandikisha)',
      descEn: 'Learn step-by-step how to introduce physical AAC speech cards and visual routines to reduce frustration-induced non-verbal tantrums.',
      descSw: 'Jifunze hatua kwa hatua jinsi ya kuanzisha kadi za picha nyumbani ili kupunguza hasira za kukosa kuwasiliana.',
      speaker: 'Speaker: Dr. Angela Kamau (Speech Therapist)'
    },
    {
      id: 'evt-school-1',
      titleEn: 'Mainstream Inclusion & Shadow Teacher Support Forum',
      titleSw: 'Kongamano la Shule Jumuishi na Walimu Wasaidizi',
      type: 'school-event',
      typeLabelEn: 'School Awareness Event',
      typeLabelSw: 'Kongamano la Shule',
      date: 'September 5, 2026',
      time: '9:00 AM - 4:00 PM',
      locationEn: 'Kenyatta University Conference Center, Nairobi',
      locationSw: 'Kenyatta University Conference Center, Nairobi',
      descEn: 'An intensive forum for headteachers, parents, and shadow assistants to bridge legal guidelines, classroom adaptations, and Individual Education Plans (IEPs).',
      descSw: 'Kongamano la wakuu wa shule, wazazi, na walimu wasaidizi kujadili miongozo ya sheria na mikakati ya kusoma.',
      speaker: 'Panel: Special Education Directors'
    }
  ];

  const handleRegister = (id: string) => {
    if (registeredIds.includes(id)) {
      setRegisteredIds(prev => prev.filter(item => item !== id));
    } else {
      setRegisteredIds(prev => [...prev, id]);
    }
  };

  const handleAlertSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailAlertSubmitted(true);
    setTimeout(() => {
      setEmailAlertSubmitted(false);
      setRemindMeEmail('');
    }, 3000);
  };

  return (
    <div id="events-calendar-module" className="events-calendar bg-white rounded-[32px] p-6 sm:p-8 border border-[#C77700]/10 shadow-sm">
      
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-gray-100 pb-6">
        <div>
          <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-[0.25em] block mb-1">
            {language === 'en' ? 'KENYAN COMMUNITY GATHERINGS' : 'MIPANGO YA JAMII KENYA'}
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2D3748]">
            {language === 'en' ? 'Upcoming Advocacy & Therapy Events' : 'Matukio Yajayo ya Jamii na Warsha'}
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            {language === 'en'
              ? 'Join free educational webinars, regional caregiver support meetups, and school advocacy summits to break stigma in Kenya.'
              : 'Jiunge na warsha za bure mtandaoni, mikutano ya wazazi mikoani, na kongamano za kuelimisha shule zetu.'}
          </p>
        </div>

        {/* Subscribe Alerts form */}
        <form onSubmit={handleAlertSignup} className="bg-[#FFF8EE] rounded-2xl p-4 border border-[#C77700]/10 flex flex-col sm:flex-row gap-2 w-full lg:w-auto shrink-0">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black uppercase text-[#C77700] tracking-widest flex items-center gap-1">
              <Bell className="w-3 h-3" />
              {language === 'en' ? 'Never Miss an Event' : 'Usipitwe na Tukio'}
            </span>
            <input
              type="email"
              required
              value={remindMeEmail}
              onChange={(e) => setRemindMeEmail(e.target.value)}
              placeholder={language === 'en' ? 'Your email address' : 'Barua pepe yako'}
              className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#C77700]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#2F6B4F] hover:bg-[#1f4734] text-white px-4 py-2 rounded-xl text-xs font-bold self-end w-full sm:w-auto cursor-pointer transition-colors"
          >
            {emailAlertSubmitted 
              ? (language === 'en' ? 'Subscribed!' : 'Umejiunga!') 
              : (language === 'en' ? 'Notify Me' : 'Nijulishe')}
          </button>
        </form>
      </div>

      {/* Events Directory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => {
          const isRegistered = registeredIds.includes(event.id);
          return (
            <div
              key={event.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 flex flex-col md:flex-row gap-5 hover:shadow-md hover:border-gray-200 transition-all"
            >
              {/* Date Box Column */}
              <div className="md:w-32 shrink-0 bg-[#FFF8EE] border border-[#C77700]/10 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                <span className="text-[10px] font-black text-[#C77700] uppercase tracking-widest block">
                  {event.date.split(' ')[0].substring(0, 3)}
                </span>
                <span className="text-2xl font-serif font-black text-[#2D3748] my-1">
                  {event.date.split(' ')[1].replace(',', '')}
                </span>
                <span className="text-[9px] font-bold text-gray-400">
                  {event.date.split(' ')[2]}
                </span>
              </div>

              {/* Event Content Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/10">
                      {language === 'en' ? event.typeLabelEn : event.typeLabelSw}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-[#2D3748] leading-snug mb-2">
                    {language === 'en' ? event.titleEn : event.titleSw}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2 sm:line-clamp-none">
                    {language === 'en' ? event.descEn : event.descSw}
                  </p>

                  {/* Metadata Row */}
                  <div className="space-y-1.5 text-xs text-gray-600 font-medium mb-5">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C77700] shrink-0" />
                      <span className="line-clamp-1">
                        {language === 'en' ? event.locationEn : event.locationSw}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 italic font-normal">
                      <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{event.speaker}</span>
                    </div>
                  </div>
                </div>

                {/* CTA registration Button */}
                <button
                  onClick={() => handleRegister(event.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                    isRegistered
                      ? 'bg-green-500/10 text-green-600 border-green-500/20'
                      : 'bg-[#2D3748] hover:bg-black text-white border-transparent'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle className="w-4 h-4 fill-current text-green-600" />
                      <span>{language === 'en' ? 'Registered • Link Sent' : 'Umejisajili • Tuma Kiungo'}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'en' ? 'Register Now' : 'Sajili Nafasi'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
