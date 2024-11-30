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

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { session, isLoading } = useSessionContext();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/home');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (session) {
      navigate('/home');
    }
  }, [session, navigate]);

  if (isLoading) {
    return null;
  }

  const onSubmit = async (values: any) => {
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password. Please try again.");
            return;
          }
          if (error.message.includes("Email not confirmed")) {
            toast.error("Please verify your email before signing in.");
            return;
          }
          toast.error(error.message);
          return;
        }

        if (data.user) {
          toast.success("Welcome back!");
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

        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error("An account with this email already exists. Please sign in instead.");
            return;
          }
          toast.error(error.message);
          return;
        }

        if (data.user) {
          toast.success("Account created! Please check your email to confirm your account.");
          navigate("/onboarding");
        }
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Auth error:", error);
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
          <h2 className="text-2xl font-bold">{isLogin ? "Welcome back" : "Create your account"}</h2>
          <p className="text-muted-foreground mt-2">
            {isLogin ? "Sign in to your account" : "Start your journey today"}
          </p>
        </div>

        <AuthSwitch isLogin={isLogin} onToggle={(checked) => setIsLogin(checked)} />

        {isLogin ? (
          <LoginForm onSubmit={onSubmit} />
        ) : (
          <SignUpForm onSubmit={onSubmit} />
        )}

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