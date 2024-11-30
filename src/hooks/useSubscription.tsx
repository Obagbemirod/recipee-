import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SubscriptionPlan } from '@/utils/subscriptionUtils';

export const useSubscription = () => {
  const [plan, setPlan] = useState<SubscriptionPlan>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrialExpired, setIsTrialExpired] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setPlan(null);
          setIsLoading(false);
          return;
        }

        // First check for any active subscription
        const { data: subscriptions, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .gt('end_date', new Date().toISOString())
          .order('created_at', { ascending: false });

        if (subscriptionError) {
          console.error('Error fetching subscription:', subscriptionError);
          setPlan(null);
          setIsLoading(false);
          return;
        }

        const activeSubscription = subscriptions?.[0];

        if (activeSubscription) {
          setPlan(activeSubscription.plan_id as SubscriptionPlan);
          setIsTrialExpired(
            activeSubscription.plan_id === '24_hour_trial' && 
            new Date(activeSubscription.end_date) <= new Date()
          );
        } else {
          setPlan(null);
          
          // Check if trial has expired by looking for any trial subscription
          const { data: trialSubscriptions } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('plan_id', '24_hour_trial');

          setIsTrialExpired(trialSubscriptions && trialSubscriptions.length > 0);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setPlan(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
    
    const channel = supabase
      .channel('subscription_updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'subscriptions' 
      }, () => {
        checkSubscription();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { plan, isLoading, isTrialExpired };
};