import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface AuthSwitchProps {
  isLogin: boolean;
  onToggle: (checked: boolean) => void;
}

export const AuthSwitch = ({ isLogin, onToggle }: AuthSwitchProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center space-y-2 mb-8"
    >
      <div className="flex items-center justify-center space-x-4 bg-secondary p-2 rounded-full">
        <button
          onClick={() => onToggle(false)}
          className={`px-4 py-2 rounded-full transition-all ${
            isLogin
              ? "bg-primary text-white"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => onToggle(true)}
          className={`px-4 py-2 rounded-full transition-all ${
            !isLogin
              ? "bg-primary text-white"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          Sign Up
        </button>
      </div>
    </motion.div>
  );
};