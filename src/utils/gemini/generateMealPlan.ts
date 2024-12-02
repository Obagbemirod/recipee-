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
  try {
    const sections = text.split('---');
    const basicInfo = sections[0].trim();
    const nutritionSection = sections[1]?.trim() || '';
    const ingredientsSection = sections[2]?.trim() || '';
    const stepsSection = sections[3]?.trim() || '';

    // Parse nutrition info
    const nutrition = {
      calories: nutritionSection.match(/Calories: ([\d.]+)/)?.[1] + ' kcal' || 'N/A',
      protein: nutritionSection.match(/Protein: ([\d.]+)g/)?.[1] + 'g' || 'N/A',
      carbs: nutritionSection.match(/Carbs: ([\d.]+)g/)?.[1] + 'g' || 'N/A',
      fat: nutritionSection.match(/Fat: ([\d.]+)g/)?.[1] + 'g' || 'N/A'
    };

    // Parse ingredients
    const ingredients = ingredientsSection
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [amount, ...itemParts] = line.split(' ');
        return {
          amount: amount,
          item: itemParts.join(' ').trim()
        };
      });

    // Parse steps
    const steps = stepsSection
      .split('\n')
      .filter(line => line.trim())
      .map((line, index) => {
        const timeMatch = line.match(/\((\d+)\s*(?:min|mins|minutes)\)/);
        return {
          step: index + 1,
          instruction: line.replace(/\(\d+\s*(?:min|mins|minutes)\)/, '').trim(),
          time: timeMatch ? `${timeMatch[1]} mins` : undefined
        };
      });

    return {
      name: basicInfo.split('(')[0].trim(),
      nutrition,
      ingredients,
      steps
    };
  } catch (error) {
    console.error('Error parsing meal details:', error);
    return {
      name: text.split('(')[0].trim(),
      nutrition: {
        calories: 'N/A',
        protein: 'N/A',
        carbs: 'N/A',
        fat: 'N/A'
      },
      ingredients: [],
      steps: []
    };
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
    
    const prompt = `Generate a detailed 7-day meal plan (Sunday to Saturday) using these ingredients: ${ingredientsList}.

    STRICT REQUIREMENTS:
    1. Generate ALL 7 days from Sunday to Saturday
    2. Each day MUST have breakfast, lunch, and dinner
    3. ONLY use the provided ingredients: ${ingredientsList}
    4. Focus on ${userPrefs.cuisineStyle || 'traditional'} cuisine from ${userPrefs.country || 'local'} region
    5. Follow dietary preference: ${userPrefs.dietaryPreference || 'no specific preference'}
    6. Avoid allergens: ${userPrefs.allergies?.join(', ') || 'none'}
    7. Each meal MUST include:
       - Name of the dish
       - Detailed nutritional information
       - List of ingredients with amounts
       - Step-by-step cooking instructions with estimated time

    Format each meal as:
    **[Day]:**
    - Breakfast: [Meal Name]
    ---
    Calories: X
    Protein: Xg
    Carbs: Xg
    Fat: Xg
    ---
    [Ingredients list with amounts]
    ---
    [Numbered cooking steps with time estimates]

    [Repeat for Lunch and Dinner]`;

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
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const mealPlan = {};
      
      const dayRegex = /\*\*(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday):\*\*/g;
      const mealRegex = /- (Breakfast|Lunch|Dinner):([\s\S]*?)(?=(?:- (?:Breakfast|Lunch|Dinner):|$|\*\*))/g;
      
      let dayMatch;
      let currentDay = '';
      
      while ((dayMatch = dayRegex.exec(text)) !== null) {
        currentDay = dayMatch[1].toLowerCase();
        mealPlan[currentDay] = {
          breakfast: {},
          lunch: {},
          dinner: {}
        };
        
        const dayContent = text.slice(dayMatch.index + dayMatch[0].length);
        let mealMatch;
        
        while ((mealMatch = mealRegex.exec(dayContent)) !== null) {
          const [, mealType, mealContent] = mealMatch;
          mealPlan[currentDay][mealType.toLowerCase()] = parseMealDetails(mealContent.trim());
          
          if (dayRegex.test(dayContent.slice(mealMatch.index))) {
            break;
          }
        }
      }
      
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