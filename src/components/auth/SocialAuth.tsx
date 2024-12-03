import { Button } from "@/components/ui/button";
import { Facebook, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface SocialAuthProps {
  isLogin: boolean;
}

export const SocialAuth = ({ isLogin }: SocialAuthProps) => {
  return null; // Temporarily hide social auth buttons
};