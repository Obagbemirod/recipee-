import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("Gemini API key is not set. Using mock data instead.");
    return null;
  }
  
  return new GoogleGenerativeAI(apiKey);
};

const mockRecipe = {
  name: "Classic Homemade Burger",
  ingredients: [
    {item: "ground beef", amount: "1/2 pound"},
    {item: "burger bun", amount: "1"},
    {item: "lettuce", amount: "1 leaf"},
    {item: "tomato", amount: "2 slices"},
    {item: "cheese", amount: "1 slice"}
  ],
  instructions: [
    {step: 1, description: "Form the patty", time: "2 minutes"},
    {step: 2, description: "Cook on medium-high heat", time: "4-5 minutes per side"}
  ],
  equipment: ["Pan", "Spatula"],
  totalTime: "15 minutes",
  difficulty: "Easy",
  servings: 1
};

export const generateRecipeFromImage = async (imageData: string) => {
  try {
    const genAI = getGeminiAPI();
    if (!genAI) {
      return mockRecipe;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    // Convert base64 to parts array for the API
    const imagePart = {
      inlineData: {
        data: imageData.split(',')[1], // Remove the data:image/jpeg;base64, part
        mimeType: "image/jpeg"
      }
    };

    const prompt = `Analyze this image and provide a recipe in the following JSON format:
    {
      "name": "dish name",
      "ingredients": [{"item": "ingredient", "amount": "measurement"}],
      "instructions": [{"step": 1, "description": "instruction", "time": "duration"}],
      "equipment": ["item1", "item2"],
      "totalTime": "duration",
      "difficulty": "level",
      "servings": number
    }`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text().trim();
    
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse recipe response:', text);
      return mockRecipe;
    }
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw error;
  }
};