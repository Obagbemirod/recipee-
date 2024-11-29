import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const AffiliateProgram = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter">Recipee Affiliate Program</h1>
              <p className="text-lg text-muted-foreground">
                Join our affiliate program and earn while helping others discover the joy of cooking
              </p>
            </div>

            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Why Become a Recipee Affiliate?</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-medium">Generous Commission Structure</h3>
                    <p className="text-muted-foreground">Earn up to 30% commission on every successful referral</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">30-Day Cookie Window</h3>
                    <p className="text-muted-foreground">Get credited for sales within 30 days of the initial referral</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Real-Time Analytics</h3>
                    <p className="text-muted-foreground">Track your performance with detailed reporting and insights</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Marketing Resources</h3>
                    <p className="text-muted-foreground">Access promotional materials, banners, and content templates</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">How It Works</h2>
                <ol className="space-y-4 list-decimal list-inside">
                  <li>Sign up for the Recipee Affiliate Program</li>
                  <li>Get your unique referral link</li>
                  <li>Share with your audience</li>
                  <li>Earn commissions on successful referrals</li>
                  <li>Get paid monthly via your preferred payment method</li>
                </ol>
              </section>

              <div className="text-center">
                <Button size="lg" className="w-full md:w-auto">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AffiliateProgram;