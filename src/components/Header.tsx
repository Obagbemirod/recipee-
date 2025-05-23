import { Button } from "@/components/ui/button";
import { LogIn, X, Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <div className="flex items-center space-x-2">
              <Link to="/">
                <img 
                  src="/lovable-uploads/9ca683d9-07dc-465b-ba8b-eb0f938ac0aa.png" 
                  alt="Recipee Logo" 
                  className="h-8 md:h-10" 
                />
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/about">
                  <Button variant="ghost" className="rounded-lg">
                    About Us
                  </Button>
                </Link>
                <Link to="/affiliate-program">
                  <Button variant="ghost" className="rounded-lg">
                    Become an Affiliate
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="default" className="rounded-lg">
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </Button>
                </Link>
              </div>
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
                <div className="flex flex-col gap-2 px-4 py-2">
                  <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full rounded-lg">
                      About Us
                    </Button>
                  </Link>
                  <Link to="/affiliate-program" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full rounded-lg">
                      Become an Affiliate
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full rounded-lg">
                      <LogIn className="mr-2 h-4 w-4" /> Sign In
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};