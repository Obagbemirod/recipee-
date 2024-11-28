import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChefHat, Utensils, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export function FinalCTA() {
  const benefits = [
    {
      icon: ChefHat,
      text: "AI-Powered Recipe Generation"
    },
    {
      icon: Clock,
      text: "Smart Meal Planning"
    },
    {
      icon: Utensils,
      text: "Step-by-Step Guidance"
    }
  ];

  return (
    <section className="bg-gradient-to-b from-secondary to-secondary/90 text-secondary-foreground py-20">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold"
          >
            Transform Your Cooking Journey Today
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex flex-col items-center space-y-3 p-4"
              >
                <benefit.icon className="h-8 w-8 text-primary" />
                <p className="text-lg font-medium">{benefit.text}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-12"
          >
            <p className="text-lg md:text-xl text-secondary-foreground/90">
              Join thousands of home chefs who have revolutionized their cooking experience with Recipee
            </p>
            
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 sm:px-8 text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Cooking Smartly
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}