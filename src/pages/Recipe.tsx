import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { RecipeInteractionForm } from "@/components/RecipeInteractionForm";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Recipe() {
  const { recipeId } = useParams();

  const { data: recipe, isLoading } = useQuery({
    queryKey: ['recipe', recipeId],
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
        .eq('id', recipeId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Recipe not found</h1>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">{recipe.title}</h1>
          <p className="text-lg text-gray-600">{recipe.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {recipe.emotions.map((emotion: string) => (
              <Badge key={emotion} variant="secondary">
                {emotion}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{recipe.cooking_time} mins</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>2 servings</span>
            </div>
          </div>
        </div>

        {recipe.image_url && (
          <img 
            src={recipe.image_url} 
            alt={recipe.title}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        )}

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="list-disc list-inside space-y-2">
              {recipe.ingredients.map((ingredient: string, index: number) => (
                <li key={index} className="text-gray-700">{ingredient}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
            <ol className="list-decimal list-inside space-y-4">
              {recipe.instructions.map((step: string, index: number) => (
                <li key={index} className="text-gray-700">{step}</li>
              ))}
            </ol>
          </section>
        </div>

        <RecipeInteractionForm 
          recipeId={recipe.id}
          onSuccess={() => {}}
        />
      </motion.div>
    </div>
  );
}