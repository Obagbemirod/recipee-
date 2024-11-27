import { motion } from "framer-motion";
import { Calendar, Camera, ChefHat, Heart, Users, Utensils } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Calendar,
    title: "Effortless Meal Planning",
    description: "Simplify your week with Personalized Meal Plans. Upload photos, videos, or even text your ingredients, and Recipee will generate a delicious weekly menu tailored to your dietary needs and preferences. Breakfast, lunch, and dinner – sorted!",
    gradient: "from-primary/20 via-primary/10 to-transparent",
  },
  {
    icon: Utensils,
    title: "Culinary Inspiration at Your Fingertips",
    description: "Feeling adventurous? Let our Random Recipe Generator surprise you with unique and exciting dishes every week. Discover new flavors and expand your culinary horizons.",
    gradient: "from-secondary/20 via-secondary/10 to-transparent",
  },
  {
    icon: Camera,
    title: "Recreate Restaurant-Worthy Dishes",
    description: "Love that dish you had at that new restaurant? Simply upload a photo, and Recipee will provide the ingredients and a step-by-step guide to recreate it at home. Impress your friends and family with your culinary skills!",
    gradient: "from-primary/20 via-primary/10 to-transparent",
  },
  {
    icon: ChefHat,
    title: "Personalized Recommendations from Recipee MasterChef",
    description: "Get personalized dish and meal plan recommendations tailored to your unique taste and dietary needs. Discover new favorites curated just for you by Recipee MasterChef.",
    gradient: "from-secondary/20 via-secondary/10 to-transparent",
  },
  {
    icon: Heart,
    title: "Stay Healthy and Informed",
    description: "Make informed choices with our detailed Nutritional Information feature. Track calories, macros, and other essential nutrients for each meal, empowering you to achieve your health goals.",
    gradient: "from-primary/20 via-primary/10 to-transparent",
  },
  {
    icon: Users,
    title: "Join a Global Community of Food Lovers",
    description: "Connect with fellow food enthusiasts, share your culinary creations, and discover new recipes from around the world. Join the Recipee community and unlock a world of culinary inspiration.",
    gradient: "from-secondary/20 via-secondary/10 to-transparent",
  },
];

export const FeatureHighlights = () => {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">
            Unlock a World of Culinary Possibilities with Recipee
          </h2>
          <p className="text-base md:text-lg text-secondary/70 max-w-2xl mx-auto">
            Discover how Recipee transforms your cooking experience with these amazing features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 hover:border-primary/20 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-50 transition-opacity duration-300 group-hover:opacity-100`} />
              
              <div className="relative p-8 h-full flex flex-col">
                <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="w-12 h-12 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-secondary group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-secondary/70 mb-6 flex-grow">
                  {feature.description}
                </p>
                
                <Link to="/auth" className="mt-auto">
                  <Button 
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};