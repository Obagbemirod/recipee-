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

export const generateRecipeFromImage = async (input: string) => {
  try {
    const genAI = getGeminiAPI();
    
    const prompt = `You are a culinary expert with deep knowledge of global cuisines.
    Analyze this input and generate a detailed recipe. IMPORTANT GUIDELINES:
    
    1. Identify the dish and its cultural origin accurately
    2. If it's a traditional dish, use its authentic local name
    3. Include cultural context and significance
    4. Use authentic cooking techniques and ingredients
    
    Return the response in this exact JSON format:
    {
      "name": "Traditional Recipe Name",
      "origin": {
        "country": "Country of Origin",
        "region": "Specific Region (if applicable)",
        "culturalContext": "Brief cultural significance/history"
      },
      "ingredients": [
        {"item": "ingredient name", "amount": "precise amount", "notes": "cultural significance or substitutes"}
      ],
      "instructions": [
        {"step": 1, "description": "detailed instruction", "time": "estimated time", "technique": "traditional method"}
      ],
      "equipment": ["required items"],
      "totalTime": "total cooking time",
      "difficulty": "easy/medium/hard",
      "servings": number,
      "authenticity": "notes about traditional preparation"
    }`;

    let result;
    
    if (input.startsWith('data:image')) {
      console.log("Processing image input...");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-vision" });
      const base64Data = input.split('base64,')[1];
      result = await model.generateContent([
        {
          inlineData: { 
            data: base64Data,
            mimeType: "image/jpeg"
          }
        },
        { text: prompt }
      ]);
    } else {
      console.log("Processing text input...");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      result = await model.generateContent([
        { text: `${prompt}\n\nIngredients: ${input}` }
      ]);
    }

    const response = await result.response;
    const text = response.text().trim();
    console.log("API Response:", text);
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      const recipe = JSON.parse(jsonStr);
      
      // Validate required fields
      if (!recipe.name || !recipe.ingredients || !recipe.instructions) {
        throw new Error("Invalid recipe format received");
      }
      
      return {
        name: recipe.name,
        origin: recipe.origin || { 
          country: "Unknown",
          region: "Not specified",
          culturalContext: "Information not available"
        },
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        equipment: recipe.equipment || [],
        totalTime: recipe.totalTime || "30 minutes",
        difficulty: recipe.difficulty || "medium",
        servings: recipe.servings || 4,
        authenticity: recipe.authenticity || "Traditional preparation methods recommended"
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