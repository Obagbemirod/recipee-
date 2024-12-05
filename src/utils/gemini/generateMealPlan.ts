import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import { COUNTRIES_AND_CUISINES } from "@/data/countriesAndCuisines";
import { parseMarkdownToMealPlan } from "./mealPlanParser";
import { WeeklyMealPlan } from "@/types/mealPlan";

const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    toast.error("Please set up your Gemini API key in the .env file");
    throw new Error("Invalid or missing Gemini API key");
  }
  
  return new GoogleGenerativeAI(apiKey);
};

export const generateMealPlan = async (additionalPreferences: string[] = [], requireIngredients: boolean = true): Promise<WeeklyMealPlan | null> => {
  try {
    const genAI = getGeminiAPI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    
    const userPrefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    const userIngredients = JSON.parse(localStorage.getItem('recognizedIngredients') || '[]');
    
    if (requireIngredients && !userIngredients.length) {
      toast.error("Please provide ingredients first");
      return null;
    }

    const ingredientsList = userIngredients.map((i: any) => i.name).join(', ');
    const selectedCuisinePreference = additionalPreferences.find(pref => 
      pref.includes('specific to') || pref.includes('Generate meals using')
    );
    
    if (!selectedCuisinePreference) {
      toast.error("Please select a cuisine");
      return null;
    }

    // Extract the cuisine value
    const cuisineMatch = selectedCuisinePreference.match(/specific to (.+?) cuisine|from (.+?)$/);
    const selectedCuisineValue = cuisineMatch ? (cuisineMatch[1] || cuisineMatch[2]) : null;
    
    if (!selectedCuisineValue) {
      toast.error("Invalid cuisine selection");
      return null;
    }

    // Find the country data
    const countryData = COUNTRIES_AND_CUISINES.find(c => 
      c.value.toLowerCase() === selectedCuisineValue.toLowerCase() ||
      c.label.toLowerCase() === selectedCuisineValue.toLowerCase()
    );
    
    if (!countryData) {
      toast.error("Invalid cuisine selected");
      return null;
    }

    console.log("Generating meal plan for cuisine:", countryData.cuisine);

    const prompt = `Generate a 7-day meal plan (Sunday to Saturday) with breakfast, lunch, and dinner for each day.
    
    STRICT REQUIREMENTS:
    1. ${requireIngredients ? `ONLY use these ingredients: ${ingredientsList}` : 'Use ingredients commonly found in this cuisine'}
    2. Focus EXCLUSIVELY on ${countryData.cuisine} from ${countryData.label}
    3. Follow these additional preferences: ${additionalPreferences.filter(pref => !pref.includes('specific to')).join('. ')}
    4. Follow dietary preference: ${userPrefs.dietaryPreference || 'no specific preference'}
    5. Avoid these allergens: ${userPrefs.allergies?.join(', ') || 'none'}
    
    CRITICAL RULES:
    1. ${requireIngredients ? 'NEVER suggest meals that require ingredients not in the provided list' : 'Suggest meals using common ingredients from this cuisine'}
    2. ONLY generate authentic ${countryData.cuisine} dishes from ${countryData.label}. DO NOT mix with other cuisines.
    3. Each meal MUST include accurate nutritional information
    4. Respect ALL user preferences and restrictions strictly
    5. EVERY meal MUST be a traditional ${countryData.cuisine} dish
    6. DO NOT suggest fusion dishes or international adaptations
    7. Use authentic ${countryData.label} cooking methods
    
    Format each meal exactly as:
    **Sunday:**
    - Breakfast: Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    - Lunch: Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    - Dinner: Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    
    [Continue for Monday through Saturday in the same format]`;

    console.log("Sending prompt to Gemini API");
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 32000,
      }
    });

    const response = await result.response;
    const text = response.text().trim();
    console.log("Received response from Gemini API");
    
    const mealPlan = parseMarkdownToMealPlan(text);
    if (!mealPlan) {
      console.error("Failed to parse meal plan");
      toast.error("Failed to generate a valid meal plan. Please try again.");
      return null;
    }

    console.log("Successfully parsed meal plan:", mealPlan);
    return mealPlan;
  } catch (error: any) {
    console.error('Error generating meal plan:', error);
    toast.error(error.message || "Failed to generate meal plan");
    return null;
  }
};