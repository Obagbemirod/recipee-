import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Check } from "lucide-react";
import { plans } from "@/data/plans";
import { handleTrialActivation, handlePaymentFlow } from "@/utils/subscriptionHandlers";

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
      const success = await handleTrialActivation(user.id);
      if (success) {
        toast({
          title: "Trial Activated!",
          description: "Your 24-hour trial has been activated. Enjoy all premium features!",
        });
        navigate("/home");
      }
      return;
    }

    handlePaymentFlow(
      user,
      plan,
      (transactionId) => {
        toast({
          title: "Payment Successful!",
          description: `Your ${plan.name} subscription has been activated.`,
        });
        navigate(`/success?transaction_id=${transactionId}&order_value=${plan.price}`);
      },
      navigate
    );
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