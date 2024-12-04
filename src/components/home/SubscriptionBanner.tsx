import { useSubscription } from "@/hooks/useSubscription";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const SubscriptionBanner = () => {
  const { plan, isTrialExpired } = useAuth();

  if (!plan) return null;

  const getBadgeStyle = () => {
    switch (plan) {
      case 'premium':
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case 'basic':
        return "bg-blue-500";
      case '24_hour_trial':
        return isTrialExpired ? "bg-red-500" : "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPlanText = () => {
    switch (plan) {
      case 'premium':
        return "Premium Plan";
      case 'basic':
        return "Basic Plan";
      case '24_hour_trial':
        return isTrialExpired ? "Trial Expired" : "Trial Plan";
      default:
        return "No Plan";
    }
  };

  return (
    <Badge className={`${getBadgeStyle()} text-white flex items-center gap-2`}>
      <Crown className="w-4 h-4" />
      {getPlanText()}
    </Badge>
  );
};