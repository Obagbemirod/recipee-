import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface TextInputSectionProps {
  isUploading: boolean;
  onIngredientsIdentified: (ingredients: { name: string; confidence: number }[]) => void;
}

export const TextInputSection = ({ onIngredientsIdentified }: TextInputSectionProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please enter your ingredients");
      return;
    }

    // Convert text input to ingredients array
    const ingredients = text
      .split('\n')
      .filter(line => line.trim())
      .map(ingredient => ({
        name: ingredient.trim(),
        confidence: 1.0
      }));

    onIngredientsIdentified(ingredients);
    toast.success("Ingredients added successfully!");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-primary hover:border-2 transition-all duration-300">
      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder="Enter your ingredients, one per line..."
          className="min-h-[200px] mb-4"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Add Ingredients
        </Button>
      </form>
    </div>
  );
};