import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Emotion mapping rules based on recipe attributes
const emotionMappingRules = {
  'Happy': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['dessert', 'chocolate', 'sweet', 'comfort_food'].includes(tag)),
  'Sad': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['comfort_food', 'soup', 'chocolate'].includes(tag)),
  'Energetic': (recipe: any) => 
    recipe.total_time_minutes < 30 && 
    recipe.tags?.some((tag: string) => 
      ['healthy', 'high_protein', 'breakfast'].includes(tag)),
  'Calm': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['tea_time', 'soup', 'vegetarian'].includes(tag)),
  'Tired': (recipe: any) => 
    recipe.total_time_minutes < 20 && 
    recipe.tags?.some((tag: string) => 
      ['easy', 'quick', 'under_30_minutes'].includes(tag)),
  'Anxious': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['comfort_food', 'baking', 'tea_time'].includes(tag)),
  'Excited': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['party', 'appetizers', 'finger_food'].includes(tag)),
  'Bored': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['challenging', 'baking', 'gourmet'].includes(tag)),
  'Motivated': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['healthy', 'meal_prep', 'high_protein'].includes(tag)),
  'Angry': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['spicy', 'quick', 'comfort_food'].includes(tag)),
  'Confident': (recipe: any) => 
    recipe.tags?.some((tag: string) => 
      ['gourmet', 'challenging', 'dinner_party'].includes(tag)),
  'Stressed': (recipe: any) => 
    recipe.total_time_minutes < 30 && 
    recipe.tags?.some((tag: string) => 
      ['easy', 'comfort_food', 'one_pot'].includes(tag)),
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

    // Fetch recipes from Tasty API
    console.log('Fetching recipes from Tasty API...')
    const response = await fetch(
      'https://tasty.p.rapidapi.com/recipes/list?from=0&size=100&tags=under_30_minutes',
      {
        headers: {
          'x-rapidapi-host': 'tasty.p.rapidapi.com',
          'x-rapidapi-key': TASTY_API_KEY,
        },
      }
    )

    if (!response.ok) {
      console.error('Tasty API error:', response.statusText)
      throw new Error(`Tasty API error: ${response.statusText}`)
    }

    const data = await response.json()
    const recipes = data.results

    // Process and tag recipes with emotions
    console.log('Processing recipes...')
    const processedRecipes = recipes.map((recipe: any) => {
      const emotions = Object.entries(emotionMappingRules)
        .filter(([_, rule]) => rule(recipe))
        .map(([emotion]) => emotion)

      // Ensure each recipe has at least one emotion
      if (emotions.length === 0) {
        emotions.push('Happy') // Default emotion
      }

      return {
        title: recipe.name,
        description: recipe.description || `A delicious ${recipe.name} recipe`,
        ingredients: recipe.sections?.[0]?.components?.map((c: any) => c.raw_text) || [],
        instructions: recipe.instructions?.map((i: any) => i.display_text) || [],
        cooking_time: recipe.total_time_minutes || 30,
        emotions: emotions,
        image_url: recipe.thumbnail_url,
        status: 'approved',
      }
    })

    console.log(`Inserting ${processedRecipes.length} recipes...`)
    
    // Insert recipes one by one to handle conflicts better
    let successCount = 0
    const errors = []

    for (const recipe of processedRecipes) {
      try {
        const { error } = await supabaseClient
          .from('recipes')
          .upsert(recipe, {
            onConflict: 'title',
          })

        if (error) {
          console.error('Error inserting recipe:', recipe.title, error)
          errors.push({ title: recipe.title, error: error.message })
        } else {
          successCount++
        }
      } catch (error) {
        console.error('Error processing recipe:', recipe.title, error)
        errors.push({ title: recipe.title, error: error.message })
      }
    }

    console.log(`Successfully imported ${successCount} recipes`)
    if (errors.length > 0) {
      console.log('Errors:', errors)
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
    console.error('Error in fetch-tasty-recipes:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})