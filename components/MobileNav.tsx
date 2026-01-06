
import React from 'react';
import { AppView } from '../types';

interface MobileNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, setView }) => {
  const menuItems: { id: AppView; label: string; icon: string }[] = [
    { id: 'home', label: 'الرئيسية', icon: 'fa-rss' },
    { id: 'sessions', label: 'الجلسات', icon: 'fa-users-viewfinder' },
    { id: 'messages', label: 'الرسائل', icon: 'fa-paper-plane' },
    { id: 'daily', label: 'يومياتي', icon: 'fa-calendar-check' },
    { id: 'profile', label: 'أنا', icon: 'fa-user-shield' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center h-16 px-2 z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex flex-col items-center justify-center gap-1 transition-all flex-1 ${
            currentView === item.id 
              ? 'text-teal-600' 
              : 'text-slate-400'
          }`}
        >
          <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${currentView === item.id ? 'bg-teal-50' : ''}`}>
            <i className={`fa-solid ${item.icon} text-lg`}></i>
            {item.id === 'messages' && (
              <div className="absolute top-2 right-[25%] w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <span className="text-[9px] font-bold">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default MobileNav;
