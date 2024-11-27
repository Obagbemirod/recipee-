import { Link, useLocation } from "react-router-dom";

export const BrandLogo = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <Link to="/">
      <img
        src="/lovable-uploads/516b173a-8ee4-43c0-8f35-8dc3b393d085.png"
        alt="Recipee Logo"
        className={`w-auto ${isHomePage ? 'h-16' : 'h-12'}`}
      />
    </Link>
  );
};