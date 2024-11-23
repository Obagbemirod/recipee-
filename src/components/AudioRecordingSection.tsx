import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AudioRecordingSectionProps {
  isUploading: boolean;
  onIngredientsIdentified: (ingredients: { name: string; confidence: number }[]) => void;
}

export const AudioRecordingSection = ({ isUploading, onIngredientsIdentified }: AudioRecordingSectionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const handleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setAudioPreview("recorded-audio-url");
      
      // Mock ingredient identification for audio
      onIngredientsIdentified([
        { name: "Garlic", confidence: 0.9 },
        { name: "Ginger", confidence: 0.85 }
      ]);
      
      toast.success("Audio processed successfully!");
    } else {
      setIsRecording(true);
      toast.success("Recording started");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-primary hover:border-2 transition-all duration-300">
      <div className="flex flex-col items-center justify-center h-64">
        <Button
          onClick={handleRecording}
          className={`rounded-full p-8 ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
          disabled={isUploading}
        >
          <Mic className={`h-12 w-12 ${isRecording ? 'animate-pulse' : ''}`} />
        </Button>
        <p className="mt-4 text-gray-500">
          {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
        </p>
      </div>
    </div>
  );
};