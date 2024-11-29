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
      <div className="flex items-center justify-center space-x-2 bg-accent p-1 rounded-full">
        <button
          onClick={() => onToggle(true)}
          className={`px-6 py-2 rounded-full transition-all duration-200 ${
            isLogin
              ? "bg-primary text-white shadow-md"
              : "text-secondary hover:bg-accent-foreground/10"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => onToggle(false)}
          className={`px-6 py-2 rounded-full transition-all duration-200 ${
            !isLogin
              ? "bg-primary text-white shadow-md"
              : "text-secondary hover:bg-accent-foreground/10"
          }`}
        >
          Sign Up
        </button>
      </div>
    </motion.div>
  );
};