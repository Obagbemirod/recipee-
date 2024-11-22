import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { RecipeCard } from "@/components/RecipeCard";

const SavedItems = () => {
  const [activeTab, setActiveTab] = useState<"recipes" | "mealPlans">("recipes");

  const savedRecipes = [
    {
      title: "Creamy Mushroom Pasta",
      image: "/lovable-uploads/a2632717-e343-4ca8-bb0f-024fa3c6f5e1.png",
      time: "30 min",
      difficulty: "Easy",
    },
    // Add more saved recipes as needed
  ];

  const savedMealPlans = [
    {
      title: "Vegetarian Week",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999",
      time: "7 days",
      difficulty: "Medium",
    },
    // Add more saved meal plans as needed
  ];

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            variant={activeTab === "recipes" ? "default" : "outline"}
            onClick={() => setActiveTab("recipes")}
          >
            Saved Recipes
          </Button>
          <Button
            variant={activeTab === "mealPlans" ? "default" : "outline"}
            onClick={() => setActiveTab("mealPlans")}
          >
            Saved Meal Plans
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activeTab === "recipes"
              ? savedRecipes.map((recipe, index) => (
                  <RecipeCard key={index} {...recipe} />
                ))
              : savedMealPlans.map((plan, index) => (
                  <RecipeCard key={index} {...plan} />
                ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SavedItems;