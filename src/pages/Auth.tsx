import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate("/home");
      }
      setIsLoading(false);
    };
    checkUser();
  }, [navigate]);

  if (isLoading) {
    return null;
  }

  const handleLoginSuccess = async () => {
    const plan = searchParams.get("plan");
    if (plan) {
      navigate(`/onboarding?plan=${plan}`);
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg"
      >
        <div className="text-center mb-8">
          <img
            src="/lovable-uploads/9ca683d9-07dc-465b-ba8b-eb0f938ac0aa.png"
            alt="Recipee Logo"
            className="h-12 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold">Welcome back!</h2>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <LoginForm onSubmit={handleLoginSuccess} />

        <div className="mt-6 text-center">
          <Button
            variant="link"
            className="text-sm text-primary hover:text-primary/80"
            onClick={() => navigate("/")}
          >
            Need an account? Sign up
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;