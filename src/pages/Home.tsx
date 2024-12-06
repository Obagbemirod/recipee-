import { Button } from "@/components/ui/button";
import { Camera, ChefHat, Image as ImageIcon, Video, Mic, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { QuickLinks } from "@/components/home/QuickLinks";
import { HomeHeader } from "@/components/home/HomeHeader";
import { useFeatureAccess } from '@/components/home/FeatureAccess';
import { useSubscription } from "@/hooks/useSubscription";
import { useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const { checkAccess, SubscriptionPrompt } = useFeatureAccess();
  const { plan, isTrialExpired, checkSubscription } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleFeatureClick = (path: string) => {
    // Premium users get unrestricted access to all features
    if (plan === "premium") {
      navigate(path);
      return;
    }

    // Trial users get full access if trial is not expired
    if (plan === "24_hour_trial" && !isTrialExpired) {
      navigate(path);
      return;
    }

    // Basic users can only access specific features
    if (plan === "basic") {
      if (path === "/upload-ingredients" || path.startsWith("/saved-items")) {
        navigate(path);
        return;
      }

      if (path === "/generate-meal-plan" || path === "/generate-recipes") {
        toast.error("This feature requires a Premium subscription. Please upgrade to access.");
        return;
      }
    }

    // Trial expired or no plan
    if (!plan || (plan === "24_hour_trial" && isTrialExpired)) {
      toast.error("Please subscribe to access this feature.");
      return;
    }

    if (checkAccess()) {
      navigate(path);
    }
  };

  useEffect(() => {
    // check subscription on render
    checkSubscription()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <img
          src="/lovable-uploads/ba7a4cdd-cf16-4080-8dd1-ed11214c2520.png"
          alt="Person cooking in kitchen"
          className="w-full h-[50vh] object-cover"
        />
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full">
            <div className="h-full flex flex-col py-4">
              <HomeHeader onLogout={handleLogout} />

              <div className="flex-1 flex items-center justify-center">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-bold text-white text-center max-w-md"
                >
                  Your Personal Kitchen Assistant
                </motion.h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
            <QuickLinks onFeatureClick={handleFeatureClick} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4">
              <div
                onClick={() => handleFeatureClick("/upload-ingredients")}
                className="bg-white rounded-lg shadow-md p-6 border border-primary hover:border-primary/80 transition-all duration-300 cursor-pointer"
              >
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-secondary">
                  <Camera className="h-5 w-5 text-primary" />
                  Upload Your Ingredients
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm border border-primary rounded-lg p-2">
                    <Camera className="h-4 w-4 text-primary" />
                    Photo
                  </div>
                  <div className="flex items-center gap-2 text-sm border border-primary rounded-lg p-2">
                    <Video className="h-4 w-4 text-primary" />
                    Video
                  </div>
                  <div className="flex items-center gap-2 text-sm border border-primary rounded-lg p-2">
                    <Mic className="h-4 w-4 text-primary" />
                    Audio
                  </div>
                  <div className="flex items-center gap-2 text-sm border border-primary rounded-lg p-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Text
                  </div>
                </div>
              </div>

              <div
                onClick={() => handleFeatureClick("/generate-meal-plan")}
                className={`bg-white rounded-lg shadow-md p-6 border border-primary hover:border-primary/80 transition-all duration-300 cursor-pointer ${(!plan || (plan === 'basic')) ? 'opacity-75' : ''}`}
              >
                <div className="flex flex-col items-center gap-3">
                  <ChefHat className="h-6 w-6 text-primary" />
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Recipee MasterChef</h3>
                    <p className="text-sm text-muted-foreground">
                      Discover culinary surprises with our Random Meal Plan Generator, where each click unveils weekly unique and exciting dishes to try.
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => handleFeatureClick("/generate-recipes")}
                className={`bg-white rounded-lg shadow-md p-6 border border-primary hover:border-primary/80 transition-all duration-300 cursor-pointer ${(!plan || (plan === 'basic')) ? 'opacity-75' : ''}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <ImageIcon className="h-6 w-6 text-primary" />
                  <span className="text-lg font-semibold">Generate Recipes from Photos</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <SubscriptionPrompt />
    </div>
  );
};

export default Home;
