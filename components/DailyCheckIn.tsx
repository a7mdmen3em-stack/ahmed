
import React, { useState, useRef } from 'react';
import { CheckIn, AppNotification } from '../types';
import { getDailySupport } from '../services/geminiService';

interface DailyCheckInProps {
  addNotification: (message: string, type: AppNotification['type']) => void;
  gainXP: (amount: number) => void;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ addNotification, gainXP }) => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [activeType, setActiveType] = useState<'morning' | 'night' | 'diary'>('morning');
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  
  // Fix: Replaced NodeJS.Timeout with any to resolve "Cannot find namespace 'NodeJS'" error in browser environment
  const timerRef = useRef<any>(null);

  const startRecording = () => {
    setIsRecording(true);
    addNotification("بدأنا نسجل.. قول اللي في قلبك.", "info");
    // محاكاة تسجيل
    timerRef.current = setTimeout(() => {
      setRecordedAudio("mock_audio_data");
    }, 2000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    addNotification("التسجيل اتسيف في الدفتر خلاص.", "success");
  };

  const handleSubmit = async () => {
    if (!content && !recordedAudio) return;
    setIsLoading(true);
    
    try {
      const feedback = await getDailySupport(content || "تسجيل صوتي", activeType);
      
      const newEntry: CheckIn = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type: activeType,
        content: content || (recordedAudio ? "تسجيل صوتي محفوظ في الدفتر" : ""),
        mediaType: recordedAudio && content ? 'both' : recordedAudio ? 'voice' : 'text',
        audioData: recordedAudio || undefined,
        aiFeedback: feedback
      };

      setCheckIns([newEntry, ...checkIns]);
      setContent('');
      setRecordedAudio(null);
      gainXP(30);
      addNotification("يوميتك اتسجلت، شوف الأخصائي رد عليك قلك إيه.", "success");
    } catch (e) {
      addNotification("معلش حصل مشكلة واحنا بنسيف اليومية.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black text-slate-800">يومياتي ودفتر أفكاري</h2>
        <p className="text-slate-500 text-sm">مساحتك عشان تطلع اللي جواك بالصوت والكتابة.</p>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex gap-2 p-1.5 bg-slate-50 rounded-3xl mb-8">
          <button 
            onClick={() => setActiveType('morning')}
            className={`flex-1 py-4 rounded-2xl font-bold text-xs transition-all ${activeType === 'morning' ? 'bg-white text-blue-600 shadow-md border border-blue-50' : 'text-slate-400'}`}
          >
            <i className="fa-solid fa-sun ml-2"></i> صباح الخير
          </button>
          <button 
            onClick={() => setActiveType('night')}
            className={`flex-1 py-4 rounded-2xl font-bold text-xs transition-all ${activeType === 'night' ? 'bg-white text-indigo-800 shadow-md border border-indigo-50' : 'text-slate-400'}`}
          >
            <i className="fa-solid fa-moon ml-2"></i> طابت ليلتك
          </button>
          <button 
            onClick={() => setActiveType('diary')}
            className={`flex-1 py-4 rounded-2xl font-bold text-xs transition-all ${activeType === 'diary' ? 'bg-white text-teal-600 shadow-md border border-teal-50' : 'text-slate-400'}`}
          >
            <i className="fa-solid fa-book ml-2"></i> دفتر اليوميات
          </button>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-40 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 outline-none resize-none text-slate-700 font-medium"
              placeholder={
                activeType === 'morning' ? "ناوي على إيه النهاردة؟ حاسس بإيه مع أول خيوط الشمس؟" :
                activeType === 'night' ? "يومك مشي إزاي؟ إيه اللي زعلك وإيه اللي فرحك؟" :
                "اكتب أي حاجة شاغلة بالك في الدفتر.."
              }
            ></textarea>
            {recordedAudio && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-teal-50 text-teal-600 px-3 py-1.5 rounded-full text-[10px] font-bold border border-teal-100 animate-pulse">
                <i className="fa-solid fa-check-circle"></i>
                تم تسجيل الفويس بنجاح
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-xl shadow-red-200' : 'bg-slate-100 text-slate-500 hover:bg-teal-50 hover:text-teal-600 border border-slate-200 shadow-inner'}`}
            >
              <i className={`fa-solid ${isRecording ? 'fa-stop' : 'fa-microphone'} text-xl`}></i>
            </button>
            <button
              onClick={handleSubmit}
              disabled={(!content && !recordedAudio) || isLoading}
              className={`flex-1 py-5 rounded-[1.5rem] font-black text-white transition-all ${(!content && !recordedAudio) || isLoading ? 'bg-slate-200 text-slate-400' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-xl hover:shadow-blue-200 active:scale-95'}`}
            >
              {isLoading ? 'بحلل مشاعرك...' : 'سيف في الدفتر'}
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 font-bold">تقدر تدوس ضغطة طويلة على المايك عشان تسجل فويس يتسيف جوا الدفتر.</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black text-slate-800 px-2">ذكرياتي وأفكاري</h3>
        {checkIns.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[3rem] border border-slate-100 text-slate-400 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-200">
               <i className="fa-solid fa-feather text-3xl"></i>
            </div>
            <p className="font-bold">لسه الدفتر فاضي.. ابدأ سجل أول ذكرى النهاردة.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {checkIns.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 space-y-4 shadow-sm group hover:border-teal-200 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black ${item.type === 'morning' ? 'bg-blue-50 text-blue-600' : item.type === 'night' ? 'bg-indigo-50 text-indigo-800' : 'bg-teal-50 text-teal-700'}`}>
                      {item.type === 'morning' ? 'صباح الخير' : item.type === 'night' ? 'طابت ليلتك' : 'دفتر اليوميات'}
                    </span>
                    {item.mediaType !== 'text' && <i className="fa-solid fa-microphone-lines text-teal-400 text-xs"></i>}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{item.timestamp.toLocaleDateString('ar-EG')}</span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed font-medium">{item.content}</p>
                
                {item.audioData && (
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                     <button className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                       <i className="fa-solid fa-play"></i>
                     </button>
                     <div className="flex-1 h-1 bg-slate-200 rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-teal-500/20 w-1/2"></div>
                     </div>
                     <span className="text-[10px] font-mono text-slate-400">0:12</span>
                  </div>
                )}

                {item.aiFeedback && (
                  <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100/50 group-hover:bg-teal-50 transition-colors">
                    <p className="text-teal-800 text-xs italic leading-relaxed font-bold">
                      <i className="fa-solid fa-heart ml-2 text-teal-400"></i>
                      {item.aiFeedback}
                    </p>
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
