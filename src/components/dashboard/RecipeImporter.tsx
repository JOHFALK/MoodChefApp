import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function RecipeImporter() {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const { data: recipeStats, refetch: refetchStats } = useQuery({
    queryKey: ['recipe-stats'],
    queryFn: async () => {
      // Get total recipes
      const { count: totalCount } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true });

      // Get recipes per emotion
      const { data: recipes } = await supabase
        .from('recipes')
        .select('emotions');

      const emotionCounts = {};
      recipes?.forEach(recipe => {
        recipe.emotions.forEach(emotion => {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
      });

      return {
        total: totalCount || 0,
        perEmotion: emotionCounts
      };
    }
  });

  const importRecipes = async () => {
    setIsImporting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        'https://meczgsrnjogdhbqhkoud.functions.supabase.co/fetch-tasty-recipes',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to import recipes');
      }

      const result = await response.json();
      
      toast({
        title: "Success!",
        description: `Imported ${result.count} recipes successfully`,
      });

      // Refresh stats after import
      refetchStats();
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to import recipes",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Recipe Statistics</h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>Total Recipes: {recipeStats?.total || 0}</p>
          <div className="space-y-1">
            <p className="font-medium">Recipes per emotion:</p>
            {recipeStats?.perEmotion && Object.entries(recipeStats.perEmotion).map(([emotion, count]) => (
              <p key={emotion} className="pl-4">
                {emotion}: {count}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Recipe Importer</h3>
        <p className="text-muted-foreground mb-4">
          Import recipes from Tasty API and automatically tag them with emotions.
        </p>
        <Button
          onClick={importRecipes}
          disabled={isImporting}
          className="w-full"
        >
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            "Import Recipes"
          )}
        </Button>
      </div>
    </div>
  );
}