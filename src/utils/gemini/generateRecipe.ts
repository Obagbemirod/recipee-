import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    toast.error("Gemini API key is not set");
    throw new Error("Invalid or missing Gemini API key");
  }
  
  return new GoogleGenerativeAI(apiKey);
};

export const generateRecipeFromImage = async (imageData: string) => {
  try {
    const genAI = getGeminiAPI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Remove the data URL prefix if present
    const base64Data = imageData.includes('base64,') 
      ? imageData.split('base64,')[1] 
      : imageData;

    const prompt = `Analyze this image and identify all food ingredients visible in it. 
    Return the response in this exact JSON format:
    {
      "ingredients": [
        {"item": "ingredient name", "amount": "approximate amount"}
      ]
    }
    Only include ingredients you are highly confident about seeing in the image.`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 1024,
      },
    });

    const response = await result.response;
    const text = response.text().trim();
    
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      const parsed = JSON.parse(jsonStr);
      
      // Convert to the expected format
      return {
        ingredients: parsed.ingredients.map((ing: any) => ({
          item: ing.item,
          amount: ing.amount || "amount not specified"
        }))
      };
    } catch (parseError) {
      console.error('Failed to parse ingredients response:', text);
      throw new Error("Failed to parse the ingredients from the image");
    }
  } catch (error: any) {
    console.error('Error generating recipe:', error);
    if (error.message?.includes('API key')) {
      throw new Error("Invalid API key configuration");
    }
    throw error;
  }
};