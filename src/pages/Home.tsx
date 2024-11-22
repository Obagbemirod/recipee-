import { Button } from "@/components/ui/button";
import { Camera, ChefHat, Image as ImageIcon, Video, Mic, FileText, ShoppingBag, BookMarked, User } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
          src="/lovable-uploads/740737a2-7602-4543-9613-7ae5b14807b1.png"
          alt="Chef cooking in kitchen" 
          className="w-full h-[250px] md:h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-between py-4 md:py-8">
            <div className="w-full flex items-center justify-between">
              <img 
                src="/lovable-uploads/9ca683d9-07dc-465b-ba8b-eb0f938ac0aa.png" 
                alt="Logo" 
                className="h-8 md:h-12"
              />
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/marketplace">
                  <Button 
                    variant="ghost" 
                    className="rounded-lg border border-primary text-white hover:bg-primary/20"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" /> Marketplace
                  </Button>
                </Link>
                <Link to="/saved-items">
                  <Button 
                    variant="ghost" 
                    className="rounded-lg border border-primary text-white hover:bg-primary/20"
                  >
                    <BookMarked className="mr-2 h-4 w-4" /> Saved Items
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button 
                    variant="ghost" 
                    className="rounded-lg border border-primary text-white hover:bg-primary/20"
                  >
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Button>
                </Link>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
            
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden w-full mt-4 bg-white/10 backdrop-blur-md rounded-lg p-4">
                <nav className="flex flex-col space-y-2">
                  <Link to="/marketplace" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      variant="ghost" 
                      className="w-full rounded-lg border border-primary text-white hover:bg-primary/20"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" /> Marketplace
                    </Button>
                  </Link>
                  <Link to="/saved-items" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      variant="ghost" 
                      className="w-full rounded-lg border border-primary text-white hover:bg-primary/20"
                    >
                      <BookMarked className="mr-2 h-4 w-4" /> Saved Items
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      variant="ghost" 
                      className="w-full rounded-lg border border-primary text-white hover:bg-primary/20"
                    >
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Button>
                  </Link>
                </nav>
              </div>
            )}
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
                <div className="bg-white rounded-lg shadow-md p-6 border border-primary hover:border-primary/80 transition-all duration-300 hover:shadow-lg group">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-secondary group-hover:text-primary transition-colors">
                    <Camera className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                    Upload Your Ingredients to Generate Personalized Meal Plans
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm border border-primary rounded-lg p-2 group-hover:bg-primary/10 transition-colors">
                      <Camera className="h-4 w-4 text-primary group-hover:text-primary" />
                      Photo
                    </div>
                    <div className="flex items-center gap-2 text-sm border border-primary rounded-lg p-2 group-hover:bg-primary/10 transition-colors">
                      <Video className="h-4 w-4 text-primary group-hover:text-primary" />
                      Video
                    </div>
                    <div className="flex items-center gap-2 text-sm border border-primary rounded-lg p-2 group-hover:bg-primary/10 transition-colors">
                      <Mic className="h-4 w-4 text-primary group-hover:text-primary" />
                      Audio
                    </div>
                    <div className="flex items-center gap-2 text-sm border border-primary rounded-lg p-2 group-hover:bg-primary/10 transition-colors">
                      <FileText className="h-4 w-4 text-primary group-hover:text-primary" />
                      Text
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/generate-meal-plan" className="w-full">
                <div className="bg-white rounded-lg shadow-md p-6 border border-primary hover:border-primary/80 transition-all duration-300 hover:shadow-lg group">
                  <div className="h-full flex flex-col items-center justify-center gap-2">
                    <ChefHat className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                    <span className="text-center text-secondary group-hover:text-primary transition-colors">Generate Meal Plan with AI</span>
                  </div>
                </div>
              </Link>
              <Link to="/generate-recipes" className="w-full">
                <div className="bg-white rounded-lg shadow-md p-6 border border-primary hover:border-primary/80 transition-all duration-300 hover:shadow-lg group">
                  <div className="h-full flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                    <span className="text-center text-secondary group-hover:text-primary transition-colors">Generate Recipes from Dish Photos</span>
                  </div>
                </div>
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
                    <Button variant="link" className="mt-2 p-0 text-primary hover:text-primary/80">
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