import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UploadPhoto = () => {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsUploading(false);
    toast.success("Photo uploaded successfully!");
    navigate("/generate-meal-plan");
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload Ingredient Photo</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Camera className="h-12 w-12 text-gray-400 mb-4" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG or HEIC (MAX. 10MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
          {isUploading && (
            <div className="mt-4 text-center text-gray-500">
              Uploading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPhoto;