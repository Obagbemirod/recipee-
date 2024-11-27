import { Button } from "@/components/ui/button";
import { Save, Pencil, X, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MealPlanDay } from "@/components/MealPlanDay";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface MealPlanProps {
  mealPlan: any;
}

const IngredientBasedMealPlan = ({ mealPlan }: MealPlanProps) => {
  const navigate = useNavigate();
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [localMealPlan, setLocalMealPlan] = useState(mealPlan);

  const saveMealPlan = () => {
    try {
      const savedPlans = JSON.parse(localStorage.getItem('savedMealPlans') || '[]');
      savedPlans.push({
        ...localMealPlan,
        id: Date.now(),
        date: new Date().toISOString(),
      });
      localStorage.setItem('savedMealPlans', JSON.stringify(savedPlans));
      toast.success("Meal plan saved successfully!");
      navigate("/saved-items");
    } catch (error) {
      toast.error("Failed to save meal plan");
    }
  };

  const handleEdit = (day: string, meal: any) => {
    setEditingDay(day);
    setEditValue(meal.name);
  };

  const handleSave = (day: string, mealType: string) => {
    if (editValue.trim()) {
      setLocalMealPlan(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [mealType]: {
            ...prev[day][mealType],
            name: editValue.trim()
          }
        }
      }));
      setEditingDay(null);
      setEditValue("");
      toast.success("Meal updated successfully!");
    } else {
      toast.error("Meal name cannot be empty!");
    }
  };

  const handleShuffle = () => {
    const days = Object.keys(localMealPlan).filter(key => key !== 'name');
    const shuffledDays = [...days].sort(() => Math.random() - 0.5);
    
    const newMealPlan = { name: localMealPlan.name };
    shuffledDays.forEach((newDay, index) => {
      newMealPlan[newDay] = localMealPlan[days[index]];
    });
    
    setLocalMealPlan(newMealPlan);
    toast.success("Meals shuffled successfully!");
  };

  if (!mealPlan) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mt-6 border border-primary hover:border-2 transition-all duration-300 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-secondary">
          Your Weekly Meal Plan
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleShuffle}
            className="flex items-center gap-2"
          >
            <Shuffle className="h-4 w-4" />
            Shuffle Days
          </Button>
          <Button
            onClick={saveMealPlan}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Plan
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(localMealPlan)
          .filter(([key]) => key !== 'name')
          .map(([day, meals]: [string, any]) => (
            <div key={day} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2 capitalize">{day}</h3>
              {Object.entries(meals).map(([mealType, meal]: [string, any]) => (
                <div key={mealType} className="flex items-center justify-between py-2">
                  {editingDay === day && editValue === meal.name ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1"
                        autoFocus
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSave(day, mealType);
                          }
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSave(day, mealType)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingDay(null);
                          setEditValue("");
                        }}
                        className="text-secondary hover:text-secondary/90"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="capitalize">
                        {mealType}: {meal.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(day, meal)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default IngredientBasedMealPlan;