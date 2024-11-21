import { Hero } from "@/components/Hero";
import { SearchBar } from "@/components/SearchBar";
import { FeaturedRecipes } from "@/components/FeaturedRecipes";
import { FeatureHighlights } from "@/components/FeatureHighlights";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <div className="py-12 bg-gradient-to-b from-accent to-white">
        <SearchBar />
      </div>
      <FeatureHighlights />
      <FeaturedRecipes />
    </main>
  );
};

export default Index;