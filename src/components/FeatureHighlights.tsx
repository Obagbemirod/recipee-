import { motion } from "framer-motion";
import { Camera, ChefHat, Calendar, Users } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Ingredient Recognition",
    description: "Take a photo of your ingredients and let AI suggest delicious recipes",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80"
  },
  {
    icon: ChefHat,
    title: "Interactive Cooking Assistant",
    description: "Step-by-step guidance with voice commands and timers",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80"
  },
  {
    icon: Calendar,
    title: "Personalized Meal Plans",
    description: "Get customized weekly meal plans based on your preferences",
    image: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&q=80"
  },
  {
    icon: Users,
    title: "Community",
    description: "Share recipes and connect with food enthusiasts worldwide",
    image: "/lovable-uploads/d5c09235-22d5-4ade-a71d-9b0d44ca21d9.png"
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">Key Features</h2>
          <p className="text-base md:text-lg text-secondary/70 max-w-2xl mx-auto px-4">
            Discover how Recipee transforms your cooking experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl bg-accent hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                <feature.icon className="w-8 h-8 md:w-10 md:h-10 mb-3 md:mb-4 text-primary" />
                <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base text-white/90">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};