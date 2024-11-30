import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const PricingHeader = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
        Choose Your Plan
      </h2>
      <p className="mx-auto max-w-[700px] text-muted-foreground mt-4">
        Start with our 24-hour Pro trial to experience all Premium features before choosing your plan.
      </p>
      {!user && (
        <Button
          variant="link"
          className="mt-4 text-primary hover:text-primary/80"
          onClick={() => navigate('/auth')}
        >
          Already signed up? Login here
        </Button>
      )}
    </div>
  );
};