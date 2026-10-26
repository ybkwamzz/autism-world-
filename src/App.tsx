import React, { useState, useEffect, useRef } from 'react';
import { 
  HashRouter, 
  Routes, 
  Route, 
  Link, 
  useLocation 
} from 'react-router-dom';
import { 
  Heart, 
  Info, 
  BookOpen, 
  X, 
  Play, 
  Globe, 
  Volume2, 
  Send, 
  CheckCircle,
  HelpCircle,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  Compass,
  Clapperboard
} from 'lucide-react';

import { Story, Message } from './types';
import Home from './components/Home';
import Toolkit from './components/Toolkit';
import VisualSchedule from './components/VisualSchedule';
import AacCards from './components/AacCards';
import AacSentenceBoard from './components/AacSentenceBoard';
import SensoryCalming from './components/SensoryCalming';
import Blog from './components/Blog';
import MicroLesson, { type SessionMode } from './components/MicroLesson';
import VoiceNavigator from './components/VoiceNavigator';
import AppTourModal from './components/AppTourModal';
import NewsletterConfirmation from './components/NewsletterConfirmation';

// Navigation layout wrapper to read router context
function AppLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Global State
  const [language, setLanguage] = useState<'en' | 'swa'>('en');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('autism_unmasked_dark_mode') === 'true';
  });
  const [activeModal, setActiveModal] = useState<null | 'video' | 'donate'>(null);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [voiceSpeechAlert, setVoiceSpeechAlert] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('autism_unmasked_dark_mode', darkMode ? 'true' : 'false');
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Connection tracking for offline capabilities
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global TTS State
  const [globalTts, setGlobalTts] = useState<boolean>(() => {
    return localStorage.getItem('autism_unmasked_global_tts') === 'true';
  });

  // Dynamic Impact Counters (start with base, increment on action)
  const [familiesCount, setFamiliesCount] = useState(2410);
  const [storiesCount, setStoriesCount] = useState(153);

  // Local Statistics Object with localStorage persistence
  const [localStats, setLocalStats] = useState(() => {
    const saved = localStorage.getItem('autism_unmasked_local_stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.downloadsCount === 'number') {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      downloadsCount: 1420, // Baseline resource downloads
      scheduleDownloads: 812,
      cardsDownloads: 418,
      boardDownloads: 190
    };
  });

  useEffect(() => {
    localStorage.setItem('autism_unmasked_local_stats', JSON.stringify(localStats));
  }, [localStats]);

  const trackDownload = (resourceType: string) => {
    setLocalStats((prev: any) => ({
      ...prev,
      downloadsCount: prev.downloadsCount + 1,
      [`${resourceType}Downloads`]: (prev[`${resourceType}Downloads`] || 0) + 1
    }));
    
    // Increment familiesCount to reflect dynamic community growth on action!
    setFamiliesCount(prev => prev + 1);
  };

  // Preloaded stories with localStorage fallback
  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('autism_unmasked_stories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: '1',
        name: 'Grace Mwangi',
        role: 'Parent',
        location: 'Nairobi',
        category: 'Our Journey',
        title: "The Founder's Story: Patience Over Fear",
        content: "When my son David was 2, he still hadn't spoken his first word. Relatives whispered about family curses, while some doctors dismissed it as simple speech delay. After a correct diagnosis of Autism, we embarked on a journey of intense early intervention. Today, David is attending mainstream schooling, expressing his brilliant mind through painting, and showing everyone that autism is not a curse—it is simply a different way of seeing the world.",
        date: 'July 2026'
      },
      {
        id: '2',
        name: 'Amina K.',
        role: 'Sibling',
        location: 'Mombasa',
        category: 'Sibling Voices',
        title: "My Brother Sees in Colors",
        content: "My brother Jojo doesn't communicate with words, but his face lights up when he organizes his wooden blocks by color. Learning to understand his unique communication cues completely reshaped how I view humanity. He has taught me that connection transcends language, and his quiet joy is the most beautiful thing in our household.",
        date: 'June 2026'
      },
      {
        id: '3',
        name: 'Teacher Juma',
        role: 'Educator',
        location: 'Kisumu',
        category: 'Special Education',
        title: "Sensory-Friendly Public Classrooms",
        content: "As a special education teacher in Kisumu, I realized that many autistic students thrive when given visual predictability. By introducing low-cost visual schedules on blackboards and creating a quiet sensory corner with pillows and local beanbags, we have reduced classroom sensory overload by 80%. Our children are learning faster and feeling safer.",
        date: 'May 2026'
      }
    ];
  });

  // Save stories to local storage
  useEffect(() => {
    localStorage.setItem('autism_unmasked_stories', JSON.stringify(stories));
    setStoriesCount(153 + stories.length - 3); // Update count dynamically
  }, [stories]);

  // Voice Speech synthesizer (manual trigger)
  const speakText = (engText: string, swaText: string) => {
    const textToSpeak = language === 'en' ? engText : swaText;
    const langCode = language === 'en' ? 'en-US' : 'sw-KE';
    
    // UI subtitling feedback
    setVoiceSpeechAlert(textToSpeak);
    setTimeout(() => setVoiceSpeechAlert(null), 2500);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel active speech
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = langCode;
      utterance.rate = 0.9; // slightly slower for readability
      window.speechSynthesis.speak(utterance);
    }
  };

  // Global TTS speak helper
  const speakTextGlobal = (text: string) => {
    if (!text || !globalTts) return;
    const langCode = language === 'en' ? 'en-US' : 'sw-KE';
    
    // UI subtitling feedback
    setVoiceSpeechAlert(text);
    
    // Clear the visual alert dynamically based on reading length
    const wordsCount = text.split(/\s+/).length;
    const duration = Math.max(3000, wordsCount * 400); // 400ms per word, min 3 seconds
    
    setTimeout(() => {
      setVoiceSpeechAlert(current => current === text ? null : current);
    }, duration);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Persist Global TTS selection and cancel speaking when turned off
  useEffect(() => {
    localStorage.setItem('autism_unmasked_global_tts', globalTts ? 'true' : 'false');
    if (!globalTts && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [globalTts]);

  // Route Change Auto-Reader: automatically read out the page header/heading when route changes
  useEffect(() => {
    if (!globalTts) return;
    
    const timer = setTimeout(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        // Find primary page title
        const heading = mainElement.querySelector('h1, h2, h3');
        if (heading && heading.textContent) {
          const pageTitleText = heading.textContent.trim();
          const announcement = language === 'en'
            ? `Viewing: ${pageTitleText}`
            : `Unasoma: ${pageTitleText}`;
          speakTextGlobal(announcement);
        }
      }
    }, 600); // slight delay to allow route component mounting

    return () => clearTimeout(timer);
  }, [location.pathname, globalTts, language]);

  // Click-to-Speak element reading event listener
  useEffect(() => {
    if (!globalTts) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Find the closest readable tag
      const closestReadable = target.closest('h1, h2, h3, h4, p, li, blockquote');
      if (closestReadable && closestReadable.textContent) {
        // Skip clicking inputs, select, normal buttons, form links, unless it's a heading
        const isInteractiveFormElement = target.closest('button, input, textarea, select, a');
        const isHeading = closestReadable.tagName.startsWith('H');
        
        if (isInteractiveFormElement && !isHeading) {
          return;
        }

        const text = closestReadable.textContent.trim();
        if (text) {
          speakTextGlobal(text);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [globalTts, language]);

  // Text Highlight Selection Speak event listener
  useEffect(() => {
    if (!globalTts) return;

    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection) {
        const selectedText = selection.toString().trim();
        if (selectedText.length > 0) {
          speakTextGlobal(selectedText);
        }
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
    };
  }, [globalTts, language]);

  const handleStorySubmit = (newStoryData: Omit<Story, 'id' | 'date'>) => {
    const submitted: Story = {
      id: 'story_' + Date.now(),
      name: newStoryData.name,
      role: newStoryData.role,
      location: newStoryData.location,
      title: newStoryData.title,
      content: newStoryData.content,
      category: newStoryData.category,
      date: 'Today'
    };

    setStories([submitted, ...stories]);
    setFamiliesCount(prev => prev + 1); // Mock community impact grows!
  };

  // Lumo Chat Drawer State & Actions
  const [isLumoChatOpen, setIsLumoChatOpen] = useState(false);
  const [learningSessionMode, setLearningSessionMode] = useState<SessionMode>('child_active');
  const [lumoInput, setLumoInput] = useState('');
  const [lumoMessages, setLumoMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: "Hujambo! I am Lumo, your supportive caregiver assistant. Ask me anything about Autism, Pattern Lab progress, visual toolkits, finding assessment clinics in Kenya, or navigating special educational resources.", 
      time: '11:30 AM' 
    }
  ]);
  const [isLumoTyping, setIsLumoTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lumoMessages, isLumoTyping]);

  const handleLumoSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      role: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLumoMessages(prev => [...prev, userMsg]);
    setLumoInput('');
    setIsLumoTyping(true);

    const history = lumoMessages.slice(-6).map(m => ({
      role: m.role,
      text: m.text
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          language,
          mode: 'caregiver_general'
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const modelMsg: Message = {
        role: 'model',
        text: data.text || "I apologize, I am experiencing temporary difficulties. Let's try again in a moment.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setLumoMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error("Lumo API error:", err);
      // Fallback offline intelligent logic
      setTimeout(() => {
        let fallbackReply = "Thank you for asking. I'm having trouble connecting to the smart Gemini server right now. If you are developing, please check if your GEMINI_API_KEY is configured in Settings > Secrets. \n\nFor general help, you can use our pre-programmed guide buttons below!";
        
        const normalized = text.toLowerCase();
        if (normalized.includes('early signs') || normalized.includes('sign') || normalized.includes('dalili')) {
          fallbackReply = language === 'en' 
            ? "Early signs of autism (typically visible by age 2) include:\n• Delayed speech or being completely non-verbal.\n• Minimal eye contact or not responding to their name.\n• Repetitive behaviors (like hand-flapping, spinning objects, or rocking).\n• Strong preference for structured routines.\n\nConsult developmental pediatricians at Gertrude’s Children’s Hospital or Kenyatta National Hospital clinic in Nairobi for diagnostic assessments."
            : "Dalili za mapema za usonji (autism) kwa watoto ni pamoja na:\n• Kuchelewa kuongea au kutoongea kabisa.\n• Kutotazama machoni na kutojibu wanapoitwa majina yao.\n• Tabia za kujirudia kama kupunga mikono, kuzungusha vitu, au kuyumbayumba.\n• Kupenda sana utaratibu maalum.\n\nShauriana na madaktari katika Hospitali ya Watoto ya Gertrude's au KNH kliniki kwa tathmini kamili.";
        } else if (normalized.includes('assessment') || normalized.includes('centre') || normalized.includes('vituo')) {
          fallbackReply = language === 'en'
            ? "Key assessment centres in Kenya include:\n• **Nairobi**: Gertrude's Children's Hospital, Kenyatta National Hospital Developmental Clinic, KISE (Kenya Institute of Special Education).\n• **Kiambu**: Autism Support Center Kenya (ASCK).\n• **Mombasa**: Coast General Hospital Clinic, Sahajanand Special School.\n• **Organizations**: Autism Society of Kenya (ASK) can connect you with local county support groups."
            : "Vituo vya tathmini nchini Kenya:\n• **Nairobi**: Hospitali ya Watoto ya Gertrude, Hospitali ya Kitaifa ya Kenyatta (KNH) kliniki ya watoto, KISE (Taasisi ya Elimu Maalum ya Kenya).\n• **Kiambu**: Kituo cha Msaada wa Usonji Kenya (ASCK).\n• **Mombasa**: Kliniki ya Hospitali Kuu ya Pwani, Shule Maalum ya Sahajanand.\n• **Mashirika**: Autism Society of Kenya (ASK) inakuunganisha na vikundi vya usaidizi vya wazazi kaunti zote.";
        } else if (normalized.includes('sensory') || normalized.includes('corner') || normalized.includes('kona')) {
          fallbackReply = language === 'en'
            ? "How to create a sensory corner at home:\n1. Use soft, dim lighting (avoid bright white neon light).\n2. Add soft pillows, a beanbag, or weighted blankets.\n3. Keep soothing toys like fidget spinners or water bubble timers.\n4. Use a quiet visual reminder chart, and utilize our toolkit's Calming Breathing guide to aid deep breathing exercises!"
            : "Jinsi ya kutengeneza kona ya hisia nyumbani:\n1. Tumia mwanga mwanana wa joto na punguza kelele.\n2. Weka mito laini, beanbag au mablanketi mazito.\n3. Toa vichezeo laini kama fidget spinners au vipima muda vya maji.\n4. Tumia chati ya picha na utumie zana ya Pumzi ya Kutuliza kusaidia mazoezi ya kupumua!";
        } else if (normalized.includes('myth') || normalized.includes('fact') || normalized.includes('uongo')) {
          fallbackReply = language === 'en'
            ? "**Common Autism Myths vs Facts in Kenya:**\n• *Myth*: Autism is caused by witchcraft or parenting mistakes.\n• *Fact*: Autism is a neurological, biological difference in brain development. No one is to blame.\n• *Myth*: Autistic children cannot study or succeed.\n• *Fact*: With predictive visual toolkits and tailored support, they can learn and many excel wonderfully in school."
            : "**Uongo na Ukweli kuhusu Usonji nchini Kenya:**\n• *Uongo*: Usonji unasababishwa na uchawi au makosa ya malezi ya mama.\n• *Ukweli*: Usonji ni tofauti ya kibiolojia na kineurolojia katika maendeleo ya ubongo. Hakuna lawama hapa.\n• *Uongo*: Watoto wenye usonji hawawezi kusoma wala kufanikiwa.\n• *Ukweli*: Kwa kutumia zana za picha (visual tools) na msaada unaofaa, wanaweza kujifunza na wengi hufanya vizuri mashuleni.";
        }

        const modelMsg: Message = {
          role: 'model',
          text: fallbackReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setLumoMessages(prev => [...prev, modelMsg]);
      }, 1000);
    } finally {
      setIsLumoTyping(false);
    }
  };

  const isHomeActive = currentPath === '/';
  const isToolkitActive = currentPath.startsWith('/toolkit') && !currentPath.includes('autism-world') && !currentPath.includes('micro-lesson');
  const isAutismWorldActive = currentPath === '/autism-world' || currentPath.includes('autism-world') || currentPath.includes('micro-lesson');
  const isStoriesActive = currentPath.startsWith('/blog');

  return (
    <div 
      id="app-container" 
      className={`min-h-screen bg-[#FFF8EE] text-[#2D3748] font-sans flex flex-col antialiased ${globalTts ? 'global-tts-active' : ''} ${darkMode ? 'dark' : ''}`}
    >
      
      {/* Voice Recognition Command Feature for Navigation */}
      <VoiceNavigator language={language} onAlert={setVoiceSpeechAlert} />

      {/* Floating sub-titles alert for screen-reader/audio playback visualization */}
      {voiceSpeechAlert && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#2D3748] text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 shadow-2xl border border-white/20 animate-bounce">
          <Volume2 className="w-4 h-4 text-[#E89B2E] animate-pulse" />
          <span>"{voiceSpeechAlert}"</span>
        </div>
      )}

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 h-20 border-b border-[#C77700]/20 bg-[#FFF8EE]/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#C77700] rounded-xl flex items-center justify-center text-white font-serif font-black text-xl shadow-md shadow-[#C77700]/10 shrink-0">
            U
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-[#2D3748] font-serif leading-none">
              Autism <span className="text-[#C77700]">Unmasked</span>
            </h1>
            <span className="text-[10px] sm:text-xs font-semibold text-[#2F6B4F] uppercase tracking-widest block">Kenya Support Hub</span>
          </div>

          {/* Connection offline-ready Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full border border-gray-100 shadow-sm ml-2 shrink-0">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Online • Toolkit Synced' : 'Mtandao • Zana zimesawazishwa'}
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                <span className="text-[9px] font-extrabold text-amber-600 uppercase tracking-wider">
                  {language === 'en' ? 'Offline Mode • Saved' : 'Nje ya Mtandao • Zimehifadhiwa'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-bold uppercase tracking-widest text-[#2D3748]/80">
          <Link 
            to="/" 
            className={`transition-colors cursor-pointer ${isHomeActive ? 'text-[#C77700]' : 'hover:text-[#C77700]'}`}
          >
            {language === 'en' ? 'Home' : 'Mwanzo'}
          </Link>
          <Link 
            to="/autism-world" 
            className={`transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-full ${
              isAutismWorldActive 
                ? 'bg-[#2F6B4F] text-white shadow-xs' 
                : 'bg-[#2F6B4F]/10 text-[#2F6B4F] hover:bg-[#2F6B4F]/20'
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'en' ? 'Autism World' : 'Autism World'}</span>
          </Link>
          <Link 
            to="/toolkit" 
            className={`transition-colors cursor-pointer ${isToolkitActive ? 'text-[#C77700]' : 'hover:text-[#C77700]'}`}
          >
            {language === 'en' ? 'Toolkit' : 'Zana za Tiba'}
          </Link>
          <Link 
            to="/blog" 
            className={`transition-colors cursor-pointer ${isStoriesActive ? 'text-[#C77700]' : 'hover:text-[#C77700]'}`}
          >
            {language === 'en' ? 'Stories' : 'Hadithi'}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* App Tour Interactive Voice Sequence Button */}
          <button
            id="app-tour-btn"
            onClick={() => setIsTourOpen(true)}
            className="flex items-center gap-1.5 text-xs font-extrabold border-2 border-[#C77700] bg-[#C77700]/10 hover:bg-[#C77700]/20 text-[#C77700] px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-xs"
            title={language === 'en' ? 'Start Voice App Tour' : 'Anza Mwongozo wa Sauti'}
          >
            <Compass className="w-3.5 h-3.5 text-[#C77700]" />
            <span className="hidden sm:inline">
              {language === 'en' ? 'App Tour' : 'Mwongozo'}
            </span>
            <span className="sm:hidden">
              Tour
            </span>
          </button>

          {/* Global Text-to-Speech Accessibility Toggle */}
          <button 
            id="global-tts-btn"
            onClick={() => {
              const nextState = !globalTts;
              setGlobalTts(nextState);
              if (nextState) {
                const confirmMsg = language === 'en' 
                  ? 'Read aloud mode activated. Click any heading or text to read, or select text with your mouse.' 
                  : 'Msomaji wa maandishi umewashwa. Gusa kichwa au aya yoyote kusomewa, au chagua maandishi.';
                
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  const utterance = new SpeechSynthesisUtterance(confirmMsg);
                  utterance.lang = language === 'en' ? 'en-US' : 'sw-KE';
                  utterance.rate = 0.95;
                  window.speechSynthesis.speak(utterance);
                }
                setVoiceSpeechAlert(confirmMsg);
                setTimeout(() => setVoiceSpeechAlert(null), 4000);
              } else {
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                const disabledMsg = language === 'en' ? 'Read aloud mode turned off' : 'Msomaji wa maandishi umezimwa';
                setVoiceSpeechAlert(disabledMsg);
                setTimeout(() => setVoiceSpeechAlert(null), 2500);
              }
            }}
            className={`flex items-center gap-1.5 text-xs font-extrabold border-2 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              globalTts 
                ? 'bg-[#C77700]/10 border-[#C77700] text-[#C77700] shadow-sm animate-pulse' 
                : 'border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400'
            }`}
            title={language === 'en' ? 'Toggle Read Aloud Mode' : 'Washa/Zima Msomaji wa Sauti'}
          >
            <Volume2 className={`w-3.5 h-3.5 ${globalTts ? 'text-[#C77700]' : ''}`} />
            <span className="hidden sm:inline">
              {globalTts 
                ? (language === 'en' ? 'Read Aloud: ON' : 'Sauti: Washa') 
                : (language === 'en' ? 'Read Aloud: OFF' : 'Sauti: Zima')}
            </span>
            <span className="sm:hidden">
              {globalTts ? 'TTS ON' : 'TTS OFF'}
            </span>
          </button>

          {/* SWA/EN Toggle */}
          <button 
            id="lang-toggle-btn"
            onClick={() => {
              const newLang = language === 'en' ? 'swa' : 'en';
              setLanguage(newLang);
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            }}
            className="flex items-center gap-1.5 text-xs font-extrabold border-2 border-[#2F6B4F] text-[#2F6B4F] px-2.5 py-1.5 rounded-full hover:bg-[#2F6B4F]/5 transition-all cursor-pointer"
            title="Translate to Swahili / English"
          >
            <Globe className="w-3 h-3" />
            <span>{language === 'en' ? 'EN / SWA' : 'SWA / EN'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button 
            id="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-1.5 text-xs font-extrabold border-2 border-gray-300 text-gray-500 px-2.5 py-1.5 rounded-full hover:bg-gray-100 dark:border-white/20 dark:text-gray-300 dark:hover:bg-white/5 transition-all cursor-pointer"
            title={language === 'en' ? 'Toggle Dark Mode' : 'Washa/Zima Hali ya Giza'}
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> : <Moon className="w-3.5 h-3.5 text-gray-500" />}
            <span className="hidden sm:inline">
              {darkMode 
                ? (language === 'en' ? 'Light Mode' : 'Mwangaza') 
                : (language === 'en' ? 'Dark Mode' : 'Hali ya Giza')}
            </span>
          </button>

          {/* Donate CTA Button */}
          <button 
            id="donate-btn"
            onClick={() => setActiveModal('donate')}
            className="bg-[#2F6B4F] hover:bg-[#23513b] text-white px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-[#2F6B4F]/10 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            {language === 'en' ? 'Donate Now' : 'Changia Sasa'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
        
        {/* Router Switches */}
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                language={language} 
                onOpenModal={setActiveModal} 
                recentStories={stories} 
                onOpenLumo={() => setIsLumoChatOpen(true)} 
                onOpenTour={() => setIsTourOpen(true)}
              />
            } 
          />
          <Route 
            path="/toolkit" 
            element={<Toolkit language={language} />} 
          />
          <Route 
            path="/toolkit/schedule" 
            element={
              <VisualSchedule 
                language={language} 
                onDownload={() => trackDownload('schedule')} 
              />
            } 
          />
          <Route 
            path="/toolkit/cards" 
            element={
              <AacCards 
                language={language} 
                onSpeak={speakText} 
                voiceSpeechAlert={voiceSpeechAlert} 
                onDownload={() => trackDownload('cards')}
              />
            } 
          />
          <Route 
            path="/toolkit/board" 
            element={
              <AacSentenceBoard 
                language={language} 
                onSpeak={speakText} 
                onDownload={() => trackDownload('board')} 
              />
            } 
          />
          <Route 
            path="/toolkit/calm" 
            element={<SensoryCalming language={language} />} 
          />
          <Route 
            path="/autism-world" 
            element={
              <MicroLesson 
                language={language} 
                initialFilter="scenario" 
                onModeChange={mode => {
                  setLearningSessionMode(mode);
                  if (mode === 'child_active') setIsLumoChatOpen(false);
                }}
                onOpenLumo={() => setIsLumoChatOpen(true)}
              />
            } 
          />
          <Route 
            path="/toolkit/autism-world" 
            element={
              <MicroLesson 
                language={language} 
                initialFilter="scenario" 
                onModeChange={mode => {
                  setLearningSessionMode(mode);
                  if (mode === 'child_active') setIsLumoChatOpen(false);
                }}
                onOpenLumo={() => setIsLumoChatOpen(true)}
              />
            } 
          />
          <Route 
            path="/toolkit/micro-lesson" 
            element={
              <MicroLesson 
                language={language} 
                onModeChange={mode => {
                  setLearningSessionMode(mode);
                  if (mode === 'child_active') setIsLumoChatOpen(false);
                }}
                onOpenLumo={() => setIsLumoChatOpen(true)}
              />
            } 
          />
          <Route 
            path="/blog" 
            element={
              <Blog 
                language={language} 
                stories={stories} 
                onSubmitStory={handleStorySubmit} 
                familiesCount={familiesCount}
                setFamiliesCount={setFamiliesCount}
                storiesCount={storiesCount}
                downloadsCount={localStats.downloadsCount}
              />
            } 
          />
          <Route 
            path="/newsletter-confirmation" 
            element={<NewsletterConfirmation language={language} />} 
          />
        </Routes>

      </main>

      {/* Footer Status Bar & Contact */}
      <footer className="mt-12 px-4 sm:px-8 py-6 border-t border-[#C77700]/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-white shrink-0">
        
        {/* Lumo AI Drawer Trigger (Respects Child Active AI Safety Boundary) */}
        {isAutismWorldActive && learningSessionMode === 'child_active' ? (
          <div
            className="flex items-center gap-2.5 bg-gray-100 border border-gray-200 px-4 py-2 rounded-full text-left"
            title="Lumo AI is disabled in Child Active Mode"
          >
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">
              {language === 'en' ? 'Child Active Mode • Generative AI Locked' : 'Hali ya Mtoto • Lumo AI Imezimwa'}
            </span>
          </div>
        ) : (
          <button 
            onClick={() => setIsLumoChatOpen(true)}
            className="flex items-center gap-3 cursor-pointer group bg-[#FFF8EE] border border-[#C77700]/20 hover:border-[#C77700] px-4 py-2 rounded-full transition-all text-left"
            title="Open Lumo Assistant Chat"
          >
            <span className="text-[10px] font-extrabold text-[#2D3748]/80 uppercase tracking-widest group-hover:text-[#C77700]">
              {language === 'en' ? 'Lumo AI Assistant (Caregiver Mode)' : 'Lumo AI Msaidizi (Hali ya Mlezi)'}
            </span>
            <span className="text-[9px] bg-[#C77700] text-white font-black px-1.5 py-0.5 rounded uppercase">Click to Chat</span>
          </button>
        )}

        <div className="text-[10px] text-[#2D3748]/60 font-medium text-center md:text-left flex flex-wrap items-center justify-center gap-2">
          <span>&copy; 2026 Autism Unmasked Kenya • Supporting Every Mind • Made with 💚 in Nairobi</span>
          <span>•</span>
          <Link to="/newsletter-confirmation" className="text-[#C77700] hover:underline font-bold">
            {language === 'en' ? 'Newsletter Info' : 'Taarifa za Jarida'}
          </Link>
        </div>

        {/* Social Badges */}
        <div className="flex gap-3">
          <span className="w-8 h-8 rounded-full bg-[#2D3748]/5 hover:bg-[#C77700]/15 hover:text-[#C77700] flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors">FB</span>
          <span className="w-8 h-8 rounded-full bg-[#2D3748]/5 hover:bg-[#C77700]/15 hover:text-[#C77700] flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors">IG</span>
          <span className="w-8 h-8 rounded-full bg-[#2D3748]/5 hover:bg-[#C77700]/15 hover:text-[#C77700] flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors">WA</span>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* ======================= MODALS ========================== */}
      {/* ========================================================= */}

      {/* 1. Video Modal */}
      {activeModal === 'video' && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] overflow-hidden w-full max-w-2xl border-4 border-white shadow-2xl relative">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full cursor-pointer z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative pt-[56.25%] bg-black">
              <iframe 
                className="absolute inset-0 w-full h-full border-0" 
                src="https://www.youtube.com/embed/Dsc6pY685oE" 
                title="Autism Awareness Video" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-6 bg-[#FFF8EE] text-[#2D3748]">
              <h4 className="font-bold font-serif text-lg text-[#C77700]">
                {language === 'en' ? 'Autism Awareness in Kenya' : 'Uelewa wa Usonji nchini Kenya'}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'en' 
                  ? 'A brief insight on fighting stigma and accepting beautiful neural diversity in Kenya.' 
                  : 'Kupambana na unyanyapaa na kukubali utofauti mzuri wa kinyurolojia nchini Kenya.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Donate Modal */}
      {activeModal === 'donate' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FFF8EE] rounded-[32px] border-4 border-[#2F6B4F] p-6 sm:p-8 w-full max-w-md shadow-2xl relative text-[#2D3748]">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 p-1.5 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mb-4">
              <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-wider block">SUPPORT OUR EFFORTS</span>
              <h3 className="text-2xl font-bold font-serif text-[#2F6B4F]">{language === 'en' ? 'Sponsor a Toolkit' : 'Dhamini Zana za Tiba'}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'en' ? '100% of your donation pays for printing and delivering Therapy Toolkits to families in rural Kenya.' : '100% ya mchango wako hutumika kuchapisha na kusambaza zana za tiba kwa familia vijijini Kenya.'}
              </p>
            </div>

            {/* Donation options */}
            <div className="space-y-4">
              {/* Option A: M-PESA details */}
              <div className="bg-white p-4 rounded-2xl border border-green-300 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-xs font-black text-green-700 uppercase tracking-widest">Safaricom M-PESA</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase font-bold">Lipa Na M-PESA</span>
                    <strong className="text-[#2D3748]">Paybill: 400222</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase font-bold">Account Number</span>
                    <strong className="text-[#2D3748]">UNMASKED</strong>
                  </div>
                </div>
              </div>

              {/* Option B: Card Simulation */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(language === 'en' ? 'Thank you! Your simulated donation was received successfully.' : 'Asante sana! Mchango wako wa kuigiza umepokelewa vizuri.');
                  setFamiliesCount(prev => prev + 5);
                  setActiveModal(null);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Donor Name</label>
                  <input type="text" required placeholder="e.g. Kwame Juma" className="w-full bg-white border border-[#C77700]/20 rounded-xl px-3 py-1.5 text-xs text-[#2D3748] focus:outline-none focus:border-[#2F6B4F]" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Amount (KES)</label>
                    <input type="number" required defaultValue="1000" min="100" className="w-full bg-white border border-[#C77700]/20 rounded-xl px-3 py-1.5 text-xs text-[#2D3748] focus:outline-none focus:border-[#2F6B4F]" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Card Number</label>
                    <input type="text" required maxLength={16} placeholder="4000 1234 5678" className="w-full bg-white border border-[#C77700]/20 rounded-xl px-3 py-1.5 text-xs text-[#2D3748] focus:outline-none focus:border-[#2F6B4F]" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#2F6B4F] hover:bg-[#1e4432] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
                  {language === 'en' ? 'Donate via Card' : 'Changia kupitia Kadi'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ============= LUMO AI ASSISTANT CHAT DRAWER ============= */}
      {/* ========================================================= */}
      
      {isLumoChatOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#FFF8EE] h-full shadow-2xl flex flex-col border-l border-[#C77700]/20 animate-slide-in relative text-[#2D3748]">
            
            {/* Drawer Header */}
            <header className="px-6 py-4 border-b border-[#C77700]/10 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2F6B4F] text-white flex items-center justify-center text-xs font-bold shadow-md relative">
                  L
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white"></span>
                </div>
                <div>
                  <h3 className="font-bold font-serif text-sm">Lumo Assistant</h3>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#2F6B4F] block">Autism Unmasked Expert</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsLumoChatOpen(false);
                    setIsTourOpen(true);
                  }}
                  className="text-[10px] font-extrabold text-[#C77700] bg-[#C77700]/10 border border-[#C77700]/20 px-2.5 py-1 rounded-full hover:bg-[#C77700]/20 transition-colors flex items-center gap-1 cursor-pointer"
                  title={language === 'en' ? 'Start App Tour' : 'Anza Mwongozo'}
                >
                  <Compass className="w-3 h-3" />
                  <span>{language === 'en' ? 'App Tour' : 'Mwongozo'}</span>
                </button>
                <button 
                  onClick={() => setIsLumoChatOpen(false)}
                  className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FFF8EE]">
              {lumoMessages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex flex-col max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div className={`p-4 rounded-3xl text-xs leading-relaxed whitespace-pre-line shadow-sm border ${
                    msg.role === 'user' 
                      ? 'bg-[#C77700] text-white border-[#C77700]' 
                      : 'bg-white text-[#2D3748] border-[#C77700]/10'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-gray-400 font-bold tracking-wider mt-1 px-2 uppercase">{msg.time}</span>
                </div>
              ))}

              {isLumoTyping && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  <span className="ml-1 uppercase tracking-widest text-[9px]">Lumo is formulating reply...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Suggested Quick Questions */}
            <div className="px-6 py-3 border-t border-[#C77700]/10 bg-white/70 space-y-1.5 shrink-0">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 block mb-1">Suggested Questions</span>
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => handleLumoSendMessage(language === 'en' ? 'What are early signs of Autism?' : 'Dalili za mapema za Usonji ni zipi?')}
                  className="w-full text-left bg-[#FFF8EE] hover:bg-[#C77700]/10 border border-[#C77700]/10 px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#2D3748] transition-colors cursor-pointer"
                >
                  ❓ {language === 'en' ? 'What are early signs of Autism?' : 'Dalili za mapema za Usonji ni zipi?'}
                </button>
                <button 
                  onClick={() => handleLumoSendMessage(language === 'en' ? 'Where can I find assessment centres in Kenya?' : 'Niko wapi vituo vya tathmini nchini Kenya?')}
                  className="w-full text-left bg-[#FFF8EE] hover:bg-[#C77700]/10 border border-[#C77700]/10 px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#2D3748] transition-colors cursor-pointer"
                >
                  📍 {language === 'en' ? 'Where are assessment centres in Kenya?' : 'Niko wapi vituo vya tathmini nchini Kenya?'}
                </button>
                <button 
                  onClick={() => handleLumoSendMessage(language === 'en' ? 'Tell me about Autism Myths vs Facts in Kenya.' : 'Uongo na Ukweli kuhusu Usonji nchini Kenya')}
                  className="w-full text-left bg-[#FFF8EE] hover:bg-[#C77700]/10 border border-[#C77700]/10 px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#2D3748] transition-colors cursor-pointer"
                >
                  ⚡ {language === 'en' ? 'Autism Myths vs Facts in Kenya' : 'Uongo na Ukweli kuhusu Usonji nchini Kenya'}
                </button>
              </div>
            </div>

            {/* Message Input Box */}
            <div className="p-4 border-t border-[#C77700]/10 bg-white shrink-0">
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder={language === 'en' ? "Ask Lumo about Autism..." : "Uza Lumo kuhusu Usonji..."}
                  value={lumoInput}
                  onChange={(e) => setLumoInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLumoSendMessage(lumoInput);
                    }
                  }}
                  className="bg-[#FFF8EE] border border-[#C77700]/25 rounded-2xl px-4 py-2.5 text-xs text-[#2D3748] focus:outline-none focus:border-[#2F6B4F] flex-1"
                />
                <button 
                  onClick={() => handleLumoSendMessage(lumoInput)}
                  className="bg-[#2F6B4F] hover:bg-[#1e4432] text-white p-2.5 rounded-2xl cursor-pointer transition-colors"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[8px] text-gray-400 font-semibold text-center mt-2 tracking-widest uppercase">
                {language === 'en' ? 'Powered by Server-Side Gemini API' : 'Inaendeshwa na Gemini API ya Server'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive App Tour Modal */}
      <AppTourModal 
        isOpen={isTourOpen} 
        onClose={() => setIsTourOpen(false)} 
        language={language} 
        speakText={speakText} 
        onOpenLumo={() => setIsLumoChatOpen(true)} 
      />

    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppLayout />
    </HashRouter>
  );
}
