import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RecipeCard } from "@/components/RecipeCard";
import { Skeleton } from "@/components/ui/skeleton";

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

export function RecipeGrid() {
  const { data: recipes, isLoading } = useQuery({
    queryKey: ['community-recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('status', 'approved')
        .order('votes', { ascending: false });
      
      if (error) {
        console.error('Error fetching recipes:', error);
        throw error;
      }

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
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes?.map((recipe) => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe}
        />
      ))}
    </div>
  );
}