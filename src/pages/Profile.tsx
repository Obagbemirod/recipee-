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
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ArrowLeft, ShoppingBag, BookMarked } from "lucide-react";
import { CulturalPreferences } from "@/components/onboarding/CulturalPreferences";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { PhotoUploadSection } from "@/components/profile/PhotoUploadSection";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  dietaryPreference: z.string(),
  allergies: z.array(z.string()),
  country: z.string(),
  cuisineStyle: z.string(),
  photo: z.string().optional(),
});

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error("User not authenticated");

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, email, country, cuisine_style, avatar_url")
          .eq("id", user.id)
          .single();

        if (profileError || !profileData) throw new Error("Failed to fetch profile data");

        form.reset({
          name: profileData.full_name || "",
          email: profileData.email || "",
          country: profileData.country || "",
          cuisineStyle: profileData.cuisine_style || "",
          photo: profileData.avatar_url || "",
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data. Please try again later.",
        });
      }
    };

    fetchProfileData();
  }, [form, toast]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.name,
          email: values.email,
          dietary_preference: values.dietaryPreference,
          allergies: values.allergies,
          country: values.country,
          cuisine_style: values.cuisineStyle,
          avatar_url: values.photo || null,
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Update Error:", error);
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
          className="max-w-2xl mx-auto space-y-8 fixed-mobile"
        >
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="border border-primary text-primary hover:bg-primary hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <Link to="/marketplace">
              <Button variant="outline" className="w-full md:w-auto border-primary text-primary hover:bg-primary hover:text-white">
                <ShoppingBag className="mr-2 h-4 w-4" /> Marketplace
              </Button>
            </Link>
            <Link to="/saved-items">
              <Button variant="outline" className="w-full md:w-auto border-primary text-primary hover:bg-primary hover:text-white">
                <BookMarked className="mr-2 h-4 w-4" /> Saved Recipes & Meal Plans
              </Button>
            </Link>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PhotoUploadSection 
                currentPhotoUrl={form.watch("photo")} 
                setValue={form.setValue}
              />

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
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
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Card>
                    <CardHeader>
                      <CardTitle>Your Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <CulturalPreferences form={form} />
                      <DietaryPreferences form={form} />
                      <AllergiesSection form={form} />
                    </CardContent>
                  </Card>

                  <Button type="submit" className="w-full">
                    Save Changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;