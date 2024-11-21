import { Button } from "@/components/ui/button";
import { Menu, ChefHat, Search, LogIn, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add scroll listener
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 20);
    });
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <ChefHat className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <span className="text-lg md:text-xl font-bold text-secondary">Recipee</span>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#recipes" className="text-secondary hover:text-primary transition-colors">
                Recipes
              </a>
              <a href="#features" className="text-secondary hover:text-primary transition-colors">
                Features
              </a>
              <a href="#about" className="text-secondary hover:text-primary transition-colors">
                About
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="default" className="hidden md:flex">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden"
          >
            <div className="bg-white/95 backdrop-blur-md shadow-lg p-4">
              <nav className="flex flex-col space-y-4">
                <a 
                  href="#recipes" 
                  className="text-secondary hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Recipes
                </a>
                <a 
                  href="#features" 
                  className="text-secondary hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#about" 
                  className="text-secondary hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </a>
                <div className="flex items-center gap-2 px-4 py-2">
                  <Button variant="ghost" size="icon">
                    <Search className="h-5 w-5" />
                  </Button>
                  <Button variant="default" className="w-full">
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};