import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronUp, ChevronDown, Trash2, Plus, Check, Download, ArrowLeft, Printer, Eye } from 'lucide-react';
import { ScheduleItem } from '../types';

interface VisualScheduleProps {
  language: 'en' | 'swa';
  onDownload?: () => void;
}

export default function VisualSchedule({ language, onDownload }: VisualScheduleProps) {
  const location = useLocation();
  const [isPrintFriendly, setIsPrintFriendly] = useState(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('print') === 'true' || location.state?.printMode === true;
  });
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('autism_unmasked_schedule');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 's1', time: '07:30 AM', task: 'Brush Teeth', icon: '🪥', done: false },
      { id: 's2', time: '08:00 AM', task: 'Eat Breakfast', icon: '🍳', done: false },
      { id: 's3', time: '09:00 AM', task: 'Study Time', icon: '📝', done: false },
      { id: 's4', time: '04:00 PM', task: 'Play Outside', icon: '⚽', done: false },
      { id: 's5', time: '07:30 PM', task: 'Take a Bath', icon: '🛀', done: false },
      { id: 's6', time: '08:30 PM', task: 'Bedtime Story & Sleep', icon: '🛌', done: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem('autism_unmasked_schedule', JSON.stringify(scheduleItems));
  }, [scheduleItems]);

  const [newScheduleTask, setNewScheduleTask] = useState('');
  const [newScheduleTime, setNewScheduleTime] = useState('08:00 AM');
  const [newScheduleIcon, setNewScheduleIcon] = useState('⭐');

  const addScheduleItem = () => {
    if (!newScheduleTask.trim()) return;
    const newItem: ScheduleItem = {
      id: 's_' + Date.now(),
      time: newScheduleTime,
      task: newScheduleTask,
      icon: newScheduleIcon,
      done: false
    };
    setScheduleItems([...scheduleItems, newItem]);
    setNewScheduleTask('');
  };

  const toggleScheduleDone = (id: string) => {
    setScheduleItems(scheduleItems.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const deleteScheduleItem = (id: string) => {
    setScheduleItems(scheduleItems.filter(item => item.id !== id));
  };

  const moveScheduleItem = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= scheduleItems.length) return;
    const updated = [...scheduleItems];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setScheduleItems(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${isPrintFriendly ? 'printable-area bg-white p-4 sm:p-6 text-black border-4 border-black rounded-2xl' : 'bg-white rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 card-h-shadow relative text-[#2D3748]'}`}>
      
      {/* Back to Toolkit Navigation (hidden on print) */}
      <div className="flex items-center justify-between gap-4 mb-6 no-print">
        <Link 
          to="/toolkit" 
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors flex items-center gap-1.5 text-xs font-bold back-to-toolkit-link"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'en' ? 'Back to Toolkit' : 'Rudi Kwenye Zana'}</span>
        </Link>

        {/* Print-friendly Toggle button */}
        <button
          onClick={() => setIsPrintFriendly(!isPrintFriendly)}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
            isPrintFriendly 
              ? 'bg-[#2F6B4F] text-white hover:bg-[#1e4432]' 
              : 'bg-[#C77700]/10 text-[#C77700] hover:bg-[#C77700]/20'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>
            {isPrintFriendly 
              ? (language === 'en' ? 'Standard Interactive View' : 'Rudi Mtazamo Kawaida') 
              : (language === 'en' ? 'Print Friendly View' : 'Mtazamo wa Kuchapa')}
          </span>
        </button>
      </div>

      {/* Print Mode Top Status Alert Bar (Visible only when Print Friendly Mode is active, hidden on print output) */}
      {isPrintFriendly && (
        <div className="bg-[#2D3748] text-white p-4 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 no-print animate-pulse border-2 border-[#E89B2E]">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#E89B2E] shrink-0" />
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-wider text-[#E89B2E]">
                {language === 'en' ? 'Eco-Print Preview Active' : 'Ukurasa wa Kuchapa Uko Tayari'}
              </p>
              <p className="text-[10px] text-gray-300">
                {language === 'en' ? 'Optimized in black & white for ink saving. Click Print Below.' : 'Imeboreshwa kwa rangi nyeusi na nyeupe ili kuokoa wino.'}
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="bg-[#2F6B4F] hover:bg-[#1e4432] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 justify-center flex-1 sm:flex-initial"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'en' ? 'Print Now' : 'Chapa Sasa'}</span>
            </button>
            <button
              onClick={() => setIsPrintFriendly(false)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 justify-center flex-1 sm:flex-initial"
            >
              <Eye className="w-4 h-4" />
              <span>{language === 'en' ? 'Close Preview' : 'Funga'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="mb-6">
        <span className="text-[10px] font-bold text-[#C77700] uppercase tracking-wider block no-print">Interactive Builder</span>
        <h3 className={`text-2xl sm:text-3xl font-bold font-serif ${isPrintFriendly ? 'text-black' : 'text-[#C77700]'}`}>
          {language === 'en' ? 'Daily Visual Routine Planner' : 'Mratibu wa Ratiba ya Picha'}
        </h3>
        <p className="text-xs text-gray-500 mt-1 no-print">
          {language === 'en' 
            ? 'Predictable structures reduce anxiety. Create, order, and toggle tasks as complete with your child.' 
            : 'Mifumo inayotabirika hupunguza fujo. Unda, panga, na gusa mradi kukamilisha na mtoto.'}
        </p>
      </div>

      {/* Quick adding task form (hidden in print-friendly mode completely) */}
      {!isPrintFriendly && (
        <div className="bg-[#FFF8EE] p-4 rounded-2xl border border-[#C77700]/10 grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6 no-print">
          <div className="sm:col-span-5">
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
              {language === 'en' ? 'Task Name' : 'Jina la Kazi'}
            </label>
            <input 
              type="text" 
              placeholder={language === 'en' ? "e.g. Wash hands" : "mfano Kuosha mikono"} 
              value={newScheduleTask}
              onChange={(e) => setNewScheduleTask(e.target.value)}
              className="w-full bg-white border border-[#C77700]/10 rounded-xl px-3 py-1.5 text-xs text-[#2D3748]"
            />
          </div>
          <div className="sm:col-span-4 flex gap-2">
            <div className="w-1/2">
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                {language === 'en' ? 'Time' : 'Saa'}
              </label>
              <input 
                type="text" 
                placeholder="08:00 AM" 
                value={newScheduleTime}
                onChange={(e) => setNewScheduleTime(e.target.value)}
                className="w-full bg-white border border-[#C77700]/10 rounded-xl px-2 py-1.5 text-xs text-[#2D3748] text-center"
              />
            </div>
            <div className="w-1/2">
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                {language === 'en' ? 'Icon' : 'Picha'}
              </label>
              <select 
                value={newScheduleIcon}
                onChange={(e) => setNewScheduleIcon(e.target.value)}
                className="w-full bg-white border border-[#C77700]/10 rounded-xl px-1 py-1.5 text-xs text-[#2D3748] text-center"
              >
                <option value="🪥">🪥</option>
                <option value="🍳">🍳</option>
                <option value="📝">📝</option>
                <option value="⚽">⚽</option>
                <option value="🛀">🛀</option>
                <option value="🛌">🛌</option>
                <option value="🍎">🍎</option>
                <option value="💧">💧</option>
                <option value="🧸">🧸</option>
                <option value="🚗">🚗</option>
                <option value="👟">👟</option>
                <option value="🤫">🤫</option>
                <option value="🏫">🏫</option>
                <option value="🦷">🦷</option>
              </select>
            </div>
          </div>
          <div className="sm:col-span-3 flex items-end">
            <button 
              onClick={addScheduleItem}
              className="w-full bg-[#2F6B4F] hover:bg-[#1e4432] text-white py-2 rounded-xl text-xs font-bold uppercase cursor-pointer flex items-center justify-center gap-1.5 h-[34px]"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'en' ? 'Add Task' : 'Weka Kazi'}</span>
            </button>
          </div>
        </div>
      )}

      {/* List container */}
      <div className={`space-y-3 mb-6 print-schedule-list ${isPrintFriendly ? '' : 'max-h-[500px] overflow-y-auto pr-2'}`}>
        {scheduleItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl text-gray-400 text-xs">
            {language === 'en' ? 'No tasks added. Create one above!' : 'Hakuna kazi iliyowekwa bado. Unda moja hapo juu!'}
          </div>
        ) : (
          scheduleItems.map((item, index) => (
            <div 
              key={item.id} 
              className={isPrintFriendly ? 'print-schedule-row border-2 border-black rounded-2xl p-4 bg-white text-black flex items-center justify-between' : `flex items-center justify-between p-4 rounded-2xl border transition-all ${
                item.done 
                  ? 'bg-green-50/50 border-green-200 opacity-60 line-through text-gray-400' 
                  : 'bg-[#FFF8EE]/30 border-[#C77700]/10 text-[#2D3748]'
              }`}
            >
              <div className="flex items-center gap-3">
                
                {/* Print checkbox helper */}
                {isPrintFriendly ? (
                  <span className="print-checkbox shrink-0 border-2 border-black rounded w-6 h-6 inline-block bg-white" />
                ) : (
                  <button 
                    onClick={() => toggleScheduleDone(item.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                      item.done 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-[#2F6B4F]'
                    }`}
                  >
                    {item.done && <Check className="w-4 h-4" />}
                  </button>
                )}

                <span className="text-3xl shrink-0">{item.icon}</span>
                <div>
                  <span className={`text-sm font-bold block leading-tight ${isPrintFriendly ? 'text-black text-base' : ''}`}>{item.task}</span>
                  <span className={`text-[10px] font-semibold ${isPrintFriendly ? 'text-gray-600 text-xs' : 'text-gray-400'}`}>{item.time}</span>
                </div>
              </div>

              {/* Actions panel (hidden completely in print mode) */}
              {!isPrintFriendly && (
                <div className="flex items-center gap-2 no-print">
                  <button 
                    disabled={index === 0}
                    onClick={() => moveScheduleItem(index, 'up')}
                    className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    disabled={index === scheduleItems.length - 1}
                    onClick={() => moveScheduleItem(index, 'down')}
                    className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    onClick={() => deleteScheduleItem(item.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-[#C77700]/10 flex flex-col sm:flex-row justify-between items-center gap-3">
        <span className="text-[10px] text-gray-400 font-medium text-center sm:text-left no-print">
          {language === 'en' ? 'Changes are saved automatically to your browser storage' : 'Mabadiliko yanahifadhiwa otomatiki katika kivaa chako'}
        </span>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto no-print">
          <button 
            onClick={handlePrint}
            className="bg-[#2F6B4F] hover:bg-[#1e4432] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'en' ? 'Print Schedule' : 'Chapa Ratiba'}</span>
          </button>

          <button 
            onClick={() => {
              if (onDownload) onDownload();
              alert(language === 'en' ? 'Routine compiled successfully. Downloading template PDF...' : 'Ratiba imekamilika vizuri. Inapakua ratiba PDF...');
            }}
            className="bg-[#2D3748] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'en' ? 'Download PDF' : 'Pakua PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
