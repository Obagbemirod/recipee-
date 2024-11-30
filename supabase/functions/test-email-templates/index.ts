import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (_req: Request): Promise<Response> => {
  const testUser = {
    name: "TEMITOPE",
    email: "OBAGBEMIROD@GMAIL.COM"
  };

  const templates = ['welcome', 'trialExpired', 'trialExpiredReminder', 'resetPassword'];
  const results = [];

  for (const templateId of templates) {
    try {
      const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: testUser.email,
          templateId,
          variables: {
            name: testUser.name,
            resetLink: templateId === 'resetPassword' ? 'https://recipee.app/reset-password?token=test-token' : undefined
          }
        }),
      });

      const result = await response.json();
      results.push({ templateId, success: true, result });
    } catch (error) {
      console.error(`Error sending ${templateId} template:`, error);
      results.push({ templateId, success: false, error: error.message });
    }
  }

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
};

serve(handler);