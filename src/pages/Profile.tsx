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
import { useRef, useEffect } from "react";
import { ArrowLeft, ShoppingBag, BookMarked } from "lucide-react";
import { CulturalPreferences } from "@/components/onboarding/CulturalPreferences";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  });

  // useEffect(() => {
  //   // Load saved preferences
  //   const savedPrefs = JSON.parse(localStorage.getItem("userPreferences") || "{}");
  //   form.reset({
  //     ...savedPrefs,
  //     name: localStorage.getItem("userName") || "",
  //     email: localStorage.getItem("userEmail") || "",
  //   });
  // }, [form]);
  // Fetch and populate user data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Get the authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error("User not authenticated");

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, email, country, cuisine_style, avatar_url")
          .eq("id", user.id)
          .single();

        if (profileError || !profileData) throw new Error("Failed to fetch profile data");

        // Populate the form fields with fetched data
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
  
  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  console.log("this is the file", file);
  if (file) {
    try {
      // Upload the file to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      console.log("this is the filename", fileName);
      const { data, error } = await supabase.storage
        .from("profile_images") // Replace with your storage bucket name
        .upload(fileName, file);
      console.log("this is the data", data);
      if (error) {
        throw new Error("Failed to upload image");
      }

      // Get the public URL of the uploaded image
      const { data: publicUrlData } = await supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);

      // if (publicUrlData?.publicUrl) {
      //   form.setValue("photo", publicUrlData.publicUrl); // Update form with the new photo URL      
      //   toast({
      //     title: "Photo updated",
      //     description: "Your profile photo has been updated successfully.",
      //   });
      // };
      if (publicUrlData?.publicUrl) {
        const { data: user } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");
        console.log("this is auth", user);
        console.log("publicUrlData?.publicUrl", publicUrlData?.publicUrl);
        console.log("this is authid", user.id);
        console.log("this is authUUID", user.UUID);
        console.log("this is authid", user.uuid);

        // Update the user's profile with the new image URL
        const { data: puser, error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: publicUrlData.publicUrl })
          .eq("id", user.id);
        
        console.log("publicUrlData?.publicUrl", publicUrlData?.publicUrl);
        if (updateError) throw new Error("Failed to update profile with image URL");
     

        toast({
          title: "Photo updated",
          description: "Your profile photo has been updated successfully.",
        });

        form.setValue("photo", publicUrlData.publicUrl); // Update the form with the new photo URL
      }

    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update photo. Please try again.",
      });
    }
  }
};


  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      // Save updated preferences with timestamp
      const updatedPreferences = {
        ...values,
        lastUpdated: new Date().toISOString(),
        source: 'profile'
      };
      
      localStorage.setItem("userPreferences", JSON.stringify(updatedPreferences));
      localStorage.setItem("dietaryPreference", values.dietaryPreference);
      localStorage.setItem("userCountry", values.country);
      localStorage.setItem("cuisineStyle", values.cuisineStyle);
      localStorage.setItem("allergies", JSON.stringify(values.allergies));

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
         throw new Error("User not authenticated");
      }         
      const myId = user.id; // Extract the profile ID
      console.log("Fetched Profile ID:", myId);

       // Log user and form values for debugging
      console.log("Authenticated user:", user);
      console.log("Authenticated userid:", user.UID);
      console.log("Form values submitted:", values);
  
      if (userError) {
        console.log("This is the error", HandleError);
      }

       // Attempt to update the user's data in Supabase
      const { data, error } = await supabase
        .from('profiles') // Replace with your Supabase table name
        .update({
          full_name: values.name,
          email: values.email,
          dietary_preference: values.dietaryPreference,
          allergies: values.allergies,
          country: values.country,
          cuisine_style: values.cuisineStyle,
          avatar_url: values.photo || null, // Optional field
        })
        .eq('id', myId)
        .select('*');

        if (error) {
          console.error("Supabase update error:", error);
          throw new Error("Failed to update profile");
          console.log("This Update error", error);
          return;
        }

      console.log("Update response:", data);
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
      console.log("Update Error", error)
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
              <div className="flex items-center space-x-4 mb-8">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={form.watch("photo") || "/placeholder.svg"} />
{/*                   <AvatarImage src="/placeholder.svg" /> */}
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                <Button variant="outline" onClick={handlePhotoClick}>
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
