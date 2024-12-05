import { MealDetails } from "@/types/meal";
import { ParsedMealPlan, WeeklyMealPlan } from "@/types/mealPlan";

const parseMealDetails = (text: string): MealDetails | null => {
  try {
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
  } catch (error) {
    console.error("Error parsing meal details:", error);
    return null;
  }
};

export const parseMarkdownToMealPlan = (markdown: string): WeeklyMealPlan | null => {
  try {
    const days: ParsedMealPlan = {};
    const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayRegex = /\*\*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\*\*/gi;
    const mealRegex = /- (Breakfast|Lunch|Dinner): ([^\n]+)/g;

    // Split the markdown into sections by day
    const sections = markdown.split(dayRegex);
    sections.shift(); // Remove the first empty element

    for (let i = 0; i < sections.length; i += 2) {
      const day = sections[i].toLowerCase();
      const content = sections[i + 1];
      const meals: Record<string, MealDetails> = {};

      // Parse meals for each day
      let mealMatch;
      while ((mealMatch = mealRegex.exec(content)) !== null) {
        const [, mealType, mealText] = mealMatch;
        const mealDetails = parseMealDetails(mealText);
        if (mealDetails) {
          meals[mealType.toLowerCase()] = mealDetails;
        }
      }

      if (Object.keys(meals).length > 0) {
        days[day] = meals;
      }
    }

    // Reorder days starting from Sunday
    const orderedDays: WeeklyMealPlan = {};
    dayOrder.forEach(day => {
      if (days[day]) {
        orderedDays[day] = days[day] as any;
      }
    });

    // Validate the meal plan structure
    const isValid = Object.keys(orderedDays).length === 7 && 
                   Object.values(orderedDays).every(day => 
                     day.breakfast && day.lunch && day.dinner);

    if (!isValid) {
      console.error("Invalid meal plan structure:", orderedDays);
      return null;
    }

    return orderedDays;
  } catch (error) {
    console.error("Error parsing meal plan:", error);
    return null;
  }
};