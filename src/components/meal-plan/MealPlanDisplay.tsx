import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MealPlanDay } from "@/components/MealPlanDay";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { useState } from "react";

interface MealPlanDisplayProps {
  mealPlan: any;
  setMealPlan: (plan: any) => void;
}

export const MealPlanDisplay = ({ mealPlan, setMealPlan }: MealPlanDisplayProps) => {
  const navigate = useNavigate();
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const handleSave = () => {
    try {
      const savedPlans = JSON.parse(localStorage.getItem('savedMealPlans') || '[]');
      const newPlan = {
        ...mealPlan,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      };
      savedPlans.push(newPlan);
      localStorage.setItem('savedMealPlans', JSON.stringify(savedPlans));
      toast.success("Meal plan saved successfully!");
      navigate("/saved-items");
    } catch (error) {
      toast.error("Failed to save meal plan");
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              {mealPlan.name || "Your Weekly Meal Plan"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Generated on {format(new Date(), "PPpp")}
            </p>
          </div>
          <Button
            onClick={handleSave}
            size="sm"
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setExpandedPlanId(expandedPlanId ? null : mealPlan.id || 'current')}
        >
          {expandedPlanId ? "Hide Details" : "View Details"}
        </Button>

        {expandedPlanId && (
          <div className="border-t mt-4 pt-4">
            <div className="space-y-4">
              {Object.entries(mealPlan)
                .filter(([key]) => !['name', 'id', 'date'].includes(key))
                .map(([day, meals]: [string, any]) => (
                  <MealPlanDay
                    key={day}
                    day={day}
                    meals={meals}
                    onUpdate={(day, meals) => {
                      setMealPlan(prev => ({
                        ...prev,
                        [day]: meals
                      }));
                    }}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};