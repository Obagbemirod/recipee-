import { GoogleGenerativeAI } from "@google/generative-ai";
import { getImageForMeal } from "./mealImages";
import { toast } from "sonner";

const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    toast.error("Gemini API key is not set. Please check your environment variables.");
    throw new Error("Gemini API key is not set");
  }
  
  return new GoogleGenerativeAI(apiKey);
};

export const generateMealPlan = async (preferences: string[]) => {
  const genAI = getGeminiAPI();
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
  
  const prompt = `Generate a meal plan for one day only with exactly this JSON structure (no additional text or markdown):
  {
    "Monday": {
      "breakfast": {
        "name": "meal name",
        "nutrition": {
          "calories": "amount",
          "protein": "amount",
          "carbs": "amount",
          "fat": "amount"
        },
        "ingredients": [
          {"item": "ingredient", "amount": "measurement"}
        ],
        "steps": [
          {"step": number, "instruction": "step description", "time": "duration"}
        ]
      },
      "lunch": { same structure as breakfast },
      "dinner": { same structure as breakfast }
    }
  }`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      }
    });

    const response = await result.response;
    const text = response.text().trim();
    
    // Remove any markdown code block syntax and clean the response
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      const mealPlan = JSON.parse(jsonStr);
      
      // Validate the structure
      if (!mealPlan.Monday || !mealPlan.Monday.breakfast || !mealPlan.Monday.lunch || !mealPlan.Monday.dinner) {
        throw new Error("Invalid meal plan structure");
      }
      
      // Add images for each meal
      ['breakfast', 'lunch', 'dinner'].forEach(meal => {
        mealPlan.Monday[meal].image = getImageForMeal(
          mealPlan.Monday[meal].name,
          meal as 'breakfast' | 'lunch' | 'dinner'
        );
      });
      
      return mealPlan;
    } catch (parseError) {
      console.error('Failed to parse meal plan response:', jsonStr);
      throw new Error("Failed to parse the meal plan response");
    }
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};