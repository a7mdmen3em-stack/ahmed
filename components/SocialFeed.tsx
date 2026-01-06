
import React, { useState } from 'react';
import { Post, UserProfile } from '../types';
import { translations } from '../translations';

interface SocialFeedProps {
  user: UserProfile;
  gainXP: (amount: number) => void;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ user, gainXP, posts, setPosts }) => {
  const t = translations[user.language];
  const [newPostContent, setNewPostContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{url: string, type: 'image' | 'video'} | null>(null);
  
  // Repost states
  const [repostMenuPost, setRepostMenuPost] = useState<Post | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteComment, setQuoteComment] = useState('');

  const handleCreatePost = () => {
    if (!newPostContent.trim() && !selectedMedia) return;

    const newPost: Post = {
      id: Date.now().toString(),
      authorId: user.id,
      authorName: user.pseudonym,
      authorAvatar: user.avatar,
      content: newPostContent,
      mediaUrl: selectedMedia?.url,
      mediaType: selectedMedia?.type,
      likes: 0,
      comments: 0,
      timestamp: new Date(),
      isAnonymous: true
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setSelectedMedia(null);
    setIsCreating(false);
    gainXP(15);
  };

  const handleQuickRepost = (post: Post) => {
    const newRepost: Post = {
      id: `rp-${Date.now()}`,
      authorId: user.id,
      authorName: user.pseudonym,
      authorAvatar: user.avatar,
      content: "",
      likes: 0,
      comments: 0,
      timestamp: new Date(),
      isAnonymous: true,
      isRepost: true,
      parentPost: post
    };

    setPosts([newRepost, ...posts]);
    setRepostMenuPost(null);
    gainXP(5);
  };

  const handleQuoteRepost = () => {
    if (!repostMenuPost || !quoteComment.trim()) return;

    const newQuote: Post = {
      id: `q-${Date.now()}`,
      authorId: user.id,
      authorName: user.pseudonym,
      authorAvatar: user.avatar,
      content: "",
      repostComment: quoteComment,
      likes: 0,
      comments: 0,
      timestamp: new Date(),
      isAnonymous: true,
      isRepost: true,
      parentPost: repostMenuPost
    };

    setPosts([newQuote, ...posts]);
    setRepostMenuPost(null);
    setIsQuoting(false);
    setQuoteComment('');
    gainXP(8);
  };

  const simulateUpload = (type: 'image' | 'video') => {
    const dummyUrl = type === 'image' 
      ? 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'
      : 'https://www.w3schools.com/html/mov_bbb.mp4';
    setSelectedMedia({ url: dummyUrl, type });
  };

  const renderPostContent = (post: Post, isNested = false) => {
    return (
      <div className={`${isNested ? 'bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800' : ''}`}>
        {isNested && (
           <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600">
                <i className={`fa-solid ${post.authorAvatar} text-[10px]`}></i>
              </div>
              <span className="text-[10px] font-bold text-slate-500">{post.authorName}</span>
           </div>
        )}
        <p className={`${isNested ? 'text-xs' : 'text-[15px]'} text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap`}>
          {post.content}
        </p>
        {post.mediaUrl && (
          <div className="mt-3">
            {post.mediaType === 'image' ? (
              <img src={post.mediaUrl} className={`w-full ${isNested ? 'h-32' : 'h-64'} object-cover rounded-[1.2rem]`} alt="media" />
            ) : (
              <video src={post.mediaUrl} className={`w-full ${isNested ? 'h-32' : 'h-64'} object-cover rounded-[1.2rem]`} controls />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-in fade-in duration-700">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">{t.forYou}</h2>
        <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm">
          <i className="fa-solid fa-sliders"></i>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 group cursor-pointer hover:border-teal-200 transition-all" onClick={() => setIsCreating(true)}>
        <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-100 transition-transform group-hover:scale-105">
          {user.profilePic ? (
             <img src={user.profilePic} className="w-full h-full object-cover rounded-2xl" alt="p" />
          ) : (
            <i className={`fa-solid ${user.avatar} text-xl`}></i>
          )}
        </div>
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-bold">{t.whatDoYouFeel}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400">
          <i className="fa-solid fa-feather-pointed"></i>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map(post => (
          <article key={post.id} className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-all hover:shadow-md">
            {post.isRepost && (
               <div className="px-5 pt-4 flex items-center gap-2 text-[10px] font-bold text-teal-600 dark:text-teal-400">
                  <i className="fa-solid fa-retweet"></i>
                  <span>{t.repostedBy} {post.authorName}</span>
               </div>
            )}
            
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-700">
                  <i className={`fa-solid ${post.authorAvatar} text-lg`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">{post.authorName}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {post.timestamp instanceof Date ? post.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : t.hoursAgo}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 pb-4 space-y-4">
              {post.repostComment && (
                <p className="text-slate-800 dark:text-white font-bold text-sm leading-relaxed mb-4">
                   {post.repostComment}
                </p>
              )}
              
              {!post.isRepost ? renderPostContent(post) : (
                post.parentPost && renderPostContent(post.parentPost, true)
              )}
            </div>

            <div className="px-5 py-4 border-t border-slate-50 dark:border-slate-700 flex items-center gap-6">
               <button className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors">
                  <i className="fa-regular fa-heart"></i>
                  <span className="text-[10px] font-bold">{post.likes}</span>
               </button>
               <button 
                  onClick={() => setRepostMenuPost(post)}
                  className="flex items-center gap-2 text-slate-400 hover:text-teal-500 transition-colors"
               >
                  <i className="fa-solid fa-retweet"></i>
                  <span className="text-[10px] font-bold">{t.repost}</span>
               </button>
               <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors">
                  <i className="fa-regular fa-comment"></i>
                  <span className="text-[10px] font-bold">{post.comments}</span>
               </button>
            </div>
          </article>
        ))}
      </div>

      {/* Repost Options Menu */}
      {repostMenuPost && !isQuoting && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-800 w-full max-w-xs rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
              <div className="p-4 border-b dark:border-slate-700 text-center font-bold text-slate-800 dark:text-white">
                 {t.repost}
              </div>
              <button 
                onClick={() => handleQuickRepost(repostMenuPost)}
                className="w-full p-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border-b dark:border-slate-700"
              >
                 <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center">
                   <i className="fa-solid fa-retweet"></i>
                 </div>
                 <span className="font-bold text-sm">{t.quickRepost}</span>
              </button>
              <button 
                onClick={() => setIsQuoting(true)}
                className="w-full p-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                 <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                   <i className="fa-solid fa-quote-right"></i>
                 </div>
                 <span className="font-bold text-sm">{t.quotePost}</span>
              </button>
              <button 
                onClick={() => setRepostMenuPost(null)}
                className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 text-slate-400 text-xs font-bold"
              >
                {translations[user.language].cancel}
              </button>
           </div>
        </div>
      )}

      {/* Quote Repost Editor */}
      {isQuoting && repostMenuPost && (
         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[120] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
               <div className="p-6 border-b dark:border-slate-700 flex items-center justify-between">
                  <h3 className="font-black text-slate-800 dark:text-white">{t.quotePost}</h3>
                  <button onClick={() => {setIsQuoting(false); setRepostMenuPost(null);}} className="text-slate-400"><i className="fa-solid fa-xmark text-xl"></i></button>
               </div>
               <div className="p-6 space-y-6">
                  <textarea 
                    autoFocus
                    value={quoteComment}
                    onChange={(e) => setQuoteComment(e.target.value)}
                    placeholder={t.quotePlaceholder}
                    className="w-full h-32 resize-none bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl outline-none text-slate-700 dark:text-slate-200"
                  ></textarea>
                  
                  <div className="p-4 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl opacity-60">
                     <p className="text-xs text-slate-500 line-clamp-2">{repostMenuPost.content || (translations[user.language].image)}</p>
                  </div>

                  <button 
                    onClick={handleQuoteRepost}
                    className="w-full py-4 bg-teal-500 text-white rounded-2xl font-black shadow-lg"
                  >
                    {t.postNow}
                  </button>
               </div>
            </div>
         </div>
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 duration-500">
            <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between bg-teal-50/30 dark:bg-teal-900/10">
              <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-3">
                <i className="fa-solid fa-feather-pointed text-teal-600"></i>
                {t.newAnonymousPost}
              </h3>
              <button onClick={() => setIsCreating(false)} className="w-10 h-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 border border-slate-100 dark:border-slate-600 shadow-sm">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <textarea 
                autoFocus
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={t.postPlaceholder}
                className="w-full h-48 resize-none bg-slate-50 dark:bg-slate-700/50 p-5 rounded-[2rem] outline-none focus:ring-4 focus:ring-teal-500/10 transition-all text-slate-700 dark:text-slate-200 font-medium"
              ></textarea>
              
              {selectedMedia && (
                <div className="relative rounded-2xl overflow-hidden h-32 bg-slate-100 dark:bg-slate-900">
                   {selectedMedia.type === 'image' ? (
                     <img src={selectedMedia.url} className="w-full h-full object-cover" alt="prev" />
                   ) : (
                     <div className="flex items-center justify-center h-full"><i className="fa-solid fa-video text-2xl"></i></div>
                   )}
                   <button onClick={() => setSelectedMedia(null)} className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full"><i className="fa-solid fa-xmark"></i></button>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => simulateUpload('image')} className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 transition-all font-bold">
                  <i className="fa-solid fa-image"></i>
                  <span>{t.image}</span>
                </button>
                <button onClick={() => simulateUpload('video')} className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800 transition-all font-bold">
                  <i className="fa-solid fa-video"></i>
                  <span>{t.video}</span>
                </button>
              </div>
              <button onClick={handleCreatePost} className="w-full py-5 bg-teal-500 text-white rounded-[1.5rem] font-black shadow-xl shadow-teal-100 hover:bg-teal-600 transition-all">
                {t.postNow}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
