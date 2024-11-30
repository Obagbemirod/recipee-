import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

declare const PaystackPop: {
  setup: (config: {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref: string;
    metadata: any;
    callback: (response: any) => void;
    onClose: () => void;
  }) => {
    openIframe: () => void;
  };
};

export const handleTrialActivation = async (userId: string) => {
  try {
    const { data: existingTrials, error: checkError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('plan_id', '24_hour_trial');

    if (checkError) throw checkError;

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

    if (insertError) throw insertError;

    return true;
  } catch (error) {
    console.error('Trial activation error:', error);
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
    const handler = PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: plan.price * 100, // Paystack expects amount in kobo/cents
      currency: 'NGN',
      ref: `${user.id}-${Date.now()}`,
      metadata: {
        user_id: user.id,
        plan_id: plan.planId,
        custom_fields: [
          {
            display_name: "Plan Name",
            variable_name: "plan_name",
            value: plan.name
          }
        ]
      },
      callback: async function(response: any) {
        if (response.status === 'success') {
          try {
            const { error } = await supabase
              .from('subscriptions')
              .insert({
                user_id: user.id,
                plan_id: plan.planId,
                start_date: new Date().toISOString(),
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active',
                payment_reference: response.reference
              });

            if (error) throw error;
            
            onSuccess(response.reference);
          } catch (error: any) {
            console.error('Subscription activation error:', error);
            toast.error("Failed to activate subscription. Please contact support.");
          }
        } else {
          toast.error("Payment failed. Please try again or contact support.");
        }
      },
      onClose: function() {
        // Handle modal close
        console.log('Payment modal closed');
      }
    });
    
    handler.openIframe();
  } catch (error) {
    console.error('Payment initialization error:', error);
    toast.error("Unable to initialize payment. Please try again.");
  }
};

export const checkTrialStatus = async (userId: string) => {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('plan_id', '24_hour_trial')
      .eq('status', 'active')
      .single();

    if (error) throw error;

    if (subscription) {
      const endDate = new Date(subscription.end_date);
      const now = new Date();
      return endDate > now;
    }

    return false;
  } catch (error) {
    console.error('Error checking trial status:', error);
    return false;
  }
};