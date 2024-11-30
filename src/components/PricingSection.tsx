import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { plans } from "@/data/plans";
import { PricingCard } from "./pricing/PricingCard";

export function PricingSection() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handlePlanSelection = (plan: typeof plans[0]) => {
    if (user) {
      // If user is already logged in, handle the flow directly
      if (plan.planId === "24_hour_trial") {
        navigate('/auth?plan=24_hour_trial');
      } else {
        navigate(`/auth?plan=${plan.planId}`);
      }
    } else {
      // If user is not logged in, redirect to auth page with plan parameter
      navigate(`/auth?plan=${plan.planId}`);
    }
  };

  return (
    <section id="pricing-section" className="py-16 bg-accent">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Choose Your Plan
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground mt-4">
            Start with our 24-hour Pro trial to experience all Premium features before choosing your plan.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PricingCard 
              key={plan.name}
              plan={plan}
              onSelect={handlePlanSelection}
            />
          ))}
        </div>
      </div>
    </section>
  );
}