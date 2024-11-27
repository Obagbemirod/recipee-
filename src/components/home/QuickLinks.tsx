import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookMarked, ChefHat } from "lucide-react";

export const QuickLinks = () => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto">
      <Link to="/saved-items?tab=mealPlans" className="w-full">
        <Button 
          variant="outline" 
          className="w-full h-24 flex flex-col items-center justify-center gap-2 border-2 border-primary/20 hover:border-primary"
        >
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium">Saved Meal Plans</span>
        </Button>
      </Link>
      <Link to="/saved-items?tab=recipes" className="w-full">
        <Button 
          variant="outline" 
          className="w-full h-24 flex flex-col items-center justify-center gap-2 border-2 border-primary/20 hover:border-primary"
        >
          <BookMarked className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium">Saved Recipes</span>
        </Button>
      </Link>
    </div>
  );
};