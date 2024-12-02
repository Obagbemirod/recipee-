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
  const [transcript, setTranscript] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processAudioData = async (finalTranscript: string) => {
    try {
      if (!finalTranscript.trim()) {
        toast.error("No speech was detected. Please try again.");
        return;
      }

      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `Given this spoken text about ingredients: "${finalTranscript}", 
        identify all food ingredients mentioned. Return ONLY a JSON array of objects with 'name' and 'confidence' 
        properties, where confidence is a number between 0 and 1 indicating how confident you are that this is a food ingredient.
        Example format: [{"name": "tomato", "confidence": 0.95}]`;

      const result = await model.generateContent(prompt);
      const response_text = await result.response.text();
      
      const cleanedResponse = response_text.replace(/```json\n|\n```/g, '').trim();
      const ingredients = JSON.parse(cleanedResponse);

      if (ingredients.length === 0) {
        toast.error("No ingredients were detected in the audio");
        return;
      }

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
      setTranscript("");

      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.start();

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioPreview(audioUrl);
        await processAudioData(transcript);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success("Recording started");

      timeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          toast.error("Recording timeout after 15 seconds");
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
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
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
    setTranscript("");
    toast.success("Audio recording deleted");
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
        {transcript && (
          <p className="mt-2 text-sm text-gray-600 max-w-md text-center">
            Recognized text: {transcript}
          </p>
        )}
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