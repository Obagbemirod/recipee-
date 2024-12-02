import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const Success = () => {
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('dietary_preference, country')
        .eq('id', user.id)
        .single();

      setIsNewUser(!profile?.dietary_preference || !profile?.country);
    };

    checkUserStatus();
  }, []);

  const handleProceed = () => {
    if (isNewUser) {
      navigate('/onboarding');
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-primary">Success!</h1>
        <p className="text-lg text-muted-foreground">
          Your payment has been processed successfully.
        </p>
        <Button 
          onClick={handleProceed}
          size="lg"
          className="w-full mt-8"
        >
          Proceed to Recipee
        </Button>
      </div>
    </div>
  );
};

export default Success;