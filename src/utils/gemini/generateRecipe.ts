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
    
    const prompt = `You are a global culinary expert with deep knowledge of world cuisines. Based on the image provided, analyze the visible ingredients and identify the dish or recipe. Follow these strict guidelines:

    ### Key Instructions:
    1. **Only identify visible ingredients**: Focus solely on ingredients or items that are clearly visible in the image.
    2. **Identify the authentic dish name**: If the dish is a well-known recipe, provide its official name along with its origin, if possible.
    3. **Exclude unidentifiable ingredients**: If you cannot definitively identify an ingredient from the image, do not include it.
    4. **No assumptions**: Do not assume any ingredients that cannot be directly seen in the image.
    5. **Global perspective**: Make the identification without bias toward any specific regional cuisine unless the dish has a clear regional identity.

    Return the analysis in the following **exact JSON format**:

    {
      "name": "Authentic Recipe Name (include origin if known)",
      "ingredients": [
        {"item": "ingredient name", "amount": "approximate amount", "confidence": number}
      ],
      "instructions": [
        {"step": 1, "description": "detailed instruction", "time": "estimated time"}
      ],
      "equipment": ["required equipment"],
      "totalTime": "total estimated cooking time",
      "difficulty": "easy/medium/hard",
      "servings": number
    }

    ### Additional Notes:
    - **Confidence** should be rated on a scale of 0 to 1. For example, if you are very sure about an ingredient, the confidence should be close to 1; if unsure, the confidence should be closer to 0.
    - **Ingredient Amount**: Provide an approximate amount for each visible ingredient (e.g., "1 onion", "200 grams of chicken").
    - **Instructions**: Write clear and detailed steps for preparing the dish based on the ingredients shown in the image.
    - **Total Time**: Estimate the total cooking time based on the visible steps and ingredients.
    - **Difficulty**: Classify the difficulty level of the recipe based on the ingredients and steps.`;

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