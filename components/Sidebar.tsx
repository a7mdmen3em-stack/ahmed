
import React from 'react';
import { AppView, UserProfile } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  user: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user }) => {
  const menuItems: { id: AppView; label: string; icon: string; highlight?: boolean }[] = [
    { id: 'home', label: 'المجتمع (For You)', icon: 'fa-rss' },
    { id: 'sessions', label: 'الجلسات والدردشة', icon: 'fa-users-viewfinder' },
    { id: 'messages', label: 'الرسائل', icon: 'fa-paper-plane' },
    { id: 'daily', label: 'يومياتي', icon: 'fa-calendar-check' },
    { id: 'ai-chat', label: 'الأخصائي الذكي', icon: 'fa-sparkles', highlight: true },
    { id: 'profile', label: 'ملفي الشخصي', icon: 'fa-user-shield' },
  ];

  const progressPercent = (user.xp / user.xpToNextLevel) * 100;

  return (
    <nav className="hidden md:flex flex-col w-72 bg-white border-l border-slate-200 shadow-sm z-20 h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white text-xl">
          <i className="fa-solid fa-hand-holding-heart"></i>
        </div>
        <h1 className="text-xl font-bold text-teal-600">Safe Space</h1>
      </div>

      {/* User Progress Mini-Card */}
      <div className="px-6 mb-6">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-slate-400">المستوى {user.level}</span>
            <span className="text-[10px] font-bold text-teal-600">{user.xp} XP</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
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
                ? 'bg-teal-50 text-teal-600 font-bold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-6 text-lg`}></i>
            <span className="text-sm">{item.label}</span>
            {item.highlight && (
              <span className="absolute top-0 right-0 h-full w-1 bg-teal-500 animate-pulse"></span>
            )}
            {item.id === 'messages' && (
              <span className="mr-auto bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">2</span>
            )}
          </button>
        ))}
      </div>
      
      <div className="p-6 border-t border-slate-100 mt-auto bg-slate-50/50">
        <div className="flex items-center gap-3 text-slate-400 text-xs font-bold">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
          <span>الخصوصية مشفرة ومؤمنة</span>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
