import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChefHat, Pencil, Save, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Ingredient {
  name: string;
  confidence: number;
}

interface RecognizedIngredientsProps {
  ingredients: Ingredient[];
  onRemove: (index: number) => void;
  onConfirm: () => void;
  isGenerating?: boolean;
}

const RecognizedIngredients = ({ ingredients, onRemove, onConfirm, isGenerating = false }: RecognizedIngredientsProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    // Store recognized ingredients in localStorage for meal plan generation
    localStorage.setItem('recognizedIngredients', JSON.stringify(ingredients));
  }, [ingredients]);

  if (!ingredients.length) return null;

  const handleEdit = (index: number, name: string) => {
    setEditingIndex(index);
    setEditValue(name);
  };

  const handleSave = (index: number) => {
    if (editValue.trim()) {
      ingredients[index].name = editValue.trim();
      setEditingIndex(null);
      setEditValue("");
      toast.success("Ingredient updated!");
    } else {
      toast.error("Ingredient name cannot be empty!");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 border border-primary">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-secondary">Recognized Ingredients</h3>
      </div>
      <div 
        className="h-[200px] mb-4 overflow-y-auto pr-4 custom-scrollbar"
        style={{ scrollbarWidth: 'thin' }}
      >
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 bg-accent/10 rounded-md animate-fade-in"
            >
              {editingIndex === index ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1"
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSave(index);
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave(index)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingIndex(null);
                      setEditValue("");
                    }}
                    className="text-secondary hover:text-secondary/90"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-secondary">
                    {ingredient.name}
                    <span className="text-xs text-secondary/60 ml-2">
                      {Math.round(ingredient.confidence * 100)}% confidence
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(index, ingredient.name)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onRemove(index);
                        toast.success("Ingredient removed!");
                      }}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Button
        onClick={onConfirm}
        className="w-full bg-primary hover:bg-primary/90 text-white"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <ChefHat className="animate-spin mr-2" />
            Generating Meal Plan...
          </>
        ) : (
          <>
            <ChefHat className="mr-2" />
            Continue to Meal Planning
          </>
        )}
      </Button>
    </div>
  );
};

export default RecognizedIngredients;
