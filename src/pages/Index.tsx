import { Hero } from "@/components/Hero";
import { SearchBar } from "@/components/SearchBar";
import { FeaturedRecipes } from "@/components/FeaturedRecipes";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <div className="py-12 bg-muted">
        <SearchBar />
      </div>
      <FeaturedRecipes />
    </main>
  );
};

export default Index;