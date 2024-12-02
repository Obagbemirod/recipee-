import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LoginForm } from "@/components/auth/LoginForm";
import { SocialAuth } from "@/components/auth/SocialAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/home');
      }
    };
    checkUser();
  }, [navigate]);

  const onSubmit = async (values: any) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("The email or password you entered is incorrect. Please try again.");
        }
        throw error;
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/home");
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
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-muted-foreground mt-2">
            Sign in to your account
          </p>
        </div>

        <LoginForm onSubmit={onSubmit} />

        <div className="text-center">
          <Button
            variant="link"
            className="text-sm text-primary hover:text-primary/80"
            onClick={() => navigate("/")}
          >
            Need an account? Sign up
          </Button>
        </div>

{/*         <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div> */}

{/*         <SocialAuth isLogin={true} /> */}
      </motion.div>
    </div>
  );
};

export default Auth;
