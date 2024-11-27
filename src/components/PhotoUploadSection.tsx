import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateRecipeFromImage } from "@/utils/gemini";

interface PhotoUploadSectionProps {
  isUploading: boolean;
  onPhotoSelected: (preview: string) => void;
  onRecipeGenerated: (recipe: any) => void;
}

export const PhotoUploadSection = ({ isUploading, onPhotoSelected, onRecipeGenerated }: PhotoUploadSectionProps) => {
  const [localIsUploading, setLocalIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

    try {
      // Convert image to base64 and set preview
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setSelectedImage(base64String);
      onPhotoSelected(base64String);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process photo. Please try again.");
    }
  };

  const handleGenerateRecipe = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setLocalIsUploading(true);

    try {
      const recipe = await generateRecipeFromImage(selectedImage);
      onRecipeGenerated(recipe);
      toast.success("Recipe generated successfully!");
    } catch (error: any) {
      console.error("Error generating recipe:", error);
      toast.error(error.message || "Failed to generate recipe. Please try again.");
    } finally {
      setLocalIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
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

      {selectedImage && (
        <div className="flex justify-center">
          <Button
            onClick={handleGenerateRecipe}
            disabled={localIsUploading}
            className="w-full md:w-auto"
          >
            {localIsUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Recipe...
              </>
            ) : (
              'Generate Recipe'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};