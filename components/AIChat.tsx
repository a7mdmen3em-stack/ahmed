
import React, { useState, useRef, useEffect } from 'react';
import { createSupportChat } from '../services/geminiService';
import { ChatMessage, AppNotification, UserProfile } from '../types';
import { translations } from '../translations';

interface AIChatProps {
  addNotification: (message: string, type: AppNotification['type']) => void;
  user: UserProfile;
}

const AIChat: React.FC<AIChatProps> = ({ addNotification, user }) => {
  const t = translations[user.language];
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: user.language === 'ar' ? 'أهلاً بك في مساحتك الخاصة. أنا هنا لأسمعك وأدعمك في أي وقت. كيف تشعر الآن؟' : 'Welcome to your private space. I am here to listen and support you. How do you feel right now?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = createSupportChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      if (!chatRef.current) chatRef.current = createSupportChat();
      const response = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: response.text || '...' }]);
    } catch (error) {
      addNotification('Connection error.', 'error');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-slate-800 md:rounded-3xl shadow-sm md:border border-slate-100 dark:border-slate-700 overflow-hidden h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)]">
      <div className="p-4 md:p-6 border-b border-slate-50 dark:border-slate-700 flex items-center gap-4 bg-teal-50/50 dark:bg-teal-900/10">
        <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center text-white">
          <i className="fa-solid fa-sparkles"></i>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-none">{t.aiAssistant}</h2>
          <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold mt-1">{t.instantSupport}</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 dark:bg-slate-900/20">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'bg-teal-600 text-white'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-50 dark:border-slate-700">
        <div className="flex gap-2 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-600">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.writeHere}
            className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-slate-700 dark:text-slate-200"
          />
          <button onClick={handleSend} disabled={!input.trim()} className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center">
            <i className="fa-solid fa-paper-plane-rtl text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
