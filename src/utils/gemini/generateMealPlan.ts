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

const parseMealDetails = (text: string) => {
  console.log("Parsing meal details:", text);
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
  console.log("Parsing markdown to meal plan:", markdown);
  const days = {};
  const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayRegex = /\*\*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\*\*/g;
  const mealRegex = /- (Breakfast|Lunch|Dinner): ([^\n]+)/g;

  let currentDay = "";
  let matches;

  const sections = markdown.split(dayRegex);
  sections.shift();

  for (let i = 0; i < sections.length; i += 2) {
    const day = sections[i].toLowerCase();
    const content = sections[i + 1];
    const meals = {};

    while ((matches = mealRegex.exec(content)) !== null) {
      const [, mealType, mealText] = matches;
      meals[mealType.toLowerCase()] = parseMealDetails(mealText);
    }

    days[day] = meals;
  }

  // Reorder days starting from Sunday
  const orderedDays = {};
  dayOrder.forEach(day => {
    if (days[day]) {
      orderedDays[day] = days[day];
    }
  });

  console.log("Parsed meal plan:", orderedDays);
  return orderedDays;
};

export const generateMealPlan = async (additionalPreferences: string[] = [], requireIngredients: boolean = true) => {
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
    const selectedCuisinePreference = additionalPreferences.find(pref => pref.includes('Generate meals specific to'));
    
    if (!selectedCuisinePreference) {
      toast.error("Please select a cuisine");
      return null;
    }

    const selectedCuisineValue = selectedCuisinePreference.split('specific to ')[1].split(' cuisine')[0];
    const countryData = COUNTRIES_AND_CUISINES.find(c => c.value === selectedCuisineValue);
    
    if (!countryData) {
      toast.error("Invalid cuisine selected");
      return null;
    }

    const prompt = `Generate a 7-day meal plan (Sunday to Saturday) with breakfast, lunch, and dinner for each day.
    
    STRICT REQUIREMENTS:
    1. ${requireIngredients ? `ONLY use these ingredients: ${ingredientsList}` : 'Use ingredients commonly found in this cuisine'}
    2. Focus EXCLUSIVELY on ${countryData.cuisine} from ${countryData.label}
    3. Follow these additional preferences: ${additionalPreferences.filter(pref => !pref.includes('Generate meals specific to')).join('. ')}
    4. Follow dietary preference: ${userPrefs.dietaryPreference || 'no specific preference'}
    5. Avoid these allergens: ${userPrefs.allergies?.join(', ') || 'none'}
    
    Format each meal EXACTLY as:
    **Sunday:**
    - Breakfast: Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    - Lunch: Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    - Dinner: Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
    
    [Continue for Monday through Saturday in the same format]`;

    console.log("Sending prompt to Gemini:", prompt);

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 32000,
      }
    });

    const response = await result.response;
    const text = response.text().trim();
    console.log("Received response from Gemini:", text);
    
    try {
      const mealPlan = parseMarkdownToMealPlan(text);
      console.log("Final meal plan:", mealPlan);
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