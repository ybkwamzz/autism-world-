import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic, MicOff, Volume2, X, Command, Globe, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceNavigatorProps {
  language: 'en' | 'swa';
  onAlert: (msg: string | null) => void;
}

interface CommandItem {
  keys: string[];
  path: string;
  tab?: string;
  labelEn: string;
  labelSw: string;
  confirmEn: string;
  confirmSw: string;
}

export default function VoiceNavigator({ language, onAlert }: VoiceNavigatorProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isListening, setIsListening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [typedCommand, setTypedCommand] = useState('');
  const [statusMessage, setStatusMessage] = useState<'idle' | 'listening' | 'success' | 'no-match' | 'error'>('idle');
  const [feedbackText, setFeedbackText] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const recognitionRef = useRef<any>(null);

  const commands: CommandItem[] = [
    {
      keys: ['home', 'go home', 'mwanzo', 'nyumbani', 'main', 'pamoja', 'anza'],
      path: '/',
      labelEn: 'Home Screen',
      labelSw: 'Mwanzo',
      confirmEn: 'Going back to the home page.',
      confirmSw: 'Tunarudi mwanzo.'
    },
    {
      keys: ['toolkit', 'tools', 'hub', 'zana', 'tiba', 'maktaba Kuu'],
      path: '/toolkit',
      labelEn: 'Toolkit Hub',
      labelSw: 'Zana za Tiba',
      confirmEn: 'Opening Therapy Toolkit Hub.',
      confirmSw: 'Tunafungua zana za tiba na msaada.'
    },
    {
      keys: ['schedule', 'visual schedule', 'ratiba', 'picha', 'ratiba ya picha'],
      path: '/toolkit/schedule',
      labelEn: 'Visual Schedules',
      labelSw: 'Ratiba ya Picha',
      confirmEn: 'Opening Visual Schedules.',
      confirmSw: 'Tunafungua ratiba ya picha.'
    },
    {
      keys: ['cards', 'soundboard', 'speech cards', 'kadi', 'sauti', 'kadi za sauti'],
      path: '/toolkit/cards',
      labelEn: 'Speech Cards',
      labelSw: 'Kadi za Sauti',
      confirmEn: 'Opening speech cards.',
      confirmSw: 'Tunafungua kadi za sauti.'
    },
    {
      keys: ['board', 'strip', 'communication strip', 'maneno', 'ukanda', 'ukanda wa maneno'],
      path: '/toolkit/board',
      labelEn: 'Communication Strip',
      labelSw: 'Ukanda wa Maneno',
      confirmEn: 'Opening communication strip.',
      confirmSw: 'Tunafungua ukanda wa maneno.'
    },
    {
      keys: ['calm', 'sensory', 'calming', 'tulivu', 'chumba', 'chumba cha kutuliza', 'hisia'],
      path: '/toolkit/calm',
      labelEn: 'Sensory Calming Room',
      labelSw: 'Chumba cha Kutuliza',
      confirmEn: 'Entering Sensory Calming Room.',
      confirmSw: 'Tunaingia chumba cha kutuliza hisia.'
    },
    {
      keys: ['blog', 'stories', 'hadithi', 'shuhuda', 'makala'],
      path: '/blog',
      labelEn: 'Family Stories',
      labelSw: 'Hadithi za Familia',
      confirmEn: 'Opening Family Stories.',
      confirmSw: 'Tunafungua hadithi za familia.'
    },
    // Sub-tab commands for within /toolkit
    {
      keys: ['download', 'downloads', 'center', 'maktaba ya nyaraka', 'nyaraka'],
      path: '/toolkit',
      tab: 'downloads',
      labelEn: 'Download Center (Tab)',
      labelSw: 'Maktaba ya Nyaraka (Kichupo)',
      confirmEn: 'Opening Download Center.',
      confirmSw: 'Tunafungua maktaba ya nyaraka.'
    },
    {
      keys: ['directory', 'clinics', 'hospitals', 'vituo', 'kliniki', 'hospitali'],
      path: '/toolkit',
      tab: 'directory',
      labelEn: 'Services Directory (Tab)',
      labelSw: 'Vituo vya Huduma (Kichupo)',
      confirmEn: 'Opening Services Directory.',
      confirmSw: 'Tunafungua vituo vya huduma.'
    },
    {
      keys: ['checker', 'checkers', 'school', 'readiness', 'vipimo', 'ukuaji'],
      path: '/toolkit',
      tab: 'checkers',
      labelEn: 'Developmental Checkers (Tab)',
      labelSw: 'Vipimo vya Ukuaji (Kichupo)',
      confirmEn: 'Opening School Readiness Checkers.',
      confirmSw: 'Tunafungua vipimo vya ukuaji.'
    },
    {
      keys: ['myth', 'myths', 'facts', 'uongo', 'ukweli', 'imani'],
      path: '/toolkit',
      tab: 'myths',
      labelEn: 'Myth Buster (Tab)',
      labelSw: 'Ukweli na Uongo (Kichupo)',
      confirmEn: 'Opening Myth Buster.',
      confirmSw: 'Tunafungua ukweli na uongo kuhusu usonji.'
    },
    {
      keys: ['event', 'events', 'calendar', 'matukio', 'ratiba ya matukio', 'sherehe'],
      path: '/toolkit',
      tab: 'events',
      labelEn: 'Events Calendar (Tab)',
      labelSw: 'Kalenda ya Matukio (Kichupo)',
      confirmEn: 'Opening Events Calendar.',
      confirmSw: 'Tunafungua kalenda ya matukio.'
    }
  ];

  useEffect(() => {
    // Check SpeechRecognition support safely
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = () => {
          setIsListening(true);
          setStatusMessage('listening');
          setTranscript('');
          setFeedbackText(language === 'en' ? 'Listening...' : 'Ninasikiliza...');
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error event:', event);
          setIsListening(false);
          setStatusMessage('error');
          const err = event?.error;
          if (err === 'not-allowed' || err === 'service-not-allowed') {
            setErrorDetails(language === 'en' ? 'Microphone permission blocked or restricted.' : 'Ruhusa ya maikrofoni imezuiliwa.');
            setFeedbackText(language === 'en' ? 'Microphone access disabled. Tap any command below or type to navigate!' : 'Ruhusa ya maikrofoni haipatikani. Gusa amri hapa chini au andika!');
          } else if (err === 'no-speech') {
            setErrorDetails(language === 'en' ? 'No speech detected.' : 'Hakuna sauti iliyosikika.');
            setFeedbackText(language === 'en' ? 'No speech heard. Please try again or tap a command below.' : 'Sikukusikia. Jaribu tena au chagua amri hapa chini.');
          } else if (err === 'audio-capture') {
            setErrorDetails(language === 'en' ? 'No microphone hardware found.' : 'Maikrofoni haikupatikana.');
            setFeedbackText(language === 'en' ? 'No microphone detected on your device. Click any command below.' : 'Maikrofoni haikupatikana. Gusa amri yoyote hapa chini.');
          } else if (err === 'network') {
            setErrorDetails(language === 'en' ? 'Network connection error.' : 'Hitilafu ya mtandao.');
            setFeedbackText(language === 'en' ? 'Network connection issue for speech recognition. Tap any command below.' : 'Hitilafu ya mtandao. Gusa amri yoyote hapa chini.');
          } else if (err === 'aborted') {
            setErrorDetails(language === 'en' ? 'Speech cancelled.' : 'Sauti imesitishwa.');
            setFeedbackText(language === 'en' ? 'Listening cancelled.' : 'Urejeshaji wa sauti umesitishwa.');
          } else {
            setErrorDetails(err ? String(err) : (language === 'en' ? 'Speech error' : 'Hitilafu ya sauti'));
            setFeedbackText(language === 'en' ? 'Speech recognition error. You can click any command below!' : 'Hitilafu ya sauti. Unaweza kubonyeza amri yoyote hapa chini!');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onresult = (event: any) => {
          try {
            if (event.results && event.results[0] && event.results[0][0]) {
              const resultText = event.results[0][0].transcript;
              setTranscript(resultText);
              processVoiceCommand(resultText);
            }
          } catch (e) {
            console.error("Error processing speech result:", e);
          }
        };

        recognitionRef.current = recognition;
      }
    } catch (err) {
      console.warn('SpeechRecognition initialization failed:', err);
    }
  }, [language]);

  // Adjust recognition language dynamically when language state changes
  useEffect(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = language === 'en' ? 'en-US' : 'sw-KE';
      } catch (e) {
        console.warn("Could not set speech recognition lang:", e);
      }
    }
  }, [language]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setStatusMessage('error');
      setErrorDetails(language === 'en' ? 'Speech recognition not supported' : 'Haitumiki');
      setFeedbackText(language === 'en' 
        ? 'Speech recognition is not supported in this browser. Tap any command below or type to navigate!' 
        : 'Huduma hii ya sauti haitumiki kwenye kivinjari hiki. Gusa amri hapa chini au andika!'
      );
      return;
    }
    
    try {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore if already stopped
      }

      setStatusMessage('listening');
      setFeedbackText(language === 'en' ? 'Initializing microphone...' : 'Inaandaa maikrofoni...');

      setTimeout(() => {
        try {
          recognitionRef.current.start();
        } catch (e: any) {
          console.warn("Recognition start exception:", e);
          setIsListening(false);
          setStatusMessage('error');
          setErrorDetails(e?.message || 'Mic start error');
          setFeedbackText(language === 'en' 
            ? 'Could not start microphone. Tap any command below to navigate!' 
            : 'Maikrofoni haikuweza kuwashwa. Gusa amri hapa chini!'
          );
        }
      }, 100);
    } catch (e: any) {
      console.warn("startListening error:", e);
      setIsListening(false);
      setStatusMessage('error');
      setErrorDetails(e?.message || 'start-failed');
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
  };

  const speakConfirmation = (text: string) => {
    try {
      if ('speechSynthesis' in window && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'en' ? 'en-US' : 'sw-KE';
        utterance.rate = 1.0;
        utterance.onerror = (e) => console.warn('SpeechSynthesis error:', e);
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('SpeechSynthesis exception:', e);
    }
  };

  const processVoiceCommand = (rawText: string) => {
    const text = rawText.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
    console.log("Processing voice command:", text);

    // Find a matching command
    const matchedCommand = commands.find(cmd => {
      return cmd.keys.some(key => text.includes(key) || key.includes(text));
    });

    if (matchedCommand) {
      setStatusMessage('success');
      const confirmation = language === 'en' ? matchedCommand.confirmEn : matchedCommand.confirmSw;
      setFeedbackText(confirmation);
      speakConfirmation(confirmation);
      onAlert(confirmation);

      // Perform navigation action
      setTimeout(() => {
        // If it targets a specific tab on the toolkit page
        if (matchedCommand.tab) {
          // If we are not on the toolkit, navigate first
          if (location.pathname !== '/toolkit') {
            navigate('/toolkit');
          }
          // Delay tab change dispatch slightly to let route resolve
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('toolkit-tab-change', { detail: matchedCommand.tab }));
            
            // Also scroll into view
            const element = document.getElementById('toolkit-tab-navigation');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 150);
        } else {
          // General route navigation
          navigate(matchedCommand.path);
        }
        
        // Clear alert and close modal on success
        setTimeout(() => {
          onAlert(null);
          setIsOpen(false);
          setStatusMessage('idle');
        }, 1500);
      }, 800);

    } else {
      setStatusMessage('no-match');
      setFeedbackText(
        language === 'en' 
          ? `No match found for "${rawText}". Try again!` 
          : `Hatukupata kifungu cha "${rawText}". Jaribu tena!`
      );
    }
  };

  return (
    <>
      {/* Floating Micro Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          id="voice-nav-trigger"
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => startListening(), 300);
          }}
          className="flex items-center gap-2 bg-[#C77700] hover:bg-[#a05f00] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all border-2 border-white/40 hover:scale-105 group cursor-pointer"
          title={language === 'en' ? 'Voice Control Navigation' : 'Msaada wa Sauti'}
        >
          <Mic className="w-5 h-5 animate-pulse text-white shrink-0" />
          <span className="hidden sm:inline text-xs font-black uppercase tracking-wider">
            {language === 'en' ? 'Voice Control' : 'Amri ya Sauti'}
          </span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </button>
      </div>

      {/* Voice Assistant Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FFF8EE] rounded-[32px] border-4 border-[#C77700] p-6 sm:p-8 w-full max-w-lg shadow-2xl relative text-[#2D3748]"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  stopListening();
                  setIsOpen(false);
                  setStatusMessage('idle');
                }}
                className="absolute top-4 right-4 bg-gray-200/80 hover:bg-gray-300 text-gray-700 p-2 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title Header */}
              <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C77700]/10 rounded-2xl flex items-center justify-center text-[#C77700]">
                  <Command className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#C77700] uppercase tracking-widest block">
                    {language === 'en' ? 'ACCESSIBILITY SPEECH CONTROLLER' : 'MDHIBITI WA SAUTI WA KITAALAMU'}
                  </span>
                  <h3 className="text-xl font-bold font-serif text-[#2D3748]">
                    {language === 'en' ? 'Voice Nav Assistant' : 'Msaidizi wa Sauti'}
                  </h3>
                </div>
              </div>

              {/* Audio Wave Visualizer Area */}
              <div className="bg-white rounded-2xl border border-[#C77700]/20 p-6 flex flex-col items-center justify-center min-h-[160px] text-center mb-6">
                {statusMessage === 'listening' ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-1.5 h-10">
                      {[...Array(6)].map((_, i) => (
                        <motion.span
                          key={i}
                          animate={{
                            height: [12, 40, 12],
                          }}
                          transition={{
                            duration: 0.7,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                          className="w-1.5 rounded-full bg-[#C77700]"
                        />
                      ))}
                    </div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest animate-pulse">
                      {language === 'en' ? 'Listening carefully...' : 'Ninasikiliza kwa makini...'}
                    </p>
                  </div>
                ) : statusMessage === 'success' ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-1">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-green-600">
                      {language === 'en' ? 'Command Recognized' : 'Amri Imetambuliwa'}
                    </span>
                  </div>
                ) : statusMessage === 'error' ? (
                  <div className="flex flex-col items-center gap-2 text-amber-600">
                    <AlertCircle className="w-10 h-10" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {language === 'en' ? 'Microphone Issue' : 'Hitilafu ya Maikrofoni'}
                    </span>
                    <span className="text-[10px] text-gray-400">{errorDetails}</span>
                  </div>
                ) : (
                  <button
                    onClick={startListening}
                    className="w-14 h-14 bg-[#C77700]/10 hover:bg-[#C77700]/20 text-[#C77700] rounded-full flex items-center justify-center transition-all cursor-pointer border border-[#C77700]/20 hover:scale-105"
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                )}

                {/* Subtitle Display */}
                <div className="mt-4 max-w-xs w-full">
                  {transcript && (
                    <p className="text-xs text-gray-400 italic mb-2">
                      {language === 'en' ? 'Heard:' : 'Umesema:'} "{transcript}"
                    </p>
                  )}
                  <p className="text-sm font-bold text-gray-700 leading-relaxed mb-3">
                    {feedbackText || (language === 'en' ? 'Tap the mic and speak a command keyword.' : 'Gusa picha ya mic kisha utoe amri yako.')}
                  </p>

                  {/* Text input fallback for quiet environments or blocked mics */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (typedCommand.trim()) {
                        processVoiceCommand(typedCommand);
                        setTypedCommand('');
                      }
                    }}
                    className="flex gap-2 w-full mt-2"
                  >
                    <input
                      type="text"
                      value={typedCommand}
                      onChange={(e) => setTypedCommand(e.target.value)}
                      placeholder={language === 'en' ? 'Or type a command (e.g. "schedule")...' : 'Au andika amri (mfano "ratiba")...'}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#C77700]"
                    />
                    <button
                      type="submit"
                      className="bg-[#C77700] hover:bg-[#a05f00] text-white px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer shrink-0"
                    >
                      {language === 'en' ? 'Go' : 'Anza'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Keyword Cheatsheet */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-widest">
                    {language === 'en' ? 'Supported Commands' : 'Amri Zinazokubalika'}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
                    <Globe className="w-3 h-3 text-[#2F6B4F]" />
                    <span>English & Swahili</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left max-h-[160px] overflow-y-auto pr-1">
                  {commands.filter(cmd => !cmd.tab).map((cmd, idx) => (
                    <button
                      key={idx}
                      onClick={() => processVoiceCommand(cmd.keys[0])}
                      className="p-2 bg-white hover:bg-gray-50 border border-gray-100 rounded-xl flex flex-col transition-all text-left cursor-pointer group"
                    >
                      <span className="text-xs font-bold text-gray-800 group-hover:text-[#C77700]">
                        {language === 'en' ? cmd.labelEn : cmd.labelSw}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">
                        "{cmd.keys.slice(0, 2).join(' / ')}"
                      </span>
                    </button>
                  ))}
                  
                  {/* Divider */}
                  <div className="col-span-2 border-t border-gray-100 my-1 py-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      {language === 'en' ? 'Toolkit Tabs' : 'Vichupo vya Zana'}
                    </span>
                  </div>

                  {commands.filter(cmd => cmd.tab).map((cmd, idx) => (
                    <button
                      key={`tab-${idx}`}
                      onClick={() => processVoiceCommand(cmd.keys[0])}
                      className="p-2 bg-white hover:bg-gray-50 border border-gray-100 rounded-xl flex flex-col transition-all text-left cursor-pointer group"
                    >
                      <span className="text-xs font-bold text-gray-800 group-hover:text-[#C77700]">
                        {language === 'en' ? cmd.labelEn.replace(' (Tab)', '') : cmd.labelSw.replace(' (Kichupo)', '')}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">
                        "{cmd.keys.slice(0, 2).join(' / ')}"
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status footer button */}
              <div className="mt-6 pt-4 border-t border-gray-200/60 flex justify-end gap-2">
                <button
                  onClick={() => {
                    stopListening();
                    setIsOpen(false);
                    setStatusMessage('idle');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  {language === 'en' ? 'Close' : 'Funga'}
                </button>
                {!isListening ? (
                  <button
                    onClick={startListening}
                    className="bg-[#C77700] hover:bg-[#a05f00] text-white font-bold px-5 py-2 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    {language === 'en' ? 'Start Speech' : 'Anza Kuongea'}
                  </button>
                ) : (
                  <button
                    onClick={stopListening}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    {language === 'en' ? 'Stop Listening' : 'Acha Kusikiliza'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
