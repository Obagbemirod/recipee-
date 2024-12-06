import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    toast.error("Gemini API key is not set");
    throw new Error("Invalid or missing Gemini API key");
  }
  
  return new GoogleGenerativeAI(apiKey);
};

export const generateRecipeFromImage = async (input: string, userCountry?: string, userCuisine?: string) => {
  try {
    const genAI = getGeminiAPI();
    
    const prompt = `You are a global culinary expert with deep knowledge of cuisines worldwide.
    Analyze this input and identify the exact dish/recipe shown. IMPORTANT GUIDELINES:
    
    1. ONLY identify ingredients and items that are CLEARLY VISIBLE in the image
    2. If this is a known dish, identify its authentic name and origin
    3. Do not make assumptions about ingredients that cannot be seen
    4. Focus on accurate, global identification without regional bias
    5. If uncertain about any ingredient, exclude it rather than guess
    
    Return the response in this exact JSON format:
    {
      "name": "Authentic Recipe Name (with origin if known)",
      "ingredients": [
        {"item": "ingredient name", "amount": "approximate amount", "confidence": number}
      ],
      "instructions": [
        {"step": 1, "description": "detailed instruction", "time": "estimated time"}
      ],
      "equipment": ["required items"],
      "totalTime": "total cooking time",
      "difficulty": "easy/medium/hard",
      "servings": number
    }`;

    let result;
    
    if (input.startsWith('data:image')) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const base64Data = input.split('base64,')[1];
      result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }
        ]
      });
    } else {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt + "\n\nIngredients: " + input }]
          }
        ]
      });
    }

    const response = await result.response;
    const text = response.text().trim();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      const recipe = JSON.parse(jsonStr);
      
      return {
        name: recipe.name || "Custom Recipe",
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        equipment: recipe.equipment || [],
        totalTime: recipe.totalTime || "30 minutes",
        difficulty: recipe.difficulty || "medium",
        servings: recipe.servings || 4
      };
    } catch (parseError) {
      console.error('Failed to parse recipe response:', text);
      throw new Error("Failed to parse the recipe");
    }
  } catch (error: any) {
    console.error('Error generating recipe:', error);
    throw error;
  }
};