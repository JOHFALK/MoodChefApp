import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RecipeInteractionFormProps {
  recipeId: string;
  onSuccess?: () => void;
}

export function RecipeInteractionForm({ recipeId, onSuccess }: RecipeInteractionFormProps) {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Please log in to track your cooking",
          variant: "destructive",
        });
        return;
      }

      const timeOfDay = new Date().getHours() < 12 ? "morning" : 
                       new Date().getHours() < 17 ? "afternoon" : "evening";

      const { error } = await supabase
        .from("recipe_interactions")
        .insert({
          recipe_id: recipeId,
          user_id: user.id,
          time_of_day: timeOfDay,
          notes,
          emotions: [], // Will be filled from the recipe's emotions
        });

      if (error) throw error;

      toast({
        title: "Recipe tracked successfully!",
        description: "Your cooking session has been recorded.",
      });

      setNotes("");
      onSuccess?.();
    } catch (error) {
      console.error("Error tracking recipe:", error);
      toast({
        title: "Error tracking recipe",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Add notes about your cooking experience..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-[100px]"
      />
      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitting}
        className="w-full"
      >
        Track This Recipe
      </Button>
    </div>
  );
}