import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";
import { checkFeatureAccess, type SubscriptionFeatures } from "@/utils/subscriptionUtils";
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
import ForgotPassword from "./pages/ForgotPassword";
import Forgot from "./pages/Forgot";
import AboutUs from "./pages/AboutUs";
import Success from "./pages/Success";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, feature }: { children: React.ReactNode, feature?: keyof SubscriptionFeatures }) => {
  const { plan } = useSubscription();
  
  if (feature && !checkFeatureAccess(plan, feature)) {
    toast.error("This feature requires a Premium subscription. Please upgrade to access.");
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

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
            <Route path="/forgotPassword" element={<Forgot />} />
            <Route path="/upload-ingredients" element={<UploadIngredients />} />
            <Route 
              path="/generate-meal-plan" 
              element={
                <ProtectedRoute feature="recipeGeneration">
                  <GenerateMealPlan />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/generate-recipes" 
              element={
                <ProtectedRoute feature="recipeGeneration">
                  <GenerateRecipes />
                </ProtectedRoute>
              } 
            />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved-items" element={<SavedItems />} />
            <Route path="/affiliate-program" element={<AffiliateProgram />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/success" element={<Success />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
