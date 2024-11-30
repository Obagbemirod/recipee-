import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <img src="https://recipee.app/lovable-uploads/05699ffd-835b-45ce-9597-5e523e4bdf98.png" 
             alt="Recipee Logo" 
             style="width: 150px; margin: 20px 0;" />
        
        <h1 style="color: #1a1a1a;">Welcome to Recipee, ${name}! 🎉</h1>
        
        <p style="color: #4a4a4a; line-height: 1.6;">
          We're excited to have you join our community of food lovers! With Recipee, you'll discover:
        </p>
        
        <ul style="color: #4a4a4a; line-height: 1.6;">
          <li>Personalized meal plans based on your preferences</li>
          <li>Recipe suggestions using ingredients you already have</li>
          <li>Smart cooking guides and tips</li>
          <li>Meal time reminders to help you stay on track</li>
        </ul>
        
        <p style="color: #4a4a4a; line-height: 1.6;">
          Ready to start your culinary journey? Click the button below to create your first meal plan!
        </p>
        
        <a href="https://recipee.app/generate-meal-plan" 
           style="display: inline-block; background-color: #22c55e; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Create Your First Meal Plan
        </a>
        
        <p style="color: #4a4a4a; line-height: 1.6;">
          If you have any questions, our support team is here to help!
        </p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; 
                    color: #666; font-size: 12px;">
          <p>© 2024 Recipee. All rights reserved.</p>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Recipee <onboarding@recipee.app>",
        to: [email],
        subject: "Welcome to Recipee - Let's Start Cooking! 🍳",
        html: emailHtml,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);