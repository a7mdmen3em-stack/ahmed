
import React from 'react';
import { AppView, UserProfile } from '../types';
import { translations } from '../translations';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  user: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user }) => {
  const t = translations[user.language];

  const menuItems: { id: AppView; label: string; icon: string; highlight?: boolean }[] = [
    { id: 'home', label: t.home, icon: 'fa-rss' },
    { id: 'sessions', label: t.sessions, icon: 'fa-users-viewfinder' },
    { id: 'messages', label: t.messages, icon: 'fa-paper-plane' },
    { id: 'daily', label: t.daily, icon: 'fa-calendar-check' },
    { id: 'ai-chat', label: t.aiChat, icon: 'fa-sparkles', highlight: true },
    { id: 'profile', label: t.profile, icon: 'fa-user-shield' },
  ];

  const progressPercent = (user.xp / user.xpToNextLevel) * 100;

  return (
    <nav className="hidden md:flex flex-col w-72 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 shadow-sm z-20 h-full transition-colors">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white text-xl">
          <i className="fa-solid fa-hand-holding-heart"></i>
        </div>
        <h1 className="text-xl font-bold text-teal-600 dark:text-teal-400">{t.appName}</h1>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-slate-400">{t.level} {user.level}</span>
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">{user.xp} {t.xp}</span>
          </div>
          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-1 px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative overflow-hidden group ${
              currentView === item.id 
                ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-bold' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-6 text-lg`}></i>
            <span className="text-sm">{item.label}</span>
            {item.highlight && (
              <span className={`absolute top-0 ${user.language === 'ar' ? 'right-0' : 'left-0'} h-full w-1 bg-teal-500 animate-pulse`}></span>
            )}
            {item.id === 'messages' && (
              <span className={`${user.language === 'ar' ? 'mr-auto' : 'ml-auto'} bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white`}>2</span>
            )}
          </button>
        ))}
      </div>
      
      <div className="p-6 border-t border-slate-100 dark:border-slate-700 mt-auto bg-slate-50/50 dark:bg-slate-900/20">
        <div className="flex items-center gap-3 text-slate-400 text-xs font-bold">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
          <span>{t.privacyEncrypted}</span>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
