import { Clock, ChefHat, Utensils } from "lucide-react";
interface RecipeHeaderProps {
  totalTime: string;
  difficulty: string;
  servings: number;
}
export const RecipeHeader = ({ totalTime, difficulty, servings }: RecipeHeaderProps) => {
  return (
    <div className="border-b pb-4">
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{totalTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <ChefHat className="w-4 h-4" />
          <span>{difficulty}</span>
        </div>
        <div className="flex items-center gap-1">
          <Utensils className="w-4 h-4" />
          <span>Serves {servings}</span>
        </div>
      </div>
    </div>
  );
};