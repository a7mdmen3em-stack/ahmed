
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  gainXP: (amount: number) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser, gainXP }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    pseudonym: user.pseudonym,
    avatar: user.avatar,
    profilePic: user.profilePic || '',
    coverPic: user.coverPic || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80',
  });

  const avatars = ['fa-user-ninja', 'fa-ghost', 'fa-robot', 'fa-user-astronaut', 'fa-cat', 'fa-dragon'];

  const handleSave = () => {
    setUser(prev => ({ 
      ...prev, 
      pseudonym: editData.pseudonym, 
      avatar: editData.avatar, 
      profilePic: editData.profilePic, 
      coverPic: editData.coverPic
    }));
    setIsEditing(false);
    gainXP(15); 
  };

  const simulateUpload = (target: 'profilePic' | 'coverPic') => {
    const dummyImages = {
      profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      coverPic: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80'
    };
    setEditData(prev => ({ ...prev, [target]: dummyImages[target] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden relative">
        {/* Cover Photo */}
        <div className="h-48 md:h-64 bg-slate-200 dark:bg-slate-700 relative group">
          <img src={editData.coverPic} className="w-full h-full object-cover" alt="cover" />
          {isEditing && (
            <button 
              onClick={() => simulateUpload('coverPic')}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
            >
              <i className="fa-solid fa-camera text-3xl mb-2"></i>
              <span className="text-xs font-bold">تغيير الغلاف</span>
            </button>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-10 flex flex-col items-center relative">
          <div className="relative -mt-20 md:-mt-24 z-10">
            <div className="w-36 h-36 md:w-44 md:h-44 bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-2xl overflow-hidden border-4 border-white dark:border-slate-800">
              {editData.profilePic ? (
                <img src={editData.profilePic} className="w-full h-full object-cover rounded-full" alt="profile" />
              ) : (
                <div className="w-full h-full bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-6xl text-teal-500">
                  <i className={`fa-solid ${editData.avatar}`}></i>
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <button onClick={() => simulateUpload('profilePic')} className="w-full h-1/2 bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                    <i className="fa-solid fa-camera"></i>
                  </button>
                  <button onClick={() => setEditData(prev => ({...prev, profilePic: ''}))} className="w-full h-1/2 bg-red-500/50 text-white flex items-center justify-center hover:bg-red-500/70">
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center w-full max-w-xl">
            {isEditing ? (
              <div className="space-y-6 animate-in zoom-in duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 block text-right px-2">الاسم المستعار</label>
                  <input 
                    type="text" 
                    value={editData.pseudonym} 
                    onChange={(e) => setEditData(prev => ({ ...prev, pseudonym: e.target.value }))} 
                    className="w-full text-center text-2xl font-black text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-700/50 border-2 border-transparent focus:border-teal-500 py-3 outline-none rounded-2xl" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 block text-right px-2">اختر أيقونتك</label>
                  <div className="flex flex-wrap justify-center gap-3 bg-slate-50 dark:bg-slate-700/30 p-4 rounded-2xl">
                    {avatars.map(icon => (
                      <button
                        key={icon}
                        onClick={() => setEditData(prev => ({ ...prev, avatar: icon }))}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${editData.avatar === icon ? 'bg-teal-500 text-white scale-110 shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400'}`}
                      >
                        <i className={`fa-solid ${icon}`}></i>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                   <button onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold">إلغاء</button>
                   <button onClick={handleSave} className="flex-1 py-4 bg-teal-500 text-white rounded-2xl font-bold shadow-lg shadow-teal-500/20">حفظ التغييرات</button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-800 dark:text-white">{user.pseudonym}</h2>
                <div className="flex items-center justify-center gap-3">
                   <span className="px-4 py-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-xs font-black border border-teal-100 dark:border-teal-800">
                     {user.rankTitle}
                   </span>
                   <span className="text-slate-400 text-[10px] font-bold">ID: #{user.id}</span>
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="mt-4 px-6 py-2.5 bg-teal-500 text-white rounded-xl text-xs font-bold hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 mx-auto"
                >
                  <i className="fa-solid fa-user-pen"></i>
                  تعديل الملف الشخصي
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-800 dark:text-white">إحصائياتي</h3>
              <i className="fa-solid fa-chart-line text-teal-500"></i>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-3xl text-center">
                 <p className="text-[10px] font-bold text-slate-400 mb-1">XP كلي</p>
                 <p className="text-xl font-black text-teal-600 dark:text-teal-400">{user.xp + (user.level-1)*500}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-3xl text-center">
                 <p className="text-[10px] font-bold text-slate-400 mb-1">جلسات مكتملة</p>
                 <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">12</p>
              </div>
           </div>
        </section>

        <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-black text-slate-800 dark:text-white">تقدم المستوى</h3>
             <span className="text-xs font-black text-teal-500 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full">LEVEL {user.level}</span>
           </div>
           <div className="space-y-6">
             <div className="relative h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600">
               <div 
                 className="h-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-1000"
                 style={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
               ></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-black text-slate-600 dark:text-slate-200">
                    {user.xp} / {user.xpToNextLevel} XP
                  </span>
               </div>
             </div>
             <p className="text-xs text-center text-slate-400 font-bold italic">"كل خطوة بتعديها بتخليك أقوى."</p>
           </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
