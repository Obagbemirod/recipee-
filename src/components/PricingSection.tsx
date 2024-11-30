import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { handleTrialActivation, handlePaymentFlow } from "@/utils/subscriptionHandlers";
import { SignUpDialog } from "./pricing/SignUpDialog";
import { PricingHeader } from "./pricing/PricingHeader";
import { PricingGrid } from "./pricing/PricingGrid";
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
      // Check if user exists by email in auth
      const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1,
        query: values.email
      });

      if (getUserError) throw getUserError;

      if (users && users.length > 0) {
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

  const handlePlanSelection = async (plan: any) => {
    if (user) {
      if (plan.planId === "24_hour_trial") {
        try {
          const { data: existingTrial, error } = await supabase
            .from('subscriptions')
            .select()
            .eq('user_id', user.id)
            .eq('plan_id', '24_hour_trial');

          if (error && error.code !== 'PGRST116') throw error;

          if (existingTrial && existingTrial.length > 0) {
            toast({
              variant: "destructive",
              title: "Trial Already Used",
              description: "You have already used your trial period.",
            });
            return;
          }

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
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Failed to check trial eligibility. Please try again.",
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
        <PricingHeader user={user} />
        <PricingGrid onPlanSelect={handlePlanSelection} />
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