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
  
  const prompt = `Create a 7-day meal plan (Monday through Sunday) based on these preferences: ${preferences.join(", ")}
  Each meal should be unique and different from previous generations.
  Return ONLY a JSON object with the following structure for each day:
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
    },
    "Tuesday": { same structure as Monday },
    ... continue for all days of the week
  }`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 4000,
      }
    });

    const response = await result.response;
    const text = response.text().trim();
    
    // Remove any markdown code block syntax if present
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      const mealPlan = JSON.parse(jsonStr);
      
      // Validate the structure of the meal plan
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const meals = ['breakfast', 'lunch', 'dinner'];
      
      // Ensure all days and meals are present
      for (const day of days) {
        if (!mealPlan[day]) {
          throw new Error(`Missing day: ${day}`);
        }
        
        for (const meal of meals) {
          if (!mealPlan[day][meal]) {
            throw new Error(`Missing ${meal} for ${day}`);
          }
          
          // Add image for each meal
          mealPlan[day][meal].image = getImageForMeal(
            mealPlan[day][meal].name,
            meal as 'breakfast' | 'lunch' | 'dinner'
          );
        }
      }
      
      return mealPlan;
    } catch (parseError) {
      console.error('Failed to parse meal plan response:', jsonStr);
      toast.error("Failed to parse the generated meal plan. Please try again.");
      throw new Error("Failed to parse meal plan response");
    }
  } catch (error) {
    console.error('Error generating meal plan:', error);
    toast.error("Failed to generate meal plan. Please try again.");
    throw error;
  }
};