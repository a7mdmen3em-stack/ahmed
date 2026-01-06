
import React, { useState } from 'react';
import { SessionCategory, AppNotification, UserProfile } from '../types';
import GroupSessions from './GroupSessions';
import SiphonRoom from './SiphonRoom';
import FunRooms from './FunRooms';
import IndividualChallenges from './IndividualChallenges';
import { translations } from '../translations';

interface SessionsHubProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isPenaltyActive: boolean;
  onWithdraw: () => void;
  gainXP: (amount: number) => void;
  addNotification: (message: string, type: AppNotification['type']) => void;
}

const SessionsHub: React.FC<SessionsHubProps> = (props) => {
  const t = translations[props.user.language];
  const [activeTab, setActiveTab] = useState<SessionCategory>('group');
  const [showTest, setShowTest] = useState(false);

  const tabs: { id: SessionCategory; label: string; icon: string; desc: string }[] = [
    { id: 'group', label: t.groupSessions, icon: 'fa-users', desc: t.groupDesc },
    { id: 'siphon', label: t.siphon, icon: 'fa-comment-medical', desc: t.siphonDesc },
    { id: 'challenges', label: t.challenges, icon: 'fa-mountain-sun', desc: props.user.language === 'ar' ? 'مهام نفسية ترفع الـ XP' : 'Psychological tasks to gain XP' },
    { id: 'fun', label: t.funRooms, icon: 'fa-face-smile', desc: props.user.language === 'ar' ? 'فك عن نفسك مع 200 واحد' : 'Relax with 200 people' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 p-2 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 flex gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`min-w-[80px] flex-1 flex flex-col items-center py-4 rounded-[1.5rem] transition-all ${activeTab === tab.id ? 'bg-teal-500 text-white' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
          >
            <i className={`fa-solid ${tab.icon} text-lg mb-1`}></i>
            <span className="text-[10px] font-bold whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center px-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">{tabs.find(t => t.id === activeTab)?.label}</h2>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">{tabs.find(t => t.id === activeTab)?.desc}</p>
        </div>
        
        {activeTab === 'group' && (
          <button onClick={() => setShowTest(true)} className="bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 border border-teal-100 dark:border-teal-800">
            <i className="fa-solid fa-plus-circle"></i> {t.openNewSession}
          </button>
        )}
      </div>

      {showTest && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 dark:text-white text-center mb-2">{t.qualificationTest}</h3>
            <p className="text-xs text-slate-400 text-center mb-6">{t.testDesc}</p>
            <button onClick={() => setShowTest(false)} className="w-full py-4 bg-teal-500 text-white rounded-2xl font-bold">{t.startNow}</button>
            <button onClick={() => setShowTest(false)} className="w-full text-center text-xs text-slate-400 font-bold py-4">{t.notNow}</button>
          </div>
        </div>
      )}

      <div className="min-h-[400px]">
        {activeTab === 'group' && <GroupSessions user={props.user} isPenaltyActive={props.isPenaltyActive} onWithdraw={props.onWithdraw} gainXP={props.gainXP} />}
        {activeTab === 'siphon' && <SiphonRoom user={props.user} addNotification={props.addNotification} />}
        {activeTab === 'challenges' && <IndividualChallenges user={props.user} gainXP={props.gainXP} addNotification={props.addNotification} />}
        {activeTab === 'fun' && <FunRooms user={props.user} />}
      </div>
    </div>
  );
};

export default SessionsHub;
