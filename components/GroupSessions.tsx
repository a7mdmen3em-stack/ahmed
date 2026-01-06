
import React, { useState } from 'react';
import { GroupSession } from '../types';

interface GroupSessionsProps {
  isPenaltyActive: boolean;
  onWithdraw: () => void;
  gainXP: (amount: number) => void;
}

const GroupSessions: React.FC<GroupSessionsProps> = ({ isPenaltyActive, onWithdraw, gainXP }) => {
  const [sessions, setSessions] = useState<GroupSession[]>([
    { id: '1', title: 'كورس القلق والتوتر', description: 'جلسات دعم جماعية مركزة (11 شخص) للمساعدة في تخطي نوبات القلق.', participants: 11, activeMics: 4, durationWeeks: 4, isJoined: false },
    { id: '2', title: 'التشافي من الصدمات', description: 'مساحة إنسانية مغلقة للحديث عن التجارب الصعبة والتعافي التدريجي.', participants: 11, activeMics: 11, durationWeeks: 4, isJoined: true },
    { id: '3', title: 'الرهاب الاجتماعي', description: 'كسر حاجز الخوف والحديث في بيئة مجهولة ومريحة جداً.', participants: 11, activeMics: 2, durationWeeks: 4, isJoined: false },
  ]);

  const [activeSession, setActiveSession] = useState<GroupSession | null>(null);

  const toggleJoin = (id: string) => {
    if (isPenaltyActive) return;
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isJoined: !s.isJoined } : s));
  };

  if (activeSession) {
    return (
      <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{activeSession.title}</h2>
            <p className="text-teal-600 dark:text-teal-400 text-sm font-bold">{activeSession.activeMics}/11 مايك مفعل حالياً</p>
          </div>
          <button 
            onClick={() => {
              if (window.confirm("هل أنت متأكد من الانسحاب؟ ستحرم من الانضمام للمجموعات لمدة 72 ساعة.")) {
                onWithdraw();
                setActiveSession(null);
              }
            }}
            className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            انسحاب فوري
          </button>
        </div>

        <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center p-6 md:p-12">
           <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full max-w-3xl">
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white text-xl transition-all shadow-md ${i < activeSession.activeMics ? 'bg-teal-500 animate-pulse ring-4 ring-teal-100 dark:ring-teal-900/30' : 'bg-white dark:bg-slate-800 text-slate-300 dark:text-slate-600 shadow-none'}`}>
                    <i className="fa-solid fa-user-ninja"></i>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">عضو مجهول</span>
                </div>
              ))}
           </div>
           
           <div className="mt-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-6 rounded-[2rem] border border-white dark:border-slate-700 shadow-2xl w-full max-w-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <button className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-teal-500 hover:bg-teal-50 transition-all border border-slate-100 dark:border-slate-600">
                    <i className="fa-solid fa-microphone-slash text-xl"></i>
                 </button>
                 <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 italic">الأخصائي يستمع...</p>
                    <p className="text-[10px] text-slate-300 dark:text-slate-600">مساحة آمنة تماماً</p>
                 </div>
              </div>
              <button 
                onClick={() => setActiveSession(null)}
                className="px-8 py-3 bg-slate-800 dark:bg-slate-700 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 dark:shadow-none"
              >
                مغادرة
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">السيشنات الجماعية</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">مجموعات علاجية مصغرة (حد أقصى 11 فرد)</p>
        </div>
        <div className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full font-bold border border-blue-100 dark:border-blue-800">
          دورة 4 أسابيع
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sessions.map(session => (
          <div key={session.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 space-y-5 group hover:border-teal-200 dark:hover:border-teal-800 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{session.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">{session.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-2xl border border-slate-50 dark:border-slate-700/50">
              <div className="flex items-center gap-2 font-bold">
                <i className="fa-solid fa-user-shield text-teal-500 dark:text-teal-400"></i>
                <span>{session.participants}/11 مشترك</span>
              </div>
              <div className="flex items-center gap-2 font-bold">
                <i className="fa-solid fa-microphone text-blue-500 dark:text-blue-400"></i>
                <span>{session.activeMics}/11 مايك فعال</span>
              </div>
            </div>

            <button
              disabled={isPenaltyActive}
              onClick={() => {
                if(session.isJoined) setActiveSession(session);
                else toggleJoin(session.id);
              }}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${
                isPenaltyActive 
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  : session.isJoined
                    ? 'bg-teal-500 text-white shadow-xl shadow-teal-100 dark:shadow-none hover:bg-teal-600 active:scale-95'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 border-2 border-slate-100 dark:border-slate-600'
              }`}
            >
              {session.isJoined ? 'دخول الجلسة' : 'انضمام للدورة'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupSessions;
