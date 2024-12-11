import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AffiliateProgram = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden fixed-mobile">
      <Header />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter">Cook Up Recurring Revenue with Recipee: The AI Cooking App! Perfect for Long-Term Earnings</h1>
              <p className="text-lg text-muted-foreground">
               Partner with Recipee and earn generous commissions while helping your audience discover the joy of effortless meal planning and cooking. This is a long-term income opportunity, not just a quick payday!
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
                      <h3 className="font-medium text-primary">Free Recipee Subscription</h3>
                      <p className="text-muted-foreground">Experience the magic of Recipee Premium for yourself!</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-primary">25% Recurring Commissions</h3>
                      <p className="text-muted-foreground">Earn 25% on every new subscriber you bring to Recipee for a full 12 months! That's continuous income as long as your referrals stay subscribed.</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-primary">Free Trial Offer for Your Audience</h3>
                      <p className="text-muted-foreground">24-hour FREE trial of Recipee Premium to experience all the amazing features!</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-primary">Exclusive Discount for Your Followers</h3>
                      <p className="text-muted-foreground">Offer your audience a special discount on Recipee to boost conversions.</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-primary">High Conversion Rates</h3>
                      <p className="text-muted-foreground">Recipee's innovative features and user-friendly interface make it a hit with consumers, resulting in higher conversion rates for you.</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-primary">Real-Time Tracking</h3>
                      <p className="text-muted-foreground">Monitor your sales and commissions 24/7 with your unique affiliate link and dashboard.</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-primary">Weekly Payouts</h3>
                      <p className="text-muted-foreground">Get paid every Friday, no delays.</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-primary">Easy Withdrawal</h3>
                      <p className="text-muted-foreground">Withdraw your earnings at any time.</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-primary">Marketing Materials</h3>
                      <p className="text-muted-foreground">Access a library of high-quality images and pre-written captions to simplify your promotions.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
{/* expectation of our brand */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Expectation of Our Brand for Delivery in Terms of Content/Posts</h2>
                 <p>
                 We're looking for enthusiastic influencers to showcase Recipee's unique features to your audience. Create engaging content highlighting how Recipee simplifies meal planning, provides personalized recipes and meal plans, and offers comprehensive cooking guidance.
                 </p>
                  <p>
                    Influencers will be expected to create engaging content that showcases how they use Recipee in their daily lives—whether it’s discovering new recipes or preparing healthy meals using our platform. Posts can include vibrant videos and/or photos featuring delicious dishes created through Recipee along with compelling captions describing personal experiences while utilizing the app's features. We encourage storytelling around meal prep tips related specifically to family-friendly meals or nutritious snacks!
                  </p>
                </CardContent>
              </Card>
{/*               end of expectation */}

{/*               our mission */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">OUR MISSION</h2>
                 <p>
                   Recipee's mission is to empower people to embrace cooking with confidence and joy. We believe that everyone, regardless of their culinary skills, deserves to create delicious and healthy meals with ease.
                  </p>                 
                </CardContent>
              </Card>
{/*               end of our mission */}
{/*               why recipee */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">WHY RECIPEE?</h2>
                  <p>Traditional meal planning and cooking can be time-consuming, stressful, and uninspiring. Recipee offers a smarter approach:</p>
                  <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
                    <li>Effortless Meal Planning: Say goodbye to mealtime stress! Snap a photo of your fridge or pantry, and Recipee generates personalized meal plans based on your ingredients dietary needs, and preferences.</li>
                    <li>AI Cooking Assistant: Cook like a pro with step-by-step guidance.</li>
                    <li>Endless Culinary Inspiration: Discover new recipes, recreate restaurant-worthy dishes, and expand your culinary horizons.</li>                  
                  </ol>
                </CardContent>
              </Card>
{/*               end of why recipee */}
{/*               our story */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">OUR STORY</h2>
                 <p>Born from a passion for food and technology, Recipee leverages the power of AI to simplify meal planning, provide interactive cooking guidance, and foster a vibrant community of food lovers. We're committed to making cooking more accessible, enjoyable, and stress-free for everyone.</p>
                 <p>Join the Recipee Affiliate Program today and start earning recurring commissions while promoting an app that's changing the way people cook!</p>
                </CardContent>
              </Card>
{/*               end of our story */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
                  <p>To join the Recipee Partner Program, we've partnered with Squaredance, a leading platform for influencer marketing. Here's how it works:</p>
                  <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
                    <li>Signing Up: To make joining our affiliate program seamless, we have chosen the *Zoho Thrive* as our Affiliate Management Platform. Click the link below to create your free account.</li>
                    <li>Apply to the Recipee Partner Program: Once you've signed up and your application is approved, you will be able to easily access your dashboard</li>
                    <li>Get Your Unique Link: After your application is approved, you'll receive your unique affiliate link. You can also create more custom links as needed</li>
                    <li>Start Sharing & Earning: Promote Recipee through your affiliate link(s) to your audience and watch your commissions grow</li>                 
                  </ol>
                  <p>Click Below To Get Started!</p>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button
                  type="button"
                  size="lg"
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-lg py-6 px-12 rounded-lg shadow-lg hover:shadow-xl transition-all"
                  onClick={() => window.open('https://recipee.zohothrive.com/thrive/publicpages/affiliate-registration/recipee/769d4dfe24098f90bbae8054c396a57d1b19a1b9882d2d8616aca5665bf5bee3', '_blank')}
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
