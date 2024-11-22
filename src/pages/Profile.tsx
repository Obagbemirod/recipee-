import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { DietaryPreferences } from "@/components/onboarding/DietaryPreferences";
import { AllergiesSection } from "@/components/onboarding/AllergiesSection";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useRef } from "react";
import { ArrowLeft, ShoppingBag, BookMarked } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  dietaryPreference: z.string(),
  allergies: z.array(z.string()),
  photo: z.string().optional(),
});

const Profile = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "Photo updated",
        description: "Your profile photo has been updated successfully.",
      });
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      dietaryPreference: "omnivore",
      allergies: [],
      photo: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      console.log("Profile values:", values);
      toast({
        title: "Profile updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              className="border border-primary text-primary hover:bg-primary hover:text-white rounded-lg"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <Link to="/marketplace">
              <Button variant="outline" className="w-full md:w-auto border-primary text-primary hover:bg-primary hover:text-white rounded-lg">
                <ShoppingBag className="mr-2 h-4 w-4" /> Marketplace
              </Button>
            </Link>
            <Link to="/saved-items">
              <Button variant="outline" className="w-full md:w-auto border-primary text-primary hover:bg-primary hover:text-white rounded-lg">
                <BookMarked className="mr-2 h-4 w-4" /> Saved Recipes & Meal Plans
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-4 mb-8">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            <Button variant="outline" onClick={handlePhotoClick} className="rounded-lg">
              Change Photo
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} className="rounded-lg" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} className="rounded-lg" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DietaryPreferences form={form} />
              <AllergiesSection form={form} />

              <Button type="submit" className="w-full rounded-lg">
                Save Changes
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
