
import React, { useState, useEffect, useMemo } from 'react';
import { PsychologicalChallenge, AppNotification, UserProfile } from '../types';
import { translations } from '../translations';

interface IndividualChallengesProps {
  user: UserProfile;
  gainXP: (amount: number) => void;
  addNotification: (message: string, type: AppNotification['type']) => void;
}

const IndividualChallenges: React.FC<IndividualChallengesProps> = ({ user, gainXP, addNotification }) => {
  const t = translations[user.language];
  
  const challengesPool = useMemo(() => {
    const level = user.level;
    const isAr = user.language === 'ar';
    
    const beginner = [
      { id: 'ind-1', title: isAr ? 'نفس هادي' : 'Calm Breath', description: isAr ? 'تمرين تنفس 4-7-8 لمدة دقيقة.' : '4-7-8 breathing exercise for 1 minute.', xpReward: 25, isCompleted: false, category: 'daily', durationSeconds: 60, difficulty: t.easy },
      { id: 'ind-2', title: isAr ? 'لاحظ المحيط' : 'Observe Surroundings', description: isAr ? 'غمض عينيك وركز في 3 أصوات حولك.' : 'Close your eyes and focus on 3 sounds around you.', xpReward: 20, isCompleted: false, category: 'daily', durationSeconds: 60, difficulty: t.easy },
    ];
    const intermediate = [
      { id: 'ind-3', title: isAr ? 'تأمل ممتد' : 'Extended Meditation', description: isAr ? 'تأمل صامت لمدة 3 دقائق دون أي حركة.' : 'Silent meditation for 3 minutes without any movement.', xpReward: 50, isCompleted: false, category: 'daily', durationSeconds: 180, difficulty: t.medium },
      { id: 'ind-4', title: isAr ? 'امتنان اليوم' : 'Daily Gratitude', description: isAr ? 'اكتب 3 حاجات حصلت النهاردة وبسطتك.' : 'Write 3 things that happened today that made you happy.', xpReward: 40, isCompleted: false, category: 'daily', durationSeconds: 120, difficulty: t.medium },
    ];
    const advanced = [
      { id: 'ind-5', title: isAr ? 'ماراثون صمت' : 'Silence Marathon', description: isAr ? 'تمرين حضور ذهني مكثف لمدة 10 دقائق.' : 'Intense mindfulness exercise for 10 minutes.', xpReward: 120, isCompleted: false, category: 'daily', durationSeconds: 600, difficulty: t.hard },
      { id: 'ind-6', title: isAr ? 'تحليل موقف' : 'Analyze Position', description: isAr ? 'اوصف موقف ضايقك النهاردة من وجهة نظر شخص تالت.' : 'Describe a situation that bothered you from a 3rd person perspective.', xpReward: 100, isCompleted: false, category: 'daily', durationSeconds: 300, difficulty: t.hard },
    ];

    let current = [...beginner];
    if (level >= 4) current = [...current, ...intermediate];
    if (level >= 8) current = [...current, ...advanced];
    return current;
  }, [user.level, user.language, t.easy, t.medium, t.hard]);

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
        addNotification(user.language === 'ar' ? `عاش! خلصت "${challenge.title}"` : `Great! Finished "${challenge.title}"`, "success");
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
        <div className="w-48 h-48 rounded-full border-8 border-teal-500/20 border-t-teal-500 flex flex-col items-center justify-center mx-auto transition-colors">
           <span className="text-4xl font-black text-slate-800 dark:text-white">{formatTime(timeLeft)}</span>
           <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{t.remaining}</span>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">{active?.title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{active?.description}</p>
        </div>
        <button onClick={() => setActiveId(null)} className="w-full py-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-red-400 rounded-2xl font-black text-sm">{t.cancelChallenge}</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map(c => (
          <div key={c.id} className={`p-6 rounded-[2.5rem] border-2 transition-all group ${c.isCompleted ? 'bg-slate-50 dark:bg-slate-900/20 opacity-60' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-teal-400 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.isCompleted ? 'bg-slate-100 dark:bg-slate-700 text-slate-400' : 'bg-teal-50 dark:bg-teal-900/20 text-teal-600'}`}>
                <i className={`fa-solid ${c.isCompleted ? 'fa-check' : 'fa-bolt'} text-xl`}></i>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black ${c.difficulty === t.easy ? 'bg-green-50 text-green-600' : c.difficulty === t.medium ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                  {c.difficulty}
                </span>
                <span className="text-[10px] font-black text-teal-500">+{c.xpReward} XP</span>
              </div>
            </div>
            <div className={user.language === 'ar' ? 'text-right' : 'text-left'}>
              <h4 className="font-black text-slate-800 dark:text-white mb-2">{c.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 h-12 overflow-hidden leading-relaxed">{c.description}</p>
            </div>
            <button
              disabled={c.isCompleted}
              onClick={() => { setActiveId(c.id); setTimeLeft(c.durationSeconds || 60); }}
              className={`w-full py-3 rounded-2xl font-black text-xs transition-all ${c.isCompleted ? 'bg-slate-100 dark:bg-slate-700 text-slate-400' : 'bg-teal-500 text-white shadow-lg shadow-teal-500/10'}`}
            >
              {c.isCompleted ? t.completed : t.startChallenge}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndividualChallenges;
