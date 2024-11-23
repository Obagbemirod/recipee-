import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    toast.error("Please set up your Gemini API key in the .env file");
    throw new Error("Invalid or missing Gemini API key");
  }
  
  if (apiKey === "BIzaSyBREmgc6S6LkzFFh_3kHcawCBYuCEZSMdZ") {
    toast.error(
      "Please replace the default API key with your own Gemini API key from https://makersuite.google.com/app/apikey"
    );
    throw new Error("Default API key detected - please use your own key");
  }
  
  return new GoogleGenerativeAI(apiKey);
};

export const generateMealPlan = async (preferences: string[]) => {
  try {
    const genAI = getGeminiAPI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    
    const prompt = `Generate a 7-day meal plan (Monday through Sunday) with exactly 3 meals per day (breakfast, lunch, dinner). Each meal should include name, nutrition info, ingredients with amounts, and cooking steps with times. Format as a clean JSON object with this exact structure for each day:
    {
      "Monday": {
        "breakfast": {
          "name": "string",
          "nutrition": {
            "calories": "number",
            "protein": "string",
            "carbs": "string",
            "fat": "string"
          },
          "ingredients": [
            {"item": "string", "amount": "string"}
          ],
          "steps": [
            {"step": number, "instruction": "string", "time": "string"}
          ]
        },
        "lunch": {...},
        "dinner": {...}
      },
      "Tuesday": {...},
      ...etc for all days
    }
    
    Consider these preferences: ${preferences.join(", ")}
    Return ONLY valid JSON, no additional text.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 32000,
      }
    });

    const response = await result.response;
    const text = response.text().trim();
    
    try {
      // Remove any markdown code block syntax if present
      const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
      const mealPlan = JSON.parse(jsonStr);
      
      // Validate the structure
      const requiredDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const requiredMeals = ['breakfast', 'lunch', 'dinner'];
      
      for (const day of requiredDays) {
        if (!mealPlan[day]) {
          throw new Error(`Missing day: ${day}`);
        }
        
        for (const meal of requiredMeals) {
          if (!mealPlan[day][meal]) {
            throw new Error(`Missing ${meal} for ${day}`);
          }
        }
      }
      
      return mealPlan;
    } catch (parseError) {
      console.error('Failed to parse meal plan response:', text);
      throw new Error("Failed to parse the meal plan response");
    }
  } catch (error: any) {
    console.error('Error generating meal plan:', error);
    if (error.message?.includes('API key')) {
      toast.error("Invalid API key. Please check your .env file and ensure you've added a valid Gemini API key.");
    } else {
      toast.error("Failed to generate meal plan. Please try again.");
    }
    throw error;
  }
};