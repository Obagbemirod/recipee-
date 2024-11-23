import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    toast.error(
      "Please set up your Gemini API key in the .env file. Get your API key from https://makersuite.google.com/app/apikey"
    );
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
    
    const prompt = `Generate a complete 7-day meal plan with exactly this JSON structure for EACH day (Monday through Sunday):
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
      "Wednesday": { same structure as Monday },
      "Thursday": { same structure as Monday },
      "Friday": { same structure as Monday },
      "Saturday": { same structure as Monday },
      "Sunday": { same structure as Monday }
    }
    
    Important: Return ONLY the JSON, no additional text or formatting.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `${prompt} Consider these preferences: ${preferences.join(", ")}` }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8000,
      }
    });

    const response = await result.response;
    const text = response.text().trim();
    
    try {
      const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
      const mealPlan = JSON.parse(jsonStr);
      
      // Validate the structure for all days
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const meals = ['breakfast', 'lunch', 'dinner'];
      
      for (const day of days) {
        if (!mealPlan[day]) {
          throw new Error(`Missing day: ${day}`);
        }
        
        for (const meal of meals) {
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