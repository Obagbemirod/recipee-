import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { PaystackConfig } from "@/types/paystack";

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
    // Ensure PaystackPop is available
    if (typeof window.PaystackPop === 'undefined') {
      console.error('Paystack not loaded');
      toast.error("Payment system not available. Please refresh the page and try again.");
      return;
    }

    const config: PaystackConfig = {
      publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: Math.round(Number(plan.price) * 100), // Convert to kobo and ensure it's a whole number
      ref: `${user.id}-${Date.now()}`,
      onSuccess: function(response) {
        handleSubscriptionActivation(user, plan, response.reference, onSuccess, navigate);
      },
      onClose: function() {
        toast.error("Payment cancelled. Please try again when ready.");
      },
      metadata: {
        custom_fields: [
          {
            display_name: "Plan Name",
            variable_name: "plan_name",
            value: plan.name
          }
        ]
      }
    };

    const handler = window.PaystackPop.setup(config);
    handler.openIframe();
  } catch (error) {
    console.error('Payment initialization error:', error);
    toast.error("Unable to initialize payment. Please try again.");
  }
};

const handleSubscriptionActivation = async (
  user: any,
  plan: any,
  reference: string,
  onSuccess: (transactionId: string) => void,
  navigate: (path: string) => void
) => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan_id: plan.planId,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        payment_reference: reference
      });

    if (error) throw error;
    
    onSuccess(reference);
    navigate("/onboarding");
  } catch (error: any) {
    console.error('Subscription activation error:', error);
    toast.error("Failed to activate subscription. Please contact support.");
  }
};