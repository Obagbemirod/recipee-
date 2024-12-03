import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const resetPasswordSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });


const Forgot = () => {
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

const handleSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    try {
      const { email, password } = values;

      // Verify if the email exists in your database
      const { data: user, error: fetchError } = await supabase
        .from("user_auth_status")
        .select("email")
        .eq("email", email)
        .single();

      if (fetchError || !user) {
        alert("The email address is not associated with any account.");
        return;
      }

      // Update the password in Supabase
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        password,
      });

      if (updateError) {
        console.error("Error updating password:", updateError.message);
        alert("Failed to update the password. Please try again later.");
        return;
      }

      alert("Password updated successfully! You can now log in with your new password.");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };
 

  
 


  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Change Password</h2>
          <p className="text-muted-foreground mt-2">
            Enter your New Password and follow the instructions to reset your password...
          </p>
        <Form {...form}>
         <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter a new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </form>
    </Form>

         
    
        </div>
      </div>
    </div>
  );
};

export default Forgot;
