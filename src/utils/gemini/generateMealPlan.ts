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
      lastUpdated: preferences.lastUpdated
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
    
    const allPreferences = [
      `Generate meals based on ${userPrefs.cuisineStyle || 'mixed'} style cuisine`,
      `Consider dietary preference: ${userPrefs.dietaryPreference || 'no specific preference'}`,
      `Generate meals typical to ${userPrefs.country || 'international'} cuisine`,
      `Strictly avoid these allergens: ${userPrefs.allergies?.join(', ') || 'none'}`,
      ...additionalPreferences
    ].filter(Boolean);

    const prompt = `Generate a detailed 7-day meal plan with breakfast, lunch, and dinner for each day. For each meal:

1. NUTRITIONAL INFORMATION (be precise and realistic):
   - Calculate calories based on standard portion sizes
   - Provide protein in grams (typical range: 15-40g per meal)
   - List carbs in grams (typical range: 30-90g per meal)
   - Include fat content in grams (typical range: 10-35g per meal)

2. RECIPE DETAILS:
   - List all ingredients with specific quantities
   - Include cooking time and temperature where applicable
   - Provide step-by-step preparation instructions
   - Note any special equipment needed

3. DIETARY CONSIDERATIONS:
   - Follow these preferences: ${allPreferences.join(". ")}
   - Ensure balanced macronutrient distribution
   - Consider portion sizes appropriate for one adult

Format each meal as follows:

**[Day]:**
- Breakfast: [Meal Name] (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
- Lunch: [Meal Name] (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
- Dinner: [Meal Name] (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)

[Continue for all days]

Ensure all nutritional values are realistic and accurately calculated based on ingredients used.`;

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