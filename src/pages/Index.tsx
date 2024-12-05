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

const Index = () => {
  const pricingRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
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