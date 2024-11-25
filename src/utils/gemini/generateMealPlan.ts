import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    toast.error("Please set up your Gemini API key in the .env file");
    throw new Error("Invalid or missing Gemini API key");
  }
  
  if (apiKey === "AIzaSyBREmgc6S6LkzFFh_3kHcawCBYuCEZSMdZ") {
    toast.error(
      "Please replace the default API key with your own Gemini API key from https://makersuite.google.com/app/apikey"
    );
    throw new Error("Default API key detected - please use your own key");
  }
  
  return new GoogleGenerativeAI(apiKey);
};

const parseMealDetails = (text: string) => {
  const caloriesMatch = text.match(/Calories: (\d+)/);
  const proteinMatch = text.match(/Protein: (\d+)g/);
  const carbsMatch = text.match(/Carbs: (\d+)g/);
  const fatMatch = text.match(/Fat: (\d+)g/);

  return {
    name: text.split('(')[0].trim(),
    nutrition: {
      calories: caloriesMatch ? `${caloriesMatch[1]} kcal` : "N/A",
      protein: proteinMatch ? `${proteinMatch[1]}g` : "N/A",
      carbs: carbsMatch ? `${carbsMatch[1]}g` : "N/A",
      fat: fatMatch ? `${fatMatch[1]}g` : "N/A"
    },
    ingredients: [
      { item: "Ingredients will be added", amount: "as needed" }
    ],
    steps: [
      { step: 1, instruction: "Detailed cooking instructions will be provided", time: "TBD" }
    ]
  };
};

const parseMarkdownToMealPlan = (markdown: string) => {
  const days: Record<string, any> = {};
  const dayRegex = /\*\*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\*\*/g;
  const mealRegex = /- (Breakfast|Lunch|Dinner): ([^\n]+)/g;

  let currentDay = "";
  let matches;

  // Split the markdown into day sections
  const sections = markdown.split(dayRegex);
  sections.shift(); // Remove the first empty element

  // Process each day
  for (let i = 0; i < sections.length; i += 2) {
    const day = sections[i];
    const content = sections[i + 1];
    const meals: Record<string, any> = {};

    // Find all meals in the current day's content
    while ((matches = mealRegex.exec(content)) !== null) {
      const [, mealType, mealText] = matches;
      meals[mealType.toLowerCase()] = parseMealDetails(mealText);
    }

    days[day.toLowerCase()] = meals;
  }

  return days;
};

export const generateMealPlan = async (preferences: string[]) => {
  try {
    const genAI = getGeminiAPI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    
    const prompt = `Generate a 7-day meal plan with breakfast, lunch, and dinner for each day. For each meal, include calories, protein, carbs, and fat content in grams. YOU MUST GENERATE THE MEAL PLAN BASED ON THE PREFERENCE ALONE: ${preferences.join(", ")}. Format as follows:

**Monday:**
- Breakfast: [Meal Name] (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
- Lunch: [Meal Name] (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
- Dinner: [Meal Name] (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)

[Continue for all days]

Consider these preferences YOU MUST GENERATE MEAL PLAN BASED ON THESE PREFERENCES ALONE: ${preferences.join(", ")}`;

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
      const mealPlan = parseMarkdownToMealPlan(text);
      return mealPlan;
    } catch (parseError) {
      console.error('Failed to parse meal plan response:', parseError);
      console.error('Response text was:', text);
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
