import { Button } from "@/components/ui/button";
import { Video, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UploadVideo = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const navigate = useNavigate();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast.error("Unable to access camera. Please check permissions.");
    }
  };

  const startRecording = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setVideoPreview(videoUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success("Recording started");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop camera stream
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      videoRef.current!.srcObject = null;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
      toast.success("Video uploaded successfully!");
    } catch (error) {
      toast.error("Error uploading video");
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Record Ingredients Video</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          {!videoPreview ? (
            <div className="space-y-6">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg mb-4"
              />
              <div className="grid grid-cols-2 gap-4">
                {!isRecording ? (
                  <>
                    <Button
                      onClick={startCamera}
                      className="w-full"
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Open Camera
                    </Button>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload File
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    className="w-full"
                  >
                    Stop Recording
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleFileUpload}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <video
                src={videoPreview}
                controls
                className="w-full rounded-lg"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setVideoPreview(null)}
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
  );
};

export default UploadVideo;