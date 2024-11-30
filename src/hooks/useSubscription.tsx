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

        // Get active subscriptions
        const { data: activeSubscriptions, error: activeError } = await supabase
          .from('subscriptions')
          .select()
          .eq('user_id', user.id)
          .eq('status', 'active')
          .gt('end_date', new Date().toISOString());

        if (activeError) {
          console.error('Error fetching active subscriptions:', activeError);
          setPlan(null);
          setIsLoading(false);
          return;
        }

        if (activeSubscriptions && activeSubscriptions.length > 0) {
          const currentSubscription = activeSubscriptions[0];
          setPlan(currentSubscription.plan_id as SubscriptionPlan);
          setIsTrialExpired(
            currentSubscription.plan_id === '24_hour_trial' && 
            new Date(currentSubscription.end_date) <= new Date()
          );
        } else {
          setPlan(null);
          // Check if trial has expired
          const { data: trialSubscriptions, error: trialError } = await supabase
            .from('subscriptions')
            .select()
            .eq('user_id', user.id)
            .eq('plan_id', '24_hour_trial');

          if (!trialError && trialSubscriptions) {
            setIsTrialExpired(trialSubscriptions.length > 0);
          }
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