import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("Invalid or missing Gemini API key");
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
    }
  };
};

const parseMarkdownToMealPlan = (markdown: string) => {
  const days: Record<string, any> = {};
  const dayRegex = /\*\*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\*\*/g;
  const mealRegex = /- (Breakfast|Lunch|Dinner): ([^\n]+)/g;

  let currentDay = "";
  let matches;

  // Split the markdown into sections by day
  const sections = markdown.split(dayRegex);
  sections.shift(); // Remove the first empty element

  // Process each day's section
  for (let i = 0; i < sections.length; i += 2) {
    const day = sections[i].toLowerCase();
    const content = sections[i + 1];
    const meals: Record<string, any> = {};

    // Extract meals for the current day
    let mealMatch;
    while ((mealMatch = mealRegex.exec(content)) !== null) {
      const [, mealType, mealText] = mealMatch;
      meals[mealType.toLowerCase()] = parseMealDetails(mealText);
    }

    if (Object.keys(meals).length > 0) {
      days[day] = meals;
    }
  }

  return days;
};

export const generateMealPlan = async (preferences: string[]) => {
  try {
    const genAI = getGeminiAPI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    
    const prompt = `Generate a detailed 7-day meal plan with breakfast, lunch, and dinner for each day. For each meal:
    1. Include name and nutritional information in this format:
       - Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    2. Consider these preferences: ${preferences.join(". ")}
    
    Format the response as:
    **Monday:**
    - Breakfast: Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    - Lunch: Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    - Dinner: Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    
    [Continue for all days]`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 32000,
      }
    });

    const response = await result.response;
    const text = response.text().trim();
    
    if (!text) {
      throw new Error("No meal plan generated");
    }

    const mealPlan = parseMarkdownToMealPlan(text);
    
    if (Object.keys(mealPlan).length === 0) {
      throw new Error("Failed to parse meal plan");
    }

    return mealPlan;
  } catch (error: any) {
    console.error('Error generating meal plan:', error);
    throw new Error(error.message || "Failed to generate meal plan");
  }
};