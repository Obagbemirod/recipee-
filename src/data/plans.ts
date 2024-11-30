export const plans = [
  {
    name: "24-Hour Trial",
    description: "Try all Premium features free for 24 hours",
    price: 0,
    features: [
      "Full access to all Premium features",
      "Unlimited meal plan generation",
      "Recipe customization",
      "Nutritional information",
      "Shopping list generation"
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "default",
    planId: "24_hour_trial"
  },
  {
    name: "Basic",
    description: "Essential features for meal planning",
    price: 4.99,
    features: [
      "Upload and scan ingredients",
      "Generate 1 meal plan per week",
      "Basic nutritional information",
      "Simple shopping lists",
      "Save up to 10 meal plans"
    ],
    buttonText: "Choose Basic",
    buttonVariant: "outline",
    planId: "basic",
  },
  {
    name: "Premium",
    description: "Complete meal planning solution",
    price: 9.99,
    features: [
      "Unlimited meal plan generation",
      "Advanced recipe customization",
      "Detailed nutritional analysis",
      "Smart shopping lists",
      "Unlimited recipe generation",
      "Priority support"
    ],
    buttonText: "Choose Premium",
    buttonVariant: "default",
    featured: true,
    planId: "premium"
  }
];