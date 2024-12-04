import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from '@/lib/supabase';
import { SubscriptionPlan } from '@/utils/subscriptionUtils';
import { addDays, isAfter } from 'date-fns';

const AuthContext = createContext(null)

export const useAuth = () => {
    return useContext(AuthContext)
}

const AuthProvider = ({ children }) => {

    const [plan, setPlan] = useState<SubscriptionPlan>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTrialExpired, setIsTrialExpired] = useState(false);
    const [lastMealPlanGenerated, setLastMealPlanGenerated] = useState<Date | null>(null);

    // check subscription
    const checkSubscription = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setPlan(null);
                setIsLoading(false);
                return;
            }

            const { data: subscription, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'active')
                .gt('end_date', new Date().toISOString())
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) throw error;

            const { data: profile } = await supabase
                .from('profiles')
                .select('last_meal_plan_generated')
                .eq('id', user.id)
                .maybeSingle();

            if (profile?.last_meal_plan_generated) {
                setLastMealPlanGenerated(new Date(profile.last_meal_plan_generated));
            }

            if (subscription) {
                setPlan(subscription.plan_id as SubscriptionPlan);
                setIsTrialExpired(
                    subscription.plan_id === '24_hour_trial' &&
                    new Date(subscription.end_date) <= new Date()
                );
            } else {
                setPlan(null);
                const { data: trialSub } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('plan_id', '24_hour_trial')
                    .maybeSingle();

                setIsTrialExpired(!!trialSub);
            }
        } catch (error) {
            console.error('Error checking subscription:', error);
            setPlan(null);
        } finally {
            setIsLoading(false);
        }
    };

    // generate meal plan 
    const canGenerateMealPlan = () => {
        if (plan === 'premium') return true;
        if (!lastMealPlanGenerated) return true;

        const nextAllowedDate = addDays(lastMealPlanGenerated, 7);
        return isAfter(new Date(), nextAllowedDate);
    };

    useEffect(() => {
        // subscribe to supabase 
        const channel = supabase
            .channel('subscription_updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'subscriptions'
            }, () => {
                console.log("check")
            })

        console.log(channel)
        checkSubscription()

        return () => {
            channel.unsubscribe();
        };
    }, [])


    let values = {
        plan,
        isLoading,
        isTrialExpired,
        canGenerateMealPlan,
        lastMealPlanGenerated,
        checkSubscription
    }

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;