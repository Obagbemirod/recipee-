import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RecipeCard } from "@/components/RecipeCard";

const Marketplace = () => {
  const navigate = useNavigate();
  const isAuthenticated = false; // This should come from your auth context

  const handleCloneRecipe = () => {
    if (!isAuthenticated) {
      toast.error("Please sign up or login to clone recipes");
      navigate("/auth");
      return;
    }
    // Handle clone logic here
  };

  const recipes = [
    {
      title: "Homemade Margherita Pizza",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
      time: "45 mins",
      difficulty: "Medium",
    },
    {
      title: "Classic Caesar Salad",
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1",
      time: "15 mins",
      difficulty: "Easy",
    },
    // Add more recipes as needed
  ];

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Recipe Marketplace</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <div key={index} className="relative">
              <RecipeCard {...recipe} />
              <Button
                className="mt-4 w-full"
                onClick={handleCloneRecipe}
              >
                Clone Recipe
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;