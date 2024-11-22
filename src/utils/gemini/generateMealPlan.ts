import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("Gemini API key is not set. Using mock data instead.");
    return null;
  }
  
  return new GoogleGenerativeAI(apiKey);
};

// Mapping of meal types to relevant images
const mealImages = {
  breakfast: {
    oatmeal: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    yogurt: "https://images.unsplash.com/photo-1626381332631-c2b3ce1e3b52",
    eggs: "https://images.unsplash.com/photo-1525351484163-7529414344d8",
    pancakes: "https://images.unsplash.com/photo-1528207776546-365bb710ee93",
    smoothie: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4",
  },
  lunch: {
    salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af",
    soup: "https://images.unsplash.com/photo-1547592166-23ac45744acd",
    bowl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    wrap: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f",
  },
  dinner: {
    pasta: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
    fish: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
    chicken: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8",
    steak: "https://images.unsplash.com/photo-1544025162-d76694265947",
    vegetarian: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
  }
};

const getImageForMeal = (mealName: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
  const lowerMealName = mealName.toLowerCase();
  const images = mealImages[mealType];
  
  // Find the most appropriate image based on meal name keywords
  const matchingKey = Object.keys(images).find(key => 
    lowerMealName.includes(key)
  );
  
  return matchingKey ? images[matchingKey] : images[Object.keys(images)[0]];
};

