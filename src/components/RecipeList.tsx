import { useState } from "react";
import { RecipeCard } from "./RecipeCard";
import { MindfulPrompt } from "./MindfulPrompt";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/use-subscription";
import { Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  servings: number;
  emotions: string[];
  ingredients: string[];
  votes: number;
  is_premium: boolean;
}

interface RecipeListProps {
  selectedEmotions: string[];
  ingredients: string[];
}

export function RecipeList({ selectedEmotions, ingredients }: RecipeListProps) {
  const { data: subscription } = useSubscription();
  const isPremium = subscription?.isSubscribed ?? false;

  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes', selectedEmotions, ingredients],
    queryFn: async () => {
      console.log('Starting query with emotions:', selectedEmotions);
      
      let query = supabase
        .from('recipes')
        .select('*')
        .eq('status', 'approved');

      // Apply emotion filter if emotions are selected
      if (selectedEmotions.length > 0) {
        // Keep original case for emotion matching
        const emotion = selectedEmotions[0];
        console.log('Filtering by emotion:', emotion);
        query = query.contains('emotions', [emotion]);
      }

      // Apply ingredient filter if ingredients are entered
      if (ingredients.length > 0) {
        ingredients.forEach(ingredient => {
          query = query.contains('ingredients', [ingredient.toLowerCase()]);
        });
      }

      const { data, error } = await query;
      
      console.log('Query results:', data);
      console.log('Query error:', error);

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      return (data || []).map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description || '',
        cookingTime: recipe.cooking_time || 0,
        servings: 2,
        emotions: recipe.emotions || [],
        ingredients: recipe.ingredients || [],
        votes: recipe.votes || 0,
        is_premium: recipe.is_premium || false
      }));
    },
    staleTime: 1000 * 60, // Cache for 1 minute
  });

  if (selectedEmotions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Select your current mood to discover perfectly matched recipes.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  const filteredRecipes = recipes?.filter(recipe => 
    !recipe.is_premium || (recipe.is_premium && isPremium)
  );

  return (
    <div className="space-y-8">
      <MindfulPrompt emotions={selectedEmotions} />
      
      {error ? (
        <div className="text-center py-8">
          <p className="text-red-500">
            Error loading recipes: {error.message}
          </p>
        </div>
      ) : !filteredRecipes?.length ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No recipes found matching your mood and ingredients. Try adjusting your selections!
          </p>
        </div>
      ) : (
        <>
          {!isPremium && recipes?.some(r => r.is_premium) && (
            <Alert>
              <AlertDescription className="flex items-center justify-between">
                <span>Some recipes are only available to premium users.</span>
                <Button asChild variant="outline" size="sm">
                  <Link to="/pricing" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Upgrade to Premium
                  </Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes?.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
