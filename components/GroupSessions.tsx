
import React, { useState, useMemo } from 'react';
import { GroupSession, UserProfile } from '../types';
import { translations } from '../translations';

interface GroupSessionsProps {
  user: UserProfile;
  isPenaltyActive: boolean;
  onWithdraw: () => void;
  gainXP: (amount: number) => void;
}

const GroupSessions: React.FC<GroupSessionsProps> = ({ user, isPenaltyActive, onWithdraw, gainXP }) => {
  const t = translations[user.language];
  
  const initialSessions = useMemo(() => [
    { id: '1', title: t.sessionTitle1, description: t.sessionDesc1, participants: 11, activeMics: 4, durationWeeks: 4, isJoined: false },
    { id: '2', title: t.sessionTitle2, description: t.sessionDesc2, participants: 11, activeMics: 11, durationWeeks: 4, isJoined: true },
    { id: '3', title: t.sessionTitle3, description: t.sessionDesc3, participants: 11, activeMics: 2, durationWeeks: 4, isJoined: false },
  ], [user.language, t]);

  const [joinedIds, setJoinedIds] = useState<string[]>(['2']);
  const [activeSession, setActiveSession] = useState<GroupSession | null>(null);

  const sessionsWithState = useMemo(() => 
    initialSessions.map(s => ({ ...s, isJoined: joinedIds.includes(s.id) }))
  , [initialSessions, joinedIds]);

  const toggleJoin = (id: string) => {
    if (isPenaltyActive) return;
    setJoinedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  if (activeSession) {
    const currentActive = sessionsWithState.find(s => s.id === activeSession.id) || activeSession;
    return (
      <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className={user.language === 'ar' ? 'text-right' : 'text-left'}>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{currentActive.title}</h2>
            <p className="text-teal-600 dark:text-teal-400 text-sm font-bold">{currentActive.activeMics}/11 {t.activeMics}</p>
          </div>
          <button 
            onClick={() => {
              if (window.confirm(t.withdrawConfirm)) {
                onWithdraw();
                setActiveSession(null);
              }
            }}
            className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            {t.immediateWithdrawal}
          </button>
        </div>

        <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center p-6 md:p-12">
           <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full max-w-3xl">
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white text-xl transition-all shadow-md ${i < currentActive.activeMics ? 'bg-teal-500 animate-pulse ring-4 ring-teal-100 dark:ring-teal-900/30' : 'bg-white dark:bg-slate-800 text-slate-300 dark:text-slate-600 shadow-none'}`}>
                    <i className="fa-solid fa-user-ninja"></i>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{t.anonymousMember}</span>
                </div>
              ))}
           </div>
           
           <div className="mt-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-6 rounded-[2rem] border border-white dark:border-slate-700 shadow-2xl w-full max-w-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <button className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-teal-500 hover:bg-teal-50 transition-all border border-slate-100 dark:border-slate-600">
                    <i className="fa-solid fa-microphone-slash text-xl"></i>
                 </button>
                 <div className={user.language === 'ar' ? 'text-right' : 'text-left'}>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 italic">{t.specialistListening}</p>
                    <p className="text-[10px] text-slate-300 dark:text-slate-600">{t.totallySafe}</p>
                 </div>
              </div>
              <button 
                onClick={() => setActiveSession(null)}
                className="px-8 py-3 bg-slate-800 dark:bg-slate-700 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 dark:shadow-none"
              >
                {t.leave}
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <div className={user.language === 'ar' ? 'text-right' : 'text-left'}>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">{t.groupSessions}</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t.testDesc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sessionsWithState.map(session => (
          <div key={session.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 space-y-5 group hover:border-teal-200 dark:hover:border-teal-800 transition-all">
            <div className="flex justify-between items-start">
              <div className={`flex-1 ${user.language === 'ar' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{session.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">{session.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-2xl border border-slate-50 dark:border-slate-700/50">
              <div className="flex items-center gap-2 font-bold">
                <i className="fa-solid fa-user-shield text-teal-500 dark:text-teal-400"></i>
                <span>{session.participants}/11</span>
              </div>
              <div className="flex items-center gap-2 font-bold">
                <i className="fa-solid fa-microphone text-blue-500 dark:text-blue-400"></i>
                <span>{session.activeMics}/11</span>
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
              {session.isJoined ? t.enterSession : t.joinCourse}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupSessions;
