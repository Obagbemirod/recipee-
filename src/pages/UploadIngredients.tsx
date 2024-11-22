import { Button } from "@/components/ui/button";
import { Camera, Video, Mic, FileText } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UploadIngredients = () => {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsUploading(false);
    toast.success(`${type} uploaded successfully!`);
    navigate("/generate-meal-plan");
  };

  const handleAudioRecording = () => {
    setIsUploading(true);
    // Simulate recording delay
    setTimeout(() => {
      setIsUploading(false);
      toast.success("Audio recorded successfully!");
      navigate("/generate-meal-plan");
    }, 2000);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const text = (form.elements.namedItem('ingredients') as HTMLTextAreaElement).value;
    
    if (!text.trim()) {
      toast.error("Please enter your ingredients");
      return;
    }

    setIsUploading(true);
    // Simulate submission delay
    setTimeout(() => {
      setIsUploading(false);
      toast.success("Ingredients submitted successfully!");
      navigate("/generate-meal-plan");
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-secondary">Upload Your Ingredients</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo Upload */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-primary hover:border-2 transition-all duration-300">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Camera className="h-12 w-12 text-primary mb-4" />
                <p className="mb-2 text-sm text-secondary">
                  <span className="font-semibold">Upload a photo</span>
                </p>
                <p className="text-xs text-secondary/70">PNG, JPG or HEIC (MAX. 10MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'Photo')}
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Video Upload */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-primary hover:border-2 transition-all duration-300">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Video className="h-12 w-12 text-primary mb-4" />
                <p className="mb-2 text-sm text-secondary">
                  <span className="font-semibold">Upload a video</span>
                </p>
                <p className="text-xs text-secondary/70">MP4, MOV or AVI (MAX. 100MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={(e) => handleFileUpload(e, 'Video')}
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Audio Recording */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-primary hover:border-2 transition-all duration-300">
            <div className="flex flex-col items-center justify-center h-64">
              <Button
                size="lg"
                className={`rounded-full p-8 ${isUploading ? 'bg-primary/80' : 'bg-primary'} hover:bg-primary/90 transition-colors`}
                onClick={handleAudioRecording}
                disabled={isUploading}
              >
                <Mic className={`h-12 w-12 ${isUploading ? 'animate-pulse' : ''}`} />
              </Button>
              <p className="mt-4 text-secondary">
                {isUploading ? 'Recording...' : 'Click to start recording'}
              </p>
            </div>
          </div>

          {/* Text Input */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-primary hover:border-2 transition-all duration-300">
            <form onSubmit={handleTextSubmit}>
              <div className="flex flex-col items-center justify-center h-64">
                <FileText className="h-12 w-12 text-primary mb-4" />
                <textarea
                  name="ingredients"
                  placeholder="Enter your ingredients, one per line..."
                  className="w-full h-32 p-2 border rounded-md mb-4 border-primary/20 focus:border-primary hover:border-primary transition-colors resize-none"
                  disabled={isUploading}
                />
                <Button 
                  type="submit" 
                  disabled={isUploading}
                  className="bg-primary hover:bg-primary/90 text-white transition-colors"
                >
                  {isUploading ? "Submitting..." : "Submit Ingredients"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadIngredients;