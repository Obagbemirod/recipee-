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
    <div className="min-h-screen bg-gray-50 pt-20">
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
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    Upload Your Ingredients to Generate Personalized Meal Plans
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Camera className="h-4 w-4" />
                      Photo
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Video className="h-4 w-4" />
                      Video
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mic className="h-4 w-4" />
                      Audio
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      Text
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/generate-meal-plan" className="w-full">
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2 w-full rounded-lg border-primary text-primary hover:bg-primary hover:text-white">
                  <ChefHat className="h-8 w-8 text-primary" />
                  <span>Generate Meal Plan with AI</span>
                </Button>
              </Link>
              <Link to="/generate-recipes" className="w-full">
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2 w-full rounded-lg border-primary text-primary hover:bg-primary hover:text-white">
                  <Image className="h-8 w-8 text-primary" />
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