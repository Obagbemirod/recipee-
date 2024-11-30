import { Button } from "@/components/ui/button";
import { Camera, FileText } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { checkFeatureAccess } from "@/utils/subscriptionUtils";

export const UploadInputs = ({ onSelectInput }: { onSelectInput: (type: string) => void }) => {
  const { plan } = useSubscription();

  const canUseImage = checkFeatureAccess(plan, 'imageInputs');
  const canUseText = checkFeatureAccess(plan, 'textInputs');

  return (
    <div className="grid grid-cols-2 gap-4">
      {canUseImage && (
        <Button
          variant="outline"
          className="w-full h-24 flex flex-col items-center justify-center gap-2"
          onClick={() => onSelectInput('photo')}
        >
          <Camera className="h-8 w-8 text-primary" />
          <span>Photo</span>
        </Button>
      )}
      
      {canUseText && (
        <Button
          variant="outline"
          className="w-full h-24 flex flex-col items-center justify-center gap-2"
          onClick={() => onSelectInput('text')}
        >
          <FileText className="h-8 w-8 text-primary" />
          <span>Text</span>
        </Button>
      )}
    </div>
  );
};