
import React from 'react';
import { AppView, UserProfile } from '../types';
import { translations } from '../translations';

interface HomeProps {
  setView: (view: AppView) => void;
  user: UserProfile;
}

const Home: React.FC<HomeProps> = ({ setView, user }) => {
  const t = translations[user.language];
  const progressPercent = (user.xp / user.xpToNextLevel) * 100;

  return (
    <div className="space-y-6 md:space-y-8 pb-4">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center gap-6 transition-colors">
        <div className="flex items-center gap-4 flex-1 w-full">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex flex-col items-center justify-center text-white shrink-0 shadow-lg shadow-teal-100">
             <span className="text-[10px] font-bold opacity-80 uppercase">{t.level}</span>
             <span className="text-2xl font-black">{user.level}</span>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="font-bold text-slate-800 dark:text-white">{t.welcome}{user.pseudonym}</h2>
                <p className="text-xs text-teal-600 dark:text-teal-400 font-bold">{user.rankTitle}</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400">{user.xp} / {user.xpToNextLevel} XP</span>
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="hidden md:block w-px h-12 bg-slate-100 dark:bg-slate-700"></div>
        <div className="flex items-center gap-3 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800">
           <i className="fa-solid fa-fire text-amber-500"></i>
           <div className={user.language === 'ar' ? 'text-right' : 'text-left'}>
             <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400">{t.dailyStreak}</p>
             <p className="text-sm font-black text-amber-800 dark:text-amber-200">3 {t.days}</p>
           </div>
        </div>
      </div>

      <header className={user.language === 'ar' ? 'text-right' : 'text-left'}>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white leading-tight">{t.exploreTools}</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <FeatureCard 
          title={t.groupSessions} 
          desc={t.groupDesc}
          icon="fa-users"
          color="teal"
          xp="+50 XP"
          onClick={() => setView('sessions')}
          lang={user.language}
        />
        <FeatureCard 
          title={t.siphon} 
          desc={t.siphonDesc}
          icon="fa-comment-medical"
          color="purple"
          xp="+30 XP"
          onClick={() => setView('sessions')}
          lang={user.language}
        />
        <FeatureCard 
          title={t.daily} 
          desc={t.dailyDescShort}
          icon="fa-calendar-check"
          color="blue"
          xp="+20 XP"
          onClick={() => setView('daily')}
          lang={user.language}
        />
        <FeatureCard 
          title={t.home} 
          desc={t.feedDescShort}
          icon="fa-rss"
          color="amber"
          xp="+10 XP"
          onClick={() => setView('home')}
          lang={user.language}
        />
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; desc: string; icon: string; color: string; xp: string; onClick: () => void; lang: string }> = ({ title, desc, icon, color, xp, onClick, lang }) => {
  const colorClasses: Record<string, string> = {
    teal: 'bg-teal-50 dark:bg-teal-900/10 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-800',
    purple: 'bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800',
    blue: 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800',
    amber: 'bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800',
  };

  return (
    <button 
      onClick={onClick}
      className={`p-5 md:p-6 rounded-3xl border transition-all active:scale-95 md:hover:scale-[1.02] md:hover:shadow-md relative overflow-hidden group ${lang === 'ar' ? 'text-right' : 'text-left'} ${colorClasses[color]}`}
    >
      <div className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} text-[9px] font-black px-2 py-1 rounded-full bg-white/50 dark:bg-slate-800/50 border border-current`}>
        {xp}
      </div>
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mb-3 md:mb-4 shadow-sm transition-transform group-hover:rotate-12">
        <i className={`fa-solid ${icon} text-lg md:text-xl`}></i>
      </div>
      <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-[13px] md:text-sm leading-relaxed opacity-80">{desc}</p>
    </button>
  );
}

export default Home;
