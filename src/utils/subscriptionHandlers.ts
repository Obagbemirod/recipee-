import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

const handleDatabaseError = (error: any) => {
  if (error.code === '42P01') {
    toast({
      title: "Database Setup Required",
      description: "The subscription system is being configured. Please try again in a few minutes.",
      variant: "destructive",
    });
    return true;
  }
  return false;
};

export const handleTrialActivation = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_id: '24_hour_trial',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      });

    if (error) {
      if (handleDatabaseError(error)) return false;
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Trial activation error:', error);
    toast({
      title: "Error",
      description: "Failed to activate trial. Please try again later.",
      variant: "destructive",
    });
    return false;
  }
};

export const handlePaymentFlow = async (
  user: any,
  plan: any,
  onSuccess: (transactionId: string) => void,
  navigate: (path: string) => void
) => {
  try {
    const flutterwaveConfig = {
      public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: `${user.id}-${Date.now()}`,
      amount: Number(plan.price),
      currency: "USD",
      payment_options: "card,mobilemoney,ussd",
      customer: {
        email: user.email,
        phone_number: user.phone || "",
        name: user.user_metadata?.full_name || user.email,
      },
      customizations: {
        title: "Recipee Subscription",
        description: `${plan.name} Plan Subscription`,
        logo: "/lovable-uploads/05699ffd-835b-45ce-9597-5e523e4bdf98.png",
      },
      callback: async function(response: any) {
        if (response.status === "successful") {
          try {
            const { error } = await supabase
              .from('subscriptions')
              .upsert({
                user_id: user.id,
                plan_id: plan.planId,
                start_date: new Date().toISOString(),
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active',
                payment_reference: response.transaction_id
              });

            if (error) {
              if (handleDatabaseError(error)) return;
              throw error;
            }
            
            onSuccess(response.transaction_id);
          } catch (error) {
            console.error('Subscription activation error:', error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to activate subscription. Please contact support.",
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Payment Failed",
            description: "Please try again or contact support if the issue persists.",
          });
        }
      },
      onclose: function() {
        // Handle modal close
      },
    };

    // @ts-ignore
    window.FlutterwaveCheckout(flutterwaveConfig);
  } catch (error) {
    console.error('Payment initialization error:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Unable to initialize payment. Please try again.",
    });
  }
};