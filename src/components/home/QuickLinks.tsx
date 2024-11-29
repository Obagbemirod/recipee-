import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Heart, Upload } from "lucide-react";

interface QuickLinksProps {
  onFeatureClick: (path: string) => void;
}

export const QuickLinks = ({ onFeatureClick }: QuickLinksProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <Button
        variant="outline"
        className="flex items-center gap-2 p-6"
        onClick={() => onFeatureClick("/saved-items?source=mealPlan")}
      >
        <Clock className="h-5 w-5 text-primary" />
        <span>Saved Meal Plans</span>
      </Button>

      <Button
        variant="outline"
        className="flex items-center gap-2 p-6"
        onClick={() => onFeatureClick("/saved-items?source=recipe")}
      >
        <Heart className="h-5 w-5 text-primary" />
        <span>Saved Recipes</span>
      </Button>

      <Button
        variant="outline"
        className="flex items-center gap-2 p-6"
        onClick={() => onFeatureClick("/upload-ingredients")}
      >
        <Upload className="h-5 w-5 text-primary" />
        <span>Upload Ingredients</span>
      </Button>
    </div>
  );
};