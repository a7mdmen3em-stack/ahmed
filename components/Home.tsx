
import React from 'react';
import { AppView, UserProfile } from '../types';

interface HomeProps {
  setView: (view: AppView) => void;
  user: UserProfile;
}

const Home: React.FC<HomeProps> = ({ setView, user }) => {
  const progressPercent = (user.xp / user.xpToNextLevel) * 100;

  return (
    <div className="space-y-6 md:space-y-8 pb-4">
      {/* User Progress Bar Header */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-4 flex-1 w-full">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex flex-col items-center justify-center text-white shrink-0 shadow-lg shadow-teal-100">
             <span className="text-[10px] font-bold opacity-80">LEVEL</span>
             <span className="text-2xl font-black">{user.level}</span>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="font-bold text-slate-800">مرحباً، {user.pseudonym}</h2>
                <p className="text-xs text-teal-600 font-bold">{user.rankTitle}</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400">{user.xp} / {user.xpToNextLevel} XP</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="hidden md:block w-px h-12 bg-slate-100"></div>
        <div className="flex items-center gap-3 px-4 py-2 bg-amber-50 rounded-2xl border border-amber-100">
           <i className="fa-solid fa-fire text-amber-500"></i>
           <div className="text-right">
             <p className="text-[10px] font-bold text-amber-600">ستريك اليوم</p>
             <p className="text-sm font-black text-amber-800">3 أيام</p>
           </div>
        </div>
      </div>

      <header className="text-right space-y-3">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">استكشف أدواتك النفسية</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <FeatureCard 
          title="السيشنات الجماعية" 
          desc="انضم لمجموعات دعم متخصصة لمدة 3 أسابيع."
          icon="fa-users"
          color="teal"
          xp="+50 XP"
          onClick={() => setView('group-sessions')}
        />
        <FeatureCard 
          title="السيفون (1 لـ 1)" 
          desc="فضفضة خاصة مع شخص مجهول تماماً."
          icon="fa-comment-medical"
          color="purple"
          xp="+30 XP"
          onClick={() => setView('siphon')}
        />
        <FeatureCard 
          title="فويس نوت اليومية" 
          desc="سجل مشاعرك وراقب تطور حالتك."
          icon="fa-calendar-check"
          color="blue"
          xp="+20 XP"
          onClick={() => setView('daily')}
        />
        <FeatureCard 
          title="المجتمع العام" 
          desc="شارك يومياتك وتفاعل مع الآخرين."
          icon="fa-rss"
          color="amber"
          xp="+10 XP"
          onClick={() => setView('feed')}
        />
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; desc: string; icon: string; color: string; xp: string; onClick: () => void }> = ({ title, desc, icon, color, xp, onClick }) => {
  const colorClasses: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <button 
      onClick={onClick}
      className={`p-5 md:p-6 rounded-3xl border text-right transition-all active:scale-95 md:hover:scale-[1.02] md:hover:shadow-md relative overflow-hidden group ${colorClasses[color]}`}
    >
      <div className="absolute top-4 left-4 text-[9px] font-black px-2 py-1 rounded-full bg-white/50 border border-current">
        {xp}
      </div>
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white flex items-center justify-center mb-3 md:mb-4 shadow-sm transition-transform group-hover:rotate-12">
        <i className={`fa-solid ${icon} text-lg md:text-xl`}></i>
      </div>
      <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">{title}</h3>
      <p className="text-slate-600 text-[13px] md:text-sm leading-relaxed opacity-80">{desc}</p>
    </button>
  );
}

export default Home;
