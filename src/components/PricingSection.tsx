import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { plans } from "@/data/plans";
import { handleTrialActivation, handlePaymentFlow } from "@/utils/subscriptionHandlers";
import { PricingCard } from "./pricing/PricingCard";
import { SignUpDialog } from "./pricing/SignUpDialog";
import { Button } from "./ui/button";

export function PricingSection() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
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

  const handleSignUpSubmit = async (values: any) => {
    try {
      const { data: existingUser } = await supabase
        .from('auth.users')
        .select()
        .eq('email', values.email)
        .single();

      if (existingUser) {
        toast({
          variant: "destructive",
          title: "Account Already Exists",
          description: (
            <div>
              <p>An account with this email already exists.</p>
              <Button
                variant="link"
                className="p-0 text-white underline"
                onClick={() => {
                  setShowSignUpDialog(false);
                  navigate('/auth');
                }}
              >
                Click here to login instead
              </Button>
              {" or "}
              <Button
                variant="link"
                className="p-0 text-white underline"
                onClick={() => {
                  setShowSignUpDialog(false);
                  navigate('/forgot-password');
                }}
              >
                click here to reset your password
              </Button>
            </div>
          ),
        });
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
          },
        },
      });

      if (error) throw error;

      setShowSignUpDialog(false);

      if (selectedPlan.planId === "24_hour_trial") {
        const success = await handleTrialActivation(data.user!.id);
        if (success) {
          toast({
            title: "Trial Activated!",
            description: "Your 24-hour trial has been activated. Enjoy all premium features!",
          });
          navigate("/onboarding");
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to activate trial. Please try again.",
          });
        }
      } else {
        handlePaymentFlow(
          data.user,
          selectedPlan,
          (transactionId) => {
            toast({
              title: "Payment Successful!",
              description: `Your ${selectedPlan.name} subscription has been activated.`,
            });
            navigate(`/success?transaction_id=${transactionId}&order_value=${selectedPlan.price}`);
          },
          navigate
        );
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handlePlanSelection = async (plan: typeof plans[0]) => {
    if (user) {
      if (plan.planId === "24_hour_trial") {
        const success = await handleTrialActivation(user.id);
        if (success) {
          toast({
            title: "Trial Activated!",
            description: "Your 24-hour trial has been activated. Enjoy all premium features!",
          });
          navigate("/onboarding");
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to activate trial. Please try again.",
          });
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
    } else {
      setSelectedPlan(plan);
      setShowSignUpDialog(true);
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
          {!user && (
            <Button
              variant="link"
              className="mt-4 text-primary hover:text-primary/80"
              onClick={() => navigate('/auth')}
            >
              Already signed up? Login here
            </Button>
          )}
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
        isOpen={showSignUpDialog}
        onOpenChange={setShowSignUpDialog}
        selectedPlan={selectedPlan}
        onSubmit={handleSignUpSubmit}
      />
    </section>
  );
}