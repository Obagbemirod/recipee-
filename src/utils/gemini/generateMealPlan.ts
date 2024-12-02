import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import { COUNTRIES_AND_CUISINES } from "@/data/countriesAndCuisines";

const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    toast.error("Please set up your Gemini API key in the .env file");
    throw new Error("Invalid or missing Gemini API key");
  }
  
  return new GoogleGenerativeAI(apiKey);
};

const getCuisineContext = (country: string) => {
  const cuisineInfo = COUNTRIES_AND_CUISINES.find(c => c.value === country);
  return cuisineInfo ? cuisineInfo.cuisine : 'local cuisine';
};

const parseMealDetails = (text: string) => {
  try {
    const nameMatch = text.match(/^([^(]+)/);
    const caloriesMatch = text.match(/Calories: (\d+)/);
    const proteinMatch = text.match(/Protein: (\d+)g/);
    const carbsMatch = text.match(/Carbs: (\d+)g/);
    const fatMatch = text.match(/Fat: (\d+)g/);

    return {
      name: nameMatch ? nameMatch[1].trim() : text.trim(),
      nutrition: {
        calories: caloriesMatch ? `${caloriesMatch[1]} kcal` : "N/A",
        protein: proteinMatch ? `${proteinMatch[1]}g` : "N/A",
        carbs: carbsMatch ? `${carbsMatch[1]}g` : "N/A",
        fat: fatMatch ? `${fatMatch[1]}g` : "N/A"
      },
      ingredients: [],
      steps: []
    };
  } catch (error) {
    console.error("Error parsing meal details:", error);
    return {
      name: text.trim(),
      nutrition: {
        calories: "N/A",
        protein: "N/A",
        carbs: "N/A",
        fat: "N/A"
      },
      ingredients: [],
      steps: []
    };
  }
};

const parseMarkdownToMealPlan = (markdown: string) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const mealPlan: Record<string, any> = {};
  
  const dayRegex = /\*\*(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday):\*\*/gi;
  const mealRegex = /- (Breakfast|Lunch|Dinner): ([^\n]+)/g;

  let currentDay = "";
  let dayMatch;
  let mealMatch;
  const content = markdown.split(dayRegex);
  
  if (content[0].trim() === '') {
    content.shift();
  }

  for (let i = 0; i < content.length; i += 2) {
    const day = content[i]?.toLowerCase();
    const mealContent = content[i + 1];

    if (day && days.includes(day)) {
      const meals: Record<string, any> = {
        breakfast: null,
        lunch: null,
        dinner: null
      };

      while ((mealMatch = mealRegex.exec(mealContent)) !== null) {
        const [, mealType, mealText] = mealMatch;
        meals[mealType.toLowerCase()] = parseMealDetails(mealText);
      }

      mealPlan[day] = meals;
    }
  }

  days.forEach(day => {
    if (!mealPlan[day]) {
      mealPlan[day] = {
        breakfast: parseMealDetails("Default meal"),
        lunch: parseMealDetails("Default meal"),
        dinner: parseMealDetails("Default meal")
      };
    }
  });

  return mealPlan;
};

export const generateMealPlan = async (additionalPreferences: string[] = []) => {
  try {
    const genAI = getGeminiAPI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    
    const userPrefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    const userIngredients = JSON.parse(localStorage.getItem('recognizedIngredients') || '[]');
    const cuisineContext = getCuisineContext(userPrefs.country || 'local');
    
    if (!userIngredients.length) {
      toast.error("Please provide ingredients first");
      return null;
    }

    const ingredientsList = userIngredients.map((i: any) => i.name).join(', ');
    
    const prompt = `Generate a complete 7-day meal plan (Sunday through Saturday) with breakfast, lunch, and dinner for each day using these ingredients: ${ingredientsList}.
    
    STRICT REQUIREMENTS:
    1. ONLY use the provided ingredients. Do not suggest meals that require ingredients not in the list.
    2. Focus EXCLUSIVELY on ${userPrefs.cuisineStyle || 'traditional'} ${cuisineContext} dishes
    3. Follow dietary preference: ${userPrefs.dietaryPreference || 'no specific preference'}
    4. Avoid allergens: ${userPrefs.allergies?.join(', ') || 'none'}
    5. Each meal MUST be possible to make with ONLY the provided ingredients
    6. Include approximate nutritional information for each meal
    7. ONLY suggest REAL, AUTHENTIC, and TRADITIONAL meals from ${cuisineContext}
    8. NO FUSION or EXPERIMENTAL dishes - stick to well-known traditional recipes
    9. Format MUST be exactly as shown below for proper parsing:
    
    **Sunday:**
    - Breakfast: Traditional Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    - Lunch: Traditional Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    - Dinner: Traditional Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    
    [Repeat for Monday through Saturday]`;

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
      console.log("Generated meal plan:", mealPlan);
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