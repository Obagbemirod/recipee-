import { Link, useLocation } from "react-router-dom";

export const BrandLogo = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <Link to="/" className="flex items-center gap-2">
      <img
        src="/lovable-uploads/1e6de312-8d82-4508-b25e-14d569bc4c82.png"
        alt="Recipee Logo"
        className={`w-auto ${isHomePage ? 'h-12' : 'h-8'}`}
      />
      {isHomePage && <span className="font-bold text-xl text-secondary">Recipee</span>}
    </Link>
  );
};