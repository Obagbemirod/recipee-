import { Button } from "@/components/ui/button";
import { Mic, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { normalizeIngredient } from "@/utils/ingredientMapping";

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
      const reader = new FileReader();
      const audioBase64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Remove data URL prefix
        };
        reader.readAsDataURL(audioBlob);
      });
      const audioBase64 = await audioBase64Promise;

      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `You are a culinary expert tasked with listening to an audio recording and identifying **only** the food ingredients explicitly mentioned.

      ### Rules:
      1. **Only list explicitly mentioned ingredients**: Include only the ingredients that are **clearly** and **explicitly** mentioned in the audio.
      2. **Do not add assumed or related ingredients**: Do not include any ingredients that were not directly mentioned, even if they are commonly associated with the dish.
      3. **Do not make assumptions**: If there is uncertainty or the ingredient is unclear, do not include it.
      4. **Confidence level**: For each ingredient, assign a **confidence** level between 0 and 1:
        - **1.0**: If the ingredient was very clearly mentioned.
        - **Less than 1.0**: If the ingredient was mentioned but not with high clarity (e.g., inaudible, vague, or uncertain).
      5. **Return format**: Provide a JSON array of objects with two properties:
        - "name": The name of the ingredient as mentioned in the audio.
        - "confidence": The confidence level, where 1.0 represents very clear mention.

        ### Example format:

      [
        { "name": "tomato", "confidence": 0.95 },
        { "name": "chicken", "confidence": 1.0 }
      ]`;

      const result = await model.generateContent([
        { text: prompt },
        { inlineData: { mimeType: "audio/webm", data: audioBase64 } }
      ]);

      const response_text = await result.response.text();
      const cleanedResponse = response_text.replace(/```json\n |\n```/g, '').trim();
      const ingredients = JSON.parse(cleanedResponse);

      if (ingredients.length === 0) {
        toast.error("No ingredients were detected in the audio");
        return;
      }

      // Normalize ingredient names based on user's country
      const userCountry = localStorage.getItem('userCountry') || 'nigeria';
      const normalizedIngredients = ingredients.map((ing: { name: string; confidence: number }) => ({
        name: normalizeIngredient(ing.name, userCountry),
        confidence: ing.confidence
      }));

      onIngredientsIdentified(normalizedIngredients);
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

  const handleDeleteAudio = () => {
    setAudioPreview(null);
    toast.success("Audio recording deleted");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-primary hover:border-2 transition-all duration-300">
      <div className="flex flex-col items-center justify-center h-64">
        <Button
          onClick={handleRecording}
          className={`rounded - full p - 8 ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''} `}
          disabled={isUploading}
        >
          <Mic className={`h - 12 w - 12 ${isRecording ? 'animate-pulse' : ''} `} />
        </Button>
        <p className="mt-4 text-gray-500">
          {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
        </p>
        {audioPreview && (
          <div className="w-full mt-4 space-y-2">
            <audio src={audioPreview} controls className="w-full" />
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAudio}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Recording
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};