import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-12">
          {/* Hero Section */}
          <section className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary">About Recipee</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transforming the way people interact with food through innovative AI-powered solutions
            </p>
          </section>

          {/* Mission Section */}
          <section className="bg-accent rounded-lg p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-secondary">Our Mission</h2>
            <p className="text-lg">
              At Recipee, we're passionate about making cooking accessible, enjoyable, and sustainable for everyone. 
              Our AI-powered platform helps you make the most of your ingredients, reduce food waste, and discover 
              exciting new recipes tailored to your preferences.
            </p>
          </section>

          {/* What We Do Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-secondary">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-primary">Smart Recipe Generation</h3>
                <p>
                  Our advanced AI analyzes your available ingredients and dietary preferences to create 
                  personalized recipe suggestions that are both practical and delicious.
                </p>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-primary">Meal Planning</h3>
                <p>
                  Get customized meal plans that fit your lifestyle, dietary restrictions, and cooking skill level, 
                  making weekly meal prep effortless and enjoyable.
                </p>
              </div>
            </div>
          </section>

          {/* Company Info Section */}
          <section className="bg-secondary text-secondary-foreground rounded-lg p-8 space-y-4">
            <h2 className="text-2xl font-semibold">Company Information</h2>
            <div className="space-y-4">
              <p>
                Based in Lagos, Nigeria, Recipee is part of the Nexus Entrepreneurship Hub, dedicated to 
                developing innovative SaaS solutions that solve real-world problems.
              </p>
              <div className="space-y-2">
                <p><strong>Location:</strong> Lagos, Nigeria</p>
                <p><strong>Contact:</strong> +2349130060924</p>
                <p><strong>Product Website:</strong>{" "}
                  <a 
                    href="https://www.recipee-app.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-foreground hover:underline"
                  >
                    www.recipee-app.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center space-y-6">
            <h2 className="text-2xl font-semibold text-secondary">Ready to Start Your Culinary Journey?</h2>
            <Link to="/auth">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                Join Recipee Today
              </Button>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;