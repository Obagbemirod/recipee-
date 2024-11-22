import { Button } from "@/components/ui/button";
import { Camera, ChefHat, Image, ShoppingCart, Settings, Heart, Store } from "lucide-react";
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
          {/* Quick Actions */}
          <div className="col-span-full mb-8">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2">
                <Camera className="h-8 w-8 text-primary" />
                <span>Upload Ingredients Photo</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2">
                <ChefHat className="h-8 w-8 text-primary" />
                <span>Generate AI Meal Plans</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2">
                <Image className="h-8 w-8 text-primary" />
                <span>Get Recipes from Photos</span>
              </Button>
            </div>
          </div>

          {/* Suggested Meal Plans */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Suggested for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedMealPlans.map((plan) => (
                <div key={plan.title} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={plan.image} alt={plan.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{plan.title}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                    <Button variant="link" className="mt-2 p-0">
                      View Plan →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
            <nav className="space-y-2">
              <Link to="/marketplace" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md">
                <Store className="h-5 w-5 text-primary" />
                <span>Recipe Marketplace</span>
              </Link>
              <Link to="/saved" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md">
                <Heart className="h-5 w-5 text-primary" />
                <span>Saved Recipes</span>
              </Link>
              <Link to="/grocery-list" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span>Grocery List</span>
              </Link>
              <Link to="/settings" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md">
                <Settings className="h-5 w-5 text-primary" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;