export const plans = [
  {
    name: "24-Hour Pro Trial",
    description: "Experience all Premium features free for 24 hours",
    price: 0,
    features: [
      "Full access to Premium features for 24 hours",
      "Generate unlimited meal plans",
      "Access to all Premium recipes",
      "Full AI recipe generation features",
      "Try all Premium features risk-free"
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "default" as const,
    planId: "24_hour_trial"
  },
  {
    name: "Basic",
    description: "Perfect for home cooks",
    originalPrice: 9,
    price: 1, // 89% discount
    discount: 89,
    features: [
      "Image, video, audio and text inputs",
      "Update Your ingredient List once per week",
      "Generate one complete meal plan per week",
      "Get Nutritional Content of Meals",
      "Get Step-by-Step Cooking Guide",
      "Basic Grocery List Management",
      "Limited offline access to recent plans"
    ],
    buttonText: "Start Basic Plan",
    buttonVariant: "outline" as const,
    planId: "basic",
  },
  {
    name: "Premium",
    description: "For serious home chefs and creators",
    originalPrice: 19,
    price: 11.40, // 40% discount
    discount: 40,
    features: [
      "All Basic features plus:",
      "Image, video, audio and text inputs",
      "Unlimited ingredient updates",
      "Unlimited Weekly Meal Planning",
      "Advanced notifications for all meals",
      "Generate Different Meal Plans for Family Members",
      "Expanded Grocery List Management",
      "Unlimited Access to Recipee Masterchef",
      "Recipe monetization",
      "Extended offline access",
      "Early access to new features"
    ],
    buttonText: "Go Premium",
    buttonVariant: "default" as const,
    featured: true,
    planId: "premium"
  }
];