import { GoogleGenAI } from "@google/genai";

// BUG FIX: Use VITE_ prefix so Vite exposes env vars to the browser bundle
const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION_BASE = `You are "Teacher Bot", an expert AI Teacher for students in Bangladesh. 

Key Guidelines:
1. Context: You are familiar with Class 1 to Class 12 NCTB curriculum.
2. Response Style: Keep responses as concise and academic as possible.
3. Language:
   - When language is set to Bangla, you may use technical English terms if they are commonly used in academic contexts or needed for clarity.
   - However, ensure the overall structure remains natural.
4. TTS-Friendly:
   - DO NOT use emojis or heavy formatting.
   - For mathematical expressions, use text that is easy for a TTS to read (e.g., "x plus y" instead of "x+y").
   - Prefer simple, clear sentences.`;

export async function askGuru(
  prompt: string,
  language: 'en' | 'bn',
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
) {
  try {
    const model = 'gemini-3-flash-preview';

    const languageInstruction =
      language === 'bn'
        ? 'Primary language: Bengali. You can use common English technical terms or symbols if helpful for academic precision, but write it in a way that sounds good when spoken.'
        : 'STRICTLY use ONLY English for your responses.';

    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history.map((h) => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }] },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE + ' ' + languageInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Something went wrong. Please check your internet connection or API key.';
  }
}

export async function generateTTS(text: string, language: 'en' | 'bn') {
  try {
    const langCode = language === 'bn' ? 'Bangla' : 'English';
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [
        {
          parts: [
            {
              text: `Read this academic explanation clearly in ${langCode}: ${text}`,
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO' as any],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: language === 'bn' ? 'Kore' : 'Zephyr',
            },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio ?? null;
  } catch (error) {
    console.error('TTS Error:', error);
    return null;
  }
}
