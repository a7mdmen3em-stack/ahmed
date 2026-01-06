
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, UserProfile, AppNotification } from '../types';
import { createSupportChat } from '../services/geminiService';

interface MessagesProps {
  user: UserProfile;
  addNotification: (message: string, type: AppNotification['type']) => void;
  gainXP: (amount: number) => void;
}

const Messages: React.FC<MessagesProps> = ({ user, addNotification, gainXP }) => {
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'ai-support',
      partnerName: 'المساعد الذكي (AI)',
      partnerAvatar: 'fa-sparkles',
      lastMessage: 'أهلاً بك، كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
      unreadCount: 0,
      isAi: true
    },
    {
      id: 'friend-1',
      partnerName: 'صديق_مجهول',
      partnerAvatar: 'fa-user-ninja',
      lastMessage: 'شكراً لك على جلسة اليوم، كانت مفيدة جداً.',
      timestamp: new Date(Date.now() - 3600000),
      unreadCount: 2,
      isAi: false
    },
    {
      id: 'friend-2',
      partnerName: 'روح_متفائلة',
      partnerAvatar: 'fa-ghost',
      lastMessage: 'هل أنت مستعد لسيشن بكرة؟',
      timestamp: new Date(Date.now() - 86400000),
      unreadCount: 0,
      isAi: false
    }
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    'ai-support': [
      { id: 'm1', senderId: 'ai', text: 'أهلاً بك، كيف يمكنني مساعدتك اليوم؟', timestamp: new Date(), isAi: true }
    ],
    'friend-1': [
      { id: 'm2', senderId: 'friend-1', text: 'كيف حالك؟', timestamp: new Date(Date.now() - 4000000) },
      { id: 'm3', senderId: 'friend-1', text: 'شكراً لك على جلسة اليوم، كانت مفيدة جداً.', timestamp: new Date(Date.now() - 3600000) }
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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedConv, messages]);

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
    gainXP(5); // نقاط بسيطة للتفاعل الاجتماعي

    if (selectedConv.isAi) {
      setIsTyping(true);
      try {
        const response = await chatRef.current.sendMessage({ message: userMsg.text });
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          senderId: 'ai',
          text: response.text || 'أنا معك دائمًا.',
          timestamp: new Date(),
          isAi: true
        };
        setMessages(prev => ({
          ...prev,
          [currentConvId]: [...(prev[currentConvId] || []), aiMsg]
        }));
      } catch (err) {
        addNotification("عذراً، المساعد الذكي غير متاح حالياً.", "error");
      } finally {
        setIsTyping(false);
      }
    } else {
      // محاكاة رد من شخص بعد فترة بسيطة
      setTimeout(() => {
        const friendMsg: Message = {
          id: (Date.now() + 1).toString(),
          senderId: currentConvId,
          text: 'شكراً لتواصلك، سأرد عليك في أقرب وقت! (محاكاة)',
          timestamp: new Date()
        };
        setMessages(prev => ({
          ...prev,
          [currentConvId]: [...(prev[currentConvId] || []), friendMsg]
        }));
      }, 2000);
    }
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Sidebar List */}
      <div className={`${selectedConv ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-l border-slate-100`}>
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-800">الرسائل</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedConv(conv)}
              className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${selectedConv?.id === conv.id ? 'bg-teal-50 border border-teal-100' : 'hover:bg-slate-50 border border-transparent'}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${conv.isAi ? 'bg-teal-500 text-white shadow-lg shadow-teal-100' : 'bg-slate-100 text-slate-500'}`}>
                <i className={`fa-solid ${conv.partnerAvatar}`}></i>
              </div>
              <div className="flex-1 text-right overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-sm text-slate-800 truncate">{conv.partnerName}</h4>
                  <span className="text-[9px] text-slate-400">{conv.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unreadCount > 0 && (
                <div className="w-5 h-5 bg-teal-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                  {conv.unreadCount}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${!selectedConv ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-slate-50/30`}>
        {selectedConv ? (
          <>
            <div className="p-4 md:p-6 bg-white border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedConv(null)} className="md:hidden text-slate-400 p-2">
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${selectedConv.isAi ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <i className={`fa-solid ${selectedConv.partnerAvatar}`}></i>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">{selectedConv.partnerName}</h3>
                  <p className="text-[10px] text-teal-600 font-bold">نشط الآن</p>
                </div>
              </div>
              <div className="flex gap-2">
                 <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all">
                    <i className="fa-solid fa-phone-slash"></i>
                 </button>
                 <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all">
                    <i className="fa-solid fa-circle-info"></i>
                 </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
               {/* Encryption Badge */}
               <div className="flex justify-center mb-6">
                 <div className="px-4 py-1.5 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-full text-[10px] text-slate-400 flex items-center gap-2">
                   <i className="fa-solid fa-lock text-[8px]"></i>
                   هذه المحادثة مشفرة ومجهولة الهوية تماماً
                 </div>
               </div>

               {(messages[selectedConv.id] || []).map((msg) => (
                 <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl shadow-sm relative ${
                      msg.senderId === user.id 
                        ? 'bg-white text-slate-800 rounded-br-none border border-slate-100' 
                        : msg.isAi 
                          ? 'bg-teal-600 text-white rounded-bl-none'
                          : 'bg-slate-800 text-white rounded-bl-none'
                    }`}>
                       <p className="text-sm leading-relaxed">{msg.text}</p>
                       <span className={`text-[8px] mt-2 block opacity-50 ${msg.senderId === user.id ? 'text-slate-400' : 'text-white'}`}>
                         {msg.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                 </div>
               ))}
               {isTyping && (
                 <div className="flex justify-end">
                   <div className="bg-teal-600/10 text-teal-600 p-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
                     <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                     <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                   </div>
                 </div>
               )}
            </div>

            <div className="p-4 bg-white border-t border-slate-50">
               <div className="flex gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-teal-500 transition-all">
                  <button className="w-10 h-10 text-slate-400 hover:text-teal-500">
                    <i className="fa-solid fa-paperclip"></i>
                  </button>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-slate-700"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!inputText.trim() || isTyping}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${!inputText.trim() || isTyping ? 'text-slate-300' : 'bg-teal-500 text-white shadow-lg shadow-teal-100'}`}
                  >
                    <i className="fa-solid fa-paper-plane-rtl"></i>
                  </button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-24 h-24 bg-teal-50 rounded-[2rem] flex items-center justify-center text-teal-500 text-4xl shadow-inner">
              <i className="fa-solid fa-comments"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">اختر محادثة للبدء</h3>
              <p className="text-sm text-slate-400 mt-2 max-w-xs leading-relaxed">تواصل مع مساعدك الذكي أو أصدقائك الذين تعرفت عليهم في السيشنات الجماعية بكل أمان.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
