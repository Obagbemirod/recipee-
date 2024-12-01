import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PricingCardProps {
  plan: {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    discount?: number;
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
            {plan.discount ? (
              <div className="space-y-1">
                <div className="relative pt-8"> {/* Added padding-top to make room for the banner */}
                  {/* Festive Banner */}
                  <div className="absolute -top-2 left-0 right-0"> {/* Adjusted top position */}
                    <div className="bg-gradient-to-r from-red-500 via-green-500 to-red-500 text-white p-2 rounded-t-lg text-center shadow-lg">
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-bold text-lg">Christmas Sale!</span>
                        <Sparkles className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4"> {/* Added margin-top */}
                    <span className="text-4xl font-bold">${plan.price.toFixed(2)}</span>
                    <span className="text-muted-foreground">/month</span>
                    <Badge variant="destructive" className="ml-2">
                      <span className="font-bold">{plan.discount}% OFF</span>
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    <span className="line-through font-bold">${plan.originalPrice}</span>
                    <span className="ml-1">Original price</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            )}
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