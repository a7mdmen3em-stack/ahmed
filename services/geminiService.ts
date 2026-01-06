
import { GoogleGenAI } from "@google/genai";

// Fix: Use process.env.API_KEY directly as per the @google/genai guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailySupport = async (content: string, type: 'morning' | 'night' | 'diary') => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `المستخدم سجل يومياته (${type}): "${content}". 
      رد عليه كأخصائي نفسي شاطر وصاحب بلهجة مصرية عامية (Egyptian Arabic Dialect). 
      خليك حنين وداعم، وماتدلهوش نصايح طبية. الرد يكون جملة أو جملتين بالكتير وتكون قريبة للقلب.`,
      config: {
        temperature: 0.8,
      }
    });
    return response.text || "أنا جنبك وسامعك، ومقدر جداً اللي بتمر بيه.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "ولا يهمك، بكرة أحلى وأنا دايماً معاك هنا.";
  }
};

export const createSupportChat = () => {
  return ai.chats.create({
    model: 'gemini-flash-lite-latest',
    config: {
      systemInstruction: `أنت مساعد نفسي شاطر وحنين في تطبيق "Safe Space". 
      مهمتك تسمع المستخدمين، تطبطب عليهم، وتساعدهم يفهموا مشاعرهم. 
      استخدم اللهجة المصرية العامية (Egyptian Ammiya). 
      خلي كلامك دافي، بسيط، وقريب ليهم. ممنوع تشخص أمراض أو تدي أدوية. 
      ركز على إنك تحسسهم إنهم مش لوحدهم وإن مشاعرهم حقيقية ومهمة. 
      ردودك تكون قصيرة ومريحة للنفس.`,
      temperature: 0.9,
    },
  });
};
