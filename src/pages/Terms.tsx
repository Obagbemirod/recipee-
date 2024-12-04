import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter">Terms of Service</h1>
              <p className="text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-6">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
                <p>By accessing and using Recipee, you agree to be bound by these Terms of Service.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">2. User Accounts</h2>
                <p>Users are responsible for maintaining the security of their accounts and all activities that occur under their accounts.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">3. Service Usage</h2>
                <p>Users agree to use the service in compliance with all applicable laws and regulations.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">4. Intellectual Property</h2>
                <p>All content and materials available on Recipee are protected by intellectual property rights.</p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;