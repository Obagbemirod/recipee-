import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        
        <div className="space-y-6 text-lg">
          <p>
            At Nexus Entrepreneurship Hub, we are dedicated to developing SaaS products 
            that solve big problems in simple ways for individuals and businesses.
          </p>
          
          <div className="bg-secondary p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Our Products</h2>
            <p className="mb-4">
              One of our flagship products is{" "}
              <a 
                href="https://www.recipee-app.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                www.recipee-app.com
              </a>
              , which is currently live and serving users worldwide.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact Information</h2>
            <div className="space-y-2">
              <p><strong>Location:</strong> Lagos, Nigeria</p>
              <p><strong>Phone:</strong> +2349130060924</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;