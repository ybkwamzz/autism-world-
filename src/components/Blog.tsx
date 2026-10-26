import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CheckCircle, Flame, Send, Share2, Mail, TrendingUp, Copy, Check } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Story } from '../types';
import Confetti from './Confetti';

interface BlogProps {
  language: 'en' | 'swa';
  stories: Story[];
  onSubmitStory: (story: Omit<Story, 'id' | 'date'>) => void;
  familiesCount: number;
  setFamiliesCount: React.Dispatch<React.SetStateAction<number>>;
  storiesCount: number;
  downloadsCount: number;
}

export default function Blog({
  language,
  stories,
  onSubmitStory,
  familiesCount,
  setFamiliesCount,
  storiesCount,
  downloadsCount
}: BlogProps) {
  const navigate = useNavigate();
  // Dynamic growth data representing historical statistics leading up to current counts
  const growthData = [
    { name: "Q1 '25", families: 120, downloads: 350 },
    { name: "Q2 '25", families: 340, downloads: 980 },
    { name: "Q3 '25", families: 680, downloads: 1850 },
    { name: "Q4 '25", families: 950, downloads: 2700 },
    { name: "Q1 '26", families: 1220, downloads: 3800 },
    { name: "Q2 '26", families: familiesCount, downloads: downloadsCount },
  ];

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState(false);
  const [storySuccess, setStorySuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copiedStoryId, setCopiedStoryId] = useState<string | null>(null);

  const handleShareStory = async (story: Story) => {
    const shareUrl = `${window.location.origin}/#/blog?story=${story.id}`;
    const shareText = `Check out this inspiring story from Autism Unmasked Kenya:\n\n"${story.title}"\n— Shared by ${story.name} (${story.role}) from ${story.location}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Autism Unmasked Kenya - Story`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Error sharing story:", err);
      }
    } else {
      try {
        const fullShareContent = `${shareText}\n\nRead more stories here: ${shareUrl}`;
        await navigator.clipboard.writeText(fullShareContent);
        setCopiedStoryId(story.id);
        setTimeout(() => setCopiedStoryId(null), 2500);
      } catch (err) {
        console.error("Could not copy text to clipboard:", err);
      }
    }
  };

  // Form State
  const [newStory, setNewStory] = useState({
    name: '',
    role: 'Parent',
    location: '',
    title: '',
    content: '',
    category: 'Our Journey'
  });

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStory.name || !newStory.location || !newStory.title || !newStory.content) return;

    onSubmitStory(newStory);
    setStorySuccess(true);
    setShowConfetti(true);
    setNewStory({
      name: '',
      role: 'Parent',
      location: '',
      title: '',
      content: '',
      category: 'Our Journey'
    });

    setTimeout(() => {
      setStorySuccess(false);
      setIsSubmitFormOpen(false);
    }, 2500);
  };

  const filteredStories = activeCategory === 'All' 
    ? stories 
    : stories.filter(story => story.category === activeCategory);

  const categories = [
    { key: 'All', en: 'All Stories', swa: 'Hadithi Zote' },
    { key: 'Our Journey', en: 'Our Journey', swa: 'Safari Yetu' },
    { key: 'Sibling Voices', en: 'Sibling Voices', swa: 'Sauti za Ndugu' },
    { key: 'Special Education', en: 'Special Education', swa: 'Elimu Maalum' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 w-full">
      {/* Subtle Confetti Overlay */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Left Column: Stories Hub (60% equivalent) */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-widest">
              {language === 'en' ? 'COMMUNITY VOICES' : 'SAUTI ZA JAMII'}
            </span>
            <h2 className="text-3xl font-bold font-serif text-[#2D3748] mt-1">
              {language === 'en' ? 'Real Stories, Shared Hope' : 'Hadithi Halisi, Tumaini Moja'}
            </h2>
          </div>
          <button 
            onClick={() => setIsSubmitFormOpen(!isSubmitFormOpen)}
            className="flex items-center gap-2 text-xs font-extrabold text-white bg-[#C77700] hover:bg-[#a06000] px-4 py-2.5 rounded-full shadow-sm transition-all cursor-pointer self-start"
          >
            <Plus className="w-4 h-4" />
            <span>
              {isSubmitFormOpen 
                ? (language === 'en' ? 'Close Panel' : 'Funga Jopo') 
                : (language === 'en' ? 'Share Your Story' : 'Shirikisha Hadithi')}
            </span>
          </button>
        </div>

        {/* Story Submission Collapsible Panel */}
        {isSubmitFormOpen && (
          <div className="bg-white rounded-3xl border-2 border-[#C77700] p-6 sm:p-8 shadow-md transition-all duration-300">
            <h3 className="text-xl font-bold font-serif text-[#C77700] mb-2">
              {language === 'en' ? 'Share Your Journey' : 'Shirikisha Safari Yako'}
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              {language === 'en' 
                ? 'Encourage thousands of parents across Kenya by writing your victory stories or lesson learned.' 
                : 'Hamasisha maelfu ya wazazi nchini Kenya kwa kuandika hadithi yako ya ushindi au mafunzo.'}
            </p>

            {storySuccess ? (
              <div className="bg-[#2F6B4F] text-[#FFF8EE] p-6 rounded-2xl text-center space-y-2">
                <CheckCircle className="w-12 h-12 mx-auto text-[#E89B2E] animate-bounce" />
                <h4 className="font-bold text-lg">{language === 'en' ? 'Story Submitted!' : 'Hadithi Imepokelewa!'}</h4>
                <p className="text-xs opacity-90">
                  {language === 'en' ? 'Thank you. Your narrative is now unmasked on the community board.' : 'Asante. Hadithi yako sasa inaonekana kwenye ubao wa jamii.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Your Name</label>
                    <input 
                      type="text" 
                      required 
                      value={newStory.name}
                      onChange={(e) => setNewStory({...newStory, name: e.target.value})}
                      placeholder="Grace Mwangi" 
                      className="w-full bg-[#FFF8EE]/50 border border-[#C77700]/20 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#C77700]" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Your Role</label>
                    <select 
                      value={newStory.role}
                      onChange={(e) => setNewStory({...newStory, role: e.target.value})}
                      className="w-full bg-[#FFF8EE]/50 border border-[#C77700]/20 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#C77700]"
                    >
                      <option value="Parent">Parent / Guardian</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Educator">Educator</option>
                      <option value="Autistic Self">Autistic Self</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Kenyan Location / County</label>
                    <input 
                      type="text" 
                      required 
                      value={newStory.location}
                      onChange={(e) => setNewStory({...newStory, location: e.target.value})}
                      placeholder="e.g., Nairobi, Kisumu" 
                      className="w-full bg-[#FFF8EE]/50 border border-[#C77700]/20 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#C77700]" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Category</label>
                    <select 
                      value={newStory.category}
                      onChange={(e) => setNewStory({...newStory, category: e.target.value})}
                      className="w-full bg-[#FFF8EE]/50 border border-[#C77700]/20 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#C77700]"
                    >
                      <option value="Our Journey">Our Journey</option>
                      <option value="Sibling Voices">Sibling Voices</option>
                      <option value="Special Education">Special Education</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Heading / Title</label>
                  <input 
                    type="text" 
                    required 
                    value={newStory.title}
                    onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                    placeholder="e.g., Taking the First Step" 
                    className="w-full bg-[#FFF8EE]/50 border border-[#C77700]/20 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#C77700]" 
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Your Story</label>
                  <textarea 
                    required 
                    rows={4}
                    value={newStory.content}
                    onChange={(e) => setNewStory({...newStory, content: e.target.value})}
                    placeholder="Describe your journey, lessons, or triumphs so others can find hope..." 
                    className="w-full bg-[#FFF8EE]/50 border border-[#C77700]/20 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#C77700] resize-none"
                  />
                </div>

                <button type="submit" className="w-full bg-[#C77700] hover:bg-[#d1841e] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
                  {language === 'en' ? 'Submit Story' : 'Wasilisha Hadithi'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Categories Filtering Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-[#2F6B4F] text-white shadow-sm'
                  : 'bg-white text-[#2D3748]/70 border border-[#C77700]/10 hover:border-[#2F6B4F]'
              }`}
            >
              {language === 'en' ? cat.en : cat.swa}
            </button>
          ))}
        </div>

        {/* Stories List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredStories.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white border border-[#C77700]/10 rounded-3xl text-gray-400 text-xs font-medium">
              {language === 'en' ? 'No stories found in this category yet. Be the first!' : 'Hakuna hadithi bado katika kundi hili. Kuwa wa kwanza!'}
            </div>
          ) : (
            filteredStories.map((story) => (
              <div 
                key={story.id} 
                className={`rounded-[28px] p-6 shadow-sm flex flex-col justify-between border transition-all hover:shadow-md ${
                  story.role === 'Sibling' 
                    ? 'bg-[#2F6B4F] text-white border-[#2F6B4F]' 
                    : 'bg-white text-[#2D3748] border-[#C77700]/10'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[9px] uppercase font-black px-2.5 py-1 rounded-full ${
                      story.role === 'Sibling' 
                        ? 'bg-white/20 text-[#FFF8EE]' 
                        : 'bg-[#C77700]/10 text-[#C77700]'
                    }`}>
                      {story.role}
                    </span>
                    <span className={`text-[10px] font-bold ${story.role === 'Sibling' ? 'text-white/70' : 'text-gray-400'}`}>
                      {story.location}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-serif mb-3 leading-tight">
                    {story.title}
                  </h3>
                  <p className={`text-xs leading-relaxed whitespace-pre-line ${story.role === 'Sibling' ? 'text-white/85 italic' : 'text-gray-600'}`}>
                    "{story.content}"
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-current/10">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                      story.role === 'Sibling' ? 'bg-white/20 text-white' : 'bg-[#C77700]/10 text-[#C77700]'
                    }`}>
                      {story.name.charAt(0)}
                    </div>
                    <span className="text-[10px] font-bold">
                      {story.name} • {story.date}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
                    <a
                      href={`mailto:?subject=${encodeURIComponent(
                        `Autism Unmasked Kenya - Story: ${story.title}`
                      )}&body=${encodeURIComponent(
                        `Check out this inspiring story from Autism Unmasked Kenya:\n\n"${story.title}"\n\n"${story.content}"\n\n— Shared by ${story.name} (${story.role}) from ${story.location}\n\nRead more stories & access therapy tools: ${typeof window !== 'undefined' ? window.location.origin : 'https://autism-unmasked.ke'}`
                      )}`}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border shrink-0 ${
                        story.role === 'Sibling'
                          ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                          : 'bg-white text-[#2D3748] border-gray-200 hover:bg-gray-50'
                      }`}
                      title={language === 'en' ? 'Share via Email' : 'Tuma kwa Barua Pepe'}
                    >
                      <Mail className="w-3.5 h-3.5 text-[#2F6B4F]" />
                      <span>{language === 'en' ? 'Email' : 'Barua'}</span>
                    </a>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `*Autism Unmasked Kenya - ${story.title}*\n\n"${story.content.length > 140 ? story.content.substring(0, 140) + '...' : story.content}"\n\n— Shared by ${story.name} (${story.role}) from ${story.location}\n\nRead more stories & access therapy tools: ${typeof window !== 'undefined' ? window.location.origin : 'https://autism-unmasked.ke'}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border shrink-0 ${
                        story.role === 'Sibling'
                          ? 'bg-white text-[#2F6B4F] border-white hover:bg-[#FFF8EE]'
                          : 'bg-[#25D366] text-white border-[#25D366] hover:bg-[#20ba5a] hover:border-[#20ba5a]'
                      }`}
                      title={language === 'en' ? 'Share to WhatsApp' : 'Tuma kwa WhatsApp'}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'WhatsApp' : 'Tuma'}</span>
                    </a>

                    <button
                      onClick={() => handleShareStory(story)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border shrink-0 ${
                        copiedStoryId === story.id
                          ? (story.role === 'Sibling' ? 'bg-white text-[#2F6B4F] border-white' : 'bg-green-100 text-green-800 border-green-200')
                          : (story.role === 'Sibling'
                              ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                              : 'bg-white text-[#2D3748] border-gray-200 hover:bg-gray-50')
                      }`}
                      title={language === 'en' ? 'Copy link/Share story' : 'Nakili kiungo/Shirikisha hadithi'}
                    >
                      {copiedStoryId === story.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Copied!' : 'Imenakiliwa!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Share' : 'Soma'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column: Sidebar Area (40% equivalent) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Impact Counters */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-[#E89B2E] text-white p-6 rounded-[28px] text-center shadow-md transform hover:scale-[1.02] transition-transform">
            <div className="text-3xl font-black font-serif">{familiesCount.toLocaleString()}+</div>
            <div className="text-[10px] uppercase font-black tracking-widest opacity-90 mt-2">
              {language === 'en' ? 'Families Reached' : 'Familia Zilizofikiwa'}
            </div>
          </div>
          <div className="bg-[#FFF8EE] border-2 border-[#E89B2E] p-6 rounded-[28px] text-center transform hover:scale-[1.02] transition-transform">
            <div className="text-3xl font-black font-serif text-[#C77700]">{storiesCount}+</div>
            <div className="text-[10px] uppercase font-black tracking-widest text-[#2D3748]/60 mt-2">
              {language === 'en' ? 'Stories Shared' : 'Hadithi Zilizotolewa'}
            </div>
          </div>
          <div className="col-span-2 bg-[#2F6B4F] text-white p-6 rounded-[28px] text-center shadow-md transform hover:scale-[1.02] transition-transform">
            <div className="text-3xl font-black font-serif">{downloadsCount.toLocaleString()}+</div>
            <div className="text-[10px] uppercase font-black tracking-widest opacity-90 mt-2">
              {language === 'en' ? 'Resources Downloaded' : 'Nyaraka Zilizopakuliwa'}
            </div>
          </div>
        </section>

        {/* Platform Growth Chart */}
        <section className="bg-white border-2 border-gray-100 rounded-[32px] p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#2F6B4F]/10 rounded-xl flex items-center justify-center text-[#2F6B4F]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-serif text-[#2D3748]">
                {language === 'en' ? 'Platform Impact Growth' : 'Ukuaji wa Huduma Yetu'}
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {language === 'en' ? 'Verified Quarterly Analytics' : 'Vipimo vya Kila Robo Mwaka'}
              </p>
            </div>
          </div>

          <div className="h-56 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={growthData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorFamilies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E89B2E" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#E89B2E" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F6B4F" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2F6B4F" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#A0AEC0" 
                  fontSize={10} 
                  fontWeight="bold"
                  fontFamily="JetBrains Mono, monospace"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#A0AEC0" 
                  fontSize={10} 
                  fontWeight="bold"
                  fontFamily="JetBrains Mono, monospace"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#FFF8EE] border-2 border-[#E89B2E] p-3 rounded-2xl shadow-lg text-xs">
                          <p className="font-bold text-[#2D3748] mb-1 font-serif">{label}</p>
                          {payload.map((pld: any) => (
                            <div key={pld.dataKey} className="flex items-center gap-2 mt-1">
                              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: pld.color }}></span>
                              <span className="text-gray-500 font-medium text-[11px]">
                                {pld.dataKey === 'families' 
                                  ? (language === 'en' ? 'Families:' : 'Familia:') 
                                  : (language === 'en' ? 'Downloads:' : 'Upakuaji:')}
                              </span>
                              <span className="font-bold text-gray-800 font-mono text-[11px]">{pld.value.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="downloads" 
                  name={language === 'en' ? 'Downloads' : 'Upakuaji'}
                  stroke="#2F6B4F" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorDownloads)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="families" 
                  name={language === 'en' ? 'Families' : 'Familia'}
                  stroke="#E89B2E" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorFamilies)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-4 text-[10px] font-black uppercase tracking-wider mt-1">
            <div className="flex items-center gap-1.5 text-[#E89B2E]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E89B2E] shrink-0"></span>
              <span>{language === 'en' ? 'Families' : 'Familia'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#2F6B4F]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2F6B4F] shrink-0"></span>
              <span>{language === 'en' ? 'Downloads' : 'Upakuaji'}</span>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-[#2D3748] text-[#FFF8EE] rounded-[32px] p-6 sm:p-8 relative overflow-hidden shadow-xl border border-white/5">
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="p-2 rounded-xl bg-white/10 text-[#E89B2E] text-lg">⚡</span>
              <h3 className="font-bold text-xl font-serif">
                {language === 'en' ? 'Join the Community' : 'Jiunge na Jamii Yetu'}
              </h3>
            </div>
            <p className="text-xs text-[#FFF8EE]/85 mb-6 leading-relaxed">
              {language === 'en'
                ? 'Receive monthly special educational visual materials, community advice, and stories from families across Kenya directly in your email.'
                : 'Pata vifaa vya masomo vya picha vya kila mwezi, ushauri wa jamii, na hadithi kutoka kwa familia kote nchini Kenya moja kwa moja.'}
            </p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = newsletterEmail.trim();
                if (trimmed) {
                  setNewsletterSuccess(true);
                  setFamiliesCount(prev => prev + 1);
                  navigate(`/newsletter-confirmation?email=${encodeURIComponent(trimmed)}`, {
                    state: { email: trimmed }
                  });
                }
              }}
              className="flex flex-col sm:flex-row gap-2.5"
            >
              <input 
                type="email" 
                required
                placeholder={language === 'en' ? 'Enter your email' : 'Ingiza barua pepe yako'} 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#E89B2E] text-white flex-1 placeholder:text-white/45"
              />
              <button 
                type="submit"
                className="bg-[#C77700] hover:bg-[#d1841e] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Join' : 'Jiunge'}
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-4 mt-6 opacity-65 text-[10px] font-bold tracking-wider">
              <span className="hover:text-[#E89B2E] cursor-pointer">WhatsApp Group</span>
              <span>•</span>
              <span className="hover:text-[#E89B2E] cursor-pointer">Instagram</span>
              <span>•</span>
              <span className="hover:text-[#E89B2E] cursor-pointer">Facebook</span>
            </div>
          </div>
          
          <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-[#E89B2E] rounded-full blur-3xl opacity-25"></div>
        </section>
      </div>
    </div>
  );
}
