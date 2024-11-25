import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Loader2, Pencil, Save, X } from "lucide-react";
import { useState } from "react";
import { ChefHat } from "lucide-react";

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

  if (!ingredients.length) return null;

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(ingredients[index].name);
  };

  const handleSave = (index: number) => {
    if (editValue.trim()) {
      ingredients[index].name = editValue.trim();
      setEditingIndex(null);
      setEditValue("");
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 border border-primary">
      <h3 className="text-xl font-semibold mb-4 text-secondary">Recognized Ingredients</h3>
      <ScrollArea className="h-[200px] mb-4">
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 bg-accent/10 rounded-md"
            >
              {editingIndex === index ? (
                <div className="flex items-center gap-2 flex-1 mr-2">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1"
                    autoFocus
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
                    onClick={handleCancel}
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
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(index)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>
      <Button
        onClick={onConfirm}
        className="w-full bg-primary hover:bg-primary/90 text-white"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
{/*             <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
              <ChefHat className="animate-spin" />
            Generating Meal Plan...
          </>
        ) : (
        <>
          <ChefHat />
           'Continue to Meal Planning'
        </>         
        )}
      </Button>
    </div>
  );
};

export default RecognizedIngredients;
