import { PricingCard } from "./PricingCard";
import { plans } from "@/data/plans";

interface PricingGridProps {
  onPlanSelect: (plan: any) => void;
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