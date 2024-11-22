import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { AuthSwitch } from "@/components/auth/AuthSwitch";
import { SocialAuth } from "@/components/auth/SocialAuth";
import { motion } from "framer-motion";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (values: any) => {
    try {
      if (isLogin) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate("/home");
      } else {
        toast({
          title: "Account created successfully!",
          description: "Please complete the onboarding process.",
        });
        navigate("/onboarding");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: isLogin ? "Invalid email or password." : "Something went wrong. Please try again.",
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
          <h2 className="text-2xl font-bold">{isLogin ? "Welcome back" : "Create your account"}</h2>
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