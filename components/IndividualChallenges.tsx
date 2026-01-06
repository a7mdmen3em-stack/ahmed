
import React, { useState, useEffect, useMemo } from 'react';
import { PsychologicalChallenge, AppNotification, UserProfile } from '../types';

interface IndividualChallengesProps {
  user: UserProfile;
  gainXP: (amount: number) => void;
  addNotification: (message: string, type: AppNotification['type']) => void;
}

const IndividualChallenges: React.FC<IndividualChallengesProps> = ({ user, gainXP, addNotification }) => {
  const challengesPool = useMemo(() => {
    const level = user.level;
    const beginner = [
      { id: 'ind-1', title: 'نفس هادي', description: 'تمرين تنفس 4-7-8 لمدة دقيقة.', xpReward: 25, isCompleted: false, category: 'daily', durationSeconds: 60, difficulty: 'سهل' },
      { id: 'ind-2', title: 'لاحظ المحيط', description: 'غمض عينيك وركز في 3 أصوات حولك.', xpReward: 20, isCompleted: false, category: 'daily', durationSeconds: 60, difficulty: 'سهل' },
    ];
    const intermediate = [
      { id: 'ind-3', title: 'تأمل ممتد', description: 'تأمل صامت لمدة 3 دقائق دون أي حركة.', xpReward: 50, isCompleted: false, category: 'daily', durationSeconds: 180, difficulty: 'متوسط' },
      { id: 'ind-4', title: 'امتنان اليوم', description: 'اكتب 3 حاجات حصلت النهاردة وبسطتك.', xpReward: 40, isCompleted: false, category: 'daily', durationSeconds: 120, difficulty: 'متوسط' },
    ];
    const advanced = [
      { id: 'ind-5', title: 'ماراثون صمت', description: 'تمرين حضور ذهني مكثف لمدة 10 دقائق.', xpReward: 120, isCompleted: false, category: 'daily', durationSeconds: 600, difficulty: 'صعب' },
      { id: 'ind-6', title: 'تحليل موقف', description: 'اوصف موقف ضايقك النهاردة من وجهة نظر شخص تالت.', xpReward: 100, isCompleted: false, category: 'daily', durationSeconds: 300, difficulty: 'صعب' },
    ];

    let current = [...beginner];
    if (level >= 4) current = [...current, ...intermediate];
    if (level >= 8) current = [...current, ...advanced];
    return current as (PsychologicalChallenge & { difficulty: string })[];
  }, [user.level]);

  const [challenges, setChallenges] = useState(challengesPool);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let interval: any;
    if (activeId && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (activeId && timeLeft === 0) {
      const challenge = challenges.find(c => c.id === activeId);
      if (challenge) {
        setChallenges(prev => prev.map(c => c.id === activeId ? { ...c, isCompleted: true } : c));
        gainXP(challenge.xpReward);
        setActiveId(null);
        addNotification(`عاش! خلصت "${challenge.title}" وخدت ${challenge.xpReward} XP.`, "success");
      }
    }
    return () => clearInterval(interval);
  }, [activeId, timeLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (activeId) {
    const active = challenges.find(c => c.id === activeId);
    return (
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border-4 border-teal-500 shadow-2xl text-center space-y-8 max-w-xl mx-auto animate-in zoom-in duration-500">
        <div className="w-48 h-48 rounded-full border-8 border-teal-500/20 border-t-teal-500 flex flex-col items-center justify-center mx-auto animate-spin-slow">
           <span className="text-4xl font-black text-slate-800 dark:text-white animate-none">{formatTime(timeLeft)}</span>
           <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase animate-none">متبقي</span>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">{active?.title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{active?.description}</p>
        </div>
        <button onClick={() => setActiveId(null)} className="w-full py-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl font-black text-sm">إلغاء التحدي</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map(c => (
          <div key={c.id} className={`p-6 rounded-[2.5rem] border-2 transition-all group ${c.isCompleted ? 'bg-slate-50 opacity-60' : 'bg-white dark:bg-slate-800 border-slate-100 hover:border-teal-400 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.isCompleted ? 'bg-slate-100 text-slate-400' : 'bg-teal-50 text-teal-600'}`}>
                <i className={`fa-solid ${c.isCompleted ? 'fa-check' : 'fa-bolt'} text-xl`}></i>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black ${c.difficulty === 'سهل' ? 'bg-green-50 text-green-600' : c.difficulty === 'متوسط' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                  {c.difficulty}
                </span>
                <span className="text-[10px] font-black text-teal-500">+{c.xpReward} XP</span>
              </div>
            </div>
            <h4 className="font-black text-slate-800 dark:text-white mb-2">{c.title}</h4>
            <p className="text-slate-500 text-xs mb-6 h-12 overflow-hidden leading-relaxed">{c.description}</p>
            <button
              disabled={c.isCompleted}
              onClick={() => { setActiveId(c.id); setTimeLeft(c.durationSeconds || 60); }}
              className={`w-full py-3 rounded-2xl font-black text-xs transition-all ${c.isCompleted ? 'bg-slate-100 text-slate-400' : 'bg-teal-500 text-white shadow-lg shadow-teal-500/10'}`}
            >
              {c.isCompleted ? 'تم الإنجاز' : 'بدء التحدي'}
            </button>
          </div>
        ))}
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-[2.5rem] flex items-center gap-6">
        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-xl shrink-0"><i className="fa-solid fa-lightbulb"></i></div>
        <p className="text-blue-700 dark:text-blue-300 text-xs font-bold leading-relaxed">
          أنت حالياً في ليفل {user.level}، متاح ليك تحديات {user.level >= 8 ? 'الخبراء' : user.level >= 4 ? 'المتوسطة' : 'المبتدئين'}. كل ما ليفلك يعلى التحديات هتفتح أكتر!
        </p>
      </div>
    </div>
  );
};

export default IndividualChallenges;
