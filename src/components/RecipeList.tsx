import { useEffect, useState } from "react";
import { RecipeCard } from "./RecipeCard";
import { MindfulPrompt } from "./MindfulPrompt";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  servings: number;
  emotions: string[];
  ingredients: string[];
  votes: number;
}

interface RecipeListProps {
  selectedEmotions: string[];
  ingredients: string[];
}

export function RecipeList({ selectedEmotions, ingredients }: RecipeListProps) {
  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes', selectedEmotions, ingredients],
    queryFn: async () => {
      let query = supabase
        .from('recipes')
        .select('*')
        .eq('status', 'approved');

      // Apply emotion filter if emotions are selected
      if (selectedEmotions.length > 0) {
        // Use overlaps for array comparison - matches if any emotion matches
        query = query.overlaps('emotions', selectedEmotions);
      }

      // Apply ingredient filter if ingredients are entered
      if (ingredients.length > 0) {
        // Use overlaps for array comparison - matches if any ingredient matches
        query = query.overlaps('ingredients', ingredients);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description || '',
        cookingTime: recipe.cooking_time || 0,
        servings: 2,
        emotions: recipe.emotions,
        ingredients: recipe.ingredients,
        votes: recipe.votes || 0
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

  return (
    <div className="space-y-8">
      <MindfulPrompt emotions={selectedEmotions} />
      
      {!recipes?.length ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No recipes found matching your mood and ingredients. Try adjusting your selections!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}