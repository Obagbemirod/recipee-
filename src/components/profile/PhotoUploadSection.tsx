import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { UseFormSetValue } from "react-hook-form";

interface PhotoUploadSectionProps {
  currentPhotoUrl?: string;
  setValue: UseFormSetValue<any>;
}

export const PhotoUploadSection = ({ currentPhotoUrl, setValue }: PhotoUploadSectionProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("profile_images")
        .upload(fileName, file);

      if (error) {
        throw new Error("Failed to upload image");
      }

      const { data: publicUrlData } = supabase.storage
        .from("profile_images")
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        setValue("photo", publicUrlData.publicUrl);
        toast({
          title: "Photo updated",
          description: "Your profile photo has been updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update photo. Please try again.",
      });
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center space-x-4 mb-8">
      <Avatar className="h-20 w-20">
        <AvatarImage src={currentPhotoUrl || "/placeholder.svg"} />
        <AvatarFallback>UN</AvatarFallback>
      </Avatar>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handlePhotoChange}
      />
      <Button variant="outline" onClick={handlePhotoClick}>
        Change Photo
      </Button>
    </div>
  );
};