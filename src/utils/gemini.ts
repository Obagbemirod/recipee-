import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with fallback to mock data
const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("Gemini API key is not set. Using mock data instead. To use real data, set VITE_GEMINI_API_KEY in your environment variables.");
    return null;
  }
  
  return new GoogleGenerativeAI(apiKey);
};

const genAI = getGeminiAPI();

const mockMealPlan = {
  "monday": {
    "breakfast": "Oatmeal with fresh berries and honey",
    "lunch": "Grilled chicken salad with avocado",
    "dinner": "Baked salmon with roasted vegetables"
  },
  "tuesday": {
    "breakfast": "Greek yogurt parfait with granola",
    "lunch": "Quinoa bowl with chickpeas and vegetables",
    "dinner": "Turkey meatballs with whole grain pasta"
  },
  // ... rest of the week with similar structure
};

const mockRecipe = {
  "name": "Classic Homemade Burger",
  "ingredients": [
    {"item": "ground beef", "amount": "1/2 pound"},
    {"item": "burger bun", "amount": "1"},
    {"item": "lettuce", "amount": "1 leaf"},
    {"item": "tomato", "amount": "2 slices"},
    {"item": "cheese", "amount": "1 slice"}
  ],
  "instructions": [
    {"step": 1, "description": "Form the patty", "time": "2 minutes"},
    {"step": 2, "description": "Cook on medium-high heat", "time": "4-5 minutes per side"}
  ],
  "equipment": ["Pan", "Spatula"],
  "totalTime": "15 minutes",
  "difficulty": "Easy",
  "servings": 1
};

export const identifyIngredients = async (input: string) => {
  try {
    if (!genAI) {
      return ["tomato", "lettuce", "cheese", "beef patty", "burger bun"];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Please identify and list all ingredients from the following input: ${input}
    Format the response as a JSON array of ingredients.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error identifying ingredients:', error);
    throw error;
  }
};

export const generateRecipeFromImage = async (imageDescription: string) => {
  try {
    if (!genAI) {
      return mockRecipe;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Given this dish: "${imageDescription}", please provide:
    1. The name of the dish
    2. A detailed list of all ingredients with exact measurements
    3. Step-by-step cooking instructions including timing for each step
    4. Cooking temperature where applicable
    5. Required kitchen equipment
    6. Total preparation and cooking time
    7. Difficulty level
    8. Number of servings
    
    Format the response as a JSON object with the following structure:
    {
      "name": "dish name",
      "ingredients": [{"item": "ingredient", "amount": "measurement"}],
      "instructions": [{"step": 1, "description": "instruction", "time": "duration"}],
      "equipment": ["item1", "item2"],
      "totalTime": "duration",
      "difficulty": "level",
      "servings": number
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw error;
  }
};

export const generateMealPlan = async (preferences: string[]) => {
  try {
    if (!genAI) {
      return mockMealPlan;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Create a 7-day meal plan based on these preferences: ${preferences.join(", ")}
    Please include breakfast, lunch, and dinner for each day.
    Format the response as a JSON object with days as keys and meals as nested objects.
    Example structure:
    {
      "monday": {
        "breakfast": "meal description",
        "lunch": "meal description",
        "dinner": "meal description"
      },
      // ... rest of the week
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};
