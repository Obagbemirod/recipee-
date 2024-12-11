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
  // Remove asterisks from the meal name
  const cleanedText = text.replace(/\*/g, '');
  
  const caloriesMatch = cleanedText.match(/Calories: (\d+)/);
  const proteinMatch = cleanedText.match(/Protein: (\d+)g/);
  const carbsMatch = cleanedText.match(/Carbs: (\d+)g/);
  const fatMatch = cleanedText.match(/Fat: (\d+)g/);

  return {
    name: cleanedText.split('(')[0].trim(),
    nutrition: {
      calories: caloriesMatch ? `${caloriesMatch[1]} kcal` : "N/A",
      protein: proteinMatch ? `${proteinMatch[1]}g` : "N/A",
      carbs: carbsMatch ? `${carbsMatch[1]}g` : "N/A",
      fat: fatMatch ? `${fatMatch[1]}g` : "N/A"
    },
    ingredients: [
      { item: "Ingredients will be provided", amount: "as needed" }
    ],
    steps: [
      { step: 1, instruction: "Detailed cooking instructions will be provided", time: "TBD" }
    ]
  };
};

const parseMarkdownToMealPlan = (markdown: string) => {
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

  return orderedDays;
};

export const generateMealPlan = async (additionalPreferences: string[] = []) => {
  try {
    const genAI = getGeminiAPI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    
    const userPrefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    const country = localStorage.getItem('userCountry') || userPrefs.country || 'local';
    const cuisine = localStorage.getItem('userCuisine') || userPrefs.cuisineStyle || 'traditional';
    
    console.log("Generating meal plan with:", {
      country,
      cuisine,
      preferences: additionalPreferences
    });

    const prompt = `Generate a 7-day meal plan (Sunday to Saturday) with breakfast, lunch, and dinner for each day.

STRICT AUTHENTICITY REQUIREMENTS:
1. ONLY generate authentic ${cuisine} dishes that are SPECIFICALLY from ${country}
2. Every meal MUST be a real, traditional, and well-known dish from ${country}
3. DO NOT include any fusion dishes, modern interpretations, or non-${country} dishes
4. If a meal isn't traditionally from ${country}, DO NOT include it
5. Each meal must be verifiably part of ${country}'s culinary tradition
6. Use only ingredients that are commonly available and traditionally used in ${country}
7. Follow authentic ${country} cooking methods and techniques
8. Maintain traditional meal composition and portion sizes specific to ${country}
9. Include traditional breakfast items that are actually eaten in ${country}
10. Respect traditional meal times and customs of ${country}

USER PREFERENCES:
${additionalPreferences.map(pref => `- ${pref}`).join('\n')}
Dietary Preference: ${userPrefs.dietaryPreference || 'no specific preference'}
Allergens to Avoid: ${userPrefs.allergies?.join(', ') || 'none'}

RESPONSE FORMAT REQUIREMENTS:
Format each meal exactly as follows:
Sunday:
- Breakfast: Traditional Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
- Lunch: Traditional Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)
- Dinner: Traditional Meal Name (Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg)

[Continue for Monday through Saturday in the same format]

AUTHENTICITY CHECK:
If you cannot generate authentic ${country} dishes or are unsure about the authenticity of any meal, respond with an error message instead of creating non-authentic or fusion meals.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 32000,
      }
    });

    const response = await result.response;
    const text = response.text().trim();
    
    // Check if the response contains an error message
    if (text.toLowerCase().includes("error") || text.toLowerCase().includes("cannot generate")) {
      console.error('AI indicated it cannot generate authentic meals:', text);
      toast.error(`Unable to generate authentic ${country} meals. Please try a different cuisine or country.`);
      return null;
    }
    
    console.log("Generated meal plan response:", text);
    
    try {
      const mealPlan = parseMarkdownToMealPlan(text);
      console.log("Parsed meal plan:", mealPlan);
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