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
    const clearCache = async () => {
      try {
        // Clear application cache
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
          console.log('Cache cleared successfully');
        }

        // Unregister service workers
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(
            registrations.map(registration => registration.unregister())
          );
          console.log('Service workers unregistered');
        }

        // Reload the page without cache
        window.location.reload(true);
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    };

    clearCache();
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