import React, { useState } from 'react';
import { Search, Filter, Download, FileText, BookOpen, AlertCircle, Share2, Mail, CheckCircle2, Bookmark, BookmarkCheck } from 'lucide-react';

interface ResourceCenterProps {
  language: 'en' | 'swa';
}

interface ResourceItem {
  id: string;
  titleEn: string;
  titleSw: string;
  descEn: string;
  descSw: string;
  category: 'schedules' | 'cards' | 'guides' | 'letters' | 'worksheets';
  icon: string;
  fileSize: string;
  fileName: string;
}

export default function ResourceCenter({ language }: ResourceCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  const categories = [
    { id: 'all', labelEn: 'All Downloads', labelSw: 'Zote Zilizopo' },
    { id: 'schedules', labelEn: 'Visual Schedules', labelSw: 'Ratiba za Picha' },
    { id: 'cards', labelEn: 'Flashcards', labelSw: 'Kadi za Sauti' },
    { id: 'guides', labelEn: 'Caregiver Guides', labelSw: 'Miongozo ya Wazazi' },
    { id: 'letters', labelEn: 'Advocacy Letters', labelSw: 'Barua za Shule' },
    { id: 'worksheets', labelEn: 'Worksheets', labelSw: 'Mazoezi ya Tiba' },
  ];

  const resources: ResourceItem[] = [
    {
      id: 'advocacy-letter-shadow',
      titleEn: 'Mainstream School Shadow Teacher Advocacy Letter',
      titleSw: 'Barua ya Ombi la Mwalimu Msaidizi (Shadow Teacher)',
      descEn: 'A pre-written clinical-grade template advocating for your child to have a shadow teacher or learning support assistant in mainstream primary schools.',
      descSw: 'Barua rasmi iliyoandikwa kitaalamu kuomba mtoto wako aruhusiwe kuwa na msaidizi wa darasani katika shule za kawaida.',
      category: 'letters',
      icon: '📝',
      fileSize: '142 KB',
      fileName: 'Shadow_Teacher_Advocacy_Letter_Kenya.pdf'
    },
    {
      id: 'guide-caregiver-manual',
      titleEn: 'First-Steps Caregiver Manual: Diagnosed in Kenya',
      titleSw: 'Mwongozo wa Kwanza wa Mlezi: Baada ya Kugunduliwa Kenya',
      descEn: 'A localized handbook explaining medical paths, assessment centers, speech therapies, and support systems available specifically in Kenya.',
      descSw: 'Mwongozo wa kina unaoelezea hatua za kwanza za kufuata, vituo vya kupima, na hospitali za msaada nchini Kenya.',
      category: 'guides',
      icon: '📘',
      fileSize: '1.8 MB',
      fileName: 'Autism_Caregiver_First_Steps_Kenya.pdf'
    },
    {
      id: 'worksheet-sensory-diet',
      titleEn: 'Sensory Diet Tracking Worksheet & Daily Routine Planner',
      titleSw: 'Karatasi ya Kufuatilia Lishe ya Sensory na Ratiba ya Kila Siku',
      descEn: 'Structured daily worksheets for caregivers to track and schedule sensory inputs (calming vs. alerting activities) throughout the school day.',
      descSw: 'Ratiba ya kila siku ya kufuatilia jinsi mtoto anavyokabiliana na vichocheo vya sauti, mwanga na hisia mbalimbali.',
      category: 'worksheets',
      icon: '📊',
      fileSize: '310 KB',
      fileName: 'Sensory_Diet_Planner_Autism.pdf'
    },
    {
      id: 'schedule-printable-cards',
      titleEn: 'Printable Visual Schedule Cards (50+ Daily Activities)',
      titleSw: 'Kadi za Picha za Kuchapisha (Shughuli 50+ za Kila Siku)',
      descEn: 'High-contrast printable PECS-style cards for tooth brushing, meals, home tasks, and school routines. Excellent for physical visual boards.',
      descSw: 'Kadi za picha za hali ya juu zinazoweza kuchapishwa kwa ajili ya kupiga mswaki, kula, kuoga, na kusoma.',
      category: 'cards',
      icon: '🎴',
      fileSize: '2.4 MB',
      fileName: 'PECS_Printable_Visual_Schedules.pdf'
    },
    {
      id: 'letters-school-accommodations',
      titleEn: 'IEP Accommodation Request Template for Class Teachers',
      titleSw: 'Kiolezo cha Ombi la Marekebisho ya Mitihani na Masomo (IEP)',
      descEn: 'Request official classroom adjustments (extra exam time, sensory breaks, quiet spaces) from Kenyan school boards and headteachers.',
      descSw: 'Barua ya kirafiki na ya kisheria ya kuomba muda wa ziada wa mitihani na nafasi tulivu kwa ajili ya mtoto shuleni.',
      category: 'letters',
      icon: '🏫',
      fileSize: '125 KB',
      fileName: 'School_Accommodations_IEP_Request.pdf'
    },
    {
      id: 'worksheet-behavior-log',
      titleEn: 'ABC Behavior Log Sheet (Antecedent, Behavior, Consequence)',
      titleSw: 'Karatasi ya ABC ya Kufuatilia Tabia za Mtoto',
      descEn: 'The standard ABA tracking tool to identify environmental triggers and patterns behind behavioral meltdowns.',
      descSw: 'Zana maalumu ya kufuatilia kile kinachosababisha hasira au hofu kwa mtoto na jinsi ya kumsaidia.',
      category: 'worksheets',
      icon: '📋',
      fileSize: '180 KB',
      fileName: 'ABC_Behavior_Analysis_Log.pdf'
    }
  ];

  const handleDownload = (resource: ResourceItem) => {
    setDownloadingId(resource.id);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingId(null);
            setDownloadedIds((prevIds) => [...prevIds, resource.id]);
            
            // Trigger a physical browser download of a dummy text file representation
            const element = document.createElement('a');
            const fileContent = `=== Autism Unmasked Kenya Support Resource ===\n\nTitle: ${resource.titleEn}\nDescription: ${resource.descEn}\nFile: ${resource.fileName}\nCategory: ${resource.category}\n\nNote: This is a verified therapeutic resource from the Autism Unmasked Kenya Hub (https://autism-unmasked.ke). Caregivers are free to print, customize, and share this within their local support groups.`;
            const file = new Blob([fileContent], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = resource.fileName.replace('.pdf', '.txt');
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 100);
  };

  const filteredResources = resources.filter((item) => {
    const matchesSearch =
      item.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.titleSw.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descSw.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div id="resource-download-center" className="resource-center-module bg-white rounded-[32px] p-6 sm:p-8 border border-[#C77700]/10 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-[0.2em] block mb-1">
            {language === 'en' ? 'Verified Therapeutic Downloads' : 'Nyaraka Zinazoweza Kupakuliwa'}
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2D3748]">
            {language === 'en' ? 'Clinical & Advocacy Resource Library' : 'Maktaba ya Nyaraka na Miongozo'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {language === 'en' 
              ? 'Print-ready guides, structured checklists, and legally referenced advocacy letters written by clinical therapists.' 
              : 'Miongozo ya kuchapisha, karatasi za kufanyia mazoezi, na barua za shule zilizoundwa na wataalamu.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'en' ? 'Search resources...' : 'Tafuta nyaraka...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#C77700] transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              selectedCategory === cat.id
                ? 'bg-[#C77700] border-[#C77700] text-white shadow-sm shadow-[#C77700]/10'
                : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            {language === 'en' ? cat.labelEn : cat.labelSw}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-600">
            {language === 'en' ? 'No downloadable resources match your filter.' : 'Hakuna nyaraka zinazolingana na utafutaji wako.'}
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
            className="text-xs text-[#C77700] font-bold underline mt-2 hover:text-[#b06a00]"
          >
            {language === 'en' ? 'Reset Filters' : 'Anza upya uchujaji'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const isCurrentlyDownloading = downloadingId === resource.id;
            const hasBeenDownloaded = downloadedIds.includes(resource.id);

            return (
              <div
                key={resource.id}
                className="bg-white rounded-[24px] border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md hover:border-gray-200 transition-all relative"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl" role="img" aria-label="resource icon">
                      {resource.icon}
                    </span>
                    <span className="text-[10px] font-extrabold text-[#2F6B4F] bg-[#2F6B4F]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {resource.fileSize}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-[#2D3748] mb-2 leading-snug">
                    {language === 'en' ? resource.titleEn : resource.titleSw}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    {language === 'en' ? resource.descEn : resource.descSw}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50">
                  {isCurrentlyDownloading ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-gray-500">
                        <span>{language === 'en' ? 'Downloading...' : 'Inapakuliwa...'}</span>
                        <span>{downloadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#C77700] h-full transition-all duration-100"
                          style={{ width: `${downloadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(resource)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          hasBeenDownloaded
                            ? 'bg-[#2F6B4F]/10 text-[#2F6B4F] hover:bg-[#2F6B4F]/15'
                            : 'bg-[#2D3748] text-white hover:bg-[#1a202c]'
                        }`}
                      >
                        {hasBeenDownloaded ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-[#2F6B4F]" />
                            <span>{language === 'en' ? 'Downloaded' : 'Tayari Unayo'}</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>{language === 'en' ? 'Download PDF' : 'Pakua PDF'}</span>
                          </>
                        )}
                      </button>

                      {/* Direct Mail Share */}
                      <a
                        href={`mailto:?subject=${encodeURIComponent(
                          `Resource: ${language === 'en' ? resource.titleEn : resource.titleSw}`
                        )}&body=${encodeURIComponent(
                          `Hello!\n\nHere is a valuable therapy/advocacy resource from Autism Unmasked Kenya:\n\n*${language === 'en' ? resource.titleEn : resource.titleSw}*\n"${language === 'en' ? resource.descEn : resource.descSw}"\n\nYou can access and download this file directly at: ${typeof window !== 'undefined' ? window.location.origin + '/toolkit' : 'https://autism-unmasked.ke'}`
                        )}`}
                        className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200/50 text-gray-500 transition-colors"
                        title={language === 'en' ? 'Email PDF Link' : 'Tuma Kiungo kwa Barua'}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
