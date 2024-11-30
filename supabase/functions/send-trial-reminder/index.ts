import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (_req: Request): Promise<Response> => {
  try {
    // Get users whose trial expired 24 hours ago and haven't upgraded
    const { data: expiredTrials, error: queryError } = await supabase
      .from('subscriptions')
      .select(`
        user_id,
        auth.users!inner (
          email,
          raw_user_meta_data->>'full_name' as full_name
        )
      `)
      .eq('plan_id', '24_hour_trial')
      .lte('end_date', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .gte('end_date', new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString())
      .not('user_id', 'in', (
        supabase
          .from('subscriptions')
          .select('user_id')
          .neq('plan_id', '24_hour_trial')
      ));

    if (queryError) throw queryError;

    // Send reminder emails
    for (const trial of expiredTrials) {
      // Create notification record
      const { error: notificationError } = await supabase
        .from('email_notifications')
        .insert({
          user_id: trial.user_id,
          notification_type: 'trial_expired_reminder',
          status: 'pending'
        });

      if (notificationError) throw notificationError;

      // Send email via SendPulse
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: trial.users.email,
          templateId: 'trialExpiredReminder',
          variables: {
            name: trial.users.full_name || 'there'
          }
        }),
      });

      if (!emailResponse.ok) {
        throw new Error(`Failed to send email: ${await emailResponse.text()}`);
      }

      // Update notification status
      const { error: updateError } = await supabase
        .from('email_notifications')
        .update({ status: 'sent' })
        .eq('user_id', trial.user_id)
        .eq('notification_type', 'trial_expired_reminder');

      if (updateError) throw updateError;
    }

    return new Response(JSON.stringify({ 
      success: true,
      processed: expiredTrials.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing trial expiration reminders:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

serve(handler);