import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Marketplace = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="border border-primary text-primary hover:bg-primary hover:text-white rounded-lg mb-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="flex flex-col items-center justify-center space-y-8 mt-12">
          <img 
            src="/lovable-uploads/0379d011-edd8-41ce-98c1-3a3bdbb30b21.png" 
            alt="Recipee Logo" 
            className="w-48 h-auto"
          />
          <h2 className="text-3xl font-bold text-center">Coming Soon</h2>
          <p className="text-xl text-muted-foreground text-center">Please check back again.</p>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;