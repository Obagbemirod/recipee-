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
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `Create a 7-day meal plan (Monday through Sunday) based on these preferences: ${preferences.join(", ")}
  Each meal should be unique and different from previous generations.
  Return ONLY a JSON object with the following structure for each day and meal:
  {
    "dayOfWeek": {
      "breakfast/lunch/dinner": {
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
      }
    }
  }`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 2000,
      }
    });

    const response = await result.response;
    const text = response.text().trim();
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      const mealPlan = JSON.parse(jsonStr);
      
      // Add appropriate images to each meal
      Object.keys(mealPlan).forEach(day => {
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
          if (mealPlan[day][mealType]) {
            mealPlan[day][mealType].image = getImageForMeal(
              mealPlan[day][mealType].name,
              mealType as 'breakfast' | 'lunch' | 'dinner'
            );
          }
        });
      });
      
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