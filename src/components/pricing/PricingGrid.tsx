import { PricingCard } from "./PricingCard";
import { plans } from "@/data/plans";
import { ButtonProps } from "@/components/ui/button";

interface PricingGridProps {
  onPlanSelect: (plan: {
    name: string;
    description: string;
    price: number;
    features: string[];
    buttonText: string;
    buttonVariant: ButtonProps['variant'];
    featured?: boolean;
    planId: string;
  }) => void;
}

export const PricingGrid = ({ onPlanSelect }: PricingGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <PricingCard 
          key={plan.name}
          plan={plan}
          onSelect={onPlanSelect}
        />
      ))}
    </div>
  );
};