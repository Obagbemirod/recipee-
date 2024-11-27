import { Link } from "react-router-dom";

export const BrandLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img
        src="/lovable-uploads/ba7a4cdd-cf16-4080-8dd1-ed11214c2520.png"
        alt="ChefAI Logo"
        className="h-8 w-auto"
      />
      <span className="font-bold text-xl text-primary">ChefAI</span>
    </Link>
  );
};