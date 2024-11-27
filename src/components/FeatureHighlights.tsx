import { motion } from "framer-motion";
import { Calendar, Camera, ChefHat, Heart, Users, Utensils } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Calendar,
    title: "Effortless Meal Planning",
    description: "Simplify your week with Personalized Meal Plans. Upload photos, videos, or even text your ingredients, and Recipee will generate a delicious weekly menu tailored to your dietary needs and preferences. Breakfast, lunch, and dinner – sorted!",
    image: "/lovable-uploads/0b797584-97a3-40b9-ad6a-ec5b8f5f7443.png",
  },
  {
    icon: Utensils,
    title: "Culinary Inspiration at Your Fingertips",
    description: "Feeling adventurous? Let our Random Recipe Generator surprise you with unique and exciting dishes every week. Discover new flavors and expand your culinary horizons.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80",
  },
  {
    icon: Camera,
    title: "Recreate Restaurant-Worthy Dishes",
    description: "Love that dish you had at that new restaurant? Simply upload a photo, and Recipee will provide the ingredients and a step-by-step guide to recreate it at home. Impress your friends and family with your culinary skills!",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80",
  },
  {
    icon: ChefHat,
    title: "Personalized Recommendations from Recipee MasterChef",
    description: "Get personalized dish and meal plan recommendations tailored to your unique taste and dietary needs. Discover new favorites curated just for you by Recipee MasterChef.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80",
  },
  {
    icon: Heart,
    title: "Stay Healthy and Informed",
    description: "Make informed choices with our detailed Nutritional Information feature. Track calories, macros, and other essential nutrients for each meal, empowering you to achieve your health goals.",
    image: "/lovable-uploads/d5c09235-22d5-4ade-a71d-9b0d44ca21d9.png",
  },
  {
    icon: Users,
    title: "Join a Global Community of Food Lovers",
    description: "Connect with fellow food enthusiasts, share your culinary creations, and discover new recipes from around the world. Join the Recipee community and unlock a world of culinary inspiration.",
    image: "/lovable-uploads/cd78387e-c9c1-45e1-9599-f505c716215c.png",
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
              className="group relative overflow-hidden rounded-xl bg-accent hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/50 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <feature.icon className="w-8 h-8 md:w-10 md:h-10 mb-3 text-primary" />
                <h3 className="text-xl md:text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm md:text-base text-white/90 mb-4 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                  {feature.description}
                </p>
                <Link to="/auth" className="w-full">
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
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