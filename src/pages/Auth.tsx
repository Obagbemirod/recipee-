import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { AuthSwitch } from "@/components/auth/AuthSwitch";
import { SocialAuth } from "@/components/auth/SocialAuth";
import { motion } from "framer-motion";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { supabase } from "@/lib/supabase";
import { handleTrialActivation, handlePaymentFlow } from "@/utils/subscriptionHandlers";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedPlan = searchParams.get('plan');
  const isTrialSignup = selectedPlan === '24_hour_trial';

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (selectedPlan) {
          if (isTrialSignup) {
            const success = await handleTrialActivation(user.id);
            if (success) {
              navigate('/onboarding');
            }
          } else {
            // Handle paid plan flow for existing users
            const planDetails = {
              planId: selectedPlan,
              // Add other plan details as needed
            };
            handlePaymentFlow(user, planDetails, () => {
              navigate('/onboarding');
            }, navigate);
          }
        } else {
          navigate('/home');
        }
      }
    };
    checkUser();
  }, [navigate, selectedPlan, isTrialSignup]);

  const onSubmit = async (values: any) => {
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });

        if (selectedPlan) {
          if (isTrialSignup) {
            const success = await handleTrialActivation(data.user.id);
            if (success) {
              navigate('/onboarding');
            }
          } else {
            const planDetails = {
              planId: selectedPlan,
              // Add other plan details as needed
            };
            handlePaymentFlow(data.user, planDetails, () => {
              navigate('/onboarding');
            }, navigate);
          }
        } else {
          navigate("/home");
        }
      } else {
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

        if (selectedPlan) {
          if (isTrialSignup) {
            const success = await handleTrialActivation(data.user!.id);
            if (success) {
              navigate('/onboarding');
            }
          } else {
            const planDetails = {
              planId: selectedPlan,
              // Add other plan details as needed
            };
            handlePaymentFlow(data.user, planDetails, () => {
              navigate('/onboarding');
            }, navigate);
          }
        } else {
          toast({
            title: "Account created successfully!",
            description: "Please check your email to confirm your account.",
          });
          navigate("/onboarding");
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8 p-8"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            {isLogin ? "Welcome back" : (isTrialSignup ? "Start Your Free Trial" : "Create your account")}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isLogin ? "Sign in to your account" : "Start your journey today"}
          </p>
        </div>

        <AuthSwitch isLogin={isLogin} onToggle={(checked) => setIsLogin(!checked)} />

        {isLogin ? (
          <LoginForm onSubmit={onSubmit} />
        ) : (
          <SignUpForm onSubmit={onSubmit} />
        )}

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline"
          >
            {isLogin ? "Need an account? Sign up" : "Already signed up? Login here"}
          </button>
        </div>

        <div className="relative">
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
      </motion.div>
    </div>
  );
};

export default Auth;