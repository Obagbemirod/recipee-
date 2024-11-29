import { motion } from "framer-motion";
import { RecipeCard } from "./RecipeCard";

const recipes = [
  {
    title: "Creamy Mushroom Pasta",
    image: "/lovable-uploads/a2632717-e343-4ca8-bb0f-024fa3c6f5e1.png",
    time: "30 min",
    difficulty: "Easy",
  },
  {
    title: "Grilled Salmon Bowl",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800",
    time: "25 min",
    difficulty: "Medium",
  },
  {
    title: "Avocado Toast",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800",
    time: "10 min",
    difficulty: "Easy",
  },
];

export const FeaturedRecipes = () => {
  const scrollToPricing = () => {
    const pricingSection = document.querySelector('#pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-accent/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-secondary/10 text-secondary rounded-full">
            Featured Recipes
          </span>
          <h2 className="text-4xl font-bold mb-4">Trending Now</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular recipes loved by home cooks worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={scrollToPricing}
              className="cursor-pointer"
            >
              <RecipeCard {...recipe} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};