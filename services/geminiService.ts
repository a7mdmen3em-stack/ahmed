
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

export const generateAIImage = async (
  description: string, 
  type: 'avatar' | 'cover', 
  gender: 'male' | 'female' = 'male'
) => {
  try {
    let prompt = "";
    if (type === 'avatar') {
      prompt = `Create a high-quality, minimalist 2D vector human-like avatar for a profile. 
      The character is a ${gender}. Style: Modern, clean, professional digital art. 
      User Description (translate and incorporate): ${description}. 
      Ensure the background is flat and the lighting is soft. No realistic photo faces, keep it stylized and anonymous.`;
    } else {
      prompt = `Create a high-quality, aesthetic background cover image (16:9 aspect ratio). 
      Theme: Mental health, peace, and serenity. Style: Abstract or nature-inspired digital art. 
      User Description (translate and incorporate): ${description}. 
      No text in image, soft colors, professional landscape orientation.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        imageConfig: {
          aspectRatio: type === 'avatar' ? "1:1" : "16:9"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};

export const generateAIAvatar = async (mood: string, color: string, gender: 'male' | 'female' = 'male') => {
  const description = `Mood: ${mood}, Primary Color: ${color}.`;
  return generateAIImage(description, 'avatar', gender);
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
