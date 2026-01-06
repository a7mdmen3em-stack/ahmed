
import React, { useState } from 'react';
import { Post, UserProfile } from '../types';

interface SocialFeedProps {
  user: UserProfile;
  gainXP: (amount: number) => void;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ user, gainXP }) => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'p1',
      authorId: 'u2',
      authorName: 'روح_حرة',
      authorAvatar: 'fa-ghost',
      content: 'أحياناً الصمت يكون أبلغ من الكلام، لكن هنا شعرت أن كلماتي لها صدى.. ممتنة لهذا المكان.',
      likes: 42,
      comments: 8,
      timestamp: new Date(Date.now() - 3600000),
      isAnonymous: true
    },
    {
      id: 'p2',
      authorId: 'u3',
      authorName: 'مفكر_هادئ',
      authorAvatar: 'fa-robot',
      content: 'تذكر دائماً أن صحتك النفسية ليست رفاهية، بل هي الأساس الذي تبني عليه حياتك. خذ استراحة إذا احتجت.',
      mediaUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      likes: 189,
      comments: 15,
      timestamp: new Date(Date.now() - 7200000),
      isAnonymous: false
    }
  ]);

  const [newPostContent, setNewPostContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{url: string, type: 'image' | 'video'} | null>(null);

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

  const simulateUpload = (type: 'image' | 'video') => {
    const dummyUrl = type === 'image' 
      ? 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'
      : 'https://www.w3schools.com/html/mov_bbb.mp4';
    setSelectedMedia({ url: dummyUrl, type });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Home Header */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black text-slate-800">لأجلك (For You)</h2>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
          <i className="fa-solid fa-sliders"></i>
        </div>
      </div>

      {/* Quick Post Box */}
      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 group cursor-pointer hover:border-teal-200 transition-all" onClick={() => setIsCreating(true)}>
        <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-100 transition-transform group-hover:scale-105">
          <i className={`fa-solid ${user.avatar} text-xl`}></i>
        </div>
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-bold">بماذا تشعر الآن؟ فضفض هنا بمجهولية...</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
          <i className="fa-solid fa-feather-pointed"></i>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map(post => (
          <article key={post.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                  <i className={`fa-solid ${post.authorAvatar} text-lg`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{post.authorName}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">منذ بضع ساعات</p>
                </div>
              </div>
              <button className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-500 rounded-full hover:bg-slate-50">
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </button>
            </div>

            <div className="px-5 pb-4">
              <p className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            {post.mediaUrl && (
              <div className="mx-5 mb-5 rounded-3xl overflow-hidden bg-slate-200 relative aspect-video shadow-inner">
                {post.mediaType === 'image' ? (
                  <img src={post.mediaUrl} alt="Post content" className="w-full h-full object-cover" />
                ) : (
                  <video src={post.mediaUrl} controls className="w-full h-full object-cover" />
                )}
              </div>
            )}

            <div className="px-5 py-4 border-t border-slate-50 flex items-center justify-between text-slate-500">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 hover:text-rose-500 transition-colors group">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center group-hover:bg-rose-50 transition-all">
                    <i className="fa-regular fa-heart text-lg"></i>
                  </div>
                  <span className="text-xs font-black">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-all">
                    <i className="fa-regular fa-comment text-lg"></i>
                  </div>
                  <span className="text-xs font-black">{post.comments}</span>
                </button>
              </div>
              <button className="flex items-center gap-2 hover:text-teal-600 transition-colors group">
                 <div className="w-9 h-9 rounded-full flex items-center justify-center group-hover:bg-teal-50 transition-all">
                  <i className="fa-solid fa-share-nodes"></i>
                </div>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Create Post Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 duration-500">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-teal-50/30">
              <h3 className="font-black text-slate-800 flex items-center gap-3">
                <i className="fa-solid fa-feather-pointed text-teal-600"></i>
                منشور مجهول جديد
              </h3>
              <button onClick={() => setIsCreating(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 border border-slate-100 shadow-sm">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <textarea 
                autoFocus
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="تحدث عما في خاطرك.. لن يعرف أحد من أنت."
                className="w-full h-48 resize-none bg-slate-50 p-5 rounded-[2rem] outline-none focus:ring-4 focus:ring-teal-500/10 transition-all text-slate-700 font-medium"
              ></textarea>

              {selectedMedia && (
                <div className="relative rounded-3xl overflow-hidden border border-slate-100 group shadow-md">
                  {selectedMedia.type === 'image' ? (
                    <img src={selectedMedia.url} alt="selected" className="w-full h-56 object-cover" />
                  ) : (
                    <video src={selectedMedia.url} className="w-full h-56 object-cover" />
                  )}
                  <button 
                    onClick={() => setSelectedMedia(null)}
                    className="absolute top-3 right-3 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:bg-red-500"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={() => simulateUpload('image')}
                  className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all font-bold"
                >
                  <i className="fa-solid fa-image"></i>
                  <span>صورة</span>
                </button>
                <button 
                  onClick={() => simulateUpload('video')}
                  className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-100 transition-all font-bold"
                >
                  <i className="fa-solid fa-video"></i>
                  <span>فيديو</span>
                </button>
              </div>

              <button 
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() && !selectedMedia}
                className="w-full py-5 bg-teal-500 text-white rounded-[1.5rem] font-black shadow-xl shadow-teal-100 hover:bg-teal-600 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none transition-all active:scale-95"
              >
                نشر مجهول الآن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
