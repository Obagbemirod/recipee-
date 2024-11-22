import { Button } from "@/components/ui/button";
import { Camera, ChefHat, Image, Video, Mic, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  const suggestedMealPlans = [
    {
      title: "Vegetarian Week",
      description: "A week of delicious plant-based meals",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=384",
    },
    {
      title: "Quick & Easy",
      description: "30-minute meals for busy days",
      image: "https://images.unsplash.com/photo-1484980972926-edee96e0960d?auto=format&fit=crop&q=80&w=384",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="relative">
        <img 
          src="https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
          alt="Header Background" 
          className="w-full h-[200px] md:h-[300px] object-cover"
        />
        <div className="absolute inset-0 bg-black/50">
          <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-between py-4 md:py-0">
            <img 
              src="/lovable-uploads/9ca683d9-07dc-465b-ba8b-eb0f938ac0aa.png" 
              alt="Logo" 
              className="h-8 md:h-12 mb-4 md:mb-0"
            />
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <Link to="/marketplace">
                <Button variant="outline" className="w-full md:w-auto border-red-500 text-white hover:bg-red-500 hover:text-white rounded-lg">
                  Marketplace
                </Button>
              </Link>
              <Link to="/saved-items">
                <Button variant="outline" className="w-full md:w-auto border-red-500 text-white hover:bg-red-500 hover:text-white rounded-lg">
                  Saved Recipes & Meal Plans
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="w-full md:w-auto border-red-500 text-white hover:bg-red-500 hover:text-white rounded-lg">
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="col-span-full mb-8">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/upload-ingredients" className="w-full">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-red-500 hover:bg-red-500 hover:text-white group">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 group-hover:text-white">
                    <Camera className="h-5 w-5 text-primary group-hover:text-white" />
                    Upload Your Ingredients to Generate Personalized Meal Plans
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm border border-red-500 rounded-lg p-2 group-hover:text-white">
                      <Camera className="h-4 w-4" />
                      Photo
                    </div>
                    <div className="flex items-center gap-2 text-sm border border-red-500 rounded-lg p-2 group-hover:text-white">
                      <Video className="h-4 w-4" />
                      Video
                    </div>
                    <div className="flex items-center gap-2 text-sm border border-red-500 rounded-lg p-2 group-hover:text-white">
                      <Mic className="h-4 w-4" />
                      Audio
                    </div>
                    <div className="flex items-center gap-2 text-sm border border-red-500 rounded-lg p-2 group-hover:text-white">
                      <FileText className="h-4 w-4" />
                      Text
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/generate-meal-plan" className="w-full">
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2 w-full rounded-lg border-red-500 text-primary hover:bg-red-500 hover:text-white">
                  <ChefHat className="h-8 w-8 text-primary group-hover:text-white" />
                  <span>Generate Meal Plan with AI</span>
                </Button>
              </Link>
              <Link to="/generate-recipes" className="w-full">
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2 w-full rounded-lg border-red-500 text-primary hover:bg-red-500 hover:text-white">
                  <Image className="h-8 w-8 text-primary group-hover:text-white" />
                  <span>Generate Recipes from Dish Photos</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Suggested for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedMealPlans.map((plan) => (
                <div key={plan.title} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={plan.image} alt={plan.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{plan.title}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                    <Button variant="link" className="mt-2 p-0 rounded-lg">
                      View Plan →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;