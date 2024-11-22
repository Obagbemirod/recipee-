import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');

export const identifyIngredients = async (input: string) => {
  try {
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

export const generateMealPlan = async (ingredients: string[]) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Create a one-week meal plan using these ingredients: ${ingredients.join(', ')}
    Format the response as a JSON object with days of the week and meals for each day.
    Consider nutritional balance and variety.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};