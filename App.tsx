
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, UserProfile, AppNotification } from './types';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import SocialFeed from './components/SocialFeed';
import SessionsHub from './components/SessionsHub';
import DailyCheckIn from './components/DailyCheckIn';
import Profile from './components/Profile';
import AIChat from './components/AIChat';
import Messages from './components/Messages';
import NotificationToast from './components/NotificationToast';
import TopDrawerMenu from './components/TopDrawerMenu';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [user, setUser] = useState<UserProfile>({
    id: '84920571',
    pseudonym: 'زائر_مطمئن',
    avatar: 'fa-user-ninja',
    moods: ['متفائل', 'هادئ'],
    preferences: 'both',
    privacy: 'only-me',
    level: 1,
    xp: 120,
    xpToNextLevel: 500,
    rankTitle: 'باحث عن الهدوء',
    isQualified: false
  });

  const [withdrawalPenalty, setWithdrawalPenalty] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 2000);
    const savedPenalty = localStorage.getItem('penalty_end');
    if (savedPenalty) {
      const end = parseInt(savedPenalty);
      if (Date.now() < end) setWithdrawalPenalty(end);
    }
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const addNotification = useCallback((message: string, type: AppNotification['type'] = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [{ id, message, type, timestamp: new Date() }, ...prev]);
  }, []);

  const gainXP = useCallback((amount: number) => {
    setUser(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newXPToNext = prev.xpToNextLevel;
      let newRank = prev.rankTitle;

      if (newXP >= prev.xpToNextLevel) {
        newXP -= prev.xpToNextLevel;
        newLevel += 1;
        newXPToNext = Math.floor(prev.xpToNextLevel * 1.5);
        addNotification(`يا وحش! مستواك علي بقى ${newLevel}.. عاش والله`, "success");
        
        if (newLevel === 2) newRank = "مستمع واعد";
        if (newLevel === 5) newRank = "صديق المجتمع";
        if (newLevel === 10) newRank = "حكيم المساحة";
      }

      return { ...prev, xp: newXP, level: newLevel, xpToNextLevel: newXPToNext, rankTitle: newRank };
    });
  }, [addNotification]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleWithdrawal = () => {
    const end = Date.now() + 72 * 60 * 60 * 1000;
    localStorage.setItem('penalty_end', end.toString());
    setWithdrawalPenalty(end);
    addNotification("الانسحاب ده هيخليك ماتاخدش سيشنات لمدة 72 ساعة، ريح شوية واستنى.", "error");
    setView('sessions');
  };

  const isPenaltyActive = withdrawalPenalty && Date.now() < withdrawalPenalty;

  if (isAppLoading) {
    return (
      <div className="h-screen w-screen bg-teal-600 flex flex-col items-center justify-center text-white p-6">
        <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
          <i className="fa-solid fa-hand-holding-heart text-5xl"></i>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-center">Safe Space<br/><span className="text-sm font-normal opacity-80">بنجهزلك قعدتك الآمنة.. ثواني</span></h1>
        <div className="mt-12 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white w-1/2 animate-[loading_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
      <Sidebar currentView={view} setView={setView} user={user} />
      
      <TopDrawerMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onLogout={() => window.location.reload()} 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <header className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 h-16 flex items-center justify-between px-4 z-40 shrink-0 shadow-sm transition-colors">
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsMenuOpen(true)}
             className="w-10 h-10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-700 rounded-xl transition-all"
           >
             <i className="fa-solid fa-bars-staggered text-xl"></i>
           </button>
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white">
               <i className="fa-solid fa-hand-holding-heart text-xs"></i>
             </div>
             <h1 className="font-bold text-teal-600 dark:text-teal-400 hidden xs:block">Safe Space</h1>
           </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[10px] bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 px-3 py-1.5 rounded-full font-bold border border-teal-100 dark:border-teal-800">
            Lvl {user.level}
          </div>
          <button onClick={() => setView('profile')} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 overflow-hidden border border-slate-200 dark:border-slate-600 shadow-sm transition-transform active:scale-95">
             {user.profilePic ? (
               <img src={user.profilePic} className="w-full h-full object-cover" alt="profile" />
             ) : (
               <i className={`fa-solid ${user.avatar} text-xs`}></i>
             )}
          </button>
        </div>
      </header>

      <NotificationToast notifications={notifications} removeNotification={removeNotification} />
      
      <main className="flex-1 overflow-y-auto relative p-4 md:p-8 pb-24 md:pb-8 animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto">
          {view === 'home' && <SocialFeed user={user} gainXP={gainXP} />}
          {view === 'sessions' && (
            <SessionsHub 
              user={user}
              setUser={setUser}
              isPenaltyActive={!!isPenaltyActive} 
              onWithdraw={handleWithdrawal} 
              gainXP={gainXP} 
              addNotification={addNotification} 
            />
          )}
          {view === 'messages' && <Messages user={user} addNotification={addNotification} gainXP={gainXP} />}
          {view === 'daily' && <DailyCheckIn addNotification={addNotification} gainXP={gainXP} />}
          {view === 'profile' && <Profile user={user} setUser={setUser} gainXP={gainXP} />}
          {view === 'ai-chat' && <AIChat addNotification={addNotification} />}
        </div>
      </main>

      <MobileNav currentView={view} setView={setView} />
    </div>
  );
};

export default App;