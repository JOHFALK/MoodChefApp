import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { processRecipes } from './recipeProcessor.ts'
import { fetchRecipesFromAPI } from './tastyAPI.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const TASTY_API_KEY = Deno.env.get('TASTY_API_KEY')
    if (!TASTY_API_KEY) {
      throw new Error('Missing TASTY_API_KEY')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch current recipe counts per emotion
    const { data: existingRecipes, error: countError } = await supabaseClient
      .from('recipes')
      .select('emotions')
      .eq('status', 'approved');

    if (countError) {
      throw countError;
    }

    // Count recipes per emotion
    const emotionCounts = new Map();
    existingRecipes?.forEach(recipe => {
      recipe.emotions.forEach((emotion: string) => {
        emotionCounts.set(emotion, (emotionCounts.get(emotion) || 0) + 1);
      });
    });

    console.log('Current emotion counts:', Object.fromEntries(emotionCounts));

    // Calculate how many more recipes we need per emotion
    const targetCount = 15;
    const neededRecipes = new Map();
    ['Happy', 'Sad', 'Energetic', 'Calm', 'Tired', 'Stressed'].forEach(emotion => {
      const current = emotionCounts.get(emotion) || 0;
      if (current < targetCount) {
        neededRecipes.set(emotion, targetCount - current);
      }
    });

    console.log('Needed recipes:', Object.fromEntries(neededRecipes));

    if (neededRecipes.size === 0) {
      return new Response(
        JSON.stringify({ message: 'All emotions have sufficient recipes' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch and process recipes
    const allRecipes = await fetchRecipesFromAPI(TASTY_API_KEY);
    console.log('Fetched recipes count:', allRecipes.length);
    
    const processedRecipes = await processRecipes(allRecipes, neededRecipes);

    // Insert recipes in batches
    const batchSize = 50;
    let successCount = 0;
    const errors = [];

    for (let i = 0; i < processedRecipes.length; i += batchSize) {
      const batch = processedRecipes.slice(i, i + batchSize);
      try {
        const { error } = await supabaseClient
          .from('recipes')
          .upsert(batch, { onConflict: 'title' });

        if (error) {
          errors.push({ batch: i / batchSize + 1, error: error.message });
          console.error('Batch insert error:', error);
        } else {
          successCount += batch.length;
        }
      } catch (error) {
        errors.push({ batch: i / batchSize + 1, error: error.message });
        console.error('Batch processing error:', error);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Recipes processed successfully',
        count: successCount,
        errors: errors.length > 0 ? errors : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})