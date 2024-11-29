import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

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
    buttonVariant: "outline" as const,
    planId: "24_hour_trial"
  },
  {
    name: "Basic",
    price: "9",
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
    price: "19",
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

export function PricingSection() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handlePayment = async (plan: typeof plans[0]) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to a plan",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (plan.planId === "24_hour_trial") {
      try {
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: user.id,
            plan_id: plan.planId,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            status: 'active'
          });

        if (error) throw error;

        toast({
          title: "Trial Activated!",
          description: "Your 24-hour trial has been activated. Enjoy all premium features!",
        });
        navigate("/home");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to activate trial. Please try again.",
        });
      }
      return;
    }

    try {
      window.FlutterwaveCheckout({
        public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: `${user.id}-${Date.now()}`,
        amount: Number(plan.price),
        currency: "USD",
        payment_options: "card,mobilemoney,ussd",
        customer: {
          email: user.email,
          phone_number: user.phone || "",
          name: user.user_metadata?.full_name || user.email,
        },
        customizations: {
          title: "Recipee Subscription",
          description: `${plan.name} Plan Subscription`,
          logo: "/lovable-uploads/05699ffd-835b-45ce-9597-5e523e4bdf98.png",
        },
        callback: async function(response: any) {
          if (response.status === "successful") {
            try {
              const { error } = await supabase
                .from('subscriptions')
                .upsert({
                  user_id: user.id,
                  plan_id: plan.planId,
                  start_date: new Date().toISOString(),
                  end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                  status: 'active',
                  payment_reference: response.transaction_id
                });

              if (error) throw error;

              toast({
                title: "Payment Successful!",
                description: `Your ${plan.name} subscription has been activated.`,
              });
              navigate("/home");
            } catch (error) {
              toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to activate subscription. Please contact support.",
              });
            }
          } else {
            toast({
              variant: "destructive",
              title: "Payment Failed",
              description: "Please try again or contact support if the issue persists.",
            });
          }
        },
        onclose: function() {
          // Handle modal close
        },
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to initialize payment. Please try again.",
      });
    }
  };

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
                <Button 
                  className="w-full" 
                  variant={plan.buttonVariant}
                  onClick={() => handlePayment(plan)}
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