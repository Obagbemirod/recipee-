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
    };

    loadPreferences();
  }, []);

  const handlePreferenceChange = async (meal: keyof typeof preferences) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

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

    // Request notification permission if enabling any notification
    if (newPreferences[meal] && Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Please enable notifications in your browser settings");
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