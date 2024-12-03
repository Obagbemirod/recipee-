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
          <div class="mb-6">
    <label for="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
    <input type="text" id="large-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
</div>

                
            <button type="submit" className="w-full">
              Send Reset Instructions
            </button>
         
    
        </div>
      </div>
    </div>
  );
};

export default Forgot;
