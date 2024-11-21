import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started with Recipee",
    features: [
      "Limited access to meal planning templates",
      "5 ingredient recognitions per week",
      "Basic community access",
      "1 AI-Generated Meal Plan per week",
      "Text and audio input options",
      "Basic Grocery List Management",
      "Standard notifications",
      "View-only Marketplace access"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const
  },
  {
    name: "Basic",
    price: "5",
    description: "Great for cooking enthusiasts",
    features: [
      "Full access to meal planning templates",
      "20 ingredient recognitions per week",
      "Full community access",
      "3 AI-Generated Meal Plans per week",
      "Image, video, text, and audio inputs",
      "Expanded Grocery List Management",
      "Customizable notifications",
      "Recipe Cloning in Marketplace"
    ],
    buttonText: "Start Basic Plan",
    buttonVariant: "secondary" as const
  },
  {
    name: "Premium",
    price: "10",
    description: "For serious home chefs and creators",
    features: [
      "Unlimited meal planning",
      "Unlimited ingredient recognition",
      "Full community features",
      "Unlimited AI-Generated Meal Plans",
      "All input options + Interactive Assistant",
      "Advanced Grocery Management with store integration",
      "Recipe monetization",
      "Early access to new features"
    ],
    buttonText: "Go Premium",
    buttonVariant: "default" as const,
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
            Select the perfect plan for your cooking journey. Upgrade or downgrade at any time.
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
                <Button 
                  className="w-full" 
                  variant={plan.buttonVariant}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}