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

        const { data: subscriptions, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .gt('end_date', new Date().toISOString())
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching subscription:', error);
          setPlan(null);
          setIsLoading(false);
          return;
        }

        if (subscriptions && subscriptions.length > 0) {
          setPlan(subscriptions[0].plan_id as SubscriptionPlan);
          setIsTrialExpired(
            subscriptions[0].plan_id === '24_hour_trial' && 
            new Date(subscriptions[0].end_date) <= new Date()
          );
        } else {
          setPlan(null);
          // Check if trial has expired
          const { data: trialSubs } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('plan_id', '24_hour_trial');

          setIsTrialExpired(trialSubs && trialSubs.length > 0);
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