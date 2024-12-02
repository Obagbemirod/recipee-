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
  try {
    const days = {
      sunday: { breakfast: {}, lunch: {}, dinner: {} },
      monday: { breakfast: {}, lunch: {}, dinner: {} },
      tuesday: { breakfast: {}, lunch: {}, dinner: {} },
      wednesday: { breakfast: {}, lunch: {}, dinner: {} },
      thursday: { breakfast: {}, lunch: {}, dinner: {} },
      friday: { breakfast: {}, lunch: {}, dinner: {} },
      saturday: { breakfast: {}, lunch: {}, dinner: {} }
    };

    const dayRegex = /\*\*(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday):\*\*/g;
    const mealRegex = /- (Breakfast|Lunch|Dinner): ([^\n]+)/g;

    let currentDay = "";
    let matches;

    const sections = markdown.split(dayRegex);
    sections.shift(); // Remove the text before the first day

    for (let i = 0; i < sections.length; i += 2) {
      const day = sections[i].toLowerCase();
      const content = sections[i + 1];
      
      while ((matches = mealRegex.exec(content)) !== null) {
        const [, mealType, mealText] = matches;
        days[day][mealType.toLowerCase()] = parseMealDetails(mealText);
      }
    }

    return days;
  } catch (error) {
    console.error("Error parsing meal plan:", error);
    throw new Error("Failed to parse meal plan data");
  }
};

export const generateMealPlan = async (additionalPreferences: string[] = []) => {
  try {
    const genAI = getGeminiAPI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    
    const userPrefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    const userIngredients = JSON.parse(localStorage.getItem('recognizedIngredients') || '[]');
    
    if (!userIngredients.length) {
      toast.error("Please provide ingredients first");
      return null;
    }

    const ingredientsList = userIngredients.map((i: any) => i.name).join(', ');
    
    const prompt = `Generate a complete 7-day meal plan (Sunday to Saturday) with breakfast, lunch, and dinner for each day using these ingredients: ${ingredientsList}.
    
    STRICT RULES:
    1. MUST include all 7 days from Sunday to Saturday
    2. MUST include breakfast, lunch, and dinner for each day
    3. ONLY use the provided ingredients
    4. Focus on ${userPrefs.cuisineStyle || 'traditional'} cuisine from ${userPrefs.country || 'local'} region
    5. Follow dietary preference: ${userPrefs.dietaryPreference || 'no specific preference'}
    6. Avoid allergens: ${userPrefs.allergies?.join(', ') || 'none'}
    7. Each meal MUST include nutritional information
    
    Format each meal as:
    **Day:**
    - Breakfast: Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    - Lunch: Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    - Dinner: Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)`;

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
      toast.error("Failed to generate meal plan. Please try again.");
      return null;
    }
  } catch (error: any) {
    console.error('Error generating meal plan:', error);
    toast.error(error.message || "Failed to generate meal plan");
    return null;
  }
};