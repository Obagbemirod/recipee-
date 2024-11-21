import { Hero } from "@/components/Hero";
import { SearchBar } from "@/components/SearchBar";
import { FeaturedRecipes } from "@/components/FeaturedRecipes";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { Header } from "@/components/Header";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <div className="py-12 bg-gradient-to-b from-accent to-white">
        <SearchBar />
      </div>
      <FeatureHighlights />
      <FeaturedRecipes />
      <PricingSection />
      <Footer />
    </main>
  );
};

export default Index;