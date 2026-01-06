
import React, { useState, useMemo } from 'react';
import { UserProfile, Post } from '../types';
import { translations } from '../translations';
import { generateAIImage } from '../services/geminiService';

interface ProfileProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  gainXP: (amount: number) => void;
  posts: Post[];
}

const Profile: React.FC<ProfileProps> = ({ user, setUser, gainXP, posts }) => {
  const t = translations[user.language];
  const [isEditing, setIsEditing] = useState(false);
  const [studioMode, setStudioMode] = useState<'none' | 'avatar' | 'cover'>('none');
  const [avatarTab, setAvatarTab] = useState<'presets' | 'ai'>('presets');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMood, setAiMood] = useState('Calm');
  const [aiColor, setAiColor] = useState('Teal');
  const [customDescription, setCustomDescription] = useState('');
  
  const [editData, setEditData] = useState({
    pseudonym: user.pseudonym,
    avatar: user.avatar,
    profilePic: user.profilePic || '',
    coverPic: user.coverPic || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80',
  });

  // Filter posts to only show ones authored by this user
  const userPosts = useMemo(() => {
    return posts.filter(p => p.authorId === user.id);
  }, [posts, user.id]);

  const avatars = user.gender === 'female' ? [
    { icon: 'fa-person-dress', color: 'bg-pink-400' },
    { icon: 'fa-user-graduate', color: 'bg-indigo-400' },
    { icon: 'fa-user-doctor', color: 'bg-teal-400' },
    { icon: 'fa-user-nurse', color: 'bg-rose-400' },
    { icon: 'fa-user-astronaut', color: 'bg-slate-700' },
    { icon: 'fa-user-tie', color: 'bg-blue-500' },
    { icon: 'fa-user-secret', color: 'bg-zinc-800' },
    { icon: 'fa-child-reaching', color: 'bg-amber-400' }
  ] : [
    { icon: 'fa-person', color: 'bg-blue-400' },
    { icon: 'fa-user-graduate', color: 'bg-indigo-400' },
    { icon: 'fa-user-doctor', color: 'bg-teal-400' },
    { icon: 'fa-user-astronaut', color: 'bg-slate-700' },
    { icon: 'fa-user-tie', color: 'bg-blue-600' },
    { icon: 'fa-user-ninja', color: 'bg-slate-800' },
    { icon: 'fa-user-secret', color: 'bg-zinc-800' },
    { icon: 'fa-child-reaching', color: 'bg-amber-400' }
  ];

  const handleSave = () => {
    setUser(prev => ({ ...prev, ...editData }));
    setIsEditing(false);
    gainXP(15); 
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    const type = studioMode === 'cover' ? 'cover' : 'avatar';
    const prompt = customDescription.trim() || `Mood: ${aiMood}, Primary Color: ${aiColor}`;
    
    const result = await generateAIImage(prompt, type, user.gender);
    if (result) {
      if (type === 'cover') {
        setEditData(prev => ({ ...prev, coverPic: result }));
      } else {
        setEditData(prev => ({ ...prev, profilePic: result, avatar: 'fa-sparkles' }));
      }
    }
    setIsGenerating(false);
  };

  const selectPreset = (avatar: string) => {
    setEditData(prev => ({ ...prev, avatar, profilePic: '' }));
  };

  const renderPostContent = (post: Post, isNested = false) => {
    return (
      <div className={`${isNested ? 'bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800' : ''}`}>
        {isNested && (
           <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-bold text-slate-500">{post.authorName}</span>
           </div>
        )}
        <p className={`${isNested ? 'text-xs' : 'text-sm'} text-slate-700 dark:text-slate-300 leading-relaxed`}>
          {post.content}
        </p>
        {post.mediaUrl && (
          <div className="mt-2">
            <img src={post.mediaUrl} className={`w-full ${isNested ? 'h-24' : 'h-48'} object-cover rounded-xl`} alt="m" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden relative">
        <div className="h-48 bg-slate-200 dark:bg-slate-700 relative group overflow-hidden">
          <img src={editData.coverPic} className="w-full h-full object-cover" alt="cover" />
          {isEditing && (
            <button 
              onClick={() => setStudioMode('cover')}
              className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <i className="fa-solid fa-paintbrush text-2xl mb-2"></i>
              <span className="font-bold text-sm">{t.editCover}</span>
            </button>
          )}
        </div>

        <div className="px-8 pb-10 flex flex-col items-center relative">
          <div className="relative -mt-20 z-10">
            <button 
              onClick={() => isEditing && setStudioMode('avatar')}
              className={`w-36 h-36 bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-2xl overflow-hidden border-4 border-white dark:border-slate-800 transition-transform ${isEditing ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''}`}
            >
              <div className="w-full h-full bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center overflow-hidden relative group">
                {editData.profilePic ? (
                  <img src={editData.profilePic} className="w-full h-full object-cover" alt="avatar" />
                ) : (
                  <i className={`fa-solid ${editData.avatar} text-6xl text-teal-500`}></i>
                )}
                {isEditing && (
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <i className="fa-solid fa-camera text-white text-2xl"></i>
                   </div>
                )}
              </div>
            </button>
          </div>

          <div className="mt-6 text-center w-full max-w-xl">
            {isEditing ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 block text-start px-4">{t.pseudonym}</label>
                  <input 
                    type="text" 
                    value={editData.pseudonym} 
                    onChange={(e) => setEditData(prev => ({ ...prev, pseudonym: e.target.value }))} 
                    className="w-full text-center text-2xl font-black text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-700 py-3 outline-none rounded-2xl border-2 border-transparent focus:border-teal-500 transition-all" 
                  />
                </div>
                <div className="flex gap-4">
                   <button onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold">{t.cancel}</button>
                   <button onClick={handleSave} className="flex-1 py-4 bg-teal-500 text-white rounded-2xl font-bold">{t.saveChanges}</button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white">{user.pseudonym}</h2>
                  <i className={`fa-solid ${user.gender === 'male' ? 'fa-mars text-blue-500' : 'fa-venus text-pink-500'} text-xl`}></i>
                </div>
                <p className="text-teal-600 dark:text-teal-400 font-bold">{user.rankTitle}</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="mt-4 px-6 py-2.5 bg-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-100 hover:bg-teal-600 transition-all active:scale-95"
                >
                  <i className="fa-solid fa-user-pen mr-2"></i> {t.editProfile}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
           <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">{t.stats}</h3>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-3xl text-center border border-slate-100 dark:border-slate-600">
                 <p className="text-[10px] font-bold text-slate-400 mb-1">{t.gender}</p>
                 <p className="text-xl font-black text-teal-600">{user.gender === 'male' ? t.male : t.female}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-3xl text-center border border-slate-100 dark:border-slate-600">
                 <p className="text-[10px] font-bold text-slate-400 mb-1">{t.totalXP}</p>
                 <p className="text-xl font-black text-teal-600">{user.xp}</p>
              </div>
           </div>
        </section>

        <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
           <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">{t.levelProgress}</h3>
           <div className="relative h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
             <div className="h-full bg-teal-500 transition-all duration-1000" style={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}></div>
           </div>
           <p className="text-xs text-center text-slate-400 font-bold italic mt-4">"{t.stepQuote}"</p>
        </section>
      </div>

      {/* My Posts Section in Profile */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-slate-800 dark:text-white px-4 flex items-center gap-3">
          <i className="fa-solid fa-rss text-teal-500"></i>
          {user.language === 'ar' ? 'منشوراتي' : 'My Posts'}
        </h3>
        
        {userPosts.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-12 rounded-[2.5rem] text-center border border-dashed border-slate-200 dark:border-slate-700">
            <i className="fa-solid fa-feather text-4xl text-slate-200 mb-4"></i>
            <p className="text-slate-400 font-bold">{user.language === 'ar' ? 'لسه مفيش منشورات.. فضفض دلوقتي!' : 'No posts yet.. start sharing!'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {userPosts.map(post => (
              <article key={post.id} className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-all">
                {post.isRepost && (
                   <div className="px-5 pt-3 flex items-center gap-2 text-[8px] font-bold text-teal-600">
                      <i className="fa-solid fa-retweet"></i>
                      <span>{t.repostedBy} {user.pseudonym}</span>
                   </div>
                )}
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600">
                      <i className={`fa-solid ${post.authorAvatar} text-sm`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-xs">{post.authorName}</h4>
                      <p className="text-[9px] text-slate-400">{post.timestamp instanceof Date ? post.timestamp.toLocaleDateString() : ''}</p>
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-5 space-y-3">
                  {post.repostComment && (
                    <p className="text-slate-800 dark:text-white font-bold text-xs">{post.repostComment}</p>
                  )}
                  {!post.isRepost ? renderPostContent(post) : (
                    post.parentPost && renderPostContent(post.parentPost, true)
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {studioMode !== 'none' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-teal-50/30 dark:bg-teal-900/10">
               <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                 <i className={`fa-solid ${studioMode === 'cover' ? 'fa-image' : 'fa-palette'} text-teal-500`}></i>
                 {studioMode === 'cover' ? t.coverStudio : t.avatarStudio}
               </h3>
               <button onClick={() => setStudioMode('none')} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                 <i className="fa-solid fa-xmark text-xl"></i>
               </button>
            </div>

            {studioMode === 'avatar' && (
              <div className="flex p-4 gap-2 bg-slate-50 dark:bg-slate-900/50">
                <button 
                  onClick={() => setAvatarTab('presets')}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${avatarTab === 'presets' ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-sm border border-teal-50' : 'text-slate-400'}`}
                >
                  {t.presets}
                </button>
                <button 
                  onClick={() => setAvatarTab('ai')}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${avatarTab === 'ai' ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-sm border border-teal-50' : 'text-slate-400'}`}
                >
                  {t.aiCreator} ✨
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6">
               {(studioMode === 'avatar' && avatarTab === 'presets') ? (
                 <div className="grid grid-cols-4 gap-4">
                   {avatars.map((av, idx) => (
                     <button 
                       key={idx}
                       onClick={() => selectPreset(av.icon)}
                       className={`aspect-square rounded-3xl flex items-center justify-center text-2xl text-white transition-all hover:scale-105 active:scale-95 ${av.color} ${editData.avatar === av.icon && !editData.profilePic ? 'ring-4 ring-teal-500 ring-offset-4 dark:ring-offset-slate-800' : 'opacity-80'}`}
                     >
                       <i className={`fa-solid ${av.icon}`}></i>
                     </button>
                   ))}
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                       {isGenerating ? (
                         <div className="space-y-4">
                            <div className="w-24 h-24 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                               <i className="fa-solid fa-wand-magic-sparkles text-3xl text-teal-500"></i>
                            </div>
                            <p className="text-sm font-bold text-teal-600">{t.generatingAvatar}</p>
                         </div>
                       ) : (studioMode === 'cover' ? editData.coverPic : editData.profilePic) ? (
                         <div className="space-y-4">
                            <img 
                              src={studioMode === 'cover' ? editData.coverPic : editData.profilePic} 
                              className={`mx-auto shadow-xl border-4 border-white ${studioMode === 'cover' ? 'w-full aspect-video rounded-2xl' : 'w-32 h-32 rounded-full'}`} 
                              alt="AI result" 
                            />
                            <p className="text-xs text-slate-400 font-bold">✨ مظهر جديد بالذكاء الاصطناعي</p>
                         </div>
                       ) : (
                         <div className="space-y-2">
                            <i className={`fa-solid ${studioMode === 'cover' ? 'fa-mountain-sun' : 'fa-user-tie'} text-4xl text-slate-300`}></i>
                            <p className="text-sm text-slate-400 font-bold">{t.chooseYourVibe}</p>
                         </div>
                       )}
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.describeYourImage}</label>
                        <textarea
                          value={customDescription}
                          onChange={(e) => setCustomDescription(e.target.value)}
                          className="w-full p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl outline-none text-sm font-bold border border-slate-100 dark:border-slate-600 resize-none h-24"
                          placeholder={t.describePlaceholder}
                        ></textarea>
                      </div>

                      {(!customDescription || customDescription.length < 5) && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.pickMood}</label>
                              <select 
                                value={aiMood}
                                onChange={(e) => setAiMood(e.target.value)}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none text-sm font-bold border border-slate-100 dark:border-slate-600"
                              >
                                <option value="Calm">{t.moodCalm}</option>
                                <option value="Strong">{t.moodStrong}</option>
                                <option value="Mysterious">{t.moodMysterious}</option>
                                <option value="Happy">{t.moodHappy}</option>
                              </select>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.pickColor}</label>
                              <select 
                                value={aiColor}
                                onChange={(e) => setAiColor(e.target.value)}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none text-sm font-bold border border-slate-100 dark:border-slate-600"
                              >
                                <option value="Teal">{t.colorTeal}</option>
                                <option value="Purple">{t.colorPurple}</option>
                                <option value="Blue">{t.colorBlue}</option>
                                <option value="Rose">{t.colorRose}</option>
                              </select>
                          </div>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={handleGenerateAI}
                      disabled={isGenerating}
                      className="w-full py-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-teal-100 hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isGenerating ? t.generatingAvatar : t.generateNew}
                    </button>
                 </div>
               )}
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
               <button 
                 onClick={() => setStudioMode('none')}
                 className="w-full py-4 bg-teal-500 text-white rounded-2xl font-black shadow-lg hover:bg-teal-600 transition-all active:scale-95"
               >
                 {t.saveAvatar}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
