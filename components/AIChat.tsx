
import React, { useState, useRef, useEffect } from 'react';
import { createSupportChat } from '../services/geminiService';
import { ChatMessage, AppNotification } from '../types';

interface AIChatProps {
  addNotification: (message: string, type: AppNotification['type']) => void;
}

const AIChat: React.FC<AIChatProps> = ({ addNotification }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'أهلاً بك في مساحتك الخاصة. أنا هنا لأسمعك وأدعمك في أي وقت. كيف تشعر الآن؟' }
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
      if (!chatRef.current) {
        chatRef.current = createSupportChat();
      }
      const response = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: response.text || 'عذراً، لم أستطع الرد حالياً.' }]);
    } catch (error) {
      console.error('Chat error:', error);
      addNotification('حدث خطأ في الاتصال بالدردشة الذكية.', 'error');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col bg-white md:rounded-3xl shadow-sm md:border border-slate-100 overflow-hidden h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)]">
      <div className="p-4 md:p-6 border-b border-slate-50 flex items-center gap-4 bg-teal-50/50">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-teal-100">
          <i className="fa-solid fa-sparkles"></i>
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-none">مساعدك الذكي</h2>
          <p className="text-[10px] md:text-xs text-teal-600 font-bold mt-1">دعم فوري مجهول</p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/30 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            <div 
              className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-white text-slate-700 rounded-br-none border border-slate-100' 
                  : 'bg-teal-600 text-white rounded-bl-none'
              }`}
            >
              {msg.text}
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

      <div className="p-3 md:p-4 bg-white border-t border-slate-50">
        <div className="flex gap-2 md:gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-teal-500 transition-all">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب هنا..."
            className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-slate-700 placeholder:text-slate-400"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${
              !input.trim() || isTyping ? 'text-slate-300' : 'bg-teal-500 text-white hover:bg-teal-600'
            }`}
          >
            <i className="fa-solid fa-paper-plane-rtl text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
