import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, BookmarkCheck, Heart, Sparkles, FolderHeart, 
  Mail, Share2, FileText, MapPin, Calendar, HelpCircle, Info, MessageSquare,
  Search, X, Volume2, Download, CheckCircle2, AlertCircle,
  GraduationCap, CalendarDays, AudioLines, Rows3, Wind, Clapperboard,
  Droplets, UtensilsCrossed, DoorClosed, HeartPulse, Printer, Layers,
  ClipboardList, BookOpen, BarChart3,
  type LucideIcon
} from 'lucide-react';

// Import our new premium clinical modules
import ResourceCenter from './ResourceCenter';
import ServicesDirectory from './ServicesDirectory';
import EventsCalendar from './EventsCalendar';
import JourneyTimeline from './JourneyTimeline';
import MythBuster from './MythBuster';
import SchoolReadiness from './SchoolReadiness';

interface ToolkitProps {
  language: 'en' | 'swa';
}

interface ToolItem {
  id: string;
  titleEn: string;
  titleSw: string;
  descEn: string;
  descSw: string;
  icon: LucideIcon;
  bgIcon: string;
  path: string;
  buttonTextEn: string;
  buttonTextSw: string;
}

interface QuickShortcut {
  id: string;
  titleEn: string;
  titleSw: string;
  descEn: string;
  descSw: string;
  icon: LucideIcon;
  bgClass: string;
  iconColor: string;
  path: string;
  keywords: string[];
  type: 'sound' | 'visual' | 'calm' | 'letter';
}

const quickShortcuts: QuickShortcut[] = [
  {
    id: 'sc-water',
    titleEn: 'Speak: I want water',
    titleSw: 'Sauti: Nataka maji',
    descEn: 'AAC speech output for expressing thirst.',
    descSw: 'Mawasiliano ya sauti ya kuomba maji au kinywaji.',
    icon: Droplets,
    bgClass: 'bg-blue-50 text-blue-600',
    iconColor: 'text-blue-600',
    path: '/toolkit/cards?speak=water',
    keywords: ['water', 'maji', 'drink', 'kunywa', 'thirst', 'kiu', 'aac', 'cards', 'kadi', 'dharura', 'urgent'],
    type: 'sound'
  },
  {
    id: 'sc-food',
    titleEn: 'Speak: I am hungry',
    titleSw: 'Sauti: Nina njaa',
    descEn: 'AAC speech output for expressing hunger.',
    descSw: 'Mawasiliano ya sauti ya kuomba chakula.',
    icon: UtensilsCrossed,
    bgClass: 'bg-orange-50 text-orange-600',
    iconColor: 'text-orange-600',
    path: '/toolkit/cards?speak=food',
    keywords: ['food', 'chakula', 'eat', 'kula', 'hungry', 'njaa', 'aac', 'cards', 'kadi', 'dharura', 'urgent'],
    type: 'sound'
  },
  {
    id: 'sc-toilet',
    titleEn: 'Speak: Bathroom / Chooni',
    titleSw: 'Sauti: Chooni',
    descEn: 'AAC speech output for urgent restroom needs.',
    descSw: 'Mawasiliano ya sauti ya kuomba kwenda msalani.',
    icon: DoorClosed,
    bgClass: 'bg-amber-50 text-amber-600',
    iconColor: 'text-amber-600',
    path: '/toolkit/cards?speak=toilet',
    keywords: ['toilet', 'choo', 'restroom', 'msala', 'pee', 'poop', 'urgent', 'haraka', 'aac', 'kadi', 'bathroom', 'dharura'],
    type: 'sound'
  },
  {
    id: 'sc-help',
    titleEn: 'Speak: Help me please',
    titleSw: 'Sauti: Nisaidie tafadhali',
    descEn: 'AAC speech output for urgent assistance.',
    descSw: 'Mawasiliano ya sauti ya kuomba msaada wa haraka.',
    icon: HelpCircle,
    bgClass: 'bg-red-50 text-red-600',
    iconColor: 'text-red-600',
    path: '/toolkit/cards?speak=help',
    keywords: ['help', 'nisaidie', 'msaada', 'urgent', 'haraka', 'scared', 'pain', 'maumivu', 'aac', 'kadi', 'dharura'],
    type: 'sound'
  },
  {
    id: 'sc-pain',
    titleEn: 'Speak: I feel sick',
    titleSw: 'Sauti: Naumwa / Nina maumivu',
    descEn: 'AAC speech output for signaling physical distress.',
    descSw: 'Mawasiliano ya sauti ya kueleza maumivu mwilini au ugonjwa.',
    icon: HeartPulse,
    bgClass: 'bg-rose-50 text-rose-600',
    iconColor: 'text-rose-600',
    path: '/toolkit/cards?speak=pain',
    keywords: ['pain', 'maumivu', 'hurt', 'sick', 'umiza', 'daktari', 'hospitali', 'aac', 'kadi', 'physic', 'dharura', 'urgent', 'naumwa'],
    type: 'sound'
  },
  {
    id: 'sc-calm-space',
    titleEn: 'Sensory Calming Space',
    titleSw: 'Chumba cha Kutuliza',
    descEn: 'Instant visual ripples and white noise to calm a sensory overload meltdown.',
    descSw: 'Mawimbi ya rangi na sauti ya kutuliza ghadhabu au hofu ya ghafla ya hisia.',
    icon: Wind,
    bgClass: 'bg-emerald-50 text-emerald-600',
    iconColor: 'text-emerald-600',
    path: '/toolkit/calm',
    keywords: ['calm', 'relax', 'sensory', 'overload', 'meltdown', 'anxiety', 'panic', 'noise', 'tuliza', 'ghadhabu', 'hasira', 'hofu', 'fujo'],
    type: 'calm'
  },
  {
    id: 'sc-autism-world',
    titleEn: 'Autism World Scenarios',
    titleSw: 'Matukio ya Autism World',
    descEn: 'Real-world school & home communication scenarios with video player and bounded practice choices.',
    descSw: 'Matukio ya kijamii ya shuleni na nyumbani yenye maswali shirikishi ya mazoezi.',
    icon: Clapperboard,
    bgClass: 'bg-[#2F6B4F]/10 text-[#2F6B4F]',
    iconColor: 'text-[#2F6B4F]',
    path: '/autism-world',
    keywords: ['autism world', 'scenario', 'social story', 'school', 'home', 'communication', 'video', 'practice', 'matukio', 'shule', 'nyumbani', 'mafunzo'],
    type: 'visual'
  }
];

