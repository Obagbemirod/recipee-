import { Button } from "@/components/ui/button";
import { Facebook, Mail } from "lucide-react";
import { motion } from "framer-motion";

interface SocialAuthProps {
  isLogin: boolean;
}

export const SocialAuth = ({ isLogin }: SocialAuthProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Button variant="outline" className="w-full" onClick={() => {}}>
        <Facebook className="mr-2 h-4 w-4" />
        {isLogin ? "Continue with Facebook" : "Sign up with Facebook"}
      </Button>
      <Button variant="outline" className="w-full" onClick={() => {}}>
        <Mail className="mr-2 h-4 w-4" />
        {isLogin ? "Continue with Google" : "Sign up with Google"}
      </Button>
    </motion.div>
  );
};