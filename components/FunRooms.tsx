
import React, { useMemo } from 'react';
import { UserProfile } from '../types';
import { translations } from '../translations';

interface FunRoomsProps {
  user: UserProfile;
}

const FunRooms: React.FC<FunRoomsProps> = ({ user }) => {
  const t = translations[user.language];

  const rooms = useMemo(() => [
    { id: 1, title: t.funRoom1, participants: 184, mics: 20, color: 'bg-indigo-500' },
    { id: 2, title: t.funRoom2, participants: 200, mics: 18, color: 'bg-amber-500' },
    { id: 3, title: t.funRoom3, participants: 42, mics: 5, color: 'bg-emerald-500' },
    { id: 4, title: t.funRoom4, participants: 67, mics: 12, color: 'bg-rose-500' },
  ], [user.language, t]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className={user.language === 'ar' ? 'text-right' : 'text-left'}>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">{t.funTitle}</h2>
          <p className="text-slate-500 text-sm mt-1">{t.funDescLong}</p>
        </div>
        <button className="bg-teal-500 text-white px-8 py-4 rounded-[1.5rem] font-bold flex items-center gap-3 hover:bg-teal-600 transition-all shadow-xl shadow-teal-100 active:scale-95">
          <i className="fa-solid fa-plus-circle text-xl"></i>
          <span>{t.newRoom}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="group relative bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-all hover:shadow-2xl hover:border-teal-100 dark:hover:border-teal-800 hover:-translate-y-2">
             <div className={`absolute top-0 ${user.language === 'ar' ? 'right-0' : 'left-0'} w-2 h-full ${room.color} opacity-20`}></div>
             
             <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all shadow-inner">
                    <i className="fa-solid fa-masks-theater text-2xl"></i>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-1 rounded-lg">{t.live}</span>
                  </div>
                </div>

                <h3 className={`font-bold text-slate-800 dark:text-white text-lg leading-tight h-12 overflow-hidden group-hover:text-teal-600 transition-colors ${user.language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {room.title}
                </h3>

                <div className="space-y-2">
                   <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                     <span className="flex items-center gap-2">
                       <i className="fa-solid fa-users text-blue-500"></i>
                       {room.participants}/200
                     </span>
                     <span className="flex items-center gap-2">
                       <i className="fa-solid fa-microphone text-teal-500"></i>
                       {room.mics}/20
                     </span>
                   </div>
                   <div className="h-1.5 bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${room.color} opacity-60 rounded-full`}
                        style={{ width: `${(room.participants / 200) * 100}%` }}
                      ></div>
                   </div>
                </div>

                <button className="w-full py-3 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold group-hover:bg-teal-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-teal-100 transition-all active:scale-95">
                  {t.joinChat}
                </button>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-indigo-600 via-teal-600 to-teal-500 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
         <div className={`flex-1 space-y-4 relative z-10 ${user.language === 'ar' ? 'text-right' : 'text-left'}`}>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
              <i className="fa-solid fa-face-laugh-beam text-2xl"></i>
            </div>
            <h3 className="text-3xl font-black">{t.anonymousFunDesc}</h3>
            <p className="text-teal-50 leading-relaxed text-lg opacity-90">{t.funBenefits}</p>
         </div>
         <div className="text-9xl opacity-10 group-hover:scale-110 transition-transform duration-700">
            <i className="fa-solid fa-comments"></i>
         </div>
      </div>
    </div>
  );
};

export default FunRooms;
