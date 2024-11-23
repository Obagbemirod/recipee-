import { Button } from "@/components/ui/button";
import { Video, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface VideoUploadSectionProps {
  isUploading: boolean;
  onIngredientsIdentified: (ingredients: { name: string; confidence: number }[]) => void;
}

export const VideoUploadSection = ({ isUploading, onIngredientsIdentified }: VideoUploadSectionProps) => {
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
      
      // Mock ingredient identification for video
      onIngredientsIdentified([
        { name: "Tomato", confidence: 0.95 },
        { name: "Onion", confidence: 0.92 }
      ]);
      
      toast.success("Video processed successfully!");
    } catch (error) {
      toast.error("Error processing video");
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
              disabled={isUploading}
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
              disabled={isUploading}
            />
          </>
        ) : (
          <video
            src={videoPreview}
            controls
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </div>
    </div>
  );
};