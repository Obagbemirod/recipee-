import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";

interface SavedRecipeCardProps {
  recipe: {
    id: string;
    name: string;
    image_url: string | null;
    total_time: string;
    difficulty: string;
  };
  onDelete: (id: string) => void;
}

export const SavedRecipeCard = ({ recipe, onDelete }: SavedRecipeCardProps) => {
  return (
    <div className="relative">
      <RecipeCard 
        title={recipe.name}
        image={recipe.image_url || "/placeholder.svg"}
        time={recipe.total_time}
        difficulty={recipe.difficulty}
      />
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2"
        onClick={() => onDelete(recipe.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};