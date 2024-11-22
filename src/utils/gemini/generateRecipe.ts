import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("Gemini API key is not set. Using mock data instead.");
    return null;
  }
  
  return new GoogleGenerativeAI(apiKey);
};

const mockRecipe = {
  name: "Classic Homemade Burger",
  ingredients: [
    {item: "ground beef", amount: "1/2 pound"},
    {item: "burger bun", amount: "1"},
    {item: "lettuce", amount: "1 leaf"},
    {item: "tomato", amount: "2 slices"},
    {item: "cheese", amount: "1 slice"}
  ],
  instructions: [
    {step: 1, description: "Form the patty", time: "2 minutes"},
    {step: 2, description: "Cook on medium-high heat", time: "4-5 minutes per side"}
  ],
  equipment: ["Pan", "Spatula"],
  totalTime: "15 minutes",
  difficulty: "Easy",
  servings: 1
};

export const generateRecipeFromImage = async (imageDescription: string) => {
  try {
    const genAI = getGeminiAPI();
    if (!genAI) {
      return mockRecipe;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Given this dish: "${imageDescription}", provide a recipe in the following JSON format only:
    {
      "name": "dish name",
      "ingredients": [{"item": "ingredient", "amount": "measurement"}],
      "instructions": [{"step": 1, "description": "instruction", "time": "duration"}],
      "equipment": ["item1", "item2"],
      "totalTime": "duration",
      "difficulty": "level",
      "servings": number
    }`;

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
      console.error('Failed to parse recipe response:', jsonStr);
      return mockRecipe;
    }
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw error;
  }
};