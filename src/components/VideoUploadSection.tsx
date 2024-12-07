import { Button } from "@/components/ui/button";
import { Video, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { identifyIngredients } from "@/utils/gemini/identifyIngredients";

interface VideoUploadSectionProps {
  isUploading: boolean;
  onIngredientsIdentified: (ingredients: { name: string; confidence: number }[]) => void;
}

export const VideoUploadSection = ({ isUploading, onIngredientsIdentified }: VideoUploadSectionProps) => {
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const processVideoForIngredients = async (videoElement: HTMLVideoElement) => {
    try {
      // Create a canvas element to capture video frame
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Draw the current frame to canvas
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to base64 image
      const frameDataUrl = canvas.toDataURL('image/jpeg');
      
      // Process the frame using the identifyIngredients function
      const ingredients = await identifyIngredients(frameDataUrl);
      
      // Map the ingredients to the expected format
      const formattedIngredients = ingredients.map((name: string) => ({
        name,
        confidence: 0.95 // Default confidence since we can't get actual confidence from the frame
      }));

      onIngredientsIdentified(formattedIngredients);
      toast.success("Video processed successfully!");
    } catch (error) {
      console.error('Error processing video:', error);
      toast.error("Error processing video");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);

      // Wait for video metadata to load
      if (videoRef.current) {
        videoRef.current.src = videoUrl;
        videoRef.current.onloadeddata = () => {
          processVideoForIngredients(videoRef.current!);
        };
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error("Error uploading video");
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-primary hover:border-2 transition-all duration-300">
      <div className="flex flex-col items-center justify-center h-64">
        {!videoPreview ? (
          <>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              disabled={isUploading || isProcessing}
            >
              <Video className="mr-2 h-4 w-4" />
              Upload Video
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleFileUpload}
              disabled={isUploading || isProcessing}
            />
          </>
        ) : (
          <video
            ref={videoRef}
            src={videoPreview}
            controls
            className="w-full h-full object-cover rounded-lg"
          />
        )}
        {isProcessing && (
          <div className="mt-4 text-sm text-muted-foreground">
            Processing video...
          </div>
        )}
      </div>
    </div>
  );
};