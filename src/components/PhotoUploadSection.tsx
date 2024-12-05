import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { generateRecipeFromImage } from "@/utils/gemini/generateRecipe";
import { normalizeIngredient } from "@/utils/ingredientMapping";

interface PhotoUploadSectionProps {
  isUploading: boolean;
  onIngredientsIdentified: (ingredients: { name: string; confidence: number }[]) => void;
}

export const PhotoUploadSection = ({ isUploading, onIngredientsIdentified }: PhotoUploadSectionProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        
        try {
          // Get recipe from image
          const recipe = await generateRecipeFromImage(base64String);
          
          if (!recipe || !recipe.ingredients) {
            throw new Error("Invalid recipe data received");
          }

          // Normalize ingredient names
          const ingredients = recipe.ingredients.map(ing => ({
            name: normalizeIngredient(ing.item),
            confidence: ing.confidence || 1.0
          }));

          onIngredientsIdentified(ingredients);
          toast.success('Ingredients identified successfully!');
        } catch (error) {
          console.error('Error processing recipe:', error);
          toast.error('Failed to identify ingredients from image');
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={isUploading || isProcessing}
        className="cursor-pointer"
      />
      
      {selectedImage && (
        <div className="mt-4">
          <img
            src={selectedImage}
            alt="Selected"
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}
      
      {(isUploading || isProcessing) && (
        <div className="text-center text-muted-foreground">
          Processing image...
        </div>
      )}
    </div>
  );
};