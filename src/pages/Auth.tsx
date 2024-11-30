import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoginForm } from "@/components/auth/LoginForm";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const Auth = () => {
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
          toast.error("The email or password you entered is incorrect. Please try again.");
          return;
        }
        if (error.message.includes("Email not confirmed")) {
          toast.error("Please verify your email before logging in.");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8 p-8"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-muted-foreground mt-2">
            Sign in to your account
          </p>
        </div>

        <LoginForm onSubmit={handleLogin} />

        <div className="text-center space-y-4">
          <Button
            variant="link"
            className="text-sm"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </Button>
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-muted-foreground">Need an account?</p>
            <Button
              variant="outline"
              onClick={() => navigate("/#pricing-section")}
            >
              View Plans & Sign Up
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;