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

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/2db23d64-bf99-47af-817e-063cd82c9b69.png" 
                alt="Recipee Logo" 
                className="h-8" 
              />
            </div>
            <p className="text-sm text-secondary-foreground/80">
              Your AI-powered cooking companion that turns ingredients into delicious meals.
            </p>
          </div>

          {/* Navigation Links */}
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

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-secondary-foreground/80">
              <p>Email: hello@recipee.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Address: 123 Kitchen Street</p>
            </div>
          </div>

          {/* Social Links */}
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
        </div>

        {/* Bottom Bar */}
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