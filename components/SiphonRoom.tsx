
import React, { useState, useEffect } from 'react';
import { SiphonState, AppNotification } from '../types';

interface SiphonRoomProps {
  addNotification: (message: string, type: AppNotification['type']) => void;
}

const SiphonRoom: React.FC<SiphonRoomProps> = ({ addNotification }) => {
  const [state, setState] = useState<SiphonState>({
    step: 'writing',
    myProblem: '',
    partnerProblem: '',
    timer: 0
  });

  const [isMatching, setIsMatching] = useState(false);

  const startMatching = () => {
    if (!state.myProblem) return;
    setIsMatching(true);
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        step: 'matching',
        partnerProblem: 'أشعر بضيق شديد مؤخراً بسبب ضغوط العمل وعدم القدرة على الموازنة بين حياتي الشخصية والمهنية.'
      }));
      setIsMatching(false);
      addNotification("تم العثور على شريك مجهول! راجع مشكلته لتبدأ الجلسة.", "info");
    }, 2500);
  };

  const acceptPartner = () => {
    setState(prev => ({ ...prev, step: 'round1', timer: 180 }));
    addNotification("بدأت الجلسة. الجولة الأولى: مساحتك للحديث.", "success");
  };

  useEffect(() => {
    if (state.timer > 0) {
      const interval = setInterval(() => {
        setState(prev => {
           if (prev.timer <= 1) {
              if (prev.step === 'round1') {
                addNotification("انتهت جولتك. حان وقت الاستماع لشريكك.", "info");
                return { ...prev, step: 'round2', timer: 180 };
              }
              if (prev.step === 'round2') {
                addNotification("انتهت جولة الاستماع. بدأ النقاش المفتوح.", "info");
                return { ...prev, step: 'round3', timer: 0 };
              }
           }
           return { ...prev, timer: prev.timer - 1 };
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.timer, state.step, addNotification]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (state.step === 'writing') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">بدء جلسة سيفون</h2>
          <p className="text-slate-500">فضفضة 1 لـ 1 مع مستمع مجهول. تبدأ بكتابة ما يزعجك.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <label className="block text-sm font-bold text-slate-700">ما الذي تود الفضفضة عنه؟</label>
          <textarea
            value={state.myProblem}
            onChange={(e) => setState(prev => ({ ...prev, myProblem: e.target.value }))}
            className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="اكتب هنا باختصار... (هذا سيظهر للطرف الآخر قبل القبول)"
          ></textarea>
          
          <button
            onClick={startMatching}
            disabled={!state.myProblem || isMatching}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all ${
              !state.myProblem || isMatching ? 'bg-slate-300' : 'bg-teal-500 hover:bg-teal-600 shadow-lg shadow-teal-100'
            }`}
          >
            {isMatching ? 'جاري البحث عن شريك...' : 'ابحث عن شريك مجهول'}
          </button>
        </div>
      </div>
    );
  }

  if (state.step === 'matching') {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-slate-100 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl">
            <i className="fa-solid fa-user-secret"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold">شريك محتمل مجهول</h3>
            <p className="text-sm text-slate-400">يرغب في مشاركتك مشكلته</p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl italic text-slate-700 leading-relaxed">
          "{state.partnerProblem}"
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setState(prev => ({ ...prev, step: 'writing', partnerProblem: '' }))}
            className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200"
          >
            رفض
          </button>
          <button 
            onClick={acceptPartner}
            className="py-4 bg-teal-500 text-white rounded-2xl font-bold hover:bg-teal-600"
          >
            قبول وبدء الجلسة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full space-y-6">
      <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-slate-800 text-white rounded-xl font-mono text-xl">
            {formatTime(state.timer)}
          </div>
          <div className="text-sm">
            <span className="text-slate-400">الجولة الحالية: </span>
            <span className="font-bold text-teal-600">
              {state.step === 'round1' ? 'أنت تتحدث - هو يسمع' : state.step === 'round2' ? 'هو يتحدث - أنت تسمع' : 'نقاش مفتوح'}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setState({ step: 'writing', myProblem: '', partnerProblem: '', timer: 0 })}
          className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-bold"
        >
          إنهاء فوري
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className={`p-8 rounded-3xl border-4 transition-all flex flex-col items-center justify-center gap-6 ${state.step === 'round1' ? 'bg-white border-teal-500 shadow-xl' : 'bg-slate-100 border-transparent opacity-50'}`}>
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl shadow-inner ${state.step === 'round1' ? 'bg-teal-100 text-teal-600 animate-pulse' : 'bg-slate-200 text-slate-400'}`}>
               <i className="fa-solid fa-microphone"></i>
            </div>
            <div className="text-center">
               <h3 className="text-xl font-bold">مساحتك للحديث</h3>
               <p className="text-slate-500 text-sm mt-2">عبر عما بداخلك بكل حرية.</p>
            </div>
         </div>

         <div className={`p-8 rounded-3xl border-4 transition-all flex flex-col items-center justify-center gap-6 ${state.step === 'round2' ? 'bg-white border-purple-500 shadow-xl' : 'bg-slate-100 border-transparent opacity-50'}`}>
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl shadow-inner ${state.step === 'round2' ? 'bg-purple-100 text-purple-600 animate-pulse' : 'bg-slate-200 text-slate-400'}`}>
               <i className="fa-solid fa-headphones"></i>
            </div>
            <div className="text-center">
               <h3 className="text-xl font-bold">وقت الاستماع</h3>
               <p className="text-slate-500 text-sm mt-2">أنصت لشريكك بعناية وتعاطف.</p>
            </div>
         </div>
      </div>

      {state.step === 'round3' && (
        <div className="bg-teal-50 border-2 border-teal-200 p-8 rounded-3xl text-center space-y-4">
           <h3 className="text-2xl font-bold text-teal-800">مرحلة النقاش المفتوح</h3>
           <p className="text-teal-600 italic">الآن يمكنكما تبادل الحديث والتعليقات لمدة غير محدودة.</p>
           <button 
             onClick={() => setState({ step: 'writing', myProblem: '', partnerProblem: '', timer: 0 })}
             className="px-8 py-3 bg-teal-600 text-white rounded-2xl font-bold"
           >
             إنهاء الجلسة وشكراً للطرف الآخر
           </button>
        </div>
      )}
    </div>
  );
};

export default SiphonRoom;
