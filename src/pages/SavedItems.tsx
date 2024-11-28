import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { RecipeCard } from "@/components/RecipeCard";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MealPlanDay } from "@/components/MealPlanDay";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

const SavedItems = () => {
  const [activeTab, setActiveTab] = useState<"recipes" | "mealPlans">("recipes");
  const [expandedPlanId, setExpandedPlanId] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get saved recipes from localStorage
  const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
  const savedMealPlans = JSON.parse(localStorage.getItem('savedMealPlans') || '[]');

  useEffect(() => {
    // Set active tab based on the source of navigation
    const params = new URLSearchParams(location.search);
    const source = params.get('source');
    if (source === 'mealPlan') {
      setActiveTab('mealPlans');
    } else if (source === 'recipe') {
      setActiveTab('recipes');
    }
  }, [location]);

  const updateMealPlan = (planId: number, day: string, meals: any) => {
    const updatedPlans = savedMealPlans.map((plan: any) => {
      if (plan.id === planId) {
        return {
          ...plan,
          [day]: meals,
        };
      }
      return plan;
    });
    localStorage.setItem('savedMealPlans', JSON.stringify(updatedPlans));
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            className="border border-primary text-primary hover:bg-primary hover:text-white rounded-lg"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-bold">Saved Items</h1>
        </div>

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
          >
            {activeTab === "recipes" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.length === 0 ? (
                  <div className="col-span-full text-center text-muted-foreground py-8">
                    No saved recipes yet
                  </div>
                ) : (
                  savedRecipes.map((recipe: any, index: number) => (
                    <RecipeCard 
                      key={index} 
                      title={recipe.name}
                      image={recipe.image || "/placeholder.svg"}
                      time={recipe.totalTime}
                      difficulty={recipe.difficulty}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedMealPlans.length === 0 ? (
                  <div className="col-span-full text-center text-muted-foreground py-8">
                    No saved meal plans yet
                  </div>
                ) : (
                  savedMealPlans.map((plan: any) => (
                    <Card 
                      key={plan.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div 
                        className="p-6 cursor-pointer"
                        onClick={() => setExpandedPlanId(expandedPlanId === plan.id ? null : plan.id)}
                      >
                        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Generated on {format(new Date(plan.date), "PPpp")}
                        </p>
                        <Button variant="outline" className="w-full">
                          {expandedPlanId === plan.id ? "Hide Details" : "View Details"}
                        </Button>
                      </div>

                      {expandedPlanId === plan.id && (
                        <div className="border-t p-6">
                          <div className="space-y-4">
                            {Object.entries(plan)
                              .filter(([key]) => !['id', 'name', 'date'].includes(key))
                              .map(([day, meals]: [string, any]) => (
                                <MealPlanDay
                                  key={day}
                                  day={day}
                                  meals={meals}
                                  onUpdate={(day, meals) => updateMealPlan(plan.id, day, meals)}
                                />
                              ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SavedItems;