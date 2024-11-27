import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface MobileHeaderProps {
  onLogout: () => void;
}

export const MobileHeader = ({ onLogout }: MobileHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <div className="flex items-center justify-between">
        <img 
          src="/lovable-uploads/9ca683d9-07dc-465b-ba8b-eb0f938ac0aa.png" 
          alt="Logo" 
          className="h-8"
        />
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
      {isOpen && (
        <nav className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
          <div className="flex flex-col space-y-2">
            <Link to="/marketplace" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Marketplace
              </Button>
            </Link>
            <Link to="/saved-items" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Saved Items
              </Button>
            </Link>
            <Link to="/profile" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Profile
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
            >
              Logout
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
};