
import React from 'react';
import { AppView, UserProfile } from '../types';
import { translations } from '../translations';

interface MobileNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  user: UserProfile;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, setView, user }) => {
  const t = translations[user.language];

  const menuItems: { id: AppView; label: string; icon: string }[] = [
    { id: 'home', label: t.home, icon: 'fa-rss' },
    { id: 'sessions', label: t.sessions, icon: 'fa-users-viewfinder' },
    { id: 'messages', label: t.messages, icon: 'fa-paper-plane' },
    { id: 'daily', label: t.daily, icon: 'fa-calendar-check' },
    { id: 'profile', label: t.profile, icon: 'fa-user-shield' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex justify-around items-center h-16 px-2 z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.08)] transition-colors">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex flex-col items-center justify-center gap-1 transition-all flex-1 ${
            currentView === item.id 
              ? 'text-teal-600 dark:text-teal-400' 
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${currentView === item.id ? 'bg-teal-50 dark:bg-teal-900/20' : ''}`}>
            <i className={`fa-solid ${item.icon} text-lg`}></i>
            {item.id === 'messages' && (
              <div className={`absolute top-2 ${user.language === 'ar' ? 'right-[25%]' : 'left-[25%]'} w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white`}></div>
            )}
          </div>
          <span className="text-[9px] font-bold">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default MobileNav;
