import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RecipeCard } from "@/components/RecipeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  return (
    <div className="text-center py-8">
      <Alert>
        <AlertDescription>
          Please use the search function to discover recipes that match your mood and ingredients.
        </AlertDescription>
      </Alert>
    </div>
  );
}