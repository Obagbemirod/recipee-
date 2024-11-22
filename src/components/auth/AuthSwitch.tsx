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
      <div className="flex items-center justify-center space-x-3">
        <span 
          className={`text-sm font-medium cursor-pointer ${!isLogin ? "text-primary" : "text-muted-foreground"}`}
          onClick={() => onToggle(true)}
        >
          Sign Up
        </span>
        <Switch
          id="auth-mode"
          checked={!isLogin}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-primary data-[state=unchecked]:border-2 data-[state=unchecked]:border-primary"
        />
        <span 
          className={`text-sm font-medium cursor-pointer ${isLogin ? "text-primary" : "text-muted-foreground"}`}
          onClick={() => onToggle(false)}
        >
          Login
        </span>
      </div>
    </motion.div>
  );
};