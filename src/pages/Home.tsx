import { Button } from "@/components/ui/button";
import { Camera, ChefHat, Image as ImageIcon, Video, Mic, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { QuickLinks } from "@/components/home/QuickLinks";
import { MobileHeader } from "@/components/home/MobileHeader";

const Home = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        <img 
          src="/lovable-uploads/ba7a4cdd-cf16-4080-8dd1-ed11214c2520.png"
          alt="Person cooking in kitchen" 
          className="w-full h-[50vh] object-cover"
        />
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full">
            <div className="h-full flex flex-col py-4">
              <MobileHeader onLogout={handleLogout} />
              
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Quick Links */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
            <QuickLinks />
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4">
              <Link to="/upload-ingredients" className="w-full">
                <div className="bg-white rounded-lg shadow-md p-6 border border-primary hover:border-primary/80 transition-all duration-300">
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
              </Link>

              <Link to="/generate-meal-plan" className="w-full">
                <div className="bg-white rounded-lg shadow-md p-6 border border-primary hover:border-primary/80 transition-all duration-300">
                  <div className="flex items-center justify-center gap-2">
                    <ChefHat className="h-6 w-6 text-primary" />
                    <span className="text-lg font-semibold">Generate Meal Plan with AI</span>
                  </div>
                </div>
              </Link>

              <Link to="/generate-recipes" className="w-full">
                <div className="bg-white rounded-lg shadow-md p-6 border border-primary hover:border-primary/80 transition-all duration-300">
                  <div className="flex items-center justify-center gap-2">
                    <ImageIcon className="h-6 w-6 text-primary" />
                    <span className="text-lg font-semibold">Generate Recipes from Photos</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;