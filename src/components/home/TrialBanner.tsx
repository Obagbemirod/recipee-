import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export const TrialBanner = () => {
  const { plan, isTrialExpired } = useAuth();
  const navigate = useNavigate();

  if (!plan || plan !== "24_hour_trial") return null;

  const handleUpgrade = () => {
    navigate("/?scrollTo=pricing");
    if (isTrialExpired) {
      toast.info("Choose a plan to continue enjoying premium features!");
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <Badge className={`${isTrialExpired ? "bg-red-500" : "bg-blue-500"} text-white`}>
        <Crown className="w-4 h-4 mr-1" />
        {isTrialExpired ? "Pro Trial Expired" : "Pro Trial"}
      </Badge>
      
      {isTrialExpired && (
        <Button
          variant="default"
          size="sm"
          onClick={handleUpgrade}
          className="whitespace-nowrap"
        >
          View Plans
        </Button>
      )}
    </div>
  );
};