import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter">Contact Us</h1>
              <p className="text-lg text-muted-foreground">
                Get in touch with the Recipee team
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">General Inquiries</h2>
                <p>Email: hello@recipee-app.com</p>
                <p>Address: Nexus Entrepreneurship Hub, Innovation Center</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Support</h2>
                <p>For technical support and assistance:</p>
                <p>Email: support@recipee-app.com</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Business Partnerships</h2>
                <p>For business and partnership inquiries:</p>
                <p>Email: partnerships@recipee-app.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;