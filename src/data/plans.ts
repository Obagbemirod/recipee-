export const plans = [
  {
    name: "24-Hour Pro Trial",
    price: 0,
    description: "Experience all Premium features free for 24 hours",
    features: [
      "Full access to Premium features for 24 hours",
      "Generate unlimited meal plans",
      "Access to all Premium recipes",
      "Full AI recipe generation features",
      "Try all Premium features risk-free"
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "outline" as const,
    planId: "24_hour_trial"
  },
  {
    name: "Basic",
    price: 9,
    description: "Perfect for home cooks",
    features: [
      "Image, video, and text inputs",
      "Update Your Ingredient List once per week",
      "Generate one complete meal plan per day",
      "Get Nutritional Content of Meals",
      "Get Step-by-Step Cooking Guide",
      "Limited Marketplace community access",
      "Basic Grocery List Management",
      "Get Notified once per day",
      "Recipe Cloning in Marketplace",
      "Limited offline access to recent plans"
    ],
    buttonText: "Start Basic Plan",
    buttonVariant: "secondary" as const,
    planId: "basic"
  },
  {
    name: "Premium",
    price: 19,
    description: "For serious home chefs and creators",
    features: [
      "All Basic features plus:",
      "Audio input support",
      "Unlimited ingredient updates",
      "Unlimited Weekly Meal Planning",
      "Advanced notifications for all meals",
      "Generate Different Meal Plans for Family Members",
      "Expanded Grocery List Management",
      "Full Marketplace Community Access",
      "Unlimited Access to Recipee Masterchef",
      "Recipe monetization",
      "Extended offline access",
      "Early access to new features"
    ],
    buttonVariant: "default" as const,
    buttonText: "Go Premium",
    featured: true,
    planId: "premium"
  }
];