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

const getUserPreferences = () => {
  try {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    const country = preferences.country || '';
    const cuisineStyle = preferences.cuisineStyle || '';
    const dietaryPreference = preferences.dietaryPreference || '';
    const allergies = JSON.parse(localStorage.getItem('allergies') || '[]');
    
    return {
      country,
      cuisineStyle,
      dietaryPreference,
      allergies,
      lastUpdated: preferences.lastUpdated,
      age: preferences.age,
      healthConditions: preferences.healthConditions,
      tribe: preferences.tribe
    };
  } catch (error) {
    console.error('Error loading user preferences:', error);
    return {};
  }
};

export const generateMealPlan = async (additionalPreferences: string[] = []) => {
  try {
    const genAI = getGeminiAPI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    
    const userPrefs = getUserPreferences();
    const userIngredients = JSON.parse(localStorage.getItem('recognizedIngredients') || '[]');
    
    const allPreferences = [
      `Generate meals based on ${userPrefs.cuisineStyle || 'mixed'} style cuisine`,
      `Follow this dietary preference: ${userPrefs.dietaryPreference || 'no specific preference'}`,
      `Generate meals typical to ${userPrefs.country || 'international'} cuisine`,
      `Avoid these allergens: ${userPrefs.allergies?.join(', ') || 'none'}`,
      userPrefs.tribe ? `Consider traditional meals from ${userPrefs.tribe} tribe` : '',
      userPrefs.age ? `Consider age-appropriate meals for ${userPrefs.age} years old` : '',
      userPrefs.healthConditions ? `Consider dietary restrictions for: ${userPrefs.healthConditions}` : '',
      userIngredients.length > 0 ? `STRICTLY use these ingredients where possible: ${userIngredients.map((i: any) => i.name).join(', ')}` : '',
      ...additionalPreferences
    ].filter(Boolean);

    const prompt = `Generate a 7-day meal plan with breakfast, lunch, and dinner for each day. 
    For each meal, include calories, protein, carbs, and fat content in grams. 
    
    IMPORTANT RULES:
    1. STRICTLY follow these preferences: ${allPreferences.join(". ")}
    2. Use traditional/local names for dishes where applicable
    3. All meals MUST be culturally appropriate and commonly prepared in the specified region
    4. Do not substitute traditional ingredients unless specifically requested
    5. DO NOT use asterisks (*) in meal names
    6. Ensure all nutritional information is accurate and appropriate for the specified age and health conditions
    7. STRICTLY incorporate user-provided ingredients where culturally appropriate
    
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
    throw error;
  }
};