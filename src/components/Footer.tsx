import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { Button } from "./ui/button";

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/recipee" },
  { icon: Instagram, href: "https://instagram.com/recipee" },
  { icon: Twitter, href: "https://twitter.com/recipee" },
  { icon: Linkedin, href: "https://linkedin.com/company/recipee" },
  { icon: Youtube, href: "https://youtube.com/recipee" },
];

const navLinks = [
  { text: "About Us", href: "/about" },
  { text: "Contact", href: "/contact" },
  { text: "Privacy Policy", href: "/privacy" },
  { text: "Terms of Service", href: "/terms" },
];

// Separate components to reduce file size
const FooterLogo = () => (
  <div className="space-y-4">
    <div className="inline-flex p-2 rounded-full bg-white">
      <img 
        src="/lovable-uploads/1be4cc88-b859-4a91-869b-0925222463a7.png" 
        alt="Recipee Logo" 
        className="h-8" 
      />
    </div>
    <p className="text-sm text-secondary-foreground/80">
      Your AI-powered cooking companion that turns ingredients into delicious meals.
    </p>
  </div>
);

const FooterLinks = () => (
  <div>
    <h3 className="font-semibold mb-4">Quick Links</h3>
    <ul className="space-y-2">
      {navLinks.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
          >
            {link.text}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const FooterContact = () => (
  <div>
    <h3 className="font-semibold mb-4">Contact Us</h3>
    <div className="space-y-2 text-sm text-secondary-foreground/80">
      <p>Email: hello@recipee.com</p>
      <p>Phone: (555) 123-4567</p>
      <p>Address: 123 Kitchen Street</p>
    </div>
  </div>
);

const FooterSocial = () => (
  <div>
    <h3 className="font-semibold mb-4">Follow Us</h3>
    <div className="flex space-x-4">
      {socialLinks.map((social) => (
        <a
          key={social.href}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary-foreground/80 hover:text-primary transition-colors"
        >
          <social.icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  </div>
);

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <FooterLogo />
          <FooterLinks />
          <FooterContact />
          <FooterSocial />
        </div>

        <div className="border-t border-secondary-foreground/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-secondary-foreground/80">
              © {new Date().getFullYear()} Recipee. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-sm">
                Cookie Policy
              </Button>
              <Button variant="ghost" size="sm" className="text-sm">
                Sitemap
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}