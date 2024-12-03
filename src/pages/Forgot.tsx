import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Forgot = () => {
  const navigate = useNavigate();
  
  const onSubmit = async () => {
    console.log("This is the forgot password page")
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Change Password</h2>
          <p className="text-muted-foreground mt-2">
            Enter your New Password and follow the instructions to reset your password...
          </p>
         
                    <input placeholder="Enter your New Password" />
                     <input placeholder="Confirm your New Password" />
                
            <button type="submit" className="w-full">
              Send Reset Instructions
            </Button>
            <button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => navigate("/auth")}
            >
              Back to Login
            </button>
    
        </div>
      </div>
    </div>
  );
};

export default Forgot;
