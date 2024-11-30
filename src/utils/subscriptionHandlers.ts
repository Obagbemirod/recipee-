import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const handleTrialActivation = async (userId: string) => {
  try {
    // Check if user already has an active trial
    const { data: existingTrials, error: checkError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('plan_id', '24_hour_trial');

    if (checkError) {
      console.error('Error checking existing trial:', checkError);
      return false;
    }

    // Check if there are any trial subscriptions
    if (existingTrials && existingTrials.length > 0) {
      toast.error("You have already used your trial period");
      return false;
    }

    const { error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: '24_hour_trial',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      });

    if (insertError) {
      console.error('Error inserting trial subscription:', insertError);
      toast.error("Failed to activate trial. Please try again.");
      return false;
    }

    return true;
  } catch (error) {
    console.error('Trial activation error:', error);
    toast.error("Failed to activate trial. Please try again.");
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
              .insert({
                user_id: user.id,
                plan_id: plan.planId,
                start_date: new Date().toISOString(),
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active',
                payment_reference: response.transaction_id
              });

            if (error) {
              console.error('Database error:', error);
              toast.error("Failed to activate subscription. Please contact support.");
              return;
            }
            
            onSuccess(response.transaction_id);
          } catch (error) {
            console.error('Subscription activation error:', error);
            toast.error("Failed to activate subscription. Please contact support.");
          }
        } else {
          toast.error("Payment failed. Please try again or contact support.");
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
    toast.error("Unable to initialize payment. Please try again.");
  }
};