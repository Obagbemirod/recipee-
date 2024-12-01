import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    toast.error("Please set up your Gemini API key in the .env file");
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

  const sections = markdown.split(dayRegex);
  sections.shift();

  for (let i = 0; i < sections.length; i += 2) {
    const day = sections[i];
    const content = sections[i + 1];
    const meals: Record<string, any> = {};

    while ((matches = mealRegex.exec(content)) !== null) {
      const [, mealType, mealText] = matches;
      meals[mealType.toLowerCase()] = parseMealDetails(mealText);
    }

    days[day.toLowerCase()] = meals;
  }

  return days;
};

export const generateMealPlan = async (additionalPreferences: string[] = [], availableIngredients: string[] = []) => {
  try {
    const genAI = getGeminiAPI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    
    const userPrefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    
    const allPreferences = [
      `STRICTLY generate meals using ONLY these ingredients: ${availableIngredients.join(', ')}`,
      `Generate meals based on ${userPrefs.cuisineStyle || 'mixed'} style cuisine`,
      `Follow this dietary preference: ${userPrefs.dietaryPreference || 'no specific preference'}`,
      `Generate meals typical to ${userPrefs.country || 'international'} cuisine`,
      `Avoid these allergens: ${userPrefs.allergies?.join(', ') || 'none'}`,
      userPrefs.tribe ? `Consider traditional meals from ${userPrefs.tribe} tribe` : '',
      userPrefs.age ? `Consider age-appropriate meals for ${userPrefs.age} years old` : '',
      userPrefs.healthConditions ? `Consider dietary restrictions for: ${userPrefs.healthConditions}` : '',
      ...additionalPreferences
    ].filter(Boolean);

    const prompt = `Generate a 7-day meal plan with breakfast, lunch, and dinner for each day. 
    For each meal, include calories, protein, carbs, and fat content in grams. 
    
    IMPORTANT RULES:
    1. ONLY use ingredients from this list: ${availableIngredients.join(', ')}
    2. DO NOT suggest meals that require ingredients not in the provided list
    3. STRICTLY follow these preferences: ${allPreferences.join(". ")}
    4. Use traditional/local names for dishes where applicable
    5. All meals MUST be culturally appropriate and commonly prepared in the specified region
    6. DO NOT use asterisks (*) in meal names
    7. Ensure all nutritional information is accurate
    8. If you cannot create a meal with the available ingredients, respond with "Not enough ingredients"
    
    Format as follows:

    Monday:
    - Breakfast: Traditional Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    - Lunch: Traditional Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    - Dinner: Traditional Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)

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
    
    if (text.includes("Not enough ingredients")) {
      toast.error("Not enough ingredients provided to generate a complete meal plan");
      return null;
    }
    
    try {
      const mealPlan = parseMarkdownToMealPlan(text);
      return mealPlan;
    } catch (parseError) {
      console.error('Failed to parse meal plan response:', parseError);
      throw new Error("Failed to parse the meal plan response");
    }
  } catch (error: any) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};