import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("Gemini API key is not set. Using mock data instead.");
    return null;
  }
  
  return new GoogleGenerativeAI(apiKey);
};

const mockMealPlan = {
  monday: {
    breakfast: "Oatmeal with fresh berries",
    lunch: "Grilled chicken salad",
    dinner: "Baked salmon with vegetables"
  },
  tuesday: {
    breakfast: "Yogurt parfait",
    lunch: "Quinoa bowl",
    dinner: "Turkey meatballs"
  },
  wednesday: {
    breakfast: "Smoothie bowl",
    lunch: "Veggie wrap",
    dinner: "Stir-fry"
  },
  thursday: {
    breakfast: "Eggs and toast",
    lunch: "Caesar salad",
    dinner: "Pasta primavera"
  },
  friday: {
    breakfast: "Pancakes",
    lunch: "Taco salad",
    dinner: "Grilled fish"
  },
  saturday: {
    breakfast: "Muffins",
    lunch: "Vegetable soup",
    dinner: "Tofu stir-fry"
  },
  sunday: {
    breakfast: "Fruit salad",
    lunch: "Sandwich",
    dinner: "Curry"
  }
};

export const generateMealPlan = async (preferences: string[]) => {
  try {
    const genAI = getGeminiAPI();
    if (!genAI) {
      return mockMealPlan;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Create a 7-day meal plan based on these preferences: ${preferences.join(", ")}
    Return ONLY a JSON object with the following structure, nothing else:
    {
      "monday": {
        "breakfast": "meal description",
        "lunch": "meal description",
        "dinner": "meal description"
      },
      // ... and so on for all days of the week
    }`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2000,
      }
    });

    const response = await result.response;
    const text = response.text().trim();
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse meal plan response:', jsonStr);
      return mockMealPlan;
    }
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};