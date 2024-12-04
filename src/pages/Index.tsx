import { Hero } from "@/components/Hero";
import { FeaturedRecipes } from "@/components/FeaturedRecipes";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { Header } from "@/components/Header";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";


const clearAllData = async () => {
  // Clear localStorage
  localStorage.clear();

  // Clear sessionStorage
  sessionStorage.clear();

  // Clear cookies
  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });

  // Clear cache storage
  if ("caches" in window) {
    const cacheKeys = await caches.keys();
    for (const key of cacheKeys) {
      await caches.delete(key);
    }
  }
};


const Index = () => {
  const pricingRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
     // Clear storage and cookies on page load
    clearAllData();
    if (location.search.includes("scrollTo=pricing") && pricingRef.current) {
      pricingRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <FeatureHighlights />
      <Testimonials />
      <FeaturedRecipes />
      <div ref={pricingRef}>
        <PricingSection />
      </div>
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default Index;
