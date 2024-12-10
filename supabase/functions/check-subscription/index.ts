import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@13.3.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get the JWT token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get user from the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    console.log('User lookup result:', { 
      userFound: !!user, 
      error: userError?.message 
    });

    if (userError || !user) {
      throw new Error('Failed to authenticate user');
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });

    console.log('Checking subscription for user:', user.email);

    // Get Stripe customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (!customers.data.length) {
      console.log('No Stripe customer found for:', user.email);
      return new Response(
        JSON.stringify({ isSubscribed: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: 'active',
      limit: 1,
    });

    console.log('Subscription check complete:', {
      hasSubscription: subscriptions.data.length > 0,
      customerId: customers.data[0].id
    });

    return new Response(
      JSON.stringify({ isSubscribed: subscriptions.data.length > 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in check-subscription:', error);
    
    // Return a proper error response with CORS headers
    return new Response(
      JSON.stringify({ 
        error: error.message,
        isSubscribed: false // Always include the expected response shape
      }),
      { 
        status: error.message.includes('authenticate') ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});