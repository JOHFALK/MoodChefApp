import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@13.3.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader); // Debug log

    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get the JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Get the user from the token using the admin client
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    console.log('User lookup result:', { user: !!user, error: userError }); // Debug log
    
    if (userError || !user) {
      console.error('User error:', userError);
      throw new Error('Failed to authenticate user');
    }

    if (!user.email) {
      throw new Error('User email not found');
    }

    console.log('Found user email:', user.email); // Debug log

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });

    // Find customer by email
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (!customers.data.length) {
      console.log('No Stripe customer found for email:', user.email); // Debug log
      return new Response(
        JSON.stringify({ isSubscribed: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: 'active',
      limit: 1,
    });

    console.log('Subscription check complete:', { 
      hasSubscription: subscriptions.data.length > 0 
    }); // Debug log

    return new Response(
      JSON.stringify({ 
        isSubscribed: subscriptions.data.length > 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in check-subscription:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});