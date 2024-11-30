import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PricingCardProps {
  plan: {
    name: string;
    description: string;
    price: number;
    features: string[];
    buttonText: string;
    buttonVariant: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
    featured?: boolean;
    planId: string;
  };
  onSelect: (plan: any) => void;
}

export function PricingCard({ plan, onSelect }: PricingCardProps) {
  return (
    <Card 
      className={`relative flex flex-col justify-between animate-fade-up ${
        plan.featured ? 
        'border-primary shadow-lg scale-105 z-10' : 
        'border-border'
      }`}
    >
      {plan.featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div>
        <CardHeader>
          <CardTitle className="text-2xl">{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <span className="text-4xl font-bold">${plan.price}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <ul className="space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </div>
      
      <CardFooter>
        <Button 
          className="w-full" 
          variant={plan.buttonVariant}
          onClick={() => onSelect(plan)}
        >
          {plan.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}