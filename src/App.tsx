import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import UploadIngredients from "./pages/UploadIngredients";
import GenerateMealPlan from "./pages/GenerateMealPlan";
import GenerateRecipes from "./pages/GenerateRecipes";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import SavedItems from "./pages/SavedItems";
import AffiliateProgram from "./pages/AffiliateProgram";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/upload-ingredients" element={<UploadIngredients />} />
            <Route path="/generate-meal-plan" element={<GenerateMealPlan />} />
            <Route path="/generate-recipes" element={<GenerateRecipes />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved-items" element={<SavedItems />} />
            <Route path="/affiliate-program" element={<AffiliateProgram />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;