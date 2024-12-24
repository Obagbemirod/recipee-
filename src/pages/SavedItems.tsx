import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { RecipeCard } from "@/components/RecipeCard";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { MealPlanDay } from "@/components/MealPlanDay";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SavedItems = () => {
  const [activeTab, setActiveTab] = useState<"recipes" | "mealPlans">("recipes");
  const [expandedPlanId, setExpandedPlanId] = useState<number | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [deleteType, setDeleteType] = useState<"recipe" | "mealPlan" | null>(null);
  const navigate = useNavigate();
  const location = useLocation();


  const [savedRecipes, setSavedRecipes] = useState([]);
  const [savedMealPlans, setSavedMealPlans] = useState([]);

  // // Update localStorage whenever saved items change
  // useEffect(() => {
  //   try {
  //     localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
  //   } catch (error) {
  //     console.error('Error saving recipes:', error);
  //     toast.error("Error saving recipes to local storage");
  //   }
  // }, [savedRecipes]);

  // useEffect(() => {
  //   try {
  //     localStorage.setItem('savedMealPlans', JSON.stringify(savedMealPlans));
  //   } catch (error) {
  //     console.error('Error saving meal plans:', error);
  //     toast.error("Error saving meal plans to local storage");
  //   }
  // }, [savedMealPlans]);

  // handle fetch saved recipes 
  const handleSavedRecipes = async () => {

    try {
      const { data: savedRecipeData, error: saveRecipeError } = await supabase
        .from('saved_recipes')
        .select("*")

      if(saveRecipeError && !savedRecipeData) {
        throw new Error("error fetching saved recipes")
      }

      console.log(savedRecipeData)
      setSavedRecipes(savedRecipeData)
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error("Failed to save recipe");
    }

  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const source = params.get('source');
    if (source === 'mealPlan') {
      setActiveTab('mealPlans');
    } else if (source === 'recipe') {
      setActiveTab('recipes');
      handleSavedRecipes()
    }
  }, [location]);

  const handleDelete = () => {
    if (!deleteItemId || !deleteType) return;

    try {
      if (deleteType === 'recipe') {

        toast.success("Recipe deleted successfully");
      } else {

        toast.success("Meal plan deleted successfully");
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error("Failed to delete item");
    }

    setDeleteItemId(null);
    setDeleteType(null);
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
                    <div key={index} className="relative">
                      <RecipeCard
                        title={recipe.name}
                        image={recipe.image_url || "/placeholder.svg"}
                        time={recipe.totalTime}
                        difficulty={recipe.difficulty}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setDeleteItemId(recipe.id);
                          setDeleteType('recipe');
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
                      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
                    >
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10"
                        onClick={() => {
                          setDeleteItemId(plan.id);
                          setDeleteType('mealPlan');
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                                  readOnly={true}
                                  onUpdate={() => { }}
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

        <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your saved {deleteType}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SavedItems;