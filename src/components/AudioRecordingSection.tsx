import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface AudioRecordingSectionProps {
  isUploading: boolean;
  onIngredientsIdentified: (ingredients: { name: string; confidence: number }[]) => void;
}

export const AudioRecordingSection = ({ isUploading, onIngredientsIdentified }: AudioRecordingSectionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const processAudioData = async (audioBlob: Blob) => {
    try {
      // Convert audio blob to base64
      const base64Audio = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(',')[1];
          resolve(base64data);
        };
        reader.readAsDataURL(audioBlob);
      });

      // Send to Google Cloud Speech-to-Text API
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            config: {
              encoding: 'WEBM_OPUS',
              sampleRateHertz: 48000,
              languageCode: 'en-US',
              model: 'default',
            },
            audio: {
              content: base64Audio,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Speech-to-Text API error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to transcribe audio');
      }

      const data = await response.json();
      const transcript = data.results?.[0]?.alternatives?.[0]?.transcript;

      if (!transcript) {
        toast.error("No speech detected in the audio");
        return;
      }

      // Use Gemini to identify ingredients from transcript
      const genAI = (window as any).GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `Given this spoken text about ingredients: "${transcript}", 
        identify all food ingredients mentioned. Return ONLY a JSON array of objects with 'name' and 'confidence' 
        properties, where confidence is a number between 0 and 1 indicating how confident you are that this is a food ingredient.
        Example format: [{"name": "tomato", "confidence": 0.95}]`;

      const result = await model.generateContent(prompt);
      const response_text = await result.response.text();
      const ingredients = JSON.parse(response_text);

      if (ingredients.length === 0) {
        toast.error("No ingredients were detected in the audio");
        return;
      }

      onIngredientsIdentified(ingredients);
      toast.success("Ingredients identified successfully!");
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error("Failed to process audio. Please try again.");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioPreview(audioUrl);
        await processAudioData(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success("Recording started");

      // Set 15-second timeout
      timeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          toast.error("No audio detected after 15 seconds");
          stopRecording();
        }
      }, 15000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Failed to start recording. Please check microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    setIsRecording(false);
  };

  const handleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
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
        {audioPreview && (
          <audio src={audioPreview} controls className="mt-4 w-full" />
        )}
      </div>
    </div>
  );
};