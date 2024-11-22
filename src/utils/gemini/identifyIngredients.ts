import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("Gemini API key is not set. Using mock data instead.");
    return null;
  }
  
  return new GoogleGenerativeAI(apiKey);
};

export const identifyIngredients = async (input: string) => {
  try {
    const genAI = getGeminiAPI();
    if (!genAI) {
      return ["tomato", "lettuce", "cheese", "beef patty", "burger bun"];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze the following input and identify food ingredients. 
    Return ONLY a JSON array of ingredient names, nothing else. 
    Example format: ["ingredient1", "ingredient2"]
    
    Input: ${input}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1000,
      }
    });
    
    const response = await result.response;
    const text = response.text().trim();
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      return JSON.parse(jsonStr);
    } catch (parseError) {
      const matches = jsonStr.match(/\[(.*)\]/);
      if (matches) {
        return JSON.parse(matches[0]);
      }
      console.error('Failed to parse ingredients response:', jsonStr);
      return ["ingredient parsing failed"];
    }
  } catch (error) {
    console.error('Error identifying ingredients:', error);
    throw error;
  }
};