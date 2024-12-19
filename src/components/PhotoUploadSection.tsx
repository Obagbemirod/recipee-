import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateRecipeFromImage } from "@/utils/gemini";
import { normalizeIngredient } from "@/utils/ingredientMapping";

interface Ingredient {
  name: string;
  confidence: number;
}

interface PhotoUploadSectionProps {
  isUploading: boolean;
  onIngredientsIdentified: (ingredients: Ingredient[]) => void;
  setImagePreview?: React.Dispatch<React.SetStateAction<File>>
}

export const PhotoUploadSection = ({ isUploading, onIngredientsIdentified, setImagePreview }: PhotoUploadSectionProps) => {
  const [localIsUploading, setLocalIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImagePreview(file)

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    try {
      setLocalIsUploading(true);

      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setSelectedImage(base64String);

      // Get user's country from localStorage for context-aware identification
      const userCountry = localStorage.getItem('userCountry') || 'nigeria';
      const userCuisine = localStorage.getItem('userCuisine') || '';

      const recipe = await generateRecipeFromImage(base64String, userCountry, userCuisine);

      // Normalize ingredient names based on user's country and cuisine
      const ingredients = recipe.ingredients.map(ing => ({
        name: normalizeIngredient(ing.item, userCountry),
        confidence: ing.confidence || 1.0
      }));

      onIngredientsIdentified(ingredients);
      toast.success("Recipe ingredients identified successfully!");
    } catch (error: any) {
      console.error("Error processing image:", error);
      toast.error(error.message || "Failed to process photo. Please try again.");
    } finally {
      setLocalIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-8 border border-primary hover:border-2 transition-all duration-300">
        <label className="flex flex-col items-center justify-center w-full h-48 md:h-64 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {(isUploading || localIsUploading) ? (
              <Loader2 className="h-8 w-8 md:h-12 md:w-12 text-primary mb-4 animate-spin" />
            ) : (
              <Camera className="h-8 w-8 md:h-12 md:w-12 text-primary mb-4" />
            )}
            <p className="mb-2 text-sm md:text-base text-secondary">
              <span className="font-semibold">Upload a photo</span>
            </p>
            <p className="text-xs md:text-sm text-secondary/70">PNG, JPG or HEIC (MAX. 10MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading || localIsUploading}
          />
        </label>
      </div>

      {selectedImage && (
        <div className="flex justify-center">
          <img
            src={selectedImage}
            alt="Selected food"
            className="max-h-48 rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
};