import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter">Privacy Policy</h1>
              <p className="text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-6">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
                <p>At Recipee, we collect information to provide better services to our users. This includes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information (email, name)</li>
                  <li>Usage data</li>
                  <li>Device information</li>
                  <li>Cooking preferences and dietary restrictions</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
                <p>We use the collected information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide personalized recipe recommendations</li>
                  <li>Improve our services</li>
                  <li>Communicate with you about updates and promotions</li>
                  <li>Ensure platform security</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">3. Data Protection</h2>
                <p>We implement security measures to protect your personal information and ensure data privacy.</p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;