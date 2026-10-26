import React, { useState } from 'react';
import { MapPin, Phone, Mail, Award, CheckCircle, Search, AlertCircle, Calendar, MessageSquare, Send } from 'lucide-react';

interface ServicesDirectoryProps {
  language: 'en' | 'swa';
}

interface ServiceItem {
  id: string;
  name: string;
  category: 'therapist' | 'school' | 'speech' | 'occupational' | 'assessment';
  categoryLabelEn: string;
  categoryLabelSw: string;
  location: 'Nairobi' | 'Mombasa' | 'Kisumu' | 'Nakuru' | 'Eldoret';
  neighborhood: string;
  phone: string;
  email: string;
  verified: boolean;
  descEn: string;
  descSw: string;
  rating: number;
}

export default function ServicesDirectory({ language }: ServicesDirectoryProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [enquiryModal, setEnquiryModal] = useState<ServiceItem | null>(null);
  const [enquirySent, setEnquirySent] = useState(false);

  const locations = [
    { id: 'all', label: language === 'en' ? 'All Locations' : 'Miji Yote' },
    { id: 'Nairobi', label: 'Nairobi' },
    { id: 'Mombasa', label: 'Mombasa' },
    { id: 'Kisumu', label: 'Kisumu' },
    { id: 'Nakuru', label: 'Nakuru' },
    { id: 'Eldoret', label: 'Eldoret' },
  ];

  const categories = [
    { id: 'all', labelEn: 'All Services', labelSw: 'Huduma Zote' },
    { id: 'therapist', labelEn: 'Therapists & ABA', labelSw: 'Wataalamu wa Tabia' },
    { id: 'school', labelEn: 'Special & Inclusive Schools', labelSw: 'Shule Maalumu' },
    { id: 'speech', labelEn: 'Speech Therapists', labelSw: 'Wataalamu wa Lugha' },
    { id: 'occupational', labelEn: 'Occupational Therapists', labelSw: 'Tiba ya Kazi (OT)' },
    { id: 'assessment', labelEn: 'Assessment Centers', labelSw: 'Vituo vya Upimaji' },
  ];

  const services: ServiceItem[] = [
    {
      id: 'nbo-assess-1',
      name: 'Gertrude\'s Children\'s Hospital Developmental Unit',
      category: 'assessment',
      categoryLabelEn: 'Assessment Center',
      categoryLabelSw: 'Kituo cha Upimaji',
      location: 'Nairobi',
      neighborhood: 'Muthaiga & Outreach Clinics',
      phone: '+254 730 600000',
      email: 'developmental@gerties.org',
      verified: true,
      descEn: 'Comprehensive neurodevelopmental assessments, diagnosis, and early intervention planning by a multidisciplinary clinical team.',
      descSw: 'Vipimo kamili vya ukuaji wa akili, utambuzi, na mipango ya kuanza tiba mapema kutoka kwa madaktari bingwa.',
      rating: 4.9
    },
    {
      id: 'nbo-school-1',
      name: 'The Nest Inclusive Learning Centre',
      category: 'school',
      categoryLabelEn: 'Inclusive School',
      categoryLabelSw: 'Shule Jumuishi',
      location: 'Nairobi',
      neighborhood: 'Kilimani',
      phone: '+254 722 890456',
      email: 'info@nestlearning.co.ke',
      verified: true,
      descEn: 'A sensory-friendly mainstream primary environment with customized individual learning plans and on-site sensory rooms.',
      descSw: 'Shule ya kawaida inayopokea watoto wenye usonji, yenye mipango maalum ya masomo na vyumba vya kutuliza kihisia.',
      rating: 4.8
    },
    {
      id: 'msa-speech-1',
      name: 'Coast Speech and Language Therapy Clinic',
      category: 'speech',
      categoryLabelEn: 'Speech Therapist',
      categoryLabelSw: 'Mtaalamu wa Lugha',
      location: 'Mombasa',
      neighborhood: 'Nyali',
      phone: '+254 711 345678',
      email: 'mombasaspeech@clinical.ke',
      verified: true,
      descEn: 'Specialized speech-language pathologists focusing on verbal development, PECS implementation, and alternative communication (AAC).',
      descSw: 'Wataalamu wa tiba ya kusema na kuwasiliana wanaosaidia watoto kukuza lugha na kutumia kadi za picha.',
      rating: 4.7
    },
    {
      id: 'kis-ot-1',
      name: 'Victoria Pediatric Occupational Therapy Services',
      category: 'occupational',
      categoryLabelEn: 'Occupational Therapist',
      categoryLabelSw: 'Tiba ya Kazi (OT)',
      location: 'Kisumu',
      neighborhood: 'Milimani',
      phone: '+254 725 901234',
      email: 'vicoccupational@kisumu.ke',
      verified: true,
      descEn: 'Sensory integration therapy, motor skills coaching, and daily self-care skills training (dressing, toilet independence) for autistic children.',
      descSw: 'Msaada wa kusawazisha hisia, kuimarisha misuli ya mkono, na kujifunza kujitunza (kuvaa, kujisaidia) kwa watoto wenye usonji.',
      rating: 4.6
    },
    {
      id: 'nkr-aba-1',
      name: 'Rift Valley Behavior Intervention Center',
      category: 'therapist',
      categoryLabelEn: 'Behavior Therapist / ABA',
      categoryLabelSw: 'Mtaalamu wa Tabia',
      location: 'Nakuru',
      neighborhood: 'Milimani Area',
      phone: '+254 733 445566',
      email: 'nakurubehavior@rvic.or.ke',
      verified: true,
      descEn: 'Applied Behavior Analysis (ABA) and evidence-based positive behavioral support aiming to eliminate aggressive or self-injurious meltdowns.',
      descSw: 'Tiba ya kurekebisha tabia kwa kutumia mbinu chanya ili kuzuia fujo na hasira kali zinazoweza kumdhuru mtoto.',
      rating: 4.8
    },
    {
      id: 'eld-school-1',
      name: 'Highlands Special Needs Academy',
      category: 'school',
      categoryLabelEn: 'Special School',
      categoryLabelSw: 'Shule Maalumu',
      location: 'Eldoret',
      neighborhood: 'Elgon View',
      phone: '+254 714 889900',
      email: 'highlandsacademy@eldoret.co.ke',
      verified: false,
      descEn: 'Tailored primary education and vocational prep for children with moderate-to-severe neurodiverse learning conditions.',
      descSw: 'Masomo ya msingi yaliyorekebishwa na miongozo ya kazi za mikono kwa watoto wenye changamoto kubwa za ukuaji.',
      rating: 4.4
    },
    {
      id: 'nbo-ot-2',
      name: 'Nairobi Sensory Integration Hub',
      category: 'occupational',
      categoryLabelEn: 'Occupational Therapist',
      categoryLabelSw: 'Tiba ya Kazi (OT)',
      location: 'Nairobi',
      neighborhood: 'Westlands',
      phone: '+254 720 112233',
      email: 'westlandsot@sensoryhub.ke',
      verified: true,
      descEn: 'State-of-the-art occupational clinic equipped with sensory swings, ball pools, and tactile zones designed for calming hyperactive triggers.',
      descSw: 'Kliniki kubwa ya mazoezi iliyo na bembea za sensory na mabwawa ya mipira ya kutuliza watoto wanaohangaika sana.',
      rating: 4.9
    }
  ];

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySent(true);
    setTimeout(() => {
      setEnquirySent(false);
      setEnquiryModal(null);
    }, 2500);
  };

  const filteredServices = services.filter((item) => {
    const matchesLocation = selectedLocation === 'all' || item.location === selectedLocation;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descSw.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLocation && matchesCategory && matchesSearch;
  });

  return (
    <div id="services-directory" className="services-directory-module bg-white rounded-[32px] p-6 sm:p-8 border border-[#C77700]/10 shadow-sm relative">
      
      {/* Header and Filters Wrapper */}
      <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center mb-8 border-b border-gray-100 pb-6">
        <div>
          <span className="text-[10px] font-bold text-[#C77700] uppercase tracking-[0.25em] block mb-1">
            {language === 'en' ? 'KENYAN CARE DIRECTORY' : 'ORODHA YA HUDUMA KENYA'}
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2D3748]">
            {language === 'en' ? 'Verified Specialists & Schools Directory' : 'Orodha ya Wataalamu na Shule'}
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            {language === 'en'
              ? 'Find speech therapists, occupational therapists, inclusive schools, and neurodevelopmental clinics across major Kenyan cities.'
              : 'Pata wataalamu wa tiba ya lugha, tiba ya OT, shule jumuishi, na kliniki za upimaji katika miji mikubwa ya Kenya.'}
          </p>
        </div>

        {/* Global Search */}
        <div className="relative w-full xl:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'en' ? 'Search by name, clinic or area...' : 'Tafuta mtaalamu au mtaa...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#C77700] transition-colors"
          />
        </div>
      </div>

      {/* Dropdown Filters Selector Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* City Filter */}
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#2D3748] uppercase tracking-wider">
            {language === 'en' ? 'Filter by City:' : 'Chagua Mji:'}
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-xs font-semibold px-4 py-2.5 rounded-xl text-gray-700 focus:outline-none focus:border-[#C77700] cursor-pointer"
          >
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.label}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#2D3748] uppercase tracking-wider">
            {language === 'en' ? 'Filter by Service Type:' : 'Aina ya Huduma:'}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-xs font-semibold px-4 py-2.5 rounded-xl text-gray-700 focus:outline-none focus:border-[#C77700] cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {language === 'en' ? cat.labelEn : cat.labelSw}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <p className="text-sm font-bold text-gray-600">
            {language === 'en'
              ? 'No registered services match your specific filters.'
              : 'Hakuna huduma zinazopatikana kwa chaguzi zako hapa.'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {language === 'en' ? 'Try broadening your search or choosing "All Locations".' : 'Jaribu kuchagua mji mwingine au kuondoa utafutaji wako.'}
          </p>
          <button
            onClick={() => { setSelectedLocation('all'); setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-[#2D3748] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            {language === 'en' ? 'Clear All Filters' : 'Futa Vichujio Zote'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-widest text-[#2F6B4F] uppercase">
                      {language === 'en' ? service.categoryLabelEn : service.categoryLabelSw}
                    </span>
                    <h4 className="text-base font-extrabold text-[#2D3748] mt-1 leading-snug">
                      {service.name}
                    </h4>
                  </div>

                  {service.verified && (
                    <div className="flex items-center gap-1 bg-[#2F6B4F]/10 text-[#2F6B4F] border border-[#2F6B4F]/20 rounded-full px-2.5 py-1 text-[9px] font-extrabold tracking-wider uppercase shrink-0">
                      <Award className="w-3 h-3 text-[#2F6B4F]" />
                      <span>{language === 'en' ? 'Verified' : 'Imehakikiwa'}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  {language === 'en' ? service.descEn : service.descSw}
                </p>

                {/* Info Badges */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#C77700] shrink-0" />
                    <span>
                      <strong>{service.location}</strong> — {service.neighborhood}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <a href={`tel:${service.phone}`} className="hover:underline hover:text-[#C77700]">
                      {service.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 border-t border-gray-50 pt-4 mt-auto">
                <a
                  href={`tel:${service.phone}`}
                  className="flex-1 text-center py-2.5 border border-gray-200 hover:border-gray-300 text-[#2D3748] rounded-xl text-xs font-bold transition-all"
                >
                  {language === 'en' ? 'Call Office' : 'Piga Simu'}
                </a>
                <button
                  onClick={() => setEnquiryModal(service)}
                  className="flex-1 bg-[#2F6B4F] hover:bg-[#1e4432] text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {language === 'en' ? 'Send Enquiry' : 'Tuma Ombi'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Enquiry Modal */}
      {enquiryModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 sm:p-8 border border-gray-100 shadow-2xl relative animate-fade-in">
            <h4 className="text-lg font-serif font-black text-[#2D3748] pr-8 mb-2">
              {language === 'en' ? 'Send Direct Referral Enquiry' : 'Tuma Ombi la Rufaa'}
            </h4>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              {language === 'en' 
                ? `You are contacting ${enquiryModal.name}. Our Hub securely proxies clinical requests directly to their staff.`
                : `Unatuma ombi kwenda ${enquiryModal.name}. Tunaunganisha ombi lako kwa usalama.`}
            </p>

            {enquirySent ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h5 className="text-sm font-bold text-gray-800">
                  {language === 'en' ? 'Enquiry Received Successfully!' : 'Ombi Lako Limepokelewa Shwari!'}
                </h5>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  {language === 'en' 
                    ? 'Staff will review your contact details and follow up within 24 business hours.' 
                    : 'Mtaalamu atapitia maelezo yako na kuwasiliana nawe chini ya saa 24.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendEnquiry} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    {language === 'en' ? 'Your Full Name:' : 'Jina Lako Kamili:'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mary Wanjiku"
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#C77700]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    {language === 'en' ? 'Mobile Number:' : 'Nambari ya Simu:'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0712345678"
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#C77700]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    {language === 'en' ? 'Brief description of child\'s therapy needs:' : 'Maelezo mafupi ya mtoto:'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder={language === 'en' ? 'e.g. Seeking speech evaluation for a 4 year old non-verbal child.' : 'e.g. Nahitaji kupimwa kwa mtoto wangu wa miaka 4 asiyeongea bado.'}
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#C77700]"
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setEnquiryModal(null)}
                    className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    {language === 'en' ? 'Cancel' : 'Batilisha'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#2F6B4F] hover:bg-[#1a3a2a] text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Submit Enquiry' : 'Tuma Ombi'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
