import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Enhanced emotion mapping rules based on recipe attributes
const emotionMappingRules = {
  'Happy': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['dessert', 'chocolate', 'sweet', 'comfort_food', 'party', 'celebration'].includes(tag)) ||
    recipe.description?.toLowerCase().includes('happy') ||
    recipe.name?.toLowerCase().includes('celebration'),
    
  'Sad': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['comfort_food', 'soup', 'chocolate', 'warm', 'cozy'].includes(tag)) ||
    recipe.cook_time_minutes < 30,
    
  'Energetic': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['healthy', 'high_protein', 'breakfast', 'power_bowl', 'smoothie'].includes(tag)) ||
    recipe.nutrition?.protein > 15,
    
  'Calm': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['tea_time', 'soup', 'vegetarian', 'meditation', 'mindful_eating'].includes(tag)) ||
    recipe.cook_time_minutes > 45,
    
  'Tired': (recipe: any) => 
    recipe.total_time_minutes < 20 ||
    recipe.tags?.some((tag: string) => 
      ['easy', 'quick', 'under_30_minutes', 'simple', '5_ingredients_or_less'].includes(tag)),
    
  'Anxious': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['comfort_food', 'baking', 'tea_time', 'stress_relief'].includes(tag)) ||
    recipe.instructions?.some((step: any) => 
      step.display_text?.toLowerCase().includes('knead') || 
      step.display_text?.toLowerCase().includes('mindful')),
    
  'Excited': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['party', 'appetizers', 'finger_food', 'celebration', 'festive'].includes(tag)) ||
    recipe.name?.toLowerCase().includes('party'),
    
  'Bored': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['challenging', 'baking', 'gourmet', 'advanced', 'project'].includes(tag)) ||
    recipe.total_time_minutes > 60,
    
  'Motivated': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['healthy', 'meal_prep', 'high_protein', 'fitness', 'nutrition'].includes(tag)) ||
    (recipe.nutrition?.protein > 20 && recipe.nutrition?.calories < 500),
    
  'Angry': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['spicy', 'quick', 'comfort_food', 'stress_relief'].includes(tag)) ||
    recipe.description?.toLowerCase().includes('spicy'),
    
  'Confident': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['gourmet', 'challenging', 'dinner_party', 'impressive'].includes(tag)) ||
    recipe.difficulty_level === 'advanced',
    
  'Stressed': (recipe: any) => 
    recipe.total_time_minutes < 30 &&
    recipe.tags?.some((tag: string) => 
      ['easy', 'comfort_food', 'one_pot', 'simple', 'minimal_cleanup'].includes(tag))
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

    // Fetch recipes from multiple Tasty API endpoints to get more variety
    const endpoints = [
      'tags=under_30_minutes',
      'tags=dinner',
      'tags=healthy',
      'tags=comfort_food',
      'tags=desserts',
      'tags=vegetarian'
    ];

    let allRecipes = [];
    console.log('Fetching recipes from multiple endpoints...');

    for (const endpoint of endpoints) {
      const response = await fetch(
        `https://tasty.p.rapidapi.com/recipes/list?from=0&size=40&${endpoint}`,
        {
          headers: {
            'x-rapidapi-host': 'tasty.p.rapidapi.com',
            'x-rapidapi-key': TASTY_API_KEY,
          },
        }
      );

      if (!response.ok) {
        console.error(`Tasty API error for ${endpoint}:`, response.statusText);
        continue;
      }

      const data = await response.json();
      allRecipes = [...allRecipes, ...data.results];
    }

    // Remove duplicates based on recipe name
    allRecipes = Array.from(new Map(allRecipes.map(recipe => [recipe.name, recipe])).values());

    // Process and tag recipes with emotions
    console.log(`Processing ${allRecipes.length} recipes...`);
    const processedRecipes = allRecipes.map((recipe: any) => {
      const emotions = Object.entries(emotionMappingRules)
        .filter(([_, rule]) => rule(recipe))
        .map(([emotion]) => emotion);

      // Ensure each recipe has at least one emotion
      if (emotions.length === 0) {
        // Assign random emotions if none matched
        const allEmotions = Object.keys(emotionMappingRules);
        emotions.push(allEmotions[Math.floor(Math.random() * allEmotions.length)]);
      }

      return {
        title: recipe.name,
        description: recipe.description || `A delicious ${recipe.name} recipe`,
        ingredients: recipe.sections?.[0]?.components?.map((c: any) => c.raw_text) || [],
        instructions: recipe.instructions?.map((i: any) => i.display_text) || [],
        cooking_time: recipe.total_time_minutes || 30,
        emotions: emotions,
        image_url: recipe.thumbnail_url,
        status: 'approved', // Set status to approved by default
      }
    });

    console.log(`Inserting ${processedRecipes.length} recipes...`);
    
    // Insert recipes in batches to handle large numbers more efficiently
    const batchSize = 50;
    let successCount = 0;
    const errors = [];

    for (let i = 0; i < processedRecipes.length; i += batchSize) {
      const batch = processedRecipes.slice(i, i + batchSize);
      try {
        const { error } = await supabaseClient
          .from('recipes')
          .upsert(batch, {
            onConflict: 'title',
          });

        if (error) {
          console.error('Error inserting batch:', error);
          errors.push({ batch: i / batchSize + 1, error: error.message });
        } else {
          successCount += batch.length;
        }
      } catch (error) {
        console.error('Error processing batch:', error);
        errors.push({ batch: i / batchSize + 1, error: error.message });
      }
    }

    console.log(`Successfully imported ${successCount} recipes`);
    if (errors.length > 0) {
      console.log('Errors:', errors);
    }

    return new Response(
      JSON.stringify({ 
        message: 'Recipes fetched and processed successfully',
        count: successCount,
        errors: errors.length > 0 ? errors : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in fetch-tasty-recipes:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})