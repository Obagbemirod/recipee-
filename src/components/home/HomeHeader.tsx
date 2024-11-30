import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { TrialBanner } from "./TrialBanner";

interface HomeHeaderProps {
  onLogout: () => Promise<void>;
}

export const HomeHeader = ({ onLogout }: HomeHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <BrandLogo />
        <Button variant="ghost" onClick={onLogout}>
          Logout
        </Button>
      </div>
      <TrialBanner />
    </div>
  );
};