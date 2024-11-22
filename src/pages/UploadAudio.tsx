import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UploadAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const navigate = useNavigate();

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate recording delay
    setTimeout(() => {
      setIsRecording(false);
      toast.success("Audio recorded successfully!");
      navigate("/generate-meal-plan");
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Record Your Ingredients</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col items-center justify-center h-64">
            <Button
              size="lg"
              className={`rounded-full p-8 ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
              onClick={handleStartRecording}
              disabled={isRecording}
            >
              <Mic className={`h-12 w-12 ${isRecording ? 'animate-pulse' : ''}`} />
            </Button>
            <p className="mt-4 text-gray-500">
              {isRecording ? 'Recording...' : 'Click to start recording'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAudio;