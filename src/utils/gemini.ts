import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

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

export const generateRecipeFromImage = async (imageDescription: string) => {
  try {
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