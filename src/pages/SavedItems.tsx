import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
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
import { SavedRecipeCard } from "@/components/saved-items/SavedRecipeCard";
import { SavedMealPlanCard } from "@/components/saved-items/SavedMealPlanCard";

const SavedItems = () => {
  const [activeTab, setActiveTab] = useState<"recipes" | "mealPlans">("recipes");
  const [expandedPlanId, setExpandedPlanId] = useState<number | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"recipe" | "mealPlan" | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [savedMealPlans, setSavedMealPlans] = useState<any[]>([]);

  useEffect(() => {
    fetchSavedRecipes();
    // Keep existing meal plans loading logic
    const loadSavedMealPlans = () => {
      try {
        const items = localStorage.getItem('savedMealPlans');
        return items ? JSON.parse(items) : [];
      } catch (error) {
        console.error('Error loading meal plans:', error);
        toast.error("Error loading saved meal plans");
        return [];
      }
    };
    setSavedMealPlans(loadSavedMealPlans());
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const source = params.get('source');
    if (source === 'mealPlan') {
      setActiveTab('mealPlans');
    } else if (source === 'recipe') {
      setActiveTab('recipes');
    }
  }, [location]);

  const fetchSavedRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error("Failed to load saved recipes");
    }
  };

  const handleDelete = async () => {
    if (!deleteItemId || !deleteType) return;

    try {
      if (deleteType === 'recipe') {
        const { error } = await supabase
          .from('saved_recipes')
          .delete()
          .eq('id', deleteItemId);

        if (error) throw error;
        await fetchSavedRecipes();
        toast.success("Recipe deleted successfully");
      } else {
        const updatedMealPlans = savedMealPlans.filter((plan: any) => plan.id !== deleteItemId);
        setSavedMealPlans(updatedMealPlans);
        localStorage.setItem('savedMealPlans', JSON.stringify(updatedMealPlans));
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
                  savedRecipes.map((recipe) => (
                    <SavedRecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onDelete={(id) => {
                        setDeleteItemId(id);
                        setDeleteType('recipe');
                      }}
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
                    <SavedMealPlanCard
                      key={plan.id}
                      plan={plan}
                      expandedPlanId={expandedPlanId}
                      onExpand={setExpandedPlanId}
                      onDelete={(id) => {
                        setDeleteItemId(id.toString());
                        setDeleteType('mealPlan');
                      }}
                    />
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