const mockMealPlan = {
  monday: {
    breakfast: {
      name: "Oatmeal with Fresh Berries",
      image: mealImages.breakfast.oatmeal,
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
      image: mealImages.lunch.salad,
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
      image: mealImages.dinner.fish,
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
      image: mealImages.breakfast.yogurt,
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
      image: mealImages.lunch.bowl,
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
      image: mealImages.dinner.fish,
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
  wednesday: {
    breakfast: {
      name: "Smoothie Bowl",
      image: mealImages.breakfast.smoothie,
      nutrition: {
        calories: "300 kcal",
        protein: "8g",
        carbs: "45g",
        fat: "8g"
      },
      ingredients: [
        { item: "banana", amount: "1" },
        { item: "spinach", amount: "1 cup" },
        { item: "almond milk", amount: "1 cup" },
        { item: "granola", amount: "1/4 cup" }
      ],
      steps: [
        { step: 1, instruction: "Blend banana, spinach, and almond milk", time: "2 mins" },
        { step: 2, instruction: "Pour into a bowl and top with granola", time: "2 mins" }
      ]
    },
    lunch: {
      name: "Veggie Wrap",
      image: mealImages.lunch.wrap,
      nutrition: {
        calories: "350 kcal",
        protein: "12g",
        carbs: "50g",
        fat: "10g"
      },
      ingredients: [
        { item: "whole wheat wrap", amount: "1" },
        { item: "hummus", amount: "2 tbsp" },
        { item: "mixed veggies", amount: "1 cup" }
      ],
      steps: [
        { step: 1, instruction: "Spread hummus on the wrap", time: "1 min" },
        { step: 2, instruction: "Add mixed veggies and roll tightly", time: "2 mins" }
      ]
    },
    dinner: {
      name: "Pasta Primavera",
      image: mealImages.dinner.pasta,
      nutrition: {
        calories: "400 kcal",
        protein: "15g",
        carbs: "60g",
        fat: "12g"
      },
      ingredients: [
        { item: "pasta", amount: "2 cups" },
        { item: "mixed vegetables", amount: "1 cup" },
        { item: "olive oil", amount: "2 tbsp" },
        { item: "parmesan cheese", amount: "1/4 cup" }
      ],
      steps: [
        { step: 1, instruction: "Cook pasta according to package instructions", time: "10 mins" },
        { step: 2, instruction: "Sauté vegetables in olive oil", time: "5 mins" },
        { step: 3, instruction: "Mix pasta with veggies and top with cheese", time: "2 mins" }
      ]
    }
  },
  thursday: {
    breakfast: {
      name: "Chia Pudding",
      image: mealImages.breakfast.pancakes,
      nutrition: {
        calories: "250 kcal",
        protein: "6g",
        carbs: "30g",
        fat: "12g"
      },
      ingredients: [
        { item: "chia seeds", amount: "1/4 cup" },
        { item: "almond milk", amount: "1 cup" },
        { item: "vanilla extract", amount: "1 tsp" },
        { item: "honey", amount: "1 tbsp" }
      ],
      steps: [
        { step: 1, instruction: "Mix all ingredients and let sit overnight", time: "5 mins" },
        { step: 2, instruction: "Serve chilled", time: "1 min" }
      ]
    },
    lunch: {
      name: "Caprese Salad",
      image: mealImages.lunch.salad,
      nutrition: {
        calories: "300 kcal",
        protein: "12g",
        carbs: "15g",
        fat: "20g"
      },
      ingredients: [
        { item: "mozzarella cheese", amount: "100g" },
        { item: "tomatoes", amount: "2" },
        { item: "basil", amount: "a handful" },
        { item: "olive oil", amount: "1 tbsp" }
      ],
      steps: [
        { step: 1, instruction: "Slice mozzarella and tomatoes", time: "2 mins" },
        { step: 2, instruction: "Layer cheese, tomatoes, and basil, drizzling oil over", time: "3 mins" }
      ]
    },
    dinner: {
      name: "Vegetable Stir Fry",
      image: mealImages.dinner.vegetarian,
      nutrition: {
        calories: "400 kcal",
        protein: "20g",
        carbs: "70g",
        fat: "15g"
      },
      ingredients: [
        { item: "broccoli", amount: "1 cup" },
        { item: "bell pepper", amount: "1", },
        { item: "soy sauce", amount: "2 tbsp" },
        { item: "rice", amount: "1 cup" }
      ],
      steps: [
        { step: 1, instruction: "Sauté vegetables in soy sauce", time: "5 mins" },
        { step: 2, instruction: "Serve over cooked rice", time: "2 mins" }
      ]
    }
  },
  friday: {
    breakfast: {
      name: "Avocado Toast",
      image: mealImages.breakfast.smoothie,
      nutrition: {
        calories: "300 kcal",
        protein: "8g",
        carbs: "40g",
        fat: "15g"
      },
      ingredients: [
        { item: "whole grain bread", amount: "2 slices" },
        { item: "avocado", amount: "1" },
        { item: "salt", amount: "to taste" }
      ],
      steps: [
        { step: 1, instruction: "Toast the bread", time: "2 mins" },
        { step: 2, instruction: "Mash avocado and spread on toast", time: "2 mins" }
      ]
    },
    lunch: {
      name: "Stuffed Peppers",
      image: mealImages.lunch.wrap,
      nutrition: {
        calories: "350 kcal",
        protein: "20g",
        carbs: "50g",
        fat: "10g"
      },
      ingredients: [
        { item: "bell peppers", amount: "2" },
        { item: "quinoa", amount: "1 cup" },
        { item: "black beans", amount: "1 can" }
      ],
      steps: [
        { step: 1, instruction: "Preheat oven to 375°F", time: "5 mins" },
        { step: 2, instruction: "Mix quinoa and black beans, stuff into peppers", time: "10 mins" },
        { step: 3, instruction: "Bake for 30 minutes", time: "30 mins" }
      ]
    },
    dinner: {
      name: "Fish Tacos",
      image: mealImages.dinner.fish,
      nutrition: {
        calories: "400 kcal",
        protein: "25g",
        carbs: "30g",
        fat: "15g"
      },
      ingredients: [
        { item: "corn tortillas", amount: "3" },
        { item: "grilled fish", amount: "6 oz" },
        { item: "cabbage", amount: "1 cup" }
      ],
      steps: [
        { step: 1, instruction: "Warm tortillas", time: "2 mins" },
        { step: 2, instruction: "Assemble tacos with fish and cabbage", time: "3 mins" }
      ]
    }
  },
  saturday: {
    breakfast: {
      name: "Fruit Salad",
      image: mealImages.breakfast.yogurt,
      nutrition: {
        calories: "200 kcal",
        protein: "2g",
        carbs: "50g",
        fat: "1g"
      },
      ingredients: [
        { item: "mixed fruits", amount: "2 cups" },
        { item: "honey", amount: "1 tbsp" }
      ],
      steps: [
        { step: 1, instruction: "Chop fruit and mix in a bowl", time: "5 mins" },
        { step: 2, instruction: "Drizzle honey over fruit", time: "1 min" }
      ]
    },
    lunch: {
      name: "Pasta Salad",
      image: mealImages.lunch.bowl,
      nutrition: {
        calories: "350 kcal",
        protein: "10g",
        carbs: "60g",
        fat: "10g"
      },
      ingredients: [
        { item: "pasta", amount: "2 cups" },
        { item: "cherry tomatoes", amount: "1 cup" },
        { item: "olive oil", amount: "2 tbsp" },
        { item: "basil", amount: "a handful" }
      ],
      steps: [
        { step: 1, instruction: "Cook pasta according to package instructions", time: "10 mins" },
        { step: 2, instruction: "Mix with tomatoes, olive oil, and basil", time: "5 mins" }
      ]
    },
    dinner: {
      name: "Beef Stir Fry",
      image: mealImages.dinner.vegetarian,
      nutrition: {
        calories: "500 kcal",
        protein: "30g",
        carbs: "40g",
        fat: "25g"
      },
      ingredients: [
        { item: "beef strips", amount: "1 lb" },
        { item: "broccoli", amount: "1 cup" },
        { item: "soy sauce", amount: "2 tbsp" }
      ],
      steps: [
        { step: 1, instruction: "Stir fry beef in a pan", time: "5 mins" },
        { step: 2, instruction: "Add broccoli and soy sauce, and cook", time: "5 mins" }
      ]
    }
  },
  sunday: {
    breakfast: {
      name: "Pancakes",
      image: mealImages.breakfast.pancakes,
      nutrition: {
        calories: "400 kcal",
        protein: "8g",
        carbs: "60g",
        fat: "10g"
      },
      ingredients: [
        { item: "flour", amount: "1 cup" },
        { item: "milk", amount: "1 cup" },
        { item: "egg", amount: "1" },
        { item: "maple syrup", amount: "to taste" }
      ],
      steps: [
        { step: 1, instruction: "Mix batter ingredients", time: "5 mins" },
        { step: 2, instruction: "Cook on a skillet for 3 minutes on each side", time: "6 mins" }
      ]
    },
    lunch: {
      name: "Caesar Salad",
      image: mealImages.lunch.salad,
      nutrition: {
        calories: "350 kcal",
        protein: "15g",
        carbs: "20g",
        fat: "25g"
      },
      ingredients: [
        { item: "romaine lettuce", amount: "2 cups" },
        { item: "croutons", amount: "1/2 cup" },
        { item: "Caesar dressing", amount: "2 tbsp" }
      ],
      steps: [
        { step: 1, instruction: "Chop lettuce and mix with dressing", time: "3 mins" },
        { step: 2, instruction: "Top with croutons", time: "1 min" }
      ]
    },
    dinner: {
      name: "Roasted Chicken",
      image: mealImages.dinner.chicken,
      nutrition: {
        calories: "600 kcal",
        protein: "45g",
        carbs: "20g",
        fat: "30g"
      },
      ingredients: [
        { item: "whole chicken", amount: "1" },
        { item: "seasoning", amount: "to taste" },
        { item: "vegetables", amount: "2 cups" }
      ],
      steps: [
        { step: 1, instruction: "Preheat oven to 400°F", time: "10 mins" },
        { step: 2, instruction: "Season and roast chicken for 1 hour", time: "60 mins" }
      ]
    }
  }
};

export const generateMealPlan = async (preferences: string[]) => {
  try {
    const genAI = getGeminiAPI();
    if (!genAI) {
      return mockMealPlan;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Create a 7-day meal plan (Monday through Sunday) based on these preferences: ${preferences.join(", ")}
    Each meal should be unique and different from previous generations.
    Return ONLY a JSON object with the following structure for each day and meal:
    {
      "dayOfWeek": {
        "breakfast/lunch/dinner": {
          "name": "meal name",
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
        temperature: 0.9, // Increased for more variation
        maxOutputTokens: 2000,
      }
    });

    const response = await result.response;
    const text = response.text().trim();
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      const mealPlan = JSON.parse(jsonStr);
      
      // Add appropriate images to each meal
      Object.keys(mealPlan).forEach(day => {
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
          if (mealPlan[day][mealType]) {
            mealPlan[day][mealType].image = getImageForMeal(
              mealPlan[day][mealType].name,
              mealType as 'breakfast' | 'lunch' | 'dinner'
            );
          }
        });
      });
      
      return mealPlan;
    } catch (parseError) {
      console.error('Failed to parse meal plan response:', jsonStr);
      return mockMealPlan;
    }
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};
