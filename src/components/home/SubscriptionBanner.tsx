import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { Crown } from "lucide-react";

export const SubscriptionBanner = () => {
  const { plan, isTrialExpired } = useSubscription();

  if (!plan) return null;

  const getBadgeColor = () => {
    switch (plan) {
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'basic':
        return 'bg-blue-500';
      case '24_hour_trial':
        return isTrialExpired ? 'bg-red-500' : 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPlanDisplay = () => {
    switch (plan) {
      case 'premium':
        return 'Premium Plan';
      case 'basic':
        return 'Basic Plan';
      case '24_hour_trial':
        return isTrialExpired ? 'Trial Expired' : 'Trial Plan';
      default:
        return 'Free Plan';
    }
  };

  return (
    <Badge className={`${getBadgeColor()} text-white flex items-center gap-2`}>
      <Crown className="w-4 h-4" />
      {getPlanDisplay()}
    </Badge>
  );
};