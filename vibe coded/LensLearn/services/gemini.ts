import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, USER_PROMPT_TEMPLATE, DIFFICULTY_INSTRUCTIONS } from '../constants';
import { DifficultyLevel } from '../types';

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeImageWithGemini = async (file: File, difficulty: DifficultyLevel): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API Key is missing. Please check your configuration.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Image = await fileToBase64(file);

    const prompt = `${USER_PROMPT_TEMPLATE}
    
    TARGET AUDIENCE LEVEL: ${difficulty.toUpperCase()}
    INSTRUCTION: ${DIFFICULTY_INSTRUCTIONS[difficulty]}
    
    Ensure the explanation complexity matches this level perfectly.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.4,
      },
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    return response.text || "No explanation provided. Please try again.";

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to analyze image.");
  }
};