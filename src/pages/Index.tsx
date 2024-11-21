import { Hero } from "@/components/Hero";
import { SearchBar } from "@/components/SearchBar";
import { FeaturedRecipes } from "@/components/FeaturedRecipes";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { Header } from "@/components/Header";

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
    </main>
  );
};

export default Index;