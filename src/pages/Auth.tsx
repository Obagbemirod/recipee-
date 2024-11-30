import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { AuthSwitch } from "@/components/auth/AuthSwitch";
import { SocialAuth } from "@/components/auth/SocialAuth";
import { motion } from "framer-motion";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { supabase } from "@/lib/supabase";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { plans } from "@/data/plans";
import { handleTrialActivation, handlePaymentFlow } from "@/utils/subscriptionHandlers";
import { PricingCard } from "@/components/pricing/PricingCard";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const navigate = useNavigate();
  const { session, isLoading } = useSessionContext();

  useEffect(() => {
    if (session) {
      navigate('/home');
    }
  }, [session, navigate]);

  if (isLoading) {
    return null;
  }

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("Login error:", error);
        if (error.message.includes("Invalid login credentials")) {
          toast.error("The email or password you entered is incorrect. Please try again or sign up if you don't have an account.");
          return;
        }
        toast.error("An error occurred during login. Please try again.");
        return;
      }

      if (data?.user) {
        toast.success("Welcome back!");
        navigate('/home');
      }
    } catch (error: any) {
      console.error("Unexpected auth error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleSignUp = async (values: { email: string; password: string; name: string }) => {
    if (!selectedPlan) {
      toast.error("Please select a plan to continue.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        if (error.message.includes("already registered")) {
          toast.error("An account with this email already exists. Please sign in instead.");
          setIsLogin(true);
          return;
        }
        toast.error(error.message);
        return;
      }

      if (data.user) {
        if (selectedPlan.planId === "24_hour_trial") {
          const success = await handleTrialActivation(data.user.id);
          if (success) {
            toast.success("Trial activated! You now have access to all premium features for 24 hours.");
            navigate("/onboarding");
          } else {
            toast.error("Failed to activate trial. Please try again or contact support.");
          }
        } else {
          handlePaymentFlow(
            data.user,
            selectedPlan,
            (transactionId) => {
              toast.success(`Your ${selectedPlan.name} subscription has been activated!`);
              navigate("/onboarding");
            },
            navigate
          );
        }
      }
    } catch (error: any) {
      console.error("Unexpected auth error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">{isLogin ? "Welcome back" : "Create your account"}</h2>
          <p className="text-muted-foreground mt-2">
            {isLogin ? "Sign in to your account" : "Start your journey today"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <AuthSwitch isLogin={isLogin} onToggle={(checked) => setIsLogin(checked)} />

            {isLogin ? (
              <LoginForm onSubmit={handleLogin} />
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Select a Plan</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {plans.map((plan) => (
                      <div
                        key={plan.planId}
                        className={`cursor-pointer transition-all ${
                          selectedPlan?.planId === plan.planId
                            ? 'ring-2 ring-primary'
                            : ''
                        }`}
                        onClick={() => setSelectedPlan(plan)}
                      >
                        <PricingCard plan={plan} onSelect={() => setSelectedPlan(plan)} />
                      </div>
                    ))}
                  </div>
                </div>
                <SignUpForm onSubmit={handleSignUp} />
              </>
            )}

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <SocialAuth isLogin={isLogin} />
          </div>

          {!isLogin && (
            <div className="hidden lg:block">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  {selectedPlan ? `Selected Plan: ${selectedPlan.name}` : 'Select a Plan'}
                </h3>
                {selectedPlan && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                    <ul className="space-y-2">
                      {selectedPlan.features.map((feature: string, index: number) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <span className="text-primary">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;