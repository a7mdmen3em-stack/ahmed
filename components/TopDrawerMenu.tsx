
import React from 'react';
import { AppView, UserProfile } from '../types';
import { translations } from '../translations';

interface TopDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setView: (view: AppView) => void;
  user: UserProfile;
}

const TopDrawerMenu: React.FC<TopDrawerMenuProps> = ({ isOpen, onClose, onLogout, isDarkMode, toggleDarkMode, setView, user }) => {
  const t = translations[user.language];
  const isAr = user.language === 'ar';

  const egyptianHotlines = [
    { name: t.hotlineMental, number: "16328", icon: "fa-phone-flip" },
    { name: t.hotlineChild, number: "16000", icon: "fa-child-reaching" },
    { name: t.hotlineWomen, number: "15115", icon: "fa-person-breastfeeding" },
    { name: t.ambulance, number: "123", icon: "fa-ambulance" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <aside className={`absolute top-0 ${isAr ? 'right-0' : 'left-0'} w-80 h-full bg-white dark:bg-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-${isAr ? 'right' : 'left'} duration-500 transition-colors`}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-teal-50/30 dark:bg-teal-900/10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white">
                <i className="fa-solid fa-hand-holding-heart"></i>
             </div>
             <h2 className="font-black text-slate-800 dark:text-white">{t.controlMenu}</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.general}</h3>
            
            <button 
              onClick={() => { setView('settings'); onClose(); }}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all text-slate-600 dark:text-slate-300 font-bold text-sm"
            >
              <i className="fa-solid fa-gear text-lg text-teal-500"></i>
              <span>{t.appSettings}</span>
            </button>

            <button 
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all text-slate-600 dark:text-slate-300 font-bold text-sm"
            >
              <div className="flex items-center gap-4">
                <i className={`fa-solid ${isDarkMode ? 'fa-sun text-amber-500' : 'fa-moon text-indigo-500'} text-lg`}></i>
                <span>{isDarkMode ? t.on : t.off} (Dark Mode)</span>
              </div>
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.importantNumbers}</h3>
            <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl p-4 border border-blue-100 dark:border-blue-900/30 space-y-3">
               {egyptianHotlines.map((line, i) => (
                 <a 
                   key={i} 
                   href={`tel:${line.number}`} 
                   className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm hover:border-blue-400 transition-all"
                 >
                   <div className="flex items-center gap-3">
                     <i className={`fa-solid ${line.icon} text-blue-500 text-sm`}></i>
                     <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{line.name}</span>
                   </div>
                   <span className="text-blue-600 dark:text-blue-400 font-black text-sm">{line.number}</span>
                 </a>
               ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
          <button 
            onClick={onLogout}
            className="w-full py-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl font-black text-sm flex items-center justify-center gap-3 border border-rose-100 dark:border-rose-900/30 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            {t.logout}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default TopDrawerMenu;
