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
    
    const prompt = `As a culinary expert, analyze the provided image/video and identify ONLY the food ingredients that are CLEARLY VISIBLE.
    
    CRITICAL RULES:
    1. ONLY list ingredients that are actually visible in the input
    2. DO NOT make assumptions about ingredients that cannot be seen
    3. DO NOT add ingredients based on what "might" be included
    4. If uncertain about an ingredient, DO NOT include it
    5. Focus on accurate identification without any guesswork
    
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