import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { plans } from "@/data/plans";
import { PricingCard } from "./pricing/PricingCard";
import { SignUpDialog } from "./pricing/SignUpDialog";
import { Button } from "./ui/button";
import { handleTrialActivation, handlePaymentFlow } from "@/utils/subscriptionHandlers";

export function PricingSection() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignUpSuccess = async (values: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
        },
      });

      if (error) {
        // Check for rate limit error
        if (error.message.includes('rate_limit')) {
          toast({
            title: "Please wait",
            description: "For security purposes, please wait a minute before trying again.",
            variant: "destructive"
          });
          return;
        }
        throw error;
      }

      if (data.user) {
        if (selectedPlan.planId === "24_hour_trial") {
          const success = await handleTrialActivation(data.user.id);
          if (success) {
            toast({
              title: "Trial activated successfully!",
              description: "Welcome to Recipee! Let's set up your preferences."
            });
            setIsSignUpOpen(false);
            navigate("/onboarding");
          }
        } else {
          await handlePaymentFlow(
            data.user,
            selectedPlan,
            (transactionId: string) => {
              toast({
                title: "Payment successful!",
                description: "Welcome to Recipee! Let's set up your preferences."
              });
              setIsSignUpOpen(false);
              navigate("/onboarding");
            },
            navigate
          );
        }
      }
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handlePlanSelection = async (plan: typeof plans[0]) => {
    if (user) {
      // User is already logged in
      if (plan.planId === "24_hour_trial") {
        const success = await handleTrialActivation(user.id);
        if (success) {
          toast({
            title: "Trial activated successfully!",
            description: "Welcome to Recipee! Let's set up your preferences."
          });
          navigate("/onboarding");
        }
      } else {
        await handlePaymentFlow(
          user,
          plan,
          (transactionId: string) => {
            toast({
              title: "Payment successful!",
              description: "Welcome to Recipee! Let's set up your preferences."
            });
            navigate("/onboarding");
          },
          navigate
        );
      }
    } else {
      // Show sign up dialog for new users
      setSelectedPlan(plan);
      setIsSignUpOpen(true);
    }
  };

  return (
    <section id="pricing-section" className="py-16 bg-accent">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Choose Your Plan
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground mt-4">
            Start with our 24-hour Pro trial to experience all Premium features before choosing your plan.
          </p>
          <Button
            variant="link"
            className="mt-4 text-primary hover:text-primary/80"
            onClick={() => navigate("/auth")}
          >
            Already signed up? Login here
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PricingCard 
              key={plan.name}
              plan={plan}
              onSelect={handlePlanSelection}
            />
          ))}
        </div>
      </div>

      <SignUpDialog
        isOpen={isSignUpOpen}
        onOpenChange={setIsSignUpOpen}
        selectedPlan={selectedPlan}
        onSubmit={handleSignUpSuccess}
      />
    </section>
  );
}