interface SearchableResource {
  id: string;
  titleEn: string;
  titleSw: string;
  descEn: string;
  descSw: string;
  category: string;
  icon: LucideIcon;
  fileName: string;
  fileSize: string;
  keywords: string[];
}

const searchableResources: SearchableResource[] = [
  {
    id: 'advocacy-letter-shadow',
    titleEn: 'Mainstream School Shadow Teacher Advocacy Letter',
    titleSw: 'Barua ya Ombi la Mwalimu Msaidizi (Shadow Teacher)',
    descEn: 'A pre-written clinical-grade template advocating for your child to have a shadow teacher or learning support assistant in mainstream primary schools.',
    descSw: 'Barua rasmi iliyoandikwa kitaalamu kuomba mtoto wako aruhusiwe kuwa na msaidizi wa darasani katika shule za kawaida.',
    category: 'letters',
    icon: FileText,
    fileName: 'Shadow_Teacher_Advocacy_Letter_Kenya.pdf',
    fileSize: '142 KB',
    keywords: ['school', 'shadow', 'teacher', 'advocacy', 'letter', 'barua', 'mwalimu', 'shule', 'primary', 'msaidizi', 'lsa', 'education']
  },
  {
    id: 'guide-caregiver-manual',
    titleEn: 'First-Steps Caregiver Manual: Diagnosed in Kenya',
    titleSw: 'Mwongozo wa Kwanza wa Mlezi: Baada ya Kugunduliwa Kenya',
    descEn: 'A localized handbook explaining medical paths, assessment centers, speech therapies, and support systems available specifically in Kenya.',
    descSw: 'Mwongozo wa kina unaoelezea hatua za kwanza za kufuata, vituo vya kupima, na hospitali za msaada nchini Kenya.',
    category: 'guides',
    icon: BookOpen,
    fileName: 'Autism_Caregiver_First_Steps_Kenya.pdf',
    fileSize: '1.8 MB',
    keywords: ['caregiver', 'manual', 'diagnosed', 'guide', 'handbook', 'medical', 'assessment', 'speech', 'support', 'kenya', 'mwongozo', 'mlezi']
  },
  {
    id: 'worksheet-sensory-diet',
    titleEn: 'Sensory Diet Tracking Worksheet & Daily Routine Planner',
    titleSw: 'Karatasi ya Kufuatilia Lishe ya Sensory na Ratiba ya Kila Siku',
    descEn: 'Structured daily worksheets for caregivers to track and schedule sensory inputs (calming vs. alerting activities) throughout the school day.',
    descSw: 'Ratiba ya kila siku ya kufuatilia jinsi mtoto anavyokabiliana na vichocheo vya sauti, mwanga na hisia mbalimbali.',
    category: 'worksheets',
    icon: BarChart3,
    fileName: 'Sensory_Diet_Planner_Autism.pdf',
    fileSize: '310 KB',
    keywords: ['sensory', 'diet', 'tracker', 'planner', 'schedule', 'routine', 'karatasi', 'sauti', 'mwanga', 'hisia', 'calming', 'meltdown', 'overload']
  },
  {
    id: 'schedule-printable-cards',
    titleEn: 'Printable Visual Schedule Cards (50+ Daily Activities)',
    titleSw: 'Kadi za Picha za Kuchapisha (Shughuli 50+ za Kila Siku)',
    descEn: 'High-contrast printable PECS-style cards for tooth brushing, meals, home tasks, and school routines. Excellent for physical visual boards.',
    descSw: 'Kadi za picha za hali ya juu zinazoweza kuchapishwa kwa ajili ya kupiga mswaki, kula, kuoga, na kusoma.',
    category: 'cards',
    icon: Layers,
    fileName: 'PECS_Printable_Visual_Schedules.pdf',
    fileSize: '2.4 MB',
    keywords: ['PECS', 'printable', 'cards', 'schedule', 'activities', 'routine', 'brush', 'meals', 'home', 'school', 'kadi', 'picha', 'tooth', 'morning']
  },
  {
    id: 'letters-school-accommodations',
    titleEn: 'IEP Accommodation Request Template for Class Teachers',
    titleSw: 'Kiolezo cha Ombi la Marekebisho ya Mitihani na Masomo (IEP)',
    descEn: 'Request official classroom adjustments (extra exam time, sensory breaks, quiet spaces) from Kenyan school boards and headteachers.',
    descSw: 'Barua ya kirafiki na ya kisheria ya kuomba muda wa ziada wa mitihani na nafasi tulivu kwa ajili ya mtoto shuleni.',
    category: 'letters',
    icon: GraduationCap,
    fileName: 'School_Accommodations_IEP_Request.pdf',
    fileSize: '125 KB',
    keywords: ['iep', 'accommodation', 'request', 'school', 'exam', 'teacher', 'shule', 'mitihani', 'barua', 'adjustment', 'classroom', 'break']
  },
  {
    id: 'worksheet-behavior-log',
    titleEn: 'ABC Behavior Log Sheet (Antecedent, Behavior, Consequence)',
    titleSw: 'Karatasi ya ABC ya Kufuatilia Tabia za Mtoto',
    descEn: 'The standard ABA tracking tool to identify environmental triggers and patterns behind behavioral meltdowns.',
    descSw: 'Zana maalumu ya kufuatilia kile kinachosababisha hasira au hofu kwa mtoto na jinsi ya kumsaidia.',
    category: 'worksheets',
    icon: ClipboardList,
    fileName: 'ABC_Behavior_Analysis_Log.pdf',
    fileSize: '180 KB',
    keywords: ['abc', 'behavior', 'log', 'tracking', 'aba', 'trigger', 'meltdown', 'karatasi', 'tabia', 'hasira', 'tantrum', 'anxiety']
  }
];

type TabType = 'apps' | 'downloads' | 'directory' | 'checkers' | 'myths' | 'events';

export default function Toolkit({ language }: ToolkitProps) {
  const [activeTab, setActiveTab] = useState<TabType>('apps');
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  const tools: ToolItem[] = [
    {
      id: 'micro-lesson',
      icon: GraduationCap,
      bgIcon: 'bg-[#2F6B4F]/10',
      titleEn: 'Autism World — Practice',
      titleSw: 'Dunia ya Autism — Mazoezi',
      descEn: 'Guided social-communication scenarios and concept lessons with spaced repetition, for school and home settings.',
      descSw: 'Mazoezi ya mawasiliano ya kijamii na masomo ya dhana kwa marudio, kwa mazingira ya shule na nyumbani.',
      path: '/toolkit/micro-lesson',
      buttonTextEn: 'Start Practice',
      buttonTextSw: 'Anza Mazoezi'
    },
    {
      id: 'schedule',
      icon: CalendarDays,
      bgIcon: 'bg-[#C77700]/10',
      titleEn: 'Visual Schedules',
      titleSw: 'Ratiba za Picha',
      descEn: 'Help children understand what comes next, lowering anxiety and reducing behavioral meltdowns.',
      descSw: 'Saidia watoto kuelewa nini kinafuata, kupunguza wasiwasi na kupunguza fujo au hofu.',
      path: '/toolkit/schedule',
      buttonTextEn: 'Build Schedule',
      buttonTextSw: 'Unda Ratiba'
    },
    {
      id: 'cards',
      icon: AudioLines,
      bgIcon: 'bg-[#E89B2E]/10',
      titleEn: 'AAC Speech Cards',
      titleSw: 'Kadi za Sauti (AAC)',
      descEn: 'Empower non-verbal children to communicate basic physical and emotional needs through voice output.',
      descSw: 'Washa mawasiliano ya sauti kwa watoto wasioweza kuongea kueleza mahitaji yao ya kimwili.',
      path: '/toolkit/cards',
      buttonTextEn: 'Open Soundboard',
      buttonTextSw: 'Fungua Kadi'
    },
    {
      id: 'board',
      icon: Rows3,
      bgIcon: 'bg-[#2F6B4F]/10',
      titleEn: 'Communication Strip',
      titleSw: 'Ukanda wa Maneno',
      descEn: 'Let children combine actions (e.g., I want) with objects (e.g., Water) to express complete thoughts.',
      descSw: 'Ruhusu watoto kuchanganya vitendo (mfano, Nataka) na vitu (mfano, Maji) kuunda sentensi.',
      path: '/toolkit/board',
      buttonTextEn: 'Build Sentences',
      buttonTextSw: 'Unda Sentensi'
    },
    {
      id: 'calm',
      icon: Wind,
      bgIcon: 'bg-[#C77700]/10',
      titleEn: 'Sensory Calming Room',
      titleSw: 'Chumba cha Kutuliza',
      descEn: 'Interactive visual ripples and a soothing low-frequency sound generator for emotional self-regulation.',
      descSw: 'Mawimbi ya rangi shirikishi na sauti tulivu ya masafa ya chini kusaidia kujituliza kihisia.',
      path: '/toolkit/calm',
      buttonTextEn: 'Enter Sensory Space',
      buttonTextSw: 'Ingia Chumba Tulivu'
    },
    {
      id: 'autism-world',
      icon: Clapperboard,
      bgIcon: 'bg-[#2F6B4F]/10',
      titleEn: 'Autism World Scenarios',
      titleSw: 'Matukio ya Autism World',
      descEn: 'Real-life social & communication video scenarios in school and home settings with guided practice.',
      descSw: 'Matukio ya kijamii ya shuleni na nyumbani yenye maswali shirikishi na video kwa ajili ya watoto.',
      path: '/autism-world',
      buttonTextEn: 'Launch Autism World',
      buttonTextSw: 'Fungua Autism World'
    }
  ];

  // Initialize favorites from localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('autism_unmasked_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persist favorites when state changes
  useEffect(() => {
    localStorage.setItem('autism_unmasked_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Handle custom voice control tab change events
  useEffect(() => {
    const handleTabChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail as TabType);
        const element = document.getElementById('toolkit-tab-navigation');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('toolkit-tab-change', handleTabChange);
    return () => {
      window.removeEventListener('toolkit-tab-change', handleTabChange);
    };
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const favoritedTools = tools.filter(t => isFavorite(t.id));

  // Switch tabs to downloads directly when triggered by subcomponents
  const handleNavigateToDownloads = () => {
    setActiveTab('downloads');
    const element = document.getElementById('toolkit-tab-navigation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const matchingTools = tools.filter(tool => {
    const q = searchTerm.toLowerCase();
    return (
      tool.titleEn.toLowerCase().includes(q) ||
      tool.titleSw.toLowerCase().includes(q) ||
      tool.descEn.toLowerCase().includes(q) ||
      tool.descSw.toLowerCase().includes(q)
    );
  });

  const matchingShortcuts = quickShortcuts.filter(sc => {
    const q = searchTerm.toLowerCase();
    return (
      sc.titleEn.toLowerCase().includes(q) ||
      sc.titleSw.toLowerCase().includes(q) ||
      sc.descEn.toLowerCase().includes(q) ||
      sc.descSw.toLowerCase().includes(q) ||
      sc.keywords.some(k => k.toLowerCase().includes(q))
    );
  });

  const matchingResources = searchableResources.filter(res => {
    const q = searchTerm.toLowerCase();
    return (
      res.titleEn.toLowerCase().includes(q) ||
      res.titleSw.toLowerCase().includes(q) ||
      res.descEn.toLowerCase().includes(q) ||
      res.descSw.toLowerCase().includes(q) ||
      res.keywords.some(k => k.toLowerCase().includes(q))
    );
  });

  const triggerDownload = (resource: any) => {
    setDownloadingId(resource.id);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingId(null);
            setDownloadedIds((prevIds) => [...prevIds, resource.id]);
            
            try {
              const dummyContent = `Autism Unmasked Kenya Assistive Toolkit\n=========================================\nDocument ID: ${resource.id}\nDocument Title: ${language === 'en' ? resource.titleEn : resource.titleSw}\nFile Size: ${resource.fileSize}\n\nThank you for utilizing Autism Unmasked Kenya. This clinical material is provided under Creative Commons licensing for caregivers in East Africa to assist neurodivergent families.\n\nSupport Line: Nairobi Support Center (+254 700 000000)\nEmail: support@autismunmasked.or.ke`;
              const blob = new Blob([dummyContent], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', resource.fileName);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            } catch (err) {
              console.error('Download trigger failed:', err);
            }
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  return (
    <section id="toolkit-hub" className="bg-[#FFF8EE] pt-2 w-full flex flex-col gap-8">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-[10px] font-bold text-[#C77700] uppercase tracking-[0.25em]">
            {language === 'en' ? 'CLINICAL SUPPORT EXPERIENCES' : 'MBINU ZA MSAADA WA KITAALAMU'}
          </span>
          <h2 className="font-bold text-3xl sm:text-4xl font-serif text-[#2D3748] mt-1">
            {language === 'en' ? 'Therapy Toolkit Hub' : 'Zana za Tiba na Msaada'}
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
            {language === 'en' 
              ? 'Our interactive clinical-grade visual templates, AAC speech engines, developmental checkers, and advocacy files are built to support cognitive stability, school readiness, and daily communication.'
              : 'Zana zetu za picha, mitambo ya sauti (AAC), vipimo vya ukuaji na maktaba ya barua za shule vimeundwa kusaidia utulivu wa akili na mawasiliano ya kila siku.'}
          </p>

          {/* Offline accessibility notice */}
          <div className="mt-4 flex items-center gap-2.5 bg-[#2F6B4F]/5 text-[#2F6B4F] px-4 py-2.5 rounded-2xl border border-[#2F6B4F]/10 text-xs font-semibold max-w-xl">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>
              {language === 'en' 
                ? 'Offline-Ready: All core features work perfectly even with no internet connection.'
                : 'Zana zipo tayari: Huduma zote hapa chini zitafanya kazi vizuri hata bila mtandao.'}
            </span>
          </div>
        </div>
        <span className="text-xs font-extrabold text-[#2F6B4F] bg-[#2F6B4F]/10 px-4 py-2 rounded-full shrink-0">
          {language === 'en' ? 'Clinical-Grade Interactive Center' : 'Kituo cha Kitaalamu Shirikishi'}
        </span>
      </div>

      {/* Unified Instant Search Bar */}
      <div id="toolkit-unified-search" className="bg-[#2D3748] text-white rounded-[32px] p-6 sm:p-8 shadow-md border-2 border-[#E89B2E]/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-[10px] font-extrabold text-[#E89B2E] uppercase tracking-widest block mb-1.5 flex items-center gap-1.5">
              <Search className="w-3 h-3 text-[#E89B2E]" />
              <span>{language === 'en' ? 'Direct Material & Clinical Search' : 'Tafuta Zana na Msaada wa Haraka'}</span>
            </span>
            <h3 className="text-lg font-serif font-bold text-white leading-tight">
              {language === 'en' ? 'Quickly find schedules, speech cards, and calming guides' : 'Tafuta haraka ratiba, kadi za sauti, na miongozo'}
            </h3>
          </div>
          <div className="relative w-full md:w-96 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'en' ? 'Type keywords (e.g. toilet, water, meltdown, shadow)...' : 'Andika maneno (mfano choo, maji, meltdown, msaidizi)...'}
              className="w-full pl-12 pr-10 py-3 sm:py-3.5 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-[#2D3748] border-2 border-white/20 focus:border-[#E89B2E] rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none transition-all placeholder:text-gray-300"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Suggestion Quick Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">
            {language === 'en' ? 'Common searches:' : 'Mada za dharura:'}
          </span>
          {[
            { labelEn: 'Bathroom / Toilet', labelSw: 'Msalani / Chooni', q: 'toilet' },
            { labelEn: 'I want water', labelSw: 'Nataka maji', q: 'water' },
            { labelEn: 'Meltdown Calming', labelSw: 'Kutuliza Ghadhabu', q: 'meltdown' },
            { labelEn: 'Shadow Teacher', labelSw: 'Msaidizi wa Darasani', q: 'shadow' },
            { labelEn: 'Visual Schedules', labelSw: 'Ratiba ya Picha', q: 'schedule' }
          ].map((tag, i) => (
            <button
              key={i}
              onClick={() => setSearchTerm(tag.q)}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white border border-white/10 hover:border-white/20 text-[11px] font-bold transition-all cursor-pointer"
            >
              {language === 'en' ? tag.labelEn : tag.labelSw}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Navigation Menu */}
      <div id="toolkit-tab-navigation" className="flex overflow-x-auto gap-2 pb-2 border-b border-gray-200/60 scrollbar-none">
        
        {/* Tab: Interactive Apps */}
        <button
          onClick={() => setActiveTab('apps')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'apps'
              ? 'bg-[#2D3748] text-white shadow-md shadow-[#2D3748]/10'
              : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{language === 'en' ? 'Interactive Tools' : 'Zana Shirikishi'}</span>
        </button>

        {/* Tab: Download Library */}
        <button
          onClick={() => setActiveTab('downloads')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'downloads'
              ? 'bg-[#2D3748] text-white shadow-md shadow-[#2D3748]/10'
              : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{language === 'en' ? 'Download Center' : 'Maktaba ya Nyaraka'}</span>
        </button>

        {/* Tab: Care Services Directory */}
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'directory'
              ? 'bg-[#2D3748] text-white shadow-md shadow-[#2D3748]/10'
              : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{language === 'en' ? 'Services Directory' : 'Orodha ya Wataalamu'}</span>
        </button>

        {/* Tab: Journey & Readiness Checkers */}
        <button
          onClick={() => setActiveTab('checkers')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'checkers'
              ? 'bg-[#2D3748] text-white shadow-md shadow-[#2D3748]/10'
              : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{language === 'en' ? 'Journey & School Checkers' : 'Vipimo vya Ukuaji'}</span>
        </button>

        {/* Tab: Myth Buster */}
        <button
          onClick={() => setActiveTab('myths')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'myths'
              ? 'bg-[#2D3748] text-white shadow-md shadow-[#2D3748]/10'
              : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-100'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>{language === 'en' ? 'Myth Buster' : 'Kuelimisha Jamii'}</span>
        </button>

        {/* Tab: Events Calendar */}
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'events'
              ? 'bg-[#2D3748] text-white shadow-md shadow-[#2D3748]/10'
              : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{language === 'en' ? 'Events Calendar' : 'Ratiba ya Matukio'}</span>
        </button>

      </div>

      {/* RENDER ACTIVE TAB CONTENT */}
      <div className="w-full">
        {searchTerm ? (
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* Search Header Banner */}
            <div className="bg-white rounded-[32px] border-2 border-[#C77700]/10 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#C77700] uppercase tracking-wider block">
                  {language === 'en' ? 'Search Results Active' : 'Matokeo ya Utafutaji'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2D3748] mt-1">
                  {language === 'en' ? `Showing results for "${searchTerm}"` : `Matokeo ya utafutaji wa "${searchTerm}"`}
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-semibold">
                  {language === 'en' 
                    ? `Found ${matchingTools.length} tools, ${matchingShortcuts.length} quick shortcuts, and ${matchingResources.length} downloads.`
                    : `Imepata zana ${matchingTools.length}, njia za mkato ${matchingShortcuts.length}, na nyaraka ${matchingResources.length}.`}
                </p>
              </div>
              <button
                onClick={() => setSearchTerm('')}
                className="bg-[#2D3748] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer self-start sm:self-center"
              >
                {language === 'en' ? 'Clear Search' : 'Futa Utafutaji'}
              </button>
            </div>

            {/* SECTION 1: INTERACTIVE CLINICAL TOOLS */}
            {matchingTools.length > 0 && (
              <div className="bg-white rounded-[32px] border-2 border-dashed border-gray-200 p-6 sm:p-8">
                <h4 className="text-sm font-black uppercase tracking-wider text-[#2F6B4F] mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'en' ? 'Interactive Clinical Apps' : 'Zana Shirikishi za Kitaalamu'}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchingTools.map(tool => (
                    <div key={tool.id} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-[#C77700]/30 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-9 h-9 rounded-lg bg-[#2D3748]/5 flex items-center justify-center shrink-0">
                            <tool.icon className="w-4 h-4 text-[#2D3748]" strokeWidth={2} />
                          </span>
                          <h5 className="font-bold text-base text-[#2D3748]">
                            {language === 'en' ? tool.titleEn : tool.titleSw}
                          </h5>
                        </div>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                          {language === 'en' ? tool.descEn : tool.descSw}
                        </p>
                      </div>
                      <Link
                        to={tool.path}
                        className="bg-[#C77700] hover:bg-[#a06000] text-white px-4 py-2.5 rounded-xl text-xs font-bold text-center transition-colors block cursor-pointer uppercase"
                      >
                        {language === 'en' ? tool.buttonTextEn : tool.buttonTextSw}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2: INSTANT VOICE & EMOTIONAL HELP SHORTCUTS (CRITICAL IN URGENT SITUATIONS) */}
            {matchingShortcuts.length > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-orange-50/50 border-2 border-red-100 rounded-[32px] p-6 sm:p-8">
                <div className="mb-4">
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block mb-0.5">
                    {language === 'en' ? '⚠️ URGENT EMERGENCY ASSISTANCE' : '⚠️ MSAADA WA HARAKA/DHARURA'}
                  </span>
                  <h4 className="text-base font-bold font-serif text-[#2D3748] flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-red-500" />
                    <span>{language === 'en' ? 'Direct Speech & Sensory Relief Buttons' : 'Njia za Mkato za Sauti na Utulivu'}</span>
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 font-semibold">
                    {language === 'en'
                      ? 'Tap these buttons to automatically open the soundboard and speak the emergency phrase or enter the visual calming room immediately.'
                      : 'Gusa vitufe hivi ili kufungua kadi na kusoma sentensi ya dharura kwa sauti, au kuingia kwenye chumba cha utulivu mara moja.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchingShortcuts.map(sc => {
                    const IconComponent = sc.icon;
                    return (
                      <Link
                        key={sc.id}
                        to={sc.path}
                        className="bg-white border border-red-100 hover:border-red-300 rounded-2xl p-4 card-h-shadow flex items-start gap-3.5 transition-all cursor-pointer"
                      >
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${sc.bgClass}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-extrabold text-sm text-[#2D3748] truncate">
                            {language === 'en' ? sc.titleEn : sc.titleSw}
                          </h5>
                          <p className="text-[11px] text-gray-500 mt-1 leading-normal line-clamp-2">
                            {language === 'en' ? sc.descEn : sc.descSw}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-600 uppercase tracking-wider mt-2.5">
                            <span>{language === 'en' ? 'Activate Now' : 'Washa Sasa'}</span>
                            <span>→</span>
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 3: DOWNLOADABLE GUIDES & PRINT-READY MATERIALS */}
            {matchingResources.length > 0 && (
              <div className="bg-white rounded-[32px] border-2 border-dashed border-gray-200 p-6 sm:p-8">
                <h4 className="text-sm font-black uppercase tracking-wider text-[#2F6B4F] mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{language === 'en' ? 'Printable Support Guides & IEP Materials' : 'Nyaraka, Barua na Miongozo ya Kuchapisha'}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchingResources.map(res => {
                    const isDownloading = downloadingId === res.id;
                    const isDownloaded = downloadedIds.includes(res.id);
                    const ResIcon = res.icon;

                    return (
                      <div key={res.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 card-h-shadow flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#2F6B4F]/10 text-[#2F6B4F] flex items-center justify-center mb-2.5">
                            <ResIcon className="w-5 h-5" />
                          </div>
                          <h5 className="font-bold text-sm text-[#2D3748] leading-tight">
                            {language === 'en' ? res.titleEn : res.titleSw}
                          </h5>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {language === 'en' ? res.descEn : res.descSw}
                          </p>
                          <div className="flex items-center gap-2 mt-3 text-[10px] font-bold text-gray-400">
                            <span className="uppercase">{res.category}</span>
                            <span>•</span>
                            <span>{res.fileSize}</span>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isDownloading ? (
                            <div className="flex flex-col items-center gap-1">
                              <div className="relative w-12 h-12 flex items-center justify-center">
                                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                  <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                  <path className="text-[#2F6B4F] transition-all duration-300" strokeDasharray={`${downloadProgress}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <span className="text-[10px] font-black text-[#2F6B4F]">{downloadProgress}%</span>
                              </div>
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{language === 'en' ? 'Saving...' : 'Inasave...'}</span>
                            </div>
                          ) : isDownloaded ? (
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-10 h-10 rounded-full bg-[#2F6B4F]/10 flex items-center justify-center text-[#2F6B4F] shadow-sm">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                              <span className="text-[9px] font-black text-[#2F6B4F] uppercase tracking-wider">{language === 'en' ? 'Downloaded' : 'Tayari'}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => triggerDownload(res)}
                              className="w-10 h-10 rounded-full bg-gray-50 hover:bg-[#2F6B4F]/10 text-gray-500 hover:text-[#2F6B4F] flex items-center justify-center border border-gray-100 cursor-pointer hover:border-[#2F6B4F]/20 transition-all shadow-sm group"
                              title={language === 'en' ? 'Download Resource File' : 'Pakua Nyaraka'}
                            >
                              <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* NO MATCHES FALLBACK SCREEN */}
            {matchingTools.length === 0 && matchingShortcuts.length === 0 && matchingResources.length === 0 && (
              <div className="bg-white rounded-[32px] border-4 border-dashed border-gray-200 p-12 text-center max-w-xl mx-auto flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-100">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-serif font-bold text-[#2D3748]">
                    {language === 'en' ? 'No exact matches found' : 'Hakuna matokeo yaliyopatikana'}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs leading-normal font-semibold">
                    {language === 'en' 
                      ? 'Try searching for other words like "toilet", "meltdown", "diet", "water", "mwalimu", "shule" or tap one of the common searches below.'
                      : 'Jaribu kutafuta maneno mengine kama vile "choo", "hasira", "lishe", "maji", "mwalimu", "shule" au bonyeza mada maarufu hapa juu.'}
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setSearchTerm('')}
                    className="bg-gray-100 hover:bg-gray-200 text-[#2D3748] px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    {language === 'en' ? 'Reset Search' : 'Anza Upya'}
                  </button>
                  <button
                    onClick={() => setSearchTerm('meltdown')}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors border border-red-100"
                  >
                    {language === 'en' ? 'Search "meltdown"' : 'Tafuta "meltdown"'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* ======================================================== */}
            {/* TAB 1: INTERACTIVE APPS                                  */}
            {/* ======================================================== */}
            {activeTab === 'apps' && (
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* Caregiver's Saved Library Section (Conditional) */}
            {favoritedTools.length > 0 && (
              <div id="caregiver-saved-library" className="bg-gradient-to-br from-[#2F6B4F]/5 to-[#C77700]/5 border-2 border-dashed border-[#2F6B4F]/20 rounded-[32px] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#2F6B4F]/10 rounded-2xl flex items-center justify-center text-[#2F6B4F]">
                    <FolderHeart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#2D3748]">
                      {language === 'en' ? 'My Saved Library' : 'Maktaba Yangu Iliyohifadhiwa'}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {language === 'en' 
                        ? 'Your personalized collection of quick-access therapy resources.' 
                        : 'Mkusanyiko wako wa kibinafsi wa zana za tiba kwa urahisi wa haraka.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoritedTools.map(tool => (
                    <div 
                      key={`saved-${tool.id}`} 
                      className="bg-white rounded-2xl p-4 border border-[#2F6B4F]/10 shadow-sm flex items-center justify-between gap-4 hover:shadow transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${tool.bgIcon} rounded-xl flex items-center justify-center shrink-0`}>
                          <tool.icon className="w-4 h-4 text-[#2D3748]" strokeWidth={2} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#2D3748] line-clamp-1">
                            {language === 'en' ? tool.titleEn : tool.titleSw}
                          </h4>
                          <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                            {language === 'en' ? tool.descEn : tool.descSw}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleFavorite(tool.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title={language === 'en' ? 'Remove from Saved' : 'Ondoa kwenye maktaba'}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                        <Link
                          to={tool.path}
                          className="bg-[#2F6B4F] hover:bg-[#204936] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                        >
                          {language === 'en' ? 'Open' : 'Fungua'}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Interactive Toolkit Grid */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-[#C77700]" />
                <h3 className="text-xs font-black uppercase tracking-widest text-[#C77700]">
                  {language === 'en' ? 'All Clinical Assistive Apps' : 'Zana Shirikishi za Tiba'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {tools.map(tool => {
                  const saved = isFavorite(tool.id);
                  return (
                    <div 
                      key={tool.id} 
                      className="bg-white rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 card-h-shadow flex flex-col justify-between h-full relative"
                    >
                      {/* Save to Library Top Action Button */}
                      <button
                        onClick={() => toggleFavorite(tool.id)}
                        className={`absolute top-5 right-5 p-2 rounded-xl transition-all border cursor-pointer ${
                          saved 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' 
                            : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }`}
                        title={
                          saved 
                            ? (language === 'en' ? 'Saved to My Library' : 'Imehifadhiwa Maktabani') 
                            : (language === 'en' ? 'Save to My Library' : 'Hifadhi kwenye Maktaba')
                        }
                      >
                        {saved ? (
                          <BookmarkCheck className="w-4 h-4 fill-current" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      <div className="pr-8">
                        <div className={`w-12 h-12 ${tool.bgIcon} rounded-2xl flex items-center justify-center mb-4`}>
                          <tool.icon className="w-5 h-5 text-[#2D3748]" strokeWidth={1.75} />
                        </div>
                        <h3 className="text-xl font-bold text-[#2D3748] mb-2">
                          {language === 'en' ? tool.titleEn : tool.titleSw}
                        </h3>
                        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                          {language === 'en' ? tool.descEn : tool.descSw}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link 
                          to={tool.path}
                          className="w-full bg-[#2D3748] hover:bg-black text-center text-white py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer block"
                        >
                          {language === 'en' ? tool.buttonTextEn : tool.buttonTextSw}
                        </Link>

                        {['schedule', 'cards', 'board'].includes(tool.id) && (
                          <Link 
                            to={`${tool.path}?print=true`}
                            state={{ printMode: true }}
                            className="w-full bg-[#C77700]/10 hover:bg-[#C77700]/20 text-[#C77700] text-center py-2.5 rounded-xl text-xs font-extrabold uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>{language === 'en' ? 'Print Mode' : 'Hali ya Kuchapa'}</span>
                          </Link>
                        )}
                        
                        {/* Inline Save Toggle text info */}
                        <button
                          onClick={() => toggleFavorite(tool.id)}
                          className={`text-center text-[10px] font-bold py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                            saved 
                              ? 'text-amber-600 hover:text-amber-800 bg-amber-500/5' 
                              : 'text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100/50'
                          }`}
                        >
                          {saved ? (
                            <>
                              <BookmarkCheck className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>{language === 'en' ? 'Saved to Library' : 'Imehifadhiwa Maktabani'}</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3 h-3 text-gray-400 shrink-0" />
                              <span>{language === 'en' ? 'Save to My Library' : 'Hifadhi kwenye Maktaba'}</span>
                            </>
                          )}
                        </button>

                        {/* Share buttons */}
                        <div className="flex gap-2 items-center justify-center mt-1 border-t border-gray-100 pt-2 text-[10px]">
                          <span className="text-gray-400 font-bold uppercase tracking-wider">
                            {language === 'en' ? 'Share:' : 'Shiriki:'}
                          </span>
                          <a
                            href={`mailto:?subject=${encodeURIComponent(
                              `Autism Unmasked Kenya - ${language === 'en' ? tool.titleEn : tool.titleSw} Resource`
                            )}&body=${encodeURIComponent(
                              `Hello! Check out this free, offline-ready clinical-grade therapeutic resource from Autism Unmasked Kenya:\n\n*${language === 'en' ? tool.titleEn : tool.titleSw}*\n"${language === 'en' ? tool.descEn : tool.descSw}"\n\nAccess this tool online or offline at: ${typeof window !== 'undefined' ? window.location.origin + tool.path : 'https://autism-unmasked.ke'}`
                            )}`}
                            className="text-[#2F6B4F] hover:text-[#204936] flex items-center gap-1 font-bold py-1 px-2 rounded-lg hover:bg-[#2F6B4F]/5 transition-colors"
                            title={language === 'en' ? 'Share via Email' : 'Shiriki kwa Barua Pepe'}
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>{language === 'en' ? 'Email' : 'Barua'}</span>
                          </a>
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(
                              `*Autism Unmasked Kenya - ${language === 'en' ? tool.titleEn : tool.titleSw}*\n\n"${language === 'en' ? tool.descEn : tool.descSw}"\n\nAccess this free resource directly: ${typeof window !== 'undefined' ? window.location.origin + tool.path : 'https://autism-unmasked.ke'}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#25D366] hover:text-[#1eb355] flex items-center gap-1 font-bold py-1 px-2 rounded-lg hover:bg-green-50 transition-colors"
                            title={language === 'en' ? 'Share to WhatsApp' : 'Shiriki kwa WhatsApp'}
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: DOWNLOAD LIBRARY                                  */}
        {/* ======================================================== */}
        {activeTab === 'downloads' && (
          <div className="animate-fade-in">
            <ResourceCenter language={language} />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SERVICES DIRECTORY                                */}
        {/* ======================================================== */}
        {activeTab === 'directory' && (
          <div className="animate-fade-in">
            <ServicesDirectory language={language} />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: CHECKERS AND NAVIGATORS                           */}
        {/* ======================================================== */}
        {activeTab === 'checkers' && (
          <div className="flex flex-col gap-8 animate-fade-in">
            
            {/* Journey Timeline Wizard */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-[#C77700]" />
                <h3 className="text-sm font-serif font-black text-[#2D3748]">
                  {language === 'en' ? '1. Autism Journey Navigator' : '1. Ramani ya Kulea na Kusaidia Mtoto'}
                </h3>
              </div>
              <JourneyTimeline language={language} />
            </div>

            {/* School Readiness Assessment */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-[#C77700]" />
                <h3 className="text-sm font-serif font-black text-[#2D3748]">
                  {language === 'en' ? '2. School Readiness & LSA Support Checker' : '2. Kipimo cha Utayari wa Shule na Shadow Assistance'}
                </h3>
              </div>
              <SchoolReadiness 
                language={language} 
                onNavigateToDownloads={handleNavigateToDownloads} 
              />
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: MYTH BUSTER                                       */}
        {/* ======================================================== */}
        {activeTab === 'myths' && (
          <div className="animate-fade-in">
            <MythBuster language={language} />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: EVENTS CALENDAR                                   */}
        {/* ======================================================== */}
        {activeTab === 'events' && (
          <div className="animate-fade-in">
            <EventsCalendar language={language} />
          </div>
        )}

          </>
        )}

      </div>

    </section>
  );
}
