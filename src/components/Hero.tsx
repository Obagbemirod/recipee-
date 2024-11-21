import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-primary/10 text-primary rounded-full">
            Your Smart Kitchen Companion
          </span>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-balance">
            Cook with confidence
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 text-balance">
            Discover recipes, plan meals, and cook like a pro with AI-powered assistance
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-4 bg-primary text-white rounded-lg font-medium hover-scale">
              Get Started
            </button>
            <button className="px-8 py-4 bg-white border border-gray-200 rounded-lg font-medium hover-scale">
              Browse Recipes
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};