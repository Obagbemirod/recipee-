import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { MealPlanDay } from "@/components/MealPlanDay";

interface SavedMealPlanCardProps {
  plan: any;
  expandedPlanId: number | null;
  onExpand: (id: number | null) => void;
  onDelete: (id: number) => void;
}

export const SavedMealPlanCard = ({ 
  plan, 
  expandedPlanId, 
  onExpand, 
  onDelete 
}: SavedMealPlanCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 z-10"
        onClick={() => onDelete(plan.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <div 
        className="p-6 cursor-pointer"
        onClick={() => onExpand(expandedPlanId === plan.id ? null : plan.id)}
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
                  onUpdate={() => {}}
                />
              ))}
          </div>
        </div>
      )}
    </Card>
  );
};