import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "24-Hour Pro Trial",
    price: "0",
    description: "Experience all Premium features free for 24 hours",
    features: [
      "Full access to Premium features for 24 hours",
      "Generate unlimited meal plans",
      "Access to all Premium recipes",
      "Full AI recipe generation features",
      "Try all Premium features risk-free"
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "outline" as const
  },
  {
    name: "Basic",
    price: "9",
    description: "Perfect for home cooks",
    features: [
      "Image, video, text, and audio inputs",
      "Update Your Ingredient List once per week",
      "Generate one complete meal plan (Breakfast, Lunch & Dinner) per day for 30 days",
      "Get Nutritional Content of Meals",
      "Get Step-by-Step Cooking Guide",
      "Limited Marketplace community access",
      "Basic Grocery List Management",
      "Get Notified once per day",
      "Recipe Cloning in Marketplace",
      "Limited offline access to recent plans"
    ],
    buttonText: "Start Basic Plan",
    buttonVariant: "secondary" as const
  },
  {
    name: "Premium",
    price: "19",
    description: "For serious home chefs and creators",
    features: [
      "Image, video, text, and audio inputs",
      "Unlimited ingredient recognitions",
      "Unlimited Update To Your Ingredient List",
      "Unlimited Weekly Meal Planning",
      "Generate Recipes From Dish Photos",
      "Get Nutritional Content of Meals",
      "Get Step-by-Step Cooking Guide",
      "Get Notified for Breakfast, Lunch & Dinner",
      "Generate Different Meal Plans for Different Family Members",
      "Expanded Grocery List Management",
      "Full Marketplace Community Access",
      "Unlimited Access to Recipee Masterchef",
      "Recipe monetization",
      "Extended offline access to meal plans",
      "Early access to new features"
    ],
    buttonVariant: "default" as const,
    buttonText: "Go Premium",
    featured: true
  }
];

export function PricingSection() {
  return (
    <section className="py-16 bg-accent">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Choose Your Plan
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground mt-4">
            Start with our 24-hour Pro trial to experience all Premium features before choosing your plan.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
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
                <Link to="/auth" className="w-full">
                  <Button 
                    className="w-full" 
                    variant={plan.buttonVariant}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}