
import React, { useState, useRef, useEffect } from 'react';
import { CheckIn, AppNotification, UserProfile } from '../types';
import { getDailySupport } from '../services/geminiService';
import { translations } from '../translations';

interface DailyCheckInProps {
  addNotification: (message: string, type: AppNotification['type']) => void;
  gainXP: (amount: number) => void;
  user: UserProfile;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ addNotification, gainXP, user }) => {
  const t = translations[user.language];
  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => {
    const saved = localStorage.getItem(`ss_diary_${user.id}`);
    return saved ? JSON.parse(saved).map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) })) : [];
  });
  const [activeType, setActiveType] = useState<'morning' | 'night' | 'diary'>('morning');
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem(`ss_diary_${user.id}`, JSON.stringify(checkIns));
  }, [checkIns, user.id]);

  const startRecording = () => {
    setIsRecording(true);
    addNotification(user.language === 'ar' ? "بدأنا نسجل.. قول اللي في قلبك." : "Recording started.. speak from your heart.", "info");
    timerRef.current = setTimeout(() => {
      setRecordedAudio("mock_audio_data");
    }, 2000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleSubmit = async () => {
    if (!content && !recordedAudio) return;
    setIsLoading(true);
    
    try {
      const feedback = await getDailySupport(content || "Voice Note", activeType);
      
      const newEntry: CheckIn = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type: activeType,
        content: content || (recordedAudio ? (user.language === 'ar' ? "تسجيل صوتي محفوظ" : "Voice note saved") : ""),
        mediaType: recordedAudio && content ? 'both' : recordedAudio ? 'voice' : 'text',
        audioData: recordedAudio || undefined,
        aiFeedback: feedback
      };

      setCheckIns([newEntry, ...checkIns]);
      setContent('');
      setRecordedAudio(null);
      gainXP(30);
      addNotification(user.language === 'ar' ? "يوميتك اتسجلت، شوف الأخصائي رد عليك قلك إيه." : "Entry saved, check the assistant's feedback.", "success");
    } catch (e) {
      addNotification("Error saving entry.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const exportAsJSON = () => {
    if (checkIns.length === 0) {
      addNotification(t.noEntriesExport, 'warning');
      return;
    }
    const dataStr = JSON.stringify(checkIns, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `SafeSpace_Diary_${user.pseudonym}_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    setShowExportMenu(false);
  };

  const exportAsTextReport = () => {
    if (checkIns.length === 0) {
      addNotification(t.noEntriesExport, 'warning');
      return;
    }
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const diaryEntriesHtml = checkIns.map(item => `
      <div style="border-bottom: 1px solid #eee; padding: 15px 0; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; color: #666; font-size: 12px; margin-bottom: 8px;">
          <span>${item.type.toUpperCase()}</span>
          <span>${item.timestamp.toLocaleString()}</span>
        </div>
        <p style="margin: 0; color: #333; line-height: 1.6;">${item.content}</p>
        ${item.aiFeedback ? `<div style="margin-top: 10px; padding: 10px; background: #f0fdfa; border-radius: 8px; font-style: italic; color: #0d9488; font-size: 13px;">AI Advice: ${item.aiFeedback}</div>` : ''}
      </div>
    `).join('');

    printWindow.document.write(`
      <html dir="${user.language === 'ar' ? 'rtl' : 'ltr'}">
        <head>
          <title>Safe Space - My Diary Report</title>
          <style>
            body { font-family: 'Cairo', sans-serif; padding: 40px; max-width: 800px; margin: auto; }
            h1 { color: #0d9488; text-align: center; margin-bottom: 40px; }
            .header-info { text-align: center; margin-bottom: 40px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>Safe Space Diary</h1>
          <div class="header-info">
            Report for <strong>${user.pseudonym}</strong><br>
            Generated on ${new Date().toLocaleDateString()}
          </div>
          ${diaryEntriesHtml}
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setShowExportMenu(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white">{t.myDiary}</h2>
        <p className="text-slate-500 text-sm">{t.diaryDesc}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-slate-900 rounded-3xl mb-8">
          <button onClick={() => setActiveType('morning')} className={`flex-1 py-4 rounded-2xl font-bold text-xs transition-all ${activeType === 'morning' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-md border border-blue-50' : 'text-slate-400'}`}>
            <i className="fa-solid fa-sun ml-2"></i> {t.morning}
          </button>
          <button onClick={() => setActiveType('night')} className={`flex-1 py-4 rounded-2xl font-bold text-xs transition-all ${activeType === 'night' ? 'bg-white dark:bg-slate-800 text-indigo-800 shadow-md border border-indigo-50' : 'text-slate-400'}`}>
            <i className="fa-solid fa-moon ml-2"></i> {t.night}
          </button>
          <button onClick={() => setActiveType('diary')} className={`flex-1 py-4 rounded-2xl font-bold text-xs transition-all ${activeType === 'diary' ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-md border border-teal-50' : 'text-slate-400'}`}>
            <i className="fa-solid fa-book ml-2"></i> {t.diary}
          </button>
        </div>

        <div className="space-y-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-40 p-6 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 outline-none resize-none text-slate-700 dark:text-slate-200 font-medium"
            placeholder={activeType === 'morning' ? t.morningPlaceholder : activeType === 'night' ? t.nightPlaceholder : t.diaryPlaceholder}
          ></textarea>

          <div className="flex items-center gap-4">
            <button onMouseDown={startRecording} onMouseUp={stopRecording} className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
              <i className={`fa-solid ${isRecording ? 'fa-stop' : 'fa-microphone'} text-xl`}></i>
            </button>
            <button onClick={handleSubmit} disabled={isLoading} className="flex-1 py-5 rounded-[1.5rem] font-black text-white bg-gradient-to-r from-blue-600 to-indigo-700 transition-all">
              {isLoading ? t.analyzingMood : t.saveInDiary}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-xl font-black text-slate-800 dark:text-white">{t.myMemories}</h3>
           <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-500 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-600 hover:bg-white transition-all shadow-sm"
              >
                <i className="fa-solid fa-download"></i>
                {t.exportDiary}
              </button>
              
              {showExportMenu && (
                <div className="absolute top-full mt-2 left-0 right-0 md:left-auto md:w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-30 overflow-hidden animate-in zoom-in duration-200 origin-top">
                   <button onClick={exportAsJSON} className="w-full p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-bold text-slate-600 dark:text-slate-300 border-b border-slate-50 dark:border-slate-700">
                      <i className="fa-solid fa-code text-teal-500"></i>
                      {t.exportJSON}
                   </button>
                   <button onClick={exportAsTextReport} className="w-full p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-bold text-slate-600 dark:text-slate-300">
                      <i className="fa-solid fa-file-lines text-blue-500"></i>
                      {t.exportText}
                   </button>
                </div>
              )}
           </div>
        </div>

        {checkIns.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 text-slate-400 shadow-sm">
            <p className="font-bold">{t.emptyDiary}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {checkIns.map(item => (
              <div key={item.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-3">
                   <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-2 py-0.5 rounded-lg">
                      {item.type === 'morning' ? t.morning : item.type === 'night' ? t.night : t.diary}
                   </span>
                   <span className="text-[10px] text-slate-400 font-bold">
                      {item.timestamp.toLocaleDateString()}
                   </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4 flex-1">{item.content}</p>
                {item.aiFeedback && (
                  <div className="mt-auto p-4 bg-teal-50 dark:bg-teal-900/20 rounded-2xl text-teal-800 dark:text-teal-400 text-xs italic border border-teal-100/50 dark:border-teal-800/50">
                    <i className="fa-solid fa-sparkles mr-2"></i>
                    {item.aiFeedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyCheckIn;
