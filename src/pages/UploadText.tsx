import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UploadText = () => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please enter your ingredients");
      return;
    }

    setIsSubmitting(true);
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    toast.success("Ingredients submitted successfully!");
    navigate("/generate-meal-plan");
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">List Your Ingredients</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Enter your ingredients, one per line..."
              className="min-h-[200px] mb-4"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Ingredients"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadText;