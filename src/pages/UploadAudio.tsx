import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UploadAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const navigate = useNavigate();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        setAudioPreview(audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success("Recording started");
    } catch (error) {
      toast.error("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop microphone stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Record Your Ingredients</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col items-center justify-center h-64">
            {!audioPreview ? (
              <>
                <Button
                  size="lg"
                  className={`rounded-full p-8 ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  <Mic className={`h-12 w-12 ${isRecording ? 'animate-pulse' : ''}`} />
                </Button>
                <p className="mt-4 text-gray-500">
                  {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </p>
              </>
            ) : (
              <div className="space-y-4 w-full">
                <audio src={audioPreview} controls className="w-full" />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setAudioPreview(null)}
                  >
                    Record Again
                  </Button>
                  <Button onClick={() => navigate("/generate-meal-plan")}>
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAudio;