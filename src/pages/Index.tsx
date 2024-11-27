import { Hero } from "@/components/Hero";
import { FeaturedRecipes } from "@/components/FeaturedRecipes";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { Header } from "@/components/Header";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { Testimonials } from "@/components/Testimonials";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <FeatureHighlights />
      <Testimonials />
      <FeaturedRecipes />
      <PricingSection />
      <Footer />
    </main>
  );
};

export default Index;