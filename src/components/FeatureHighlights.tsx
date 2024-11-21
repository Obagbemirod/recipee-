import { motion } from "framer-motion";
import { Camera, ChefHat, Calendar, Users } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Ingredient Recognition",
    description: "Take a photo of your ingredients and let AI suggest delicious recipes",
  },
  {
    icon: ChefHat,
    title: "Interactive Cooking Assistant",
    description: "Step-by-step guidance with voice commands and timers",
  },
  {
    icon: Calendar,
    title: "Personalized Meal Plans",
    description: "Get customized weekly meal plans based on your preferences",
  },
  {
    icon: Users,
    title: "Community",
    description: "Share recipes and connect with food enthusiasts worldwide",
  },
];

export const FeatureHighlights = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-secondary">Key Features</h2>
          <p className="text-lg text-secondary/70 max-w-2xl mx-auto">
            Discover how Recipee transforms your cooking experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-lg bg-accent hover:shadow-lg transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-secondary">{feature.title}</h3>
              <p className="text-secondary/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};