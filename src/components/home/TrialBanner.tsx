import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export const TrialBanner = () => {
  const { plan, isTrialExpired } = useSubscription();
  const navigate = useNavigate();

  if (!plan || plan !== "24_hour_trial") return null;

  return (
    <div className="flex flex-col gap-2">
      <Badge className={`${isTrialExpired ? "bg-red-500" : "bg-blue-500"} text-white`}>
        <Crown className="w-4 h-4 mr-1" />
        {isTrialExpired ? "Pro Trial Expired" : "Pro Trial"}
      </Badge>
      
      {isTrialExpired && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-md flex items-center justify-between">
          <span>Your trial has expired. Upgrade now to continue enjoying premium features!</span>
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate("/pricing")}
            className="ml-2"
          >
            Upgrade Plan
          </Button>
        </div>
      )}
    </div>
  );
};