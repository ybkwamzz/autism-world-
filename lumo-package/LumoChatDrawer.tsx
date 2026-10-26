import React, { useState, useEffect, useRef } from 'react';
import { Bot, Compass, X, Send } from 'lucide-react';

export interface Message {
  role: 'user' | 'model';
  text: string;
  time?: string;
}

interface LumoChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'swa';
  onOpenTour?: () => void;
}

export default function LumoChatDrawer({
  isOpen,
  onClose,
  language,
  onOpenTour
}: LumoChatDrawerProps) {
  const [lumoInput, setLumoInput] = useState('');
  const [lumoMessages, setLumoMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: "Hujambo! I am Lumo, your supportive assistant. Ask me anything about Autism, visual toolkits, finding assessment clinics in Kenya, or navigating special educational resources.", 
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

  const handleSendMessage = async (text: string) => {
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
          language
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
      // Fallback offline clinical guidance
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

  if (!isOpen) return null;

  return (
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
            {onOpenTour && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTour();
                }}
                className="text-[10px] font-extrabold text-[#C77700] bg-[#C77700]/10 border border-[#C77700]/20 px-2.5 py-1 rounded-full hover:bg-[#C77700]/20 transition-colors flex items-center gap-1 cursor-pointer"
                title={language === 'en' ? 'Start App Tour' : 'Anza Mwongozo'}
              >
                <Compass className="w-3 h-3" />
                <span>{language === 'en' ? 'App Tour' : 'Mwongozo'}</span>
              </button>
            )}
            <button 
              onClick={onClose}
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
              onClick={() => handleSendMessage(language === 'en' ? 'What are early signs of Autism?' : 'Dalili za mapema za Usonji ni zipi?')}
              className="w-full text-left bg-[#FFF8EE] hover:bg-[#C77700]/10 border border-[#C77700]/10 px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#2D3748] transition-colors cursor-pointer"
            >
              ❓ {language === 'en' ? 'What are early signs of Autism?' : 'Dalili za mapema za Usonji ni zipi?'}
            </button>
            <button 
              onClick={() => handleSendMessage(language === 'en' ? 'Where can I find assessment centres in Kenya?' : 'Niko wapi vituo vya tathmini nchini Kenya?')}
              className="w-full text-left bg-[#FFF8EE] hover:bg-[#C77700]/10 border border-[#C77700]/10 px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#2D3748] transition-colors cursor-pointer"
            >
              📍 {language === 'en' ? 'Where are assessment centres in Kenya?' : 'Niko wapi vituo vya tathmini nchini Kenya?'}
            </button>
            <button 
              onClick={() => handleSendMessage(language === 'en' ? 'Tell me about Autism Myths vs Facts in Kenya.' : 'Uongo na Ukweli kuhusu Usonji nchini Kenya')}
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
                  handleSendMessage(lumoInput);
                }
              }}
              className="bg-[#FFF8EE] border border-[#C77700]/25 rounded-2xl px-4 py-2.5 text-xs text-[#2D3748] focus:outline-none focus:border-[#2F6B4F] flex-1"
            />
            <button 
              onClick={() => handleSendMessage(lumoInput)}
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
  );
}
