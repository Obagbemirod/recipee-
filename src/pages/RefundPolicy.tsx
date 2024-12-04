import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter">Refund Policy</h1>
              <p className="text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-6">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">1. Subscription Refunds</h2>
                <p>We offer refunds within 14 days of purchase for any subscription plan if you're not satisfied with our service.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">2. Refund Process</h2>
                <p>To request a refund:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact our support team at support@recipee-app.com</li>
                  <li>Provide your account email and reason for refund</li>
                  <li>Refunds are processed within 5-7 business days</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">3. Exceptions</h2>
                <p>Refunds may not be available for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Trial period usage</li>
                  <li>Promotional or discounted subscriptions</li>
                  <li>Accounts that violate our Terms of Service</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;