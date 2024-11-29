import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SubscriptionPlan } from '@/utils/subscriptionUtils';

export const useSubscription = () => {
  const [plan, setPlan] = useState<SubscriptionPlan>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setPlan(null);
          setIsLoading(false);
          return;
        }

        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .gt('end_date', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        setPlan(subscription ? subscription.plan_id as SubscriptionPlan : null);
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

  return { plan, isLoading };
};