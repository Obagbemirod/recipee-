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
  const [localIsUploading, setLocalIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    setLocalIsUploading(true);

    try {
      // Convert image to base64
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Generate recipe from the image
      const recipe = await generateRecipeFromImage(base64String);
      
      // Extract ingredients and convert to required format
      const ingredients = recipe.ingredients.map(ing => ({
        name: ing.item,
        confidence: 0.95 // Setting a default high confidence since these are from recipe
      }));
      
      onIngredientsIdentified(ingredients);
      toast.success("Ingredients identified successfully!");
    } catch (error: any) {
      console.error("Error processing image:", error);
      toast.error(error.message || "Failed to process photo. Please try again.");
    } finally {
      setLocalIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-primary hover:border-2 transition-all duration-300">
      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {(isUploading || localIsUploading) ? (
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
          disabled={isUploading || localIsUploading}
        />
      </label>
    </div>
  );
};