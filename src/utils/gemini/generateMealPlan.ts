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
    breakfast: {
      name: "Oatmeal with Fresh Berries",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
      nutrition: {
        calories: "320 kcal",
        protein: "12g",
        carbs: "45g",
        fat: "8g"
      },
      ingredients: [
        { item: "rolled oats", amount: "1 cup" },
        { item: "mixed berries", amount: "1/2 cup" },
        { item: "honey", amount: "1 tbsp" }
      ],
      steps: [
        { step: 1, instruction: "Bring water to boil", time: "2 mins" },
        { step: 2, instruction: "Add oats and cook", time: "5 mins" },
        { step: 3, instruction: "Top with berries and honey" }
      ]
    },
    lunch: {
      name: "Grilled Chicken Salad",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
      nutrition: {
        calories: "420 kcal",
        protein: "35g",
        carbs: "25g",
        fat: "22g"
      },
      ingredients: [
        { item: "chicken breast", amount: "6 oz" },
        { item: "mixed greens", amount: "2 cups" },
        { item: "olive oil", amount: "1 tbsp" }
      ],
      steps: [
        { step: 1, instruction: "Season chicken", time: "2 mins" },
        { step: 2, instruction: "Grill chicken", time: "12 mins" },
        { step: 3, instruction: "Assemble salad" }
      ]
    },
    dinner: {
      name: "Baked Salmon with Vegetables",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
      nutrition: {
        calories: "520 kcal",
        protein: "42g",
        carbs: "30g",
        fat: "28g"
      },
      ingredients: [
        { item: "salmon fillet", amount: "6 oz" },
        { item: "mixed vegetables", amount: "2 cups" },
        { item: "lemon", amount: "1" }
      ],
      steps: [
        { step: 1, instruction: "Preheat oven", time: "10 mins" },
        { step: 2, instruction: "Season salmon", time: "2 mins" },
        { step: 3, instruction: "Bake", time: "18 mins" }
      ]
    }
  },
  tuesday: {
    breakfast: {
      name: "Yogurt parfait",
      image: "https://images.unsplash.com/photo-1626381332631-c2b3ce1e3b52",
      nutrition: {
        calories: "250 kcal",
        protein: "10g",
        carbs: "32g",
        fat: "8g"
      },
      ingredients: [
        { item: "yogurt", amount: "1 cup" },
        { item: "granola", amount: "1/4 cup" },
        { item: "honey", amount: "1 tsp" },
        { item: "berries", amount: "1/2 cup" }
      ],
      steps: [
        { step: 1, instruction: "Layer yogurt, granola, and berries in a glass", time: "5 mins" },
        { step: 2, instruction: "Drizzle honey on top", time: "1 min" }
      ]
    },
    lunch: {
      name: "Quinoa bowl",
      image: "https://images.unsplash.com/photo-1619239004571-2a7be8c2b0e7",
      nutrition: {
        calories: "400 kcal",
        protein: "15g",
        carbs: "60g",
        fat: "10g"
      },
      ingredients: [
        { item: "quinoa", amount: "1 cup" },
        { item: "black beans", amount: "1/2 cup" },
        { item: "corn", amount: "1/2 cup" },
        { item: "avocado", amount: "1" }
      ],
      steps: [
        { step: 1, instruction: "Cook quinoa as per package instructions", time: "15 mins" },
        { step: 2, instruction: "Mix in black beans and corn", time: "5 mins" },
        { step: 3, instruction: "Top with sliced avocado", time: "2 mins" }
      ]
    },
    dinner: {
      name: "Turkey meatballs",
      image: "https://images.unsplash.com/photo-1592270192031-9eb961857a25",
      nutrition: {
        calories: "450 kcal",
        protein: "35g",
        carbs: "15g",
        fat: "25g"
      },
      ingredients: [
        { item: "ground turkey", amount: "1 lb" },
        { item: "breadcrumbs", amount: "1/2 cup" },
        { item: "egg", amount: "1" },
        { item: "parmesan cheese", amount: "1/4 cup" }
      ],
      steps: [
        { step: 1, instruction: "Mix all ingredients in a bowl", time: "5 mins" },
        { step: 2, instruction: "Form into meatballs", time: "10 mins" },
        { step: 3, instruction: "Bake in preheated oven at 400°F for 20 mins", time: "20 mins" }
      ]
    }
  },
  // ... keep existing code (other days with similar structure)
};

export const generateMealPlan = async (preferences: string[]) => {
  try {
    const genAI = getGeminiAPI();
    if (!genAI) {
      return mockMealPlan;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Create a 7-day meal plan based on these preferences: ${preferences.join(", ")}
    Return ONLY a JSON object with the following structure for each meal:
    {
      "dayOfWeek": {
        "breakfast/lunch/dinner": {
          "name": "meal name",
          "image": "URL to meal image",
          "nutrition": {
            "calories": "amount",
            "protein": "amount",
            "carbs": "amount",
            "fat": "amount"
          },
          "ingredients": [
            {"item": "ingredient", "amount": "measurement"}
          ],
          "steps": [
            {"step": number, "instruction": "step description", "time": "duration"}
          ]
        }
      }
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
