import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { TrialBanner } from "./TrialBanner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Crown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionBanner } from "./SubscriptionBanner";
import { useAuth } from "@/context/AuthContext";

interface HomeHeaderProps {
  onLogout: () => Promise<void>;
}

export const HomeHeader = ({ onLogout }: HomeHeaderProps) => {
  const navigate = useNavigate();
  const { plan, isTrialExpired } = useAuth();

  const handleUpgrade = () => {
    navigate("/?scrollTo=pricing");
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <BrandLogo />
        <div className="ml-4">
          <SubscriptionBanner />
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <Settings className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/marketplace")}>
              <Crown className="mr-2 h-4 w-4" />
              Marketplace
            </DropdownMenuItem>
            {(isTrialExpired || !plan || plan === "basic") && (
              <DropdownMenuItem onClick={handleUpgrade}>
                <Crown className="mr-2 h-4 w-4" />
                Upgrade Plan
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TrialBanner />
      </div>
    </div>
  );
};