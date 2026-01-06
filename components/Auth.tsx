
import React, { useState } from 'react';
import { UserProfile, AppNotification } from '../types';
import { translations } from '../translations';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
  addNotification: (message: string, type: AppNotification['type']) => void;
  language: 'ar' | 'en';
}

const Auth: React.FC<AuthProps> = ({ onLogin, addNotification, language }) => {
  const t = translations[language];
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    pseudonym: '',
    gender: 'male' as 'male' | 'female'
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('ss_users') || '[]');

    if (isLoginMode) {
      const user = users.find((u: any) => u.username === formData.username && u.password === formData.password);
      if (user) {
        onLogin({
          ...user,
          isLoggedIn: true
        });
        addNotification(t.welcomeBack, 'success');
      } else {
        addNotification(t.authError, 'error');
      }
    } else {
      if (!formData.username || !formData.password || !formData.pseudonym) {
        addNotification(language === 'ar' ? 'برجاء ملء كافة البيانات' : 'Please fill all fields', 'warning');
        return;
      }
      
      const exists = users.find((u: any) => u.username === formData.username);
      if (exists) {
        addNotification(language === 'ar' ? 'اسم المستخدم موجود بالفعل' : 'Username already exists', 'error');
        return;
      }

      const newUser: UserProfile & { password?: string } = {
        id: Math.random().toString(36).substr(2, 9),
        username: formData.username,
        pseudonym: formData.pseudonym,
        password: formData.password,
        gender: formData.gender,
        avatar: formData.gender === 'male' ? 'fa-person' : 'fa-person-dress',
        moods: [],
        preferences: 'both',
        privacy: 'only-me',
        level: 1,
        xp: 0,
        xpToNextLevel: 500,
        rankTitle: language === 'ar' ? 'باحث عن السلام' : 'Peace Seeker',
        isQualified: false,
        language: language,
        isLocked: false,
        isLoggedIn: true
      };

      users.push(newUser);
      localStorage.setItem('ss_users', JSON.stringify(users));
      
      const { password, ...userWithoutPassword } = newUser;
      onLogin(userWithoutPassword as UserProfile);
      addNotification(language === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-teal-600 flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-teal-600"></div>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg shadow-teal-100">
            <i className="fa-solid fa-hand-holding-heart"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">{isLoginMode ? t.login : t.signup}</h2>
          <p className="text-slate-400 text-sm mt-2">{isLoginMode ? t.welcomeBack : t.startJourney}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase px-4">{t.username}</label>
            <div className="relative">
              <i className="fa-solid fa-user absolute top-1/2 -translate-y-1/2 left-5 text-slate-300"></i>
              <input 
                type="text" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-700/50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none transition-all text-slate-700 dark:text-slate-200"
                placeholder="Ex: ahmed_99"
              />
            </div>
          </div>

          {!isLoginMode && (
            <>
              <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                <label className="text-[10px] font-black text-slate-400 uppercase px-4">{t.pseudonymLabel}</label>
                <div className="relative">
                  <i className="fa-solid fa-mask absolute top-1/2 -translate-y-1/2 left-5 text-slate-300"></i>
                  <input 
                    type="text" 
                    value={formData.pseudonym}
                    onChange={(e) => setFormData({...formData, pseudonym: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-700/50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none transition-all text-slate-700 dark:text-slate-200"
                    placeholder="Ex: Spirit_of_Calm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase px-4">{t.gender}</label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, gender: 'male'})}
                    className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${formData.gender === 'male' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-slate-50 border-transparent text-slate-400'}`}
                  >
                    <i className="fa-solid fa-mars"></i> {t.male}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, gender: 'female'})}
                    className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${formData.gender === 'female' ? 'bg-pink-50 border-pink-500 text-pink-600' : 'bg-slate-50 border-transparent text-slate-400'}`}
                  >
                    <i className="fa-solid fa-venus"></i> {t.female}
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase px-4">{t.password}</label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute top-1/2 -translate-y-1/2 left-5 text-slate-300"></i>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-700/50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none transition-all text-slate-700 dark:text-slate-200"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-teal-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-teal-100 hover:bg-teal-600 transition-all active:scale-95 mt-4">
            {isLoginMode ? t.enter : t.signup}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            {isLoginMode ? t.dontHaveAccount : t.alreadyHaveAccount}{' '}
            <button 
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-teal-600 font-bold hover:underline"
            >
              {isLoginMode ? t.signup : t.login}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
