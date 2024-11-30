import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const SENDPULSE_CLIENT_ID = Deno.env.get("SENDPULSE_CLIENT_ID");
const SENDPULSE_CLIENT_SECRET = Deno.env.get("SENDPULSE_CLIENT_SECRET");
const FROM_EMAIL = "notifications@recipee.app";
const BRAND_NAME = "Recipee";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  templateId: string;
  variables: Record<string, string>;
}

async function getAccessToken() {
  const response = await fetch('https://api.sendpulse.com/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: SENDPULSE_CLIENT_ID,
      client_secret: SENDPULSE_CLIENT_SECRET,
    }),
  });

  const data = await response.json();
  return data.access_token;
}

const emailTemplates = {
  welcome: {
    subject: "Welcome to Recipee! 🎉",
    html: (name: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1c0e0d;">
        <img src="https://recipee.app/lovable-uploads/8e0f2230-7cf1-4b6e-b87f-d9a1d4d323a8.png" alt="Recipee Logo" style="width: 150px; margin-bottom: 20px;">
        <h1 style="color: #f23426;">Welcome to Recipee!</h1>
        <p>Hi ${name},</p>
        <p>Welcome to Recipee! We're excited to have you join our community of food lovers and home chefs.</p>
        <p>Your 24-hour trial period has begun, giving you full access to all our premium features:</p>
        <ul style="list-style-type: none; padding-left: 0;">
          <li style="margin: 10px 0;">✨ AI-powered recipe generation</li>
          <li style="margin: 10px 0;">🍳 Unlimited meal planning</li>
          <li style="margin: 10px 0;">📱 Full marketplace access</li>
          <li style="margin: 10px 0;">💰 Recipe monetization</li>
        </ul>
        <a href="https://recipee.app/home" style="display: inline-block; background-color: #f23426; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">Start Exploring</a>
      </div>
    `
  },
  trialExpired: {
    subject: "Don't Miss Out! Your Recipee Trial Has Ended 🔔",
    html: (name: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1c0e0d;">
        <img src="https://recipee.app/lovable-uploads/8e0f2230-7cf1-4b6e-b87f-d9a1d4d323a8.png" alt="Recipee Logo" style="width: 150px; margin-bottom: 20px;">
        <h1 style="color: #f23426;">Your Trial Has Ended</h1>
        <p>Hi ${name},</p>
        <p>Your 24-hour trial of Recipee has come to an end. We hope you enjoyed experiencing our premium features!</p>
        <p>To continue enjoying unlimited access to all features, choose one of our premium plans:</p>
        <div style="background: #fcf8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #f23426; margin-top: 0;">Premium Plan Benefits:</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin: 10px 0;">✨ Unlimited meal planning</li>
            <li style="margin: 10px 0;">🤖 Advanced AI recipe generation</li>
            <li style="margin: 10px 0;">💰 Recipe monetization</li>
            <li style="margin: 10px 0;">📱 Full marketplace access</li>
          </ul>
        </div>
        <a href="https://recipee.app/pricing" style="display: inline-block; background-color: #f23426; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Upgrade Now</a>
      </div>
    `
  },
  trialExpiredReminder: {
    subject: "Last Chance! Don't Miss Out on Recipee Premium 🌟",
    html: (name: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1c0e0d;">
        <img src="https://recipee.app/lovable-uploads/8e0f2230-7cf1-4b6e-b87f-d9a1d4d323a8.png" alt="Recipee Logo" style="width: 150px; margin-bottom: 20px;">
        <h1 style="color: #f23426;">Final Reminder!</h1>
        <p>Hi ${name},</p>
        <p>We noticed you haven't upgraded your Recipee account yet. Don't miss out on our amazing premium features!</p>
        <p>Upgrade now to continue:</p>
        <ul style="list-style-type: none; padding-left: 0;">
          <li style="margin: 10px 0;">✨ Creating unlimited meal plans</li>
          <li style="margin: 10px 0;">🤖 Using advanced AI recipe generation</li>
          <li style="margin: 10px 0;">💰 Monetizing your recipes</li>
          <li style="margin: 10px 0;">📱 Accessing the full marketplace</li>
        </ul>
        <div style="background: #fcf8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold;">Special Offer: Get 20% off your first month with code WELCOME20</p>
        </div>
        <a href="https://recipee.app/pricing" style="display: inline-block; background-color: #f23426; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Upgrade Now</a>
      </div>
    `
  },
  resetPassword: {
    subject: "Reset Your Recipee Password",
    html: (name: string, resetLink: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1c0e0d;">
        <img src="https://recipee.app/lovable-uploads/8e0f2230-7cf1-4b6e-b87f-d9a1d4d323a8.png" alt="Recipee Logo" style="width: 150px; margin-bottom: 20px;">
        <h1 style="color: #f23426;">Reset Your Password</h1>
        <p>Hi ${name},</p>
        <p>We received a request to reset your Recipee password. Click the button below to create a new password:</p>
        <a href="${resetLink}" style="display: inline-block; background-color: #f23426; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
        <p style="color: #666; font-size: 14px;">If you didn't request this change, you can safely ignore this email.</p>
      </div>
    `
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, templateId, variables } = await req.json() as EmailRequest;
    const template = emailTemplates[templateId as keyof typeof emailTemplates];
    
    if (!template) {
      throw new Error('Invalid template ID');
    }

    const accessToken = await getAccessToken();
    const html = template.html(variables.name, variables.resetLink);
    
    const response = await fetch('https://api.sendpulse.com/smtp/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: {
          html,
          text_content: "Please view this email in an HTML-capable client",
          subject: template.subject,
          from: {
            name: BRAND_NAME,
            email: FROM_EMAIL,
          },
          to: [
            {
              email: to,
            },
          ],
        },
      }),
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

serve(handler);