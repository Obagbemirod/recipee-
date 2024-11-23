import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateRecipeFromImage } from "@/utils/gemini";

interface PhotoUploadSectionProps {
  isUploading: boolean;
  onIngredientsIdentified: (ingredients: { name: string; confidence: number }[]) => void;
}

export const PhotoUploadSection = ({ isUploading, onIngredientsIdentified }: PhotoUploadSectionProps) => {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Convert image to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        
        // Generate recipe from the image
        const recipe = await generateRecipeFromImage(base64String);
        
        // Extract ingredients from recipe and convert to required format
        const ingredients = recipe.ingredients.map(ing => ({
          name: ing.item,
          confidence: 0.95 // Setting a default high confidence since these are from recipe
        }));
        
        onIngredientsIdentified(ingredients);
        toast.success("Photo processed successfully!");
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Failed to process photo. Please try again.");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-primary hover:border-2 transition-all duration-300">
      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <Loader2 className="h-12 w-12 text-primary mb-4 animate-spin" />
          ) : (
            <Camera className="h-12 w-12 text-primary mb-4" />
          )}
          <p className="mb-2 text-sm text-secondary">
            <span className="font-semibold">Upload a photo</span>
          </p>
          <p className="text-xs text-secondary/70">PNG, JPG or HEIC (MAX. 10MB)</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};