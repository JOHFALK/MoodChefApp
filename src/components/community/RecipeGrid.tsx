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

interface RecipeWithProfile {
  id: string;
  title: string;
  description: string | null;
  cooking_time: number | null;
  emotions: string[];
  ingredients: string[];
  votes: number | null;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export function RecipeGrid() {
  const { data: recipes, isLoading } = useQuery({
    queryKey: ['community-recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .eq('status', 'approved')
        .not('user_id', 'is', null) // Changed this line to use proper null check syntax
        .order('votes', { ascending: false });
      
      if (error) throw error;
      return data as RecipeWithProfile[];
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
          recipe={{
            id: recipe.id,
            title: recipe.title,
            description: recipe.description || '',
            cookingTime: recipe.cooking_time || 0,
            servings: 2, // Default value since it's not in the database
            emotions: recipe.emotions,
            ingredients: recipe.ingredients,
            votes: recipe.votes || 0
          }} 
        />
      ))}
    </div>
  );
}