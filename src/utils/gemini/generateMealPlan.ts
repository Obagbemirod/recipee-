import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    toast.error("Gemini API key is not set. Please check your environment variables.");
    throw new Error("Gemini API key is not set");
  }
  
  if (apiKey === "AIzaSyBREmgc6S6LkzFFh_3kHcawCBYuCEZSMdE") {
    toast.error("Please replace the default API key with your own Gemini API key in the .env file");
    throw new Error("Default API key detected - please use your own key");
  }
  
  return new GoogleGenerativeAI(apiKey);
};

export const generateMealPlan = async (preferences: string[]) => {
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

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `${prompt} Consider these preferences: ${preferences.join(", ")}` }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8000,
      }
    });

    const response = await result.response;
    const text = response.text().trim();
    
    // Remove any markdown code block syntax and clean the response
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
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
      console.error('Failed to parse meal plan response:', jsonStr);
      throw new Error("Failed to parse the meal plan response");
    }
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};