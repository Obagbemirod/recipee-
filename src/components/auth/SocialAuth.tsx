import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface SocialAuthProps {
  isLogin: boolean;
}

export const SocialAuth = ({ isLogin }: SocialAuthProps) => {
  return null; // Social auth removed as requested
};