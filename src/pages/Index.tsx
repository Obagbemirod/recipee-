import { Hero } from "@/components/Hero";
import { FeaturedRecipes } from "@/components/FeaturedRecipes";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { Header } from "@/components/Header";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Clear cache when component mounts
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
  }, []);

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <FeatureHighlights />
      <Testimonials />
      <FeaturedRecipes />
      <PricingSection />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default Index;