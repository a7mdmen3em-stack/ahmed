
import React, { useState } from 'react';
import { UserProfile, AppNotification } from '../types';
import { translations } from '../translations';

interface SettingsProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  addNotification: (message: string, type: AppNotification['type']) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, setUser, isDarkMode, toggleDarkMode, addNotification }) => {
  const t = translations[user.language];
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');

  const toggleLanguage = () => {
    const nextLang = user.language === 'ar' ? 'en' : 'ar';
    setUser(prev => ({ ...prev, language: nextLang }));
    addNotification(nextLang === 'ar' ? "تم تحويل اللغة للعربية" : "Language switched to English", "success");
  };

  const handleSetPin = () => {
    if (newPin.length < 4) {
      addNotification(user.language === 'ar' ? "الرمز يجب أن يكون 4 أرقام على الأقل" : "PIN must be at least 4 digits", "warning");
      return;
    }
    setUser(prev => ({ ...prev, pinCode: newPin, isLocked: true }));
    setShowPinModal(false);
    setNewPin('');
    addNotification(t.pinSuccess, "success");
  };

  const toggleAppLock = () => {
    if (user.isLocked) {
      setUser(prev => ({ ...prev, isLocked: false }));
      addNotification(user.language === 'ar' ? "تم إلغاء قفل التطبيق" : "App lock disabled", "info");
    } else {
      setShowPinModal(true);
    }
  };

  const clearAllData = () => {
    if (window.confirm("هل أنت متأكد؟ هذا الخيار سيمسح كل يومياتك ورسائلك من الجهاز فوراً ولا يمكن التراجع عنه.")) {
      localStorage.clear();
      addNotification("تم مسح كافة البيانات بنجاح. أمانك هو أولويتنا.", "warning");
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const settingsGroups = [
    {
      title: t.general,
      items: [
        {
          id: 'lang',
          label: t.appLanguage,
          value: user.language === 'ar' ? "العربية (مصر)" : "English",
          icon: "fa-language",
          action: toggleLanguage,
          color: "text-blue-500 bg-blue-50 dark:bg-blue-900/30"
        },
        {
          id: 'theme',
          label: t.darkMode,
          value: isDarkMode ? t.on : t.off,
          icon: isDarkMode ? "fa-moon" : "fa-sun",
          action: toggleDarkMode,
          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/30",
          isToggle: true,
          toggleState: isDarkMode
        }
      ]
    },
    {
      title: t.securityPrivacy,
      items: [
        {
          id: 'lock',
          label: t.appLock,
          value: user.isLocked ? t.active : t.inactive,
          icon: "fa-shield-halved",
          action: toggleAppLock,
          color: "text-teal-500 bg-teal-50 dark:bg-teal-900/30",
          isToggle: true,
          toggleState: user.isLocked
        },
        {
          id: 'clear',
          label: t.clearData,
          value: "",
          icon: "fa-fire-extinguisher",
          action: clearAllData,
          color: "text-rose-500 bg-rose-50 dark:bg-rose-900/30",
          isDanger: true
        }
      ]
    }
  ];

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
         <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/30 text-teal-500 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
           <i className="fa-solid fa-gear"></i>
         </div>
         <h2 className="text-3xl font-black text-slate-800 dark:text-white">{t.settings}</h2>
         <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
           {user.language === 'ar' ? "تحكم في مساحتك الخاصة وأمانك" : "Control your private space and security"}
         </p>
      </div>

      <div className="space-y-8">
        {settingsGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-3">
            <h3 className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
              {group.title}
            </h3>
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
              {group.items.map((item, iIdx) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all ${iIdx !== group.items.length - 1 ? 'border-b border-slate-50 dark:border-slate-700' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.color}`}>
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <span className={`text-sm font-bold ${item.isDanger ? 'text-rose-500' : 'text-slate-700 dark:text-slate-200'}`}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.value && (
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{item.value}</span>
                    )}
                    {item.isToggle ? (
                      <div className={`w-12 h-6 rounded-full relative transition-colors ${item.toggleState ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-600'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${user.language === 'ar' ? (item.toggleState ? 'right-7' : 'right-1') : (item.toggleState ? 'left-7' : 'left-1')}`}></div>
                      </div>
                    ) : (
                      <i className={`fa-solid ${user.language === 'ar' ? 'fa-chevron-left' : 'fa-chevron-right'} text-[10px] text-slate-300`}></i>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showPinModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-black text-slate-800 dark:text-white text-center mb-6">{t.setPinTitle}</h3>
            <input 
              type="text" 
              inputMode="numeric"
              maxLength={6}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              placeholder="Ex: 1234"
              className="w-full text-center text-3xl tracking-[0.5em] py-4 bg-slate-50 dark:bg-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 mb-6 text-slate-800 dark:text-white"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowPinModal(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-2xl font-bold">{t.cancel}</button>
              <button onClick={handleSetPin} className="flex-1 py-4 bg-teal-500 text-white rounded-2xl font-bold">{t.confirmPin}</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 text-center space-y-2">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Safe Space v2.5.0</p>
        <p className="text-[9px] text-slate-300 dark:text-slate-600 font-medium px-10">
          {t.privacyNotice}
        </p>
      </div>
    </div>
  );
};

export default Settings;
