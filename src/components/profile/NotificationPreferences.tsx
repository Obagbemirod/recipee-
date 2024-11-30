import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    breakfast: false,
    lunch: false,
    dinner: false
  });
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('notification_preferences')
        .eq('id', user.id)
        .single();

      if (profile?.notification_preferences) {
        setPreferences(profile.notification_preferences);
      }

      // Check if push notifications are already enabled
      if ('Notification' in window) {
        setPushEnabled(Notification.permission === 'granted');
      }
    };

    loadPreferences();
  }, []);

  const handlePreferenceChange = async (meal: keyof typeof preferences) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Request notification permission if not already granted
    if (!pushEnabled && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushEnabled(true);
      } else {
        toast.error("Please enable notifications in your browser settings to receive meal reminders");
        return;
      }
    }

    const newPreferences = {
      ...preferences,
      [meal]: !preferences[meal]
    };

    const { error } = await supabase
      .from('profiles')
      .update({
        notification_preferences: newPreferences
      })
      .eq('id', user.id);

    if (error) {
      toast.error("Failed to update notification preferences");
      return;
    }

    setPreferences(newPreferences);
    toast.success("Notification preferences updated");

    // Register service worker for push notifications
    if (newPreferences[meal] && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
        });

        // Send subscription to backend
        const { error: subscriptionError } = await supabase.functions.invoke('register-push-subscription', {
          body: { subscription, userId: user.id }
        });

        if (subscriptionError) {
          throw subscriptionError;
        }
      } catch (error) {
        console.error('Error registering push notification:', error);
        toast.error("Failed to enable push notifications");
      }
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Meal Notifications</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="breakfast">Breakfast Notifications</Label>
          <Switch
            id="breakfast"
            checked={preferences.breakfast}
            onCheckedChange={() => handlePreferenceChange('breakfast')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="lunch">Lunch Notifications</Label>
          <Switch
            id="lunch"
            checked={preferences.lunch}
            onCheckedChange={() => handlePreferenceChange('lunch')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="dinner">Dinner Notifications</Label>
          <Switch
            id="dinner"
            checked={preferences.dinner}
            onCheckedChange={() => handlePreferenceChange('dinner')}
          />
        </div>
      </div>
    </Card>
  );
};