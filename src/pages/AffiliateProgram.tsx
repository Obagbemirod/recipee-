import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom'; 

const AffiliateProgram = () => {
  const navigate = useNavigate(); 
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden fixed-mobile">
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

            <div className="grid gap-8">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Why Become a Recipee Affiliate?</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="font-medium text-primary">Free Registration</h3>
                      <p className="text-muted-foreground">Start earning without any upfront costs</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-primary">Weekly Payouts</h3>
                      <p className="text-muted-foreground">Get paid every Friday, no delays</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-primary">No Minimum Withdrawal</h3>
                      <p className="text-muted-foreground">Withdraw your earnings at any time</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-primary">12-Month Recurring Commission</h3>
                      <p className="text-muted-foreground">Earn commission for a full year on each referral</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-primary">Customer Discounts</h3>
                      <p className="text-muted-foreground">Offer special discounts to users who sign up through you</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-primary">Real-Time Analytics</h3>
                      <p className="text-muted-foreground">Track your performance with detailed reporting</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
                  <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
                    <li>Sign up for the Recipee Affiliate Program (it's completely free!)</li>
                    <li>Get your unique referral link</li>
                    <li>Share with your audience</li>
                    <li>Earn commissions on successful referrals</li>
                    <li>Get paid weekly every Friday</li>
                  </ol>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button
                  type="button"
                   variant="link"
                  size="lg" className="w-full md:w-auto"
                   onClick={() => {                       
                        navigate('https://partners.squaredance.io/signup/referral/c_DKWdD8rf-0?s=a2')
                      }}
                  >
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
