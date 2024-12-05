import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

export const generateRecipeFromImage = async (ingredients: string): Promise<any> => {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

    const prompt = `Analyze these ingredients and generate a detailed recipe:
    Ingredients: ${ingredients}

    Please provide:
    1. The name of the dish
    2. Country/region of origin and cultural significance
    3. Detailed list of ingredients with amounts
    4. Step-by-step cooking instructions with timing
    5. Required equipment
    6. Total cooking time
    7. Difficulty level
    8. Number of servings

    Format the response exactly as follows:
    {
      "name": "Dish Name",
      "origin": {
        "country": "Country Name",
        "region": "Region Name (if applicable)",
        "significance": "Brief cultural significance"
      },
      "ingredients": [
        {"item": "ingredient1", "amount": "amount1"},
        {"item": "ingredient2", "amount": "amount2"}
      ],
      "instructions": [
        {"step": 1, "description": "instruction1", "time": "time1"},
        {"step": 2, "description": "instruction2", "time": "time2"}
      ],
      "equipment": ["item1", "item2"],
      "totalTime": "X hours Y minutes",
      "difficulty": "Easy/Medium/Hard",
      "servings": number
    }`;

    console.log("Sending recipe generation prompt to Gemini");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Received recipe response:", text);
    
    try {
      const recipe = JSON.parse(text);
      console.log("Parsed recipe:", recipe);
      
      // Validate required properties
      if (!recipe || !recipe.ingredients || !recipe.instructions || !recipe.equipment) {
        throw new Error("Invalid recipe format received from API");
      }
      
      return {
        name: recipe.name || "Unknown Recipe",
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        equipment: recipe.equipment || [],
        totalTime: recipe.totalTime || "Unknown",
        difficulty: recipe.difficulty || "Medium",
        servings: recipe.servings || 2,
        origin: recipe.origin || {
          country: "Unknown",
          significance: "Information not available"
        }
      };
    } catch (parseError) {
      console.error("Error parsing recipe JSON:", parseError);
      toast.error("Failed to parse recipe response");
      throw new Error("Failed to parse recipe response");
    }
  } catch (error) {
    console.error("Error generating recipe:", error);
    toast.error("Failed to generate recipe");
    throw error;
  }
};