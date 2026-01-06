
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, UserProfile, AppNotification } from '../types';
import { createSupportChat } from '../services/geminiService';
import { translations } from '../translations';

interface MessagesProps {
  user: UserProfile;
  addNotification: (message: string, type: AppNotification['type']) => void;
  gainXP: (amount: number) => void;
}

const Messages: React.FC<MessagesProps> = ({ user, addNotification, gainXP }) => {
  const t = translations[user.language];
  const isAr = user.language === 'ar';

  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'ai-support',
      partnerName: isAr ? 'المساعد الذكي (AI)' : 'AI Assistant',
      partnerAvatar: 'fa-sparkles',
      lastMessage: isAr ? 'أهلاً بك، كيف يمكنني مساعدتك اليوم؟' : 'Hello, how can I help you today?',
      timestamp: new Date(),
      unreadCount: 0,
      isAi: true
    },
    {
      id: 'friend-1',
      partnerName: isAr ? 'صديق_مجهول' : 'Anonymous_Friend',
      partnerAvatar: 'fa-user-ninja',
      lastMessage: isAr ? 'شكراً لك على جلسة اليوم.' : 'Thanks for today\'s session.',
      timestamp: new Date(Date.now() - 3600000),
      unreadCount: 2,
      isAi: false
    }
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    'ai-support': [
      { id: 'm1', senderId: 'ai', text: isAr ? 'أهلاً بك، كيف يمكنني مساعدتك اليوم؟' : 'Hello, how can I help you today?', timestamp: new Date(), isAi: true }
    ],
    'friend-1': [
      { id: 'm3', senderId: 'friend-1', text: isAr ? 'شكراً لك على جلسة اليوم.' : 'Thanks for today\'s session.', timestamp: new Date(Date.now() - 3600000) }
    ]
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedConv?.isAi) {
      chatRef.current = createSupportChat();
    }
  }, [selectedConv]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim() || !selectedConv) return;

    const currentConvId = selectedConv.id;
    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      text: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => ({
      ...prev,
      [currentConvId]: [...(prev[currentConvId] || []), userMsg]
    }));
    setInputText('');
    gainXP(5);

    if (selectedConv.isAi) {
      setIsTyping(true);
      try {
        const response = await chatRef.current.sendMessage({ message: userMsg.text });
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          senderId: 'ai',
          text: response.text || '...',
          timestamp: new Date(),
          isAi: true
        };
        setMessages(prev => ({
          ...prev,
          [currentConvId]: [...(prev[currentConvId] || []), aiMsg]
        }));
      } catch (err) {
        addNotification("Error.", "error");
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
      <div className={`${selectedConv ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-l dark:border-slate-700`}>
        <div className="p-6 border-b dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.messages}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedConv(conv)}
              className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${selectedConv?.id === conv.id ? 'bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800' : 'hover:bg-slate-50 dark:hover:bg-slate-700 border border-transparent'}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${conv.isAi ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                <i className={`fa-solid ${conv.partnerAvatar}`}></i>
              </div>
              <div className={`flex-1 overflow-hidden ${isAr ? 'text-right' : 'text-left'}`}>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{conv.partnerName}</h4>
                  <span className="text-[9px] text-slate-400">12:00</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={`${!selectedConv ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-slate-50/30 dark:bg-slate-900/20`}>
        {selectedConv ? (
          <>
            <div className="p-4 md:p-6 bg-white dark:bg-slate-800 border-b dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedConv(null)} className="md:hidden text-slate-400 p-2">
                  <i className={`fa-solid ${isAr ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
                </button>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${selectedConv.isAi ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                  <i className={`fa-solid ${selectedConv.partnerAvatar}`}></i>
                </div>
                <div className={isAr ? 'text-right' : 'text-left'}>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm md:text-base">{selectedConv.partnerName}</h3>
                  <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">{t.activeNow}</p>
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
               <div className="flex justify-center mb-6">
                 <div className="px-4 py-1.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-100 dark:border-slate-700 rounded-full text-[10px] text-slate-400 flex items-center gap-2">
                   <i className="fa-solid fa-lock text-[8px]"></i>
                   {t.chatEncrypted}
                 </div>
               </div>

               {(messages[selectedConv.id] || []).map((msg) => (
                 <div key={msg.id} className={`flex ${msg.senderId === user.id ? (isAr ? 'justify-start' : 'justify-end') : (isAr ? 'justify-end' : 'justify-start')}`}>
                    <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl shadow-sm ${
                      msg.senderId === user.id 
                        ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-600' 
                        : 'bg-teal-600 text-white'
                    }`}>
                       <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                 </div>
               ))}
               {isTyping && (
                 <div className={`flex ${isAr ? 'justify-end' : 'justify-start'}`}>
                   <div className="bg-teal-600/10 p-3 rounded-2xl flex gap-1 items-center">
                     <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                     <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                   </div>
                 </div>
               )}
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700">
               <div className="flex gap-3 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-600">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t.writeMessage}
                    className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-slate-700 dark:text-slate-200"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${!inputText.trim() ? 'text-slate-300' : 'bg-teal-500 text-white'}`}
                  >
                    <i className="fa-solid fa-paper-plane-rtl"></i>
                  </button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-24 h-24 bg-teal-50 dark:bg-teal-900/20 rounded-[2rem] flex items-center justify-center text-teal-500 text-4xl">
              <i className="fa-solid fa-comments"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t.chooseChat}</h3>
              <p className="text-sm text-slate-400 mt-2 max-w-xs">{t.chooseChatDesc}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
