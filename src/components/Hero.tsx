import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  const scrollToPricing = () => {
    const pricingSection = document.querySelector('#pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/lovable-uploads/18108068-da8f-4dbc-b588-6c6dcd2d7702.png"
          alt="A person joyfully cooking in a modern kitchen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-secondary/60 mix-blend-multiply" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight text-balance text-white">
            Cooking Made Simple
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 text-balance px-4">
            Unlock the Joy of Cooking. Say Goodbye to Mealtime Stress with Recipee
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              variant="default" 
              className="text-base px-6 py-2 sm:px-8 sm:py-3 bg-primary hover:bg-primary/90 w-full sm:w-auto"
              onClick={scrollToPricing}
            >
              Start Cooking Smartly
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};