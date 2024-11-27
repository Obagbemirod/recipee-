import { Link } from "react-router-dom";

export const BrandLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img
        src="/lovable-uploads/a54490e1-2a8d-45c0-b781-16f4d61fd8ce.png"
        alt="Recipee Logo"
        className="h-8 w-auto"
      />
      <span className="font-bold text-xl text-secondary">Recipee</span>
    </Link>
  );
};