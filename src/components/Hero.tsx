import { motion } from "framer-motion";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      <div className="absolute inset-0">
        <Carousel className="w-full h-full" opts={{ loop: true, duration: 20 }}>
          <CarouselContent>
            <CarouselItem>
              <img
                src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80"
                alt="Person cooking in modern kitchen 1"
                className="w-full h-full object-cover"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                src="https://images.unsplash.com/photo-1556910638-6cdac31d44dc?auto=format&fit=crop&q=80"
                alt="Person cooking in modern kitchen 2"
                className="w-full h-full object-cover"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80"
                alt="Person cooking in modern kitchen 3"
                className="w-full h-full object-cover"
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs md:text-sm font-medium bg-white/10 text-white rounded-full backdrop-blur-sm">
            Your Smart Kitchen Companion
          </span>
          
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-6 tracking-tight text-balance text-white">
            Revolutionize Your Kitchen with Recipee
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 text-balance px-4">
            AI-Powered Meal Planning and Interactive Cooking
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center px-4"
          >
            <Button size="lg" variant="default" className="text-base md:text-lg px-6 md:px-8 bg-primary hover:bg-primary/90 w-full sm:w-auto">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8 text-white border-white hover:bg-white/10 w-full sm:w-auto">
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};