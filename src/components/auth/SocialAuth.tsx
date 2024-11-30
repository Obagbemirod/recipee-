import { Button } from "@/components/ui/button";
import { Facebook, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface SocialAuthProps {
  isLogin: boolean;
}

export const SocialAuth = ({ isLogin }: SocialAuthProps) => {
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message
      });
    }
  };

  const handleFacebookSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Button variant="outline" className="w-full" onClick={handleFacebookSignIn}>
        <Facebook className="mr-2 h-4 w-4" />
        {isLogin ? "Continue with Facebook" : "Sign up with Facebook"}
      </Button>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
        <Mail className="mr-2 h-4 w-4" />
        {isLogin ? "Continue with Google" : "Sign up with Google"}
      </Button>
    </motion.div>
  );
};