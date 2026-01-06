
import React, { useState } from 'react';
import { SessionCategory, AppNotification, UserProfile } from '../types';
import GroupSessions from './GroupSessions';
import SiphonRoom from './SiphonRoom';
import FunRooms from './FunRooms';
import IndividualChallenges from './IndividualChallenges';

interface SessionsHubProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isPenaltyActive: boolean;
  onWithdraw: () => void;
  gainXP: (amount: number) => void;
  addNotification: (message: string, type: AppNotification['type']) => void;
}

const SessionsHub: React.FC<SessionsHubProps> = (props) => {
  const [activeTab, setActiveTab] = useState<SessionCategory>('group');
  const [showTest, setShowTest] = useState(false);
  const [testStep, setTestStep] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const testQuestions = [
    { q: "لو حد في السيشن بدأ يعيط، هتعمل إيه؟", options: ["هقوله بطل عياط وخليك قوي", "هسمعه بهدوء وأحسسه إني معاه", "هخرج من السيشن فوراً"], correct: 1 },
    { q: "ينفع تسأل حد عن اسمه الحقيقي أو رقم تليفونه؟", options: ["أيوة عشان نتعرف أكتر", "لأ، الخصوصية هنا أهم حاجة", "لو هو وافق مفيش مشكلة"], correct: 1 },
    { q: "إيه أهم حاجة بنقدمها لبعض في 'Safe Space'؟", options: ["نصايح طبية وأدوية", "حكم على تصرفات الآخرين", "دعم نفسي من غير أحكام"], correct: 2 },
  ];

  const handleTestAnswer = (index: number) => {
    if (index === testQuestions[testStep].correct) {
      if (testStep < testQuestions.length - 1) {
        setTestStep(testStep + 1);
      } else {
        props.setUser(prev => ({ ...prev, isQualified: true }));
        props.addNotification("مبروك! بقيت مؤهل تفتح سيشنات بنفسك يا بطل.", "success");
        setShowTest(false);
        setShowCreateForm(true);
      }
    } else {
      props.addNotification("الإجابة مش دقيقة، ركز في قيم المكان وحاول تاني.", "warning");
      setTestStep(0);
      setShowTest(false);
    }
  };

  const tabs: { id: SessionCategory; label: string; icon: string; desc: string }[] = [
    { id: 'group', label: 'سيشنات جماعية', icon: 'fa-users', desc: 'مجموعات دعم (11 فرد) بلهجة مصرية' },
    { id: 'siphon', label: 'سيفون (1-1)', icon: 'fa-comment-medical', desc: 'دردشة خاصة ومجهولة تماماً' },
    { id: 'challenges', label: 'تحديات فردية', icon: 'fa-mountain-sun', desc: 'مهام نفسية ترفع الـ XP بتاعك' },
    { id: 'fun', label: 'رومات ترفيه', icon: 'fa-face-smile', desc: 'فك عن نفسك مع 200 واحد' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tab Switcher */}
      <div className="bg-white dark:bg-slate-800 p-2 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 flex gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`min-w-[80px] flex-1 flex flex-col items-center py-4 rounded-[1.5rem] transition-all relative overflow-hidden shrink-0 ${
              activeTab === tab.id 
                ? 'bg-teal-500 text-white shadow-xl shadow-teal-500/20' 
                : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-lg mb-1`}></i>
            <span className="text-[10px] font-bold whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center px-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
            {tabs.find(t => t.id === activeTab)?.desc}
          </p>
        </div>
        
        {activeTab === 'group' && (
          <button 
            onClick={() => props.user.isQualified ? setShowCreateForm(true) : setShowTest(true)}
            className="bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 border border-teal-100 dark:border-teal-800 hover:bg-teal-500 hover:text-white transition-all shadow-sm"
          >
            <i className="fa-solid fa-plus-circle"></i>
            افتح سيشن جديدة
          </button>
        )}
      </div>

      {/* Test Modal */}
      {showTest && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/30 text-teal-500 dark:text-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">اختبار التأهيل</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">عشان تفتح سيشن بنفسك، لازم نتأكد إنك هتحافظ على أمان المكان.</p>
            </div>
            
            <div className="space-y-6">
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                {testQuestions[testStep].q}
              </div>
              <div className="space-y-3">
                {testQuestions[testStep].options.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleTestAnswer(i)}
                    className="w-full p-4 text-right text-xs font-bold border border-slate-100 dark:border-slate-700 rounded-2xl hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:border-teal-200 transition-all text-slate-600 dark:text-slate-400"
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowTest(false)} className="w-full text-center text-xs text-slate-400 font-bold py-2">مش دلوقتي</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Session Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 text-right">بيانات السيشن الجديدة</h3>
            <div className="space-y-4">
              <input type="text" placeholder="اسم السيشن (مثلاً: فضفضة نص الليل)" className="w-full p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none focus:ring-2 focus:ring-teal-500 text-sm font-bold text-slate-800 dark:text-white" />
              <textarea placeholder="وصف السيشن.. هنتكلم في إيه؟" className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium resize-none text-slate-800 dark:text-white"></textarea>
              <div className="flex gap-2">
                <button onClick={() => setShowCreateForm(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-2xl font-bold">إلغاء</button>
                <button 
                  onClick={() => {
                    props.addNotification("تم إنشاء السيشن بنجاح! الناس هتبدأ تدخل دلوقتي.", "success");
                    setShowCreateForm(false);
                    props.gainXP(100);
                  }}
                  className="flex-1 py-4 bg-teal-500 text-white rounded-2xl font-bold shadow-lg shadow-teal-500/20"
                >
                  يلا بينا
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Content */}
      <div className="min-h-[400px]">
        {activeTab === 'group' && (
          <GroupSessions 
            isPenaltyActive={props.isPenaltyActive} 
            onWithdraw={props.onWithdraw} 
            gainXP={props.gainXP} 
          />
        )}
        {activeTab === 'siphon' && (
          <SiphonRoom 
            addNotification={props.addNotification} 
            gainXP={props.gainXP} 
          />
        )}
        {activeTab === 'challenges' && (
          <IndividualChallenges 
            user={props.user}
            gainXP={props.gainXP} 
            addNotification={props.addNotification} 
          />
        )}
        {activeTab === 'fun' && (
          <FunRooms />
        )}
      </div>
    </div>
  );
};

export default SessionsHub;
