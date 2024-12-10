import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function RecipeImporter() {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

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
    <div className="p-4 border rounded-lg bg-card">
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
  );
}