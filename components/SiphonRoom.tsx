
import React, { useState, useEffect } from 'react';
import { SiphonState, AppNotification, UserProfile } from '../types';
import { translations } from '../translations';

interface SiphonRoomProps {
  user: UserProfile;
  addNotification: (message: string, type: AppNotification['type']) => void;
}

const SiphonRoom: React.FC<SiphonRoomProps> = ({ user, addNotification }) => {
  const t = translations[user.language];
  const [state, setState] = useState<SiphonState>({
    step: 'writing',
    myProblem: '',
    partnerProblem: '',
    timer: 0
  });

  const [isMatching, setIsMatching] = useState(false);

  const startMatching = () => {
    if (!state.myProblem) return;
    setIsMatching(true);
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        step: 'matching',
        partnerProblem: user.language === 'ar' 
          ? 'أشعر بضيق شديد مؤخراً بسبب ضغوط العمل وعدم القدرة على الموازنة بين حياتي الشخصية والمهنية.'
          : 'I feel very stressed lately due to work pressure and not being able to balance my personal and professional life.'
      }));
      setIsMatching(false);
      addNotification(user.language === 'ar' ? "تم العثور على شريك مجهول!" : "Anonymous partner found!", "info");
    }, 2500);
  };

  const acceptPartner = () => {
    setState(prev => ({ ...prev, step: 'round1', timer: 180 }));
    addNotification(user.language === 'ar' ? "بدأت الجلسة. الجولة الأولى: مساحتك للحديث." : "Session started. Round 1: Your turn to talk.", "success");
  };

  useEffect(() => {
    if (state.timer > 0) {
      const interval = setInterval(() => {
        setState(prev => {
           if (prev.timer <= 1) {
              if (prev.step === 'round1') {
                return { ...prev, step: 'round2', timer: 180 };
              }
              if (prev.step === 'round2') {
                return { ...prev, step: 'round3', timer: 0 };
              }
           }
           return { ...prev, timer: prev.timer - 1 };
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.timer, state.step]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (state.step === 'writing') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.siphonStartTitle}</h2>
          <p className="text-slate-500">{t.siphonStartDesc}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">{t.whatToVent}</label>
          <textarea
            value={state.myProblem}
            onChange={(e) => setState(prev => ({ ...prev, myProblem: e.target.value }))}
            className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl resize-none focus:ring-2 focus:ring-teal-500 outline-none text-slate-800 dark:text-slate-200"
            placeholder={t.ventPlaceholder}
          ></textarea>
          
          <button
            onClick={startMatching}
            disabled={!state.myProblem || isMatching}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all ${
              !state.myProblem || isMatching ? 'bg-slate-300' : 'bg-teal-500 hover:bg-teal-600 shadow-lg shadow-teal-100'
            }`}
          >
            {isMatching ? t.searchingPartner : t.findPartner}
          </button>
        </div>
      </div>
    );
  }

  if (state.step === 'matching') {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 text-2xl">
            <i className="fa-solid fa-user-secret"></i>
          </div>
          <div className={user.language === 'ar' ? 'text-right' : 'text-left'}>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t.potentialPartner}</h3>
            <p className="text-sm text-slate-400">{t.partnerWantsShare}</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl italic text-slate-700 dark:text-slate-300 leading-relaxed">
          "{state.partnerProblem}"
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setState(prev => ({ ...prev, step: 'writing', partnerProblem: '' }))}
            className="py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            {t.reject}
          </button>
          <button 
            onClick={acceptPartner}
            className="py-4 bg-teal-500 text-white rounded-2xl font-bold hover:bg-teal-600 shadow-lg shadow-teal-100"
          >
            {t.acceptAndStart}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full space-y-6">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm flex items-center justify-between border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-mono text-xl">
            {formatTime(state.timer)}
          </div>
          <div className="text-sm">
            <span className="text-slate-400">{t.activeNow}: </span>
            <span className="font-bold text-teal-600 dark:text-teal-400">
              {state.step === 'round1' ? t.round1Title : state.step === 'round2' ? t.round2Title : t.round3Title}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setState({ step: 'writing', myProblem: '', partnerProblem: '', timer: 0 })}
          className="px-6 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold"
        >
          {t.immediateEnd}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className={`p-8 rounded-3xl border-4 transition-all flex flex-col items-center justify-center gap-6 ${state.step === 'round1' ? 'bg-white dark:bg-slate-800 border-teal-500 shadow-xl' : 'bg-slate-100 dark:bg-slate-900 border-transparent opacity-50'}`}>
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl shadow-inner ${state.step === 'round1' ? 'bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 animate-pulse' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-600'}`}>
               <i className="fa-solid fa-microphone"></i>
            </div>
            <div className="text-center">
               <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t.yourSpaceTalk}</h3>
               <p className="text-slate-500 text-sm mt-2">{t.ventFreely}</p>
            </div>
         </div>

         <div className={`p-8 rounded-3xl border-4 transition-all flex flex-col items-center justify-center gap-6 ${state.step === 'round2' ? 'bg-white dark:bg-slate-800 border-purple-500 shadow-xl' : 'bg-slate-100 dark:bg-slate-900 border-transparent opacity-50'}`}>
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl shadow-inner ${state.step === 'round2' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 animate-pulse' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-600'}`}>
               <i className="fa-solid fa-headphones"></i>
            </div>
            <div className="text-center">
               <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t.listeningTime}</h3>
               <p className="text-slate-500 text-sm mt-2">{t.listenWithEmpathy}</p>
            </div>
         </div>
      </div>

      {state.step === 'round3' && (
        <div className="bg-teal-50 dark:bg-teal-900/10 border-2 border-teal-200 dark:border-teal-800 p-8 rounded-3xl text-center space-y-4">
           <h3 className="text-2xl font-bold text-teal-800 dark:text-teal-200">{t.openDiscussionPhase}</h3>
           <p className="text-teal-600 dark:text-teal-400 italic">{t.openDiscussionDesc}</p>
           <button 
             onClick={() => setState({ step: 'writing', myProblem: '', partnerProblem: '', timer: 0 })}
             className="px-8 py-3 bg-teal-600 text-white rounded-2xl font-bold"
           >
             {t.endAndThank}
           </button>
        </div>
      )}
    </div>
  );
};

export default SiphonRoom;